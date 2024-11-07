const path = require('path');
const fs = require('fs');
const {
  loadConfig,
  validateConfig,
  defaultConfig,
  defaultEsmConfig,
} = require('./config');
const UsageError = require('./usage_error');

const commonOptions = [
  { name: 'config', type: 'string', description: 'path to the config file' },
  { name: 'port', type: 'number', description: 'port to run the server on' },
  {
    name: 'tlsCert',
    type: 'string',
    description: 'Path to TLS cert file for https',
  },
  {
    name: 'tlsKey',
    type: 'string',
    description: 'Path to TLS key file for https',
  },
  { name: 'hostname', type: 'string', description: 'hostname to listen on' },
];

const subCommands = [
  { name: 'help', alias: '-h', description: 'show help' },
  {
    name: 'version',
    alias: '-v',
    description: 'show versions for this and jasmine-core',
  },
  {
    name: 'init',
    description: 'initialize a new Jasmine project',
    options: [
      {
        name: 'esm',
        type: 'bool',
        description:
          'configure for use with ES modules (<script type="module">)',
      },
    ],
  },
  {
    name: 'serve',
    options: commonOptions,
    description: 'start a server with your Jasmine specs',
  },
  {
    name: 'runSpecs',
    description: 'start a server and run your Jasmine specs in a browser',
    options: commonOptions.concat([
      {
        name: 'color',
        type: 'bool',
        reversable: true,
        description: 'turn on or off color output',
      },
      {
        name: 'filter',
        type: 'string',
        description:
          'filter specs to run only those that match the given string',
      },
      {
        name: 'fail-fast',
        type: 'bool',
        description: 'stop Jasmine execution on the first failure',
      },
      {
        name: 'random',
        type: 'bool',
        reversable: true,
        description: 'turn on or off randomization',
      },
      {
        name: 'seed',
        type: 'string',
        description: 'specify a seed for randomization',
      },
      {
        name: 'reporter',
        type: 'string',
        description:
          'path to reporter to use instead of the default Jasmine reporter',
      },
      {
        name: 'browser',
        type: 'string',
        description: 'which local browser to launch',
      },
      {
        name: 'hideDisabled',
        type: 'bool',
        description: 'hide disabled tests',
      },
    ]),
  },
];

class Command {
  constructor(config) {
    this._config = config;
    this._logger = config.console || console;
  }

  async run(args) {
    const commandStr = args[0] || 'serve';
    const toRun = subCommands.find(function(command) {
      return command.name === commandStr || command.alias === commandStr;
    });

    if (!toRun) {
      this.help();
      throw new UsageError();
    } else if (toRun.options) {
      return this[toRun.name](parseOptions(toRun, args.slice(1)));
    } else {
      return this[toRun.name]();
    }
  }

  help() {
    const width = 80;
    const logger = this._logger;
    logger.log();
    logger.log('Usage: jasmine-browser <command> [options]');
    logger.log();
    logger.group('Commands:');
    const commandPadding = maxLength(subCommands.map(commandText)) + 2;
    subCommands.forEach(function(command) {
      logger.log(
        commandText(command).padEnd(commandPadding, ' ') +
          wrapDescription(1, commandPadding, width, command.description)
      );
    });
    logger.groupEnd();
    logger.log();
    logger.group('Subcommand options:');

    const detailedCommands = subCommands.filter(c => c.options);
    detailedCommands.forEach(function(command) {
      logger.log();
      logger.group(command.name);
      const optionPadding = maxLength(command.options.map(optionText)) + 2;

      command.options.forEach(function(option) {
        logger.log(
          optionText(option).padEnd(optionPadding, ' ') +
            wrapDescription(2, optionPadding, width, option.description)
        );
      });
      logger.groupEnd();
    });
    logger.groupEnd();
  }

  version() {
    const pkg = require('../package.json');
    this._logger.log();
    this._logger.log(`${pkg.name} v${pkg.version}`);
    this._logger.log('jasmine-core v' + this._config.jasmineCore.version());
  }

  init(options) {
    const dest = 'spec/support/jasmine-browser.mjs';

    if (fs.existsSync(dest)) {
      this._logger.log(`${dest} already exists.`);
      return;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (options.esm) {
      fs.writeFileSync(dest, defaultEsmConfig());
    } else {
      fs.writeFileSync(dest, defaultConfig());
    }

    this._logger.log(`Wrote configuration to ${dest}.`);
  }

  async serve(options) {
    await this._config.jasmineBrowser.startServer(
      await this._loadConfig(options)
    );
  }

  async runSpecs(options) {
    const config = await this._loadConfig(options);

    if (options['fail-fast']) {
      config.env = {
        ...config.env,
        stopSpecOnExpectationFailure: true,
        stopOnSpecFailure: true,
      };
    }

    await this._config.jasmineBrowser.runSpecs(config);
  }

  async _loadConfig(options) {
    const config = await loadConfig(this._config.baseDir, options);
    validateConfig(config);
    return config;
  }
}

const extractArg = /^--(no-)?([^=]*)(?:=(.*))?$/;
function parseOptions(command, args) {
  const parsedArgs = { unknown: [] };
  args.forEach(function(arg) {
    const extracted = arg.match(extractArg);

    if (!extracted) {
      parsedArgs.unknown.push(arg);
    } else {
      const opt = command.options.find(o => o.name === extracted[2]);
      if (!opt) {
        parsedArgs.unknown.push(arg);
      } else {
        if (opt.type === 'bool') {
          parsedArgs[opt.name] = !extracted[1];
        } else if (opt.type === 'number') {
          parsedArgs[opt.name] = parseInt(extracted[3], 10);
        } else {
          parsedArgs[opt.name] = extracted[3];
        }
      }
    }
  });

  return parsedArgs;
}

function maxLength(strings) {
  return Math.max.apply(
    Math,
    strings.map(s => s.length)
  );
}

function commandText(command) {
  return [command.name, command.alias].filter(s => s !== undefined).join(', ');
}

function optionText(option) {
  if (option.type !== 'bool') {
    return `--${option.name}=<value>`;
  } else if (option.reversable) {
    return `--[no-]${option.name}`;
  } else {
    return `--${option.name}`;
  }
}

function wrapDescription(indentLevel, prefixWidth, maxWidth, text) {
  const indentLength = indentLevel * 2; // console.group
  const columnWidth = maxWidth - indentLength - prefixWidth;

  if (text.length < columnWidth) {
    return text;
  }

  const chunks = [];
  while (text.length > columnWidth) {
    const wrapChar = text.lastIndexOf(' ', columnWidth);
    chunks.push(text.substring(0, wrapChar));
    text = text.substring(wrapChar + 1);
  }
  chunks.push(text);

  return chunks.join('\n'.padEnd(prefixWidth + 1, ' '));
}

module.exports = Command;
