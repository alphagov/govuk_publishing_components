export default class TimeIt {
  // returns a singleton instance
  constructor(log) {
    let {
      instance = this
    } = this.constructor;
    instance.log = log;
    this.constructor.instance = instance;
    return instance;
  }

  // this function has some code repeatition as it needs to handle both sync and async
  // callbacks. It handles both cases when function is marked async but there is no await
  // as well as functions which have async await and sync functions - including sync
  // functions which returns a promise instead.
  // So we need to check if callback is returning promise or not and handle accordingly
  // it always returns exact same value/promise as callback function and measures time
  // correctly.
  measure(name, identifier, meta, callback) {
    const startTime = Date.now();
    let errorMsg;
    let errorStack;
    const logtime = () => {
      const duration = Date.now() - startTime;
      this.log.debug(`${name} - ${identifier} - ${duration / 1000}s`, {
        durationMs: duration,
        errorMsg,
        errorStack,
        ...meta
      });
    };
    let wasPromise = false;
    try {
      let ret = callback();
      // if it returned a promise then we need to return a promise
      if (ret.then !== undefined && ret.then != null) {
        wasPromise = true;
        return ret.catch(e => {
          return {
            error: e,
            errorReturnedFromMeasure: true
          };
        }).then(result => {
          if (result !== null && result !== void 0 && result.errorReturnedFromMeasure) {
            errorMsg = result.error.message;
            errorStack = result.error.stack;
          }
          logtime();
          if (result !== null && result !== void 0 && result.errorReturnedFromMeasure) {
            throw result.error;
          }
          return result;
        });
      }
      return ret;
    } catch (e) {
      errorMsg = e.message;
      errorStack = e.stack;
      throw e;
    } finally {
      if (!wasPromise) logtime();
    }
  }
}