const path = require('path');
const fs = require('fs');
const ModuleLoader = require('./moduleLoader');

async function loadConfig(baseDir, cliOptions) {
  const options = { ...cliOptions };
  const specifiedConfigFile = options.config;
  delete options.config;
  delete options.unknown;

  Object.keys(options).forEach(function(opt) {
    const camelCase = opt.replace(/-./g, function(input) {
      return input[1].toUpperCase();
    });
    if (camelCase !== opt) {
      options[camelCase] = options[opt];
      delete options[opt];
    }
  });

  const candidates = (specifiedConfigFile
    ? [specifiedConfigFile]
    : ['spec/support/jasmine-browser.js', 'spec/support/jasmine-browser.json']
  )
    .filter(name => !!name)
    .map(name => path.resolve(baseDir, name));

  const fullPath = candidates.find(p => fs.existsSync(p));

  if (!fullPath) {
    const msg =
      'Could not find configuration file.\nTried:\n' +
      candidates.map(p => `* ${p}`).join('\n');
    throw new Error(msg);
  }

  const moduleLoader = new ModuleLoader();
  return Object.assign({}, await moduleLoader.load(fullPath), options);
}

function validateConfig(config) {
  for (const k of ['specDir', 'srcDir']) {
    if (!config[k]) {
      throw new Error('Configuration is missing ' + k);
    }
  }

  for (const k of ['specFiles', 'srcFiles', 'helpers']) {
    if (config[k] && !Array.isArray(config[k])) {
      throw new Error(`Configuration's ${k} property is not an array`);
    }
  }
}

function defaultConfig() {
  return fs.readFileSync(require.resolve('./examples/default_config.json'), {
    encoding: 'utf8',
  });
}

function defaultEsmConfig() {
  return fs.readFileSync(
    require.resolve('./examples/default_esm_config.json'),
    {
      encoding: 'utf8',
    }
  );
}

module.exports = {
  loadConfig,
  validateConfig,
  defaultConfig,
  defaultEsmConfig,
};
