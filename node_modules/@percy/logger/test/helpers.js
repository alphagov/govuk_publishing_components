import logger from '@percy/logger';
import { ANSI_REG } from '@percy/logger/utils';

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

function spy(object, method, func) {
  if (object[method].restore) object[method].restore();

  let spy = Object.assign(function spy(...args) {
    spy.calls.push(args);
    if (func) return func.apply(this, args);
  }, {
    restore: () => (object[method] = spy.originalValue),
    reset: () => (spy.calls.length = 0) || spy,
    originalValue: object[method],
    calls: []
  });

  object[method] = spy;
  return spy;
}

const helpers = {
  stdout: [],
  stderr: [],
  loglevel: logger.loglevel,

  get instance() {
    return logger.instance;
  },

  async mock(options = {}) {
    // Default to memory mode for downstream packages whose test setups don't
    // explicitly select a mode. Logger tests that want disk mode set
    // PERCY_LOGS_IN_MEMORY explicitly before calling mock(); the value here
    // is only applied when the env hasn't already been pinned.
    if (!('PERCY_LOGS_IN_MEMORY' in process.env)) {
      process.env.PERCY_LOGS_IN_MEMORY = '1';
    }

    helpers.reset();

    if (options.level) {
      logger.loglevel(options.level);
    }

    if (process.env.__PERCY_BROWSERIFIED__) {
      spy(logger.constructor.prototype, 'write', function(lvl, msg) {
        let stdio = lvl === 'info' ? 'stdout' : 'stderr';
        helpers[stdio].push(sanitizeLog(msg, options));
        return this.write.originalValue.call(this, lvl, msg);
      });

      spy(console, 'log');
      spy(console, 'warn');
      spy(console, 'error');
    } else {
      let { Writable } = await import('stream');

      for (let stdio of ['stdout', 'stderr']) {
        logger.constructor[stdio] = Object.assign(new Writable(), {
          isTTY: options.isTTY,
          columns: options.isTTY ? 100 : null,
          cursorTo() { return true; },
          clearLine() { return true; },
          _write(chunk, encoding, callback) {
            helpers[stdio].push(sanitizeLog(chunk.toString(), options));
            callback();
          }
        });
      }
    }
  },

  reset(soft) {
    if (soft) {
      logger.loglevel('info');
    } else {
      // tear down the prior instance's disk artifacts before swapping it out
      try { logger.constructor.instance?.reset(); } catch { /* tolerate */ }
      delete logger.constructor.instance;
    }

    helpers.stdout.length = 0;
    helpers.stderr.length = 0;

    if (console.log.reset) {
      console.log.reset();
      console.warn.reset();
      console.error.reset();
    }
  },

  dump() {
    let msgs = logger.instance.query(() => true);
    if (!msgs.length) return;

    let log = m => process.env.__PERCY_BROWSERIFIED__ ? (
      console.log.and ? console.log.and.originalFn(m) : console.log(m)
    ) : process.stderr.write(`${m}\n`);

    logger.loglevel('debug');
    log(logger.format('testing', 'warn', '--- DUMPING LOGS ---'));

    msgs.reduce((last, { debug, level, message, timestamp }) => {
      log(logger.format(debug, level, message, timestamp - last));
      return timestamp;
    }, msgs[0].timestamp);
  }
};

export { helpers as logger };
export default helpers;
