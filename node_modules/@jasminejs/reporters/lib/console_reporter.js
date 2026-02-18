const util = require('util');

const ansi = {
  green: '\x1B[32m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  none: '\x1B[0m',
};

/**
 * @classdesc A reporter that prints spec and suite results to the console.
 *
 * @constructor
 * @example
 * const {ConsoleReporter} = require('@jasminejs/reporters');
 * const reporter = new ConsoleReporter();
 */
class ConsoleReporter {
  #print;
  #isTTY;
  #noColorEnvSet;
  #configuredToShowColors;
  #alwaysListPendingSpecs;
  #stackFilter;
  #failedSpecs;
  #pendingSpecs;
  #failedSuites;

  // Options is intended for focused integration tests that cover
  // ConsoleReporter. Production code shoudln't need to pass it.
  // TODO: Document the options arg?
  constructor(options) {
    const stdout = options?.stdout ?? process.stdout;
    this.#print = function() {
      stdout.write(util.format.apply(undefined, arguments));
    };
    this.#isTTY = stdout.isTTY ?? false;
    const noColor = (options?.env ?? process.env).NO_COLOR;
    this.#noColorEnvSet = !!noColor;
    this.#configuredToShowColors = undefined;
    this.#alwaysListPendingSpecs = true;
    this.#stackFilter = stack => stack;
    this.#failedSpecs = [];
    this.#pendingSpecs = [];
    this.#failedSuites = [];

    this.reporterCapabilities = { parallel: true };
  }

  /**
   * Configures the reporter.
   * @function
   * @name ConsoleReporter#configure
   * @param {ConsoleReporterOptions} options
   */
  configure(options) {
    if (options.print) {
      this.#print = options.print;
    }

    /**
     * @interface ConsoleReporterOptions
     */
    /**
     * Whether to colorize the output
     *
     * The color option should only be specified if the user has explicitly
     * requested to enable or disable color. If set to something other than
     * undefined, it takes precedence over the NO_COLOR environment variable.
     *
     * The color option is ignored if stdout is not a TTY.
     * @name ConsoleReporterOptions#color
     * @type Boolean|undefined
     * @default undefined
     */
    if (options.color !== undefined) {
      this.#configuredToShowColors = options.color;
    }

    if (options.stackFilter) {
      this.#stackFilter = options.stackFilter;
    }
    /**
     * A function that takes a random seed and returns the command to reproduce
     * that seed. Use this to customize the output when using ConsoleReporter
     * in a different command line tool.
     * @name ConsoleReporterOptions#randomSeedReproductionCmd
     * @type Function|undefined
     */
    if (options.randomSeedReproductionCmd) {
      this.randomSeedReproductionCmd = options.randomSeedReproductionCmd;
    }

    /**
     * Whether to list pending specs even if there are failures.
     * @name ConsoleReporterOptions#this.#alwaysListPendingSpecs
     * @type Boolean|undefined
     * @default true
     */
    if (options.alwaysListPendingSpecs !== undefined) {
      this.#alwaysListPendingSpecs = options.alwaysListPendingSpecs;
    }
  }

  jasmineStarted(options) {
    this._specCount = 0;
    this._executableSpecCount = 0;
    this._failureCount = 0;
    if (options && options.order && options.order.random) {
      this.#print('Randomized with seed ' + options.order.seed);
      this.#printNewline();
    }
    this.#print('Started');
    this.#printNewline();
  }

  jasmineDone(result) {
    if (result.failedExpectations) {
      this._failureCount += result.failedExpectations.length;
    }

    this.#printNewline();
    this.#printNewline();
    if (this.#failedSpecs.length > 0) {
      this.#print('Failures:');
    }
    for (let i = 0; i < this.#failedSpecs.length; i++) {
      this.#specFailureDetails(this.#failedSpecs[i], i + 1);
    }

    for (let i = 0; i < this.#failedSuites.length; i++) {
      this.#suiteFailureDetails(this.#failedSuites[i]);
    }

    if (
      result &&
      result.failedExpectations &&
      result.failedExpectations.length > 0
    ) {
      this.#suiteFailureDetails({ fullName: 'top suite', ...result });
    }

    if (this.#alwaysListPendingSpecs || result.overallStatus === 'passed') {
      if (this.#pendingSpecs.length > 0) {
        this.#print('Pending:');
      }
      for (let i = 0; i < this.#pendingSpecs.length; i++) {
        this.#pendingSpecDetails(this.#pendingSpecs[i], i + 1);
      }
    }

    if (this._specCount > 0) {
      this.#printNewline();

      if (this._executableSpecCount !== this._specCount) {
        this.#print(
          'Ran ' +
            this._executableSpecCount +
            ' of ' +
            this._specCount +
            plural(' spec', this._specCount)
        );
        this.#printNewline();
      }
      let specCounts =
        this._executableSpecCount +
        ' ' +
        plural('spec', this._executableSpecCount) +
        ', ' +
        this._failureCount +
        ' ' +
        plural('failure', this._failureCount);

      if (this.#pendingSpecs.length) {
        specCounts +=
          ', ' +
          this.#pendingSpecs.length +
          ' pending ' +
          plural('spec', this.#pendingSpecs.length);
      }

      this.#print(specCounts);
    } else {
      this.#print('No specs found');
    }

    this.#printNewline();

    if (result.numWorkers) {
      this.#print('Ran in parallel with ' + result.numWorkers + ' workers');
      this.#printNewline();
    }

    const seconds = result ? result.totalTime / 1000 : 0;
    this.#print('Finished in ' + seconds + ' ' + plural('second', seconds));
    this.#printNewline();

    if (result && result.overallStatus === 'incomplete') {
      this.#print('Incomplete: ' + result.incompleteReason);
      this.#printNewline();
    }

    if (result && result.order && result.order.random) {
      this.#print('Randomized with seed ' + result.order.seed);

      if (this.randomSeedReproductionCmd) {
        this.#print(
          ' (' + this.randomSeedReproductionCmd(result.order.seed) + ')'
        );
      }

      this.#printNewline();
    }
  }

  specDone(result) {
    this._specCount++;

    if (result.status === 'pending') {
      this.#pendingSpecs.push(result);
      this._executableSpecCount++;
      this.#print(this.#colored('yellow', '*'));
      return;
    }

    if (result.status === 'passed') {
      this._executableSpecCount++;
      this.#print(this.#colored('green', '.'));
      return;
    }

    if (result.status === 'failed') {
      this._failureCount++;
      this.#failedSpecs.push(result);
      this._executableSpecCount++;
      this.#print(this.#colored('red', 'F'));
    }
  }

  suiteDone(result) {
    if (result.failedExpectations && result.failedExpectations.length > 0) {
      this._failureCount++;
      this.#failedSuites.push(result);
    }
  }

  #printNewline() {
    this.#print('\n');
  }

  #colored(color, str) {
    return this.#shouldColorize() ? ansi[color] + str + ansi.none : str;
  }

  #shouldColorize() {
    if (this.#configuredToShowColors !== undefined) {
      return this.#configuredToShowColors;
    } else {
      return this.#isTTY && !this.#noColorEnvSet;
    }
  }

  #specFailureDetails(result, failedSpecNumber) {
    this.#printNewline();
    this.#print(failedSpecNumber + ') ');
    this.#print(result.fullName);
    this.#printFailedExpectations(result);

    if (result.debugLogs) {
      this.#printNewline();
      this.#print(indent('Debug logs:', 2));
      this.#printNewline();

      for (const entry of result.debugLogs) {
        this.#print(indent(`${entry.timestamp}ms: ${entry.message}`, 4));
        this.#printNewline();
      }
    }
  }

  #suiteFailureDetails(result) {
    this.#printNewline();
    this.#print('Suite error: ' + result.fullName);
    this.#printFailedExpectations(result);
  }

  #printFailedExpectations(result) {
    for (let i = 0; i < result.failedExpectations.length; i++) {
      const failedExpectation = result.failedExpectations[i];
      this.#printNewline();
      this.#print(indent('Message:', 2));
      this.#printNewline();
      this.#print(this.#colored('red', indent(failedExpectation.message, 4)));
      this.#printNewline();
      this.#print(indent('Stack:', 2));
      this.#printNewline();
      this.#print(indent(this.#stackFilter(failedExpectation.stack), 4));
    }

    // When failSpecWithNoExpectations = true and a spec fails because of no expectations found,
    // jasmine-core reports it as a failure with no message.
    //
    // Therefore we assume that when there are no failed or passed expectations,
    // the failure was because of our failSpecWithNoExpectations setting.
    //
    // Same logic is used by jasmine.HtmlReporter, see https://github.com/jasmine/jasmine/blob/main/src/html/HtmlReporter.js
    if (
      result.failedExpectations.length === 0 &&
      result.passedExpectations.length === 0
    ) {
      this.#printNewline();
      this.#print(indent('Message:', 2));
      this.#printNewline();
      this.#print(this.#colored('red', indent('Spec has no expectations', 4)));
    }

    this.#printNewline();
  }

  #pendingSpecDetails(result, pendingSpecNumber) {
    this.#printNewline();
    this.#printNewline();
    this.#print(pendingSpecNumber + ') ');
    this.#print(result.fullName);
    this.#printNewline();
    let pendingReason = 'No reason given';
    if (result.pendingReason && result.pendingReason !== '') {
      pendingReason = result.pendingReason;
    }
    this.#print(indent(this.#colored('yellow', pendingReason), 2));
    this.#printNewline();
  }
}

function plural(str, count) {
  return count === 1 ? str : str + 's';
}

function repeat(thing, times) {
  const arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(thing);
  }
  return arr;
}

function indent(str, spaces) {
  const lines = (str || '').split('\n');
  const newArr = [];
  for (let i = 0; i < lines.length; i++) {
    newArr.push(repeat(' ', spaces).join('') + lines[i]);
  }
  return newArr.join('\n');
}

module.exports = exports = ConsoleReporter;
