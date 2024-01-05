const querystring = require('querystring');

function getBatch(driver) {
  return driver.executeScript(
    'var results = batchReporter.getBatch();\n' +
      'for (var i = 0; i < results.length; i++) {\n' +
      'var expectations = results[i][1].failedExpectations || [];\n' +
      'if (results[i][1].passedExpectations) {\n' +
      'expectations = expectations.concat(results[i][1].passedExpectations);\n' +
      '}\n' +
      'for (var j = 0; j < expectations.length; j++) {\n' +
      'var expectation = expectations[j];\n' +
      "try { JSON.stringify(expectation.expected); } catch (e) { expectation.expected = '<circular expected>'; }\n" +
      "try { JSON.stringify(expectation.actual); } catch (e) { expectation.actual = '<circular actual>'; }\n" +
      '}\n' +
      '}\n' +
      'return results;'
  );
}

function proxyToReporters(batch, reporters) {
  batch.forEach(function(result) {
    const fn = result[0];

    for (const reporter of reporters) {
      if (reporter[fn]) {
        reporter[fn](result[1]);
      }
    }
  });
}

function isDone(batch) {
  return batch.some(function(result) {
    return result[0] === 'jasmineDone';
  });
}

function runTillEnd(webdriver, reporters) {
  return new Promise(function(resolve, reject) {
    function processOneBatch() {
      getBatch(webdriver)
        .then(function(batch) {
          proxyToReporters(batch, reporters);

          if (isDone(batch)) {
            resolve(runDetails(batch));
          } else {
            setTimeout(processOneBatch, 250);
          }
        })
        .catch(reject);
    }

    processOneBatch();
  });
}

function runDetails(batch) {
  const jasmineDone = batch.find(function(item) {
    return item[0] === 'jasmineDone';
  });

  if (!jasmineDone) {
    throw new Error('No `jasmineDone` event found');
  }

  return jasmineDone[1];
}

function urlParams(runOptions) {
  return (
    '?' +
    querystring.stringify(
      filterUndefined({
        random: runOptions.random,
        seed: runOptions.seed,
        spec: runOptions.filter,
      })
    )
  );
}

function filterUndefined(obj) {
  const result = {};

  Object.keys(obj).forEach(function(k) {
    if (obj[k] !== undefined) {
      result[k] = obj[k];
    }
  });

  return result;
}

class Runner {
  constructor(options) {
    this._options = options;
  }

  async run(runOptions) {
    runOptions = runOptions || {};
    await this._options.webdriver.get(
      this._options.host + urlParams(runOptions)
    );

    return await runTillEnd(this._options.webdriver, this._options.reporters);
  }
}

module.exports = Runner;
