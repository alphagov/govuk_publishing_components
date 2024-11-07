const ConsoleReporter = require('./lib/console_reporter');
const webdriverModule = require('./lib/webdriver');
const Server = require('./lib/server');
const Runner = require('./lib/runner');
const ModuleLoader = require('./lib/moduleLoader');

async function createReporters(options, deps) {
  const result = [];

  if (options.useConsoleReporter !== false) {
    deps = deps || {};
    const ReporterCtor = deps.ConsoleReporter || ConsoleReporter;
    const consoleReporter = new ReporterCtor();
    consoleReporter.setOptions({
      color: options.color,
      alwaysListPendingSpecs: options.alwaysListPendingSpecs,
    });
    result.push(consoleReporter);
  }

  if (options.reporters) {
    // Resolve relative paths relative to the cwd, rather than the default
    // which is the directory containing the moduleLoader module.
    const loader = new ModuleLoader(process.cwd());

    for (const reporterOrModuleName of options.reporters) {
      if (typeof reporterOrModuleName === 'object') {
        result.push(reporterOrModuleName);
      } else {
        try {
          const Reporter = await loader.load(reporterOrModuleName);
          result.push(new Reporter());
        } catch (e) {
          throw new Error(
            `Failed to register reporter ${reporterOrModuleName}: ${e.message}`
          );
        }
      }
    }
  }

  if (result.length === 0) {
    throw new Error(
      'No reporters were specified. Either add a reporter or remove ' +
        '`useConsoleReporter: false`.'
    );
  }

  return result;
}

/**
 * @module jasmine-browser-runner
 */
module.exports = {
  /**
   * Starts a {@link Server} that will serve the specs and supporting files via HTTP.
   * @param {ServerCtorOptions} options to use to construct the server
   * @param {ServerStartOptions} serverOptions Options to use to start the server
   * @return {Promise<undefined>} A promise that is resolved when the server is
   * started.
   */
  startServer: function(options, serverOptions) {
    const server = new Server(options);
    return server.start(serverOptions || {});
  },
  /**
   * Runs the specs.
   * @param {Configuration} options
   * @return {Promise<JasmineDoneInfo>} A promise that resolves to the {@link https://jasmine.github.io/api/edge/global.html#JasmineDoneInfo|overall result} when the suite has finished running.
   */
  runSpecs: async function(options, deps) {
    options = options || {};
    deps = deps || {};
    const ServerClass = deps.Server || Server;
    const RunnerClass = deps.Runner || Runner;
    const buildWebdriver =
      deps.buildWebdriver || webdriverModule.buildWebdriver;
    const setExitCode = deps.setExitCode || (code => (process.exitCode = code));
    const server = new ServerClass(options);

    const reporters = await createReporters(options, deps);
    const useLegacySauce = options.browser && options.browser.useSauce;
    const useRemote = options.browser && options.browser.useRemoteSeleniumGrid;
    const useSauceCompletionReporting =
      useLegacySauce ||
      (useRemote &&
        options.browser.remoteSeleniumGrid?.url?.includes('saucelabs.com'));
    let portRequest;

    if (options.port) {
      portRequest = options.port;
    } else if (useLegacySauce || useRemote) {
      portRequest = 5555;
    } else {
      portRequest = 0;
    }

    await server.start({ port: portRequest });

    try {
      const webdriver = buildWebdriver(options.browser);

      try {
        const host = `${server.scheme()}://${server.hostname()}:${server.port()}`;
        const runner = new RunnerClass({ webdriver, reporters, host });

        console.log('Running tests in the browser...');

        const details = await runner.run(options);

        // Use 0 only for complete success
        // Avoid 1 because Node uses that for unhandled exceptions etc., and
        // some users have CI systems that want to distinguish between spec
        // failures and crashes.
        if (details.overallStatus === 'passed') {
          setExitCode(0);
        } else if (anyLoadErrors(details)) {
          // Use node's general failure code
          setExitCode(1);
        } else if (details.overallStatus === 'incomplete') {
          setExitCode(2);
        } else {
          setExitCode(3);
        }

        return details;
      } finally {
        if (useSauceCompletionReporting) {
          await webdriver.executeScript(
            `sauce:job-result=${process.exitCode === 0}`
          );
        }

        await webdriver.close();
      }
    } finally {
      await server.stop();
    }
  },
  Server,
  Runner,
  ConsoleReporter,
};

function anyLoadErrors(jasmineDoneInfo) {
  const failures = jasmineDoneInfo.failedExpectations || [];
  const loadError = failures.find(function(fe) {
    return fe.globalErrorType === 'load';
  });

  return !!loadError;
}
