export default {
  srcDir: "src",
  // srcFiles should usually be left empty when using ES modules, because you'll
  // explicitly import sources from your specs.
  srcFiles: [],
  specDir: ".",
  specFiles: [
    "spec/**/*[sS]pec.?(m)js"
  ],
  helpers: [
    "spec/helpers/**/*.?(m)js"
  ],
  esmFilenameExtension: ".mjs",
  // Set to true if you need to load module src files instead of loading via the spec files.
  modulesWithSideEffectsInSrcFiles: false,
  // Allows the use of top-level await in src/spec/helper files. This is off by
  // default because it makes files load more slowly.
  enableTopLevelAwait: false,
  env: {
    stopSpecOnExpectationFailure: false,
    stopOnSpecFailure: false,
    random: true,
    // Fail if a suite contains multiple suites or specs with the same name.
    forbidDuplicateNames: true
  },

  // For security, listen only to localhost. You can also specify a different
  // hostname or IP address, or remove the property or set it to "*" to listen
  // to all network interfaces.
  listenAddress: "localhost",

  // The hostname that the browser will use to connect to the server.
  hostname: "localhost",

  browser: {
    name: "firefox"
  }
};
