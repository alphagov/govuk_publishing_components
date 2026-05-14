/* eslint-env browser, jasmine */
function BatchReporter() {
  let events = [];

  this.getBatch = function() {
    const result = events;
    events = [];
    return result;
  };

  this.jasmineStarted = function(info) {
    events.push(['jasmineStarted', info]);
  };

  this.suiteStarted = function(info) {
    events.push(['suiteStarted', info]);
  };

  this.specStarted = function(info) {
    events.push(['specStarted', info]);
  };

  this.jasmineDone = function(info) {
    deleteExpectedAndActual(info);
    events.push(['jasmineDone', info]);
  };

  this.suiteDone = function(info) {
    deleteExpectedAndActual(info);
    events.push(['suiteDone', info]);
  };

  this.specDone = function(info) {
    deleteExpectedAndActual(info);
    events.push(['specDone', info]);
  };

  function deleteExpectedAndActual(info) {
    for (const e of info.failedExpectations) {
      // Delete expected and actual. Not all JS objects are serializable, we
      // don't have a reliable way to determine what Selenium can and can't
      // serialize, not everything that's serializable survives the process
      // intact, and there are no known reporters that use the expected or
      // actual properties of expectation results.
      delete e.expected;
      delete e.actual;
    }
  }
}

window.batchReporter = new BatchReporter();

jasmine.getEnv().addReporter(window.batchReporter);
