const logger = require('@percy/logger');
const { ANSI_REG } = require('@percy/logger/dist/util');
const { Logger } = logger;

const ELAPSED_REG = /\s\S*?\(\d+ms\)\S*/;
const NEWLINE_REG = /\r\n/g;
const LASTLINE_REG = /\n$/;

function sanitizeLog(str, { ansi, elapsed } = {}) {
  // normalize line endings
  str = str.replace(NEWLINE_REG, '\n');
  // strip ansi colors
  if (!ansi) str = str.replace(ANSI_REG, '');
  // strip elapsed time
  if (!elapsed) str = str.replace(ELAPSED_REG, '');
  // strip trailing line endings
  return str.replace(LASTLINE_REG, '');
}

function TestIO(data, options) {
  if (!process.env.__PERCY_BROWSERIFIED__) {
    let { Writable } = require('stream');

    return Object.assign(new Writable(), {
      isTTY: options && options.isTTY,
      cursorTo() {},
      clearLine() {},

      _write(chunk, encoding, callback) {
        data.push(sanitizeLog(chunk.toString(), options));
        callback();
      }
    });
  }
}

function spy(object, method, func) {
  if (object[method].reset) {
    object[method].reset();
    return object[method];
  }

  let spy = Object.assign(function spy(...args) {
    spy.calls.push(args);
    if (func) return func.apply(this, args);
  }, {
    restore: () => (object[method] = spy.originalValue),
    reset: () => (spy.calls.length = 0),
    originalValue: object[method],
    calls: []
  });

  object[method] = spy;
  return spy;
}

const helpers = {
  constructor: Logger,
  loglevel: logger.loglevel,
  stdout: [],
  stderr: [],

  get messages() {
    return Logger.instance &&
      Logger.instance.messages;
  },

  mock(options) {
    helpers.reset();
    helpers.options = options;

    if (!process.env.__PERCY_BROWSERIFIED__) {
      Logger.stdout = TestIO(helpers.stdout, options);
      Logger.stderr = TestIO(helpers.stderr, options);
    } else {
      spy(Logger.prototype, 'write', function(lvl, msg) {
        let stdio = lvl === 'info' ? 'stdout' : 'stderr';
        helpers[stdio].push(sanitizeLog(msg, helpers.options));
        return this.write.originalValue.call(this, lvl, msg);
      });

      spy(console, 'log');
      spy(console, 'warn');
      spy(console, 'error');
    }
  },

  reset(soft) {
    if (soft) Logger.instance.loglevel('info');
    else delete Logger.instance;

    helpers.stdout.length = 0;
    helpers.stderr.length = 0;

    if (console.log.reset) {
      console.log.reset();
      console.warn.reset();
      console.error.reset();
    }
  },

  dump() {
    if (!helpers.messages || !helpers.messages.size) return;
    if (console.log.and) console.log.and.callThrough();

    let write = m => process.env.__PERCY_BROWSERIFIED__
      ? console.log(m) : process.stderr.write(`${m}\n`);
    let logs = Array.from(helpers.messages);

    logger.loglevel('debug');

    write(logger.format('testing', 'warn', '--- DUMPING LOGS ---'));

    logs.reduce((lastlog, { debug, level, message, timestamp }) => {
      write(logger.format(debug, level, message, timestamp - lastlog));
      return timestamp;
    }, logs[0].timestamp);
  }
};

module.exports = helpers;
