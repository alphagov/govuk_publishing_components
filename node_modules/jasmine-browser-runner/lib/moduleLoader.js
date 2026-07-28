const path = require('path');
const url = require('url');

class ModuleLoader {
  constructor(parentDir, deps) {
    deps = deps || {};
    this.require_ = deps.requireShim || requireShim;
    this.import_ = deps.importShim || importShim;
    this.parentDir_ = parentDir;
  }

  async load(filePath) {
    if (filePath.endsWith('.json')) {
      return this.require_(filePath);
    } else {
      // The ES module spec requires absolute import paths to be valid URLs. As
      // of v16, Node enforces this on Windows but not on other OSes.
      if (path.isAbsolute(filePath)) {
        filePath = url.pathToFileURL(filePath);
      } else if (filePath.startsWith('./') || filePath.startsWith('../')) {
        filePath = url.pathToFileURL(path.resolve(this.parentDir_, filePath));
      }

      const module = await this.import_(filePath);
      return module.default;
    }
  }
}

function requireShim(path) {
  return require(path);
}

function importShim(path) {
  return import(path);
}

module.exports = ModuleLoader;
