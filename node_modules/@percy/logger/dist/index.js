import Logger from './logger.js';
import TimeIt from './timing.js';
export function logger(name) {
  return new Logger().group(name);
}
Object.defineProperties(logger, {
  stdout: {
    get: () => Logger.stdout
  },
  stderr: {
    get: () => Logger.stderr
  },
  constructor: {
    get: () => Logger
  },
  instance: {
    get: () => new Logger()
  },
  query: {
    value: (...args) => logger.instance.query(...args)
  },
  format: {
    value: (...args) => logger.instance.format(...args)
  },
  loglevel: {
    value: (...args) => logger.instance.loglevel(...args)
  },
  timeit: {
    get: () => new TimeIt(logger.instance.group('timer'))
  },
  measure: {
    value: (...args) => logger.timeit.measure(...args)
  }
});
export default logger;