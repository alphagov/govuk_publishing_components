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
    events.push(['jasmineDone', info]);
  };

  this.suiteDone = function(info) {
    events.push(['suiteDone', info]);
  };

  this.specDone = function(info) {
    events.push(['specDone', info]);
  };
}

window.batchReporter = new BatchReporter();

jasmine.getEnv().addReporter(window.batchReporter);
