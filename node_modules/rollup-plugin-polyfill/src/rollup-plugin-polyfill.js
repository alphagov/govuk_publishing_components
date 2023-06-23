const PROXY_SUFFIX = '?polyfill-entry';

/**
 * rollup-plugin-polyfill
 * prepends entry files with a source file or module
 * @param packages - list of files or modules to import
 *
 * @see https://github.com/JRJurman/rollup-plugin-polyfill
 *
 */
module.exports = (packages) => ({
  name: 'polyfill',
  options(rawOptions) {
    // We inject the resolver in the beginning so that "catch-all-resolvers"
    // like node-resolve  do not prevent our plugin from resolving entry points
    // via proxies.
    const plugins = Array.isArray(rawOptions.plugins)
        ? [...rawOptions.plugins]
        : rawOptions.plugins
            ? [rawOptions.plugins]
            : [];
    plugins.unshift({
      name: 'polyfill--resolver',
      async resolveId(source, importer, options) {
        if (options.isEntry) {
          // Determine what the actual entry would have been. We need "skipSelf"
          // to avoid an infinite loop.
          const resolution = await this.resolve(source, importer, { skipSelf: true, ...options });
          // If it cannot be resolved or is external, just return it so that
          // Rollup can display an error
          if (!resolution || resolution.external) return resolution;
          // In the load hook of the proxy, we need to know if the entry has a
          // default export. There, however, we no longer have the full
          // "resolution" object that may contain meta-data from other plugins
          // that is only added on first load. Therefore we trigger loading here.
          const moduleInfo = await this.load(resolution);
          // We need to make sure side effects in the original entry point
          // are respected even for treeshake.moduleSideEffects: false.
          // "moduleSideEffects" is a writable property on ModuleInfo.
          moduleInfo.moduleSideEffects = true;
          // It is important that the new entry does not start with \0 and
          // has the same directory as the original one to not mess up
          // relative external import generation. Also keeping the name and
          // just adding a "?query" to the end ensures that preserveModules
          // will generate the original entry name for this entry.
          return `${resolution.id}${PROXY_SUFFIX}`;
        }
        return null;
      },
    });
    return { ...rawOptions, plugins };
  },
  async buildStart() {
    await Promise.all(packages.map(async pkg => {
      const resolved = await this.resolve(pkg);
      if (!resolved) {
        throw new Error(`Could not resolve polyfill "${pkg}". If you do not want to bundle your polyfills and just want to inject imports, please mark them as external by using Rollup's "external" option.`)
      }
      if (!resolved.external && !resolved.moduleSideEffects) {
        const moduleInfo = await this.load(resolved);
        // ensure that polyfills always have side effects, even if the user
        // turns them off explicitly
        moduleInfo.moduleSideEffects = true;
      }
    }))
  },
  load(id) {
    if (id.endsWith(PROXY_SUFFIX)) {
      const entryId = id.slice(0, -PROXY_SUFFIX.length);
      let code = packages.map(pkg => `import ${JSON.stringify(pkg)};`).join('\n');
      code += `\nexport * from ${JSON.stringify(entryId)};\n`;
      // Namespace reexports do not reexport default, so we need special
      // handling here. We know ModuleInfo.hasDefaultExport is reliable because
      // we awaited this.load in resolveId.
      if (this.getModuleInfo(entryId).hasDefaultExport) {
        code += `export { default } from ${JSON.stringify(entryId)};\n`;
      }
      return code;
    }
    return null;
  }
});
