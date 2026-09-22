import * as debugFactory from 'debug';
import * as path from 'path';
import * as _merge from 'lodash.merge';
// Use vendored and patched nconf without yargs and with our custom TRUE/FALSE logic in env.ts file
import nconf from './nconf/nconf';

const debug = debugFactory('snyk:config');

export type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[];

export interface Options {
  parseEnvValues?: boolean;
  secretConfig?: string;
}

export function loadConfig(
  dir?: string,
  options?: Options,
): { [property: string]: Json } {
  if (!dir) {
    dir = '';
  }

  options = options || {};
  const secretConfig =
    options.secretConfig ||
    process.env['CONFIG_SECRET_FILE'] ||
    path.resolve(dir, 'config.secret.json');

  const parseEnvValues = getParseEnvValues(options);

  if (!path.isAbsolute(dir)) {
    throw new Error('config requires absolute path to read from');
  }

  const serviceEnv = process.env['SERVICE_ENV'];
  const localConfig = serviceEnv ? serviceEnv : 'local';
  const localConfigPath = path.resolve(dir, `config.${localConfig}.json`);
  debug('dir: %s, local: %s, secret: %s', dir, localConfigPath, secretConfig);

  const snykMatch = /^SNYK_.*$/;

  nconf.env({
    parseValues: parseEnvValues,
    separator: '__',
    match: snykMatch,
    whitelist: ['NODE_ENV', 'PORT'],
  });

  // This argv parser is using minimist on the background, instead of yargs as nconf by default
  // Do not pass `options` to this parser
  nconf.argv();

  nconf.file('secret', { file: path.resolve(secretConfig) });
  nconf.file('local', { file: localConfigPath });
  nconf.file('default', { file: path.resolve(dir, 'config.default.json') });

  const config = nconf.get();

  // strip prefix from env vars in config
  Object.keys(config).forEach(function (key) {
    if (key.match(snykMatch)) {
      const trimmedKey = key.replace(/^SNYK_/, '');
      if (
        typeof config[trimmedKey] === 'object' &&
        typeof config[key] === 'object'
      ) {
        config[trimmedKey] = _merge(config[trimmedKey], config[key]);
      } else {
        config[trimmedKey] = config[key];
      }
      delete config[key];
    }
  });

  substituteEnvVarValues(config);

  debug('loading from %s', dir, JSON.stringify(config, null, 2));

  return config;
}

// recursively replace ${VAL} in config values with process.env.VAL
function substituteEnvVarValues(config): void {
  Object.keys(config).forEach(function (key) {
    // recurse through nested objects
    if (typeof config[key] === 'object') {
      return substituteEnvVarValues(config[key]);
    }

    // replace /\${.*?}/g in strings with env var if such exists
    if (typeof config[key] === 'string') {
      config[key] = config[key].replace(/(\${.*?})/g, function (_, match) {
        const val = match.slice(2, -1); // ditch the wrappers

        // explode if env var is missing
        if (process.env[val] === undefined) {
          throw new Error(
            'Missing env var to substitute ' +
              val +
              " in '" +
              key +
              ': "' +
              config[key] +
              '"\'',
          );
        }

        return process.env[val];
      });
    }
  });
}

function getParseEnvValues(configOptions: Options): boolean {
  if (configOptions.parseEnvValues !== undefined) {
    if (typeof configOptions.parseEnvValues !== 'boolean') {
      throw new Error('options.parseEnvValues must be a boolean');
    }

    return configOptions.parseEnvValues;
  }

  const envVarVal = process.env['CONFIG_PARSE_ENV_VALUES'];
  if (
    envVarVal !== undefined &&
    envVarVal !== '' &&
    envVarVal !== 'undefined'
  ) {
    let parsed: unknown;

    try {
      parsed = JSON.parse(envVarVal.toLowerCase());
    } catch {
      throw new Error('CONFIG_PARSE_ENV_VALUES must be a boolean');
    }

    if (typeof parsed !== 'boolean') {
      throw new Error('CONFIG_PARSE_ENV_VALUES must be a boolean');
    }

    return parsed;
  }

  return false;
}
