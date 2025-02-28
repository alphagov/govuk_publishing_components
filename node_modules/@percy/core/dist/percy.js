function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
import PercyClient from '@percy/client';
import PercyConfig from '@percy/config';
import logger from '@percy/logger';
import { getProxy } from '@percy/client/utils';
import Browser from './browser.js';
import Pako from 'pako';
import { base64encode, generatePromise, yieldAll, yieldTo, redactSecrets, detectSystemProxyAndLog } from './utils.js';
import { createPercyServer, createStaticServer } from './api.js';
import { gatherSnapshots, createSnapshotsQueue, validateSnapshotOptions } from './snapshot.js';
import { discoverSnapshotResources, createDiscoveryQueue } from './discovery.js';
import Monitoring from '@percy/monitoring';
import { WaitForJob } from './wait-for-job.js';
const MAX_SUGGESTION_CALLS = 10;

// If no activity is done for 5 mins, we will stop monitoring
// system metric eg: (cpu load && memory usage)
const MONITOR_ACTIVITY_TIMEOUT = 300000;
const MONITORING_INTERVAL_MS = 5000; // 5 sec

// A Percy instance will create a new build when started, handle snapshot creation, asset discovery,
// and resource uploads, and will finalize the build when stopped. Snapshots are processed
// concurrently and the build is not finalized until all snapshots have been handled.
var _discovery = /*#__PURE__*/new WeakMap();
var _snapshots = /*#__PURE__*/new WeakMap();
var _Percy_brand = /*#__PURE__*/new WeakSet();
export class Percy {
  // Static shortcut to create and start an instance in one call
  static async start(options) {
    let instance = new this(options);
    await instance.start();
    return instance;
  }
  constructor({
    // initial log level
    loglevel,
    // process uploads before the next snapshot
    delayUploads,
    // process uploads after all snapshots
    deferUploads,
    // run without uploading anything
    skipUploads,
    // run without asset discovery
    skipDiscovery,
    // implies `skipUploads` and `skipDiscovery`
    dryRun,
    // implies `dryRun`, silent logs, and adds extra api endpoints
    labels,
    testing,
    // configuration filepath
    config: configFile,
    // provided to @percy/client
    token,
    clientInfo = '',
    environmentInfo = '',
    // snapshot server options
    server = true,
    port = 5338,
    projectType = null,
    suggestionsCallCounter = 0,
    // options such as `snapshot` and `discovery` that are valid Percy config
    // options which will become accessible via the `.config` property
    ..._options
  } = {}) {
    var _config$percy, _config$percy2;
    _classPrivateMethodInitSpec(this, _Percy_brand);
    _defineProperty(this, "log", logger('core'));
    _defineProperty(this, "readyState", null);
    _classPrivateFieldInitSpec(this, _discovery, null);
    _classPrivateFieldInitSpec(this, _snapshots, null);
    let config = PercyConfig.load({
      overrides: _options,
      path: configFile
    });
    labels ?? (labels = (_config$percy = config.percy) === null || _config$percy === void 0 ? void 0 : _config$percy.labels);
    deferUploads ?? (deferUploads = (_config$percy2 = config.percy) === null || _config$percy2 === void 0 ? void 0 : _config$percy2.deferUploads);
    this.config = config;
    this.cliStartTime = null;
    if (testing) loglevel = 'silent';
    if (loglevel) this.loglevel(loglevel);
    this.port = port;
    this.projectType = projectType;
    this.testing = testing ? {} : null;
    this.dryRun = !!testing || !!dryRun;
    this.skipUploads = this.dryRun || !!skipUploads;
    this.skipDiscovery = this.dryRun || !!skipDiscovery;
    this.delayUploads = this.skipUploads || !!delayUploads;
    this.deferUploads = this.skipUploads || !!deferUploads;
    this.labels = labels;
    this.suggestionsCallCounter = suggestionsCallCounter;
    this.client = new PercyClient({
      token,
      clientInfo,
      environmentInfo,
      config,
      labels
    });
    if (server) this.server = createPercyServer(this, port);
    this.browser = new Browser(this);
    _classPrivateFieldSet(_discovery, this, createDiscoveryQueue(this));
    this.discoveryMaxConcurrency = _classPrivateFieldGet(_discovery, this).concurrency;
    _classPrivateFieldSet(_snapshots, this, createSnapshotsQueue(this));
    this.monitoring = new Monitoring();
    // used continue monitoring if there is activity going on
    // if there is none, stop it
    this.resetMonitoringId = null;
    this.monitoringCheckLastExecutedAt = null;

    // generator methods are wrapped to autorun and return promises
    for (let m of ['start', 'stop', 'flush', 'idle', 'snapshot', 'upload']) {
      // the original generator can be referenced with percy.yield.<method>
      let method = (this.yield || (this.yield = {}))[m] = this[m].bind(this);
      this[m] = (...args) => generatePromise(method(...args));
    }
  }
  systemMonitoringEnabled() {
    return process.env.PERCY_DISABLE_SYSTEM_MONITORING !== 'true';
  }
  async configureSystemMonitor() {
    await this.monitoring.startMonitoring({
      interval: MONITORING_INTERVAL_MS
    });
    this.resetSystemMonitor();
  }

  // Debouncing logic to only stop Monitoring system
  // if there is no any activity for 5 mins
  // means, no job is pushed in queue from 5 mins
  resetSystemMonitor() {
    if (this.resetMonitoringId) {
      clearTimeout(this.resetMonitoringId);
      this.resetMonitoringId = null;
    }
    this.resetMonitoringId = setTimeout(() => {
      this.monitoring.stopMonitoring();
    }, MONITOR_ACTIVITY_TIMEOUT);
  }

  // Shortcut for controlling the global logger's log level.
  loglevel(level) {
    return logger.loglevel(level);
  }

  // Snapshot server API address
  address() {
    var _this$server;
    return (_this$server = this.server) === null || _this$server === void 0 ? void 0 : _this$server.address();
  }
  renderingTypeProject() {
    return this.projectType === 'web' || this.projectType === 'visual_scanner';
  }

  // Set client & environment info, and override loaded config options
  set({
    clientInfo,
    environmentInfo,
    ...config
  }) {
    this.client.addClientInfo(clientInfo);
    this.client.addEnvironmentInfo(environmentInfo);

    // normalize config and do nothing if empty
    config = PercyConfig.normalize(config, {
      schema: '/config'
    });
    if (!config) return this.config;

    // validate provided config options
    let errors = PercyConfig.validate(config);
    if ((errors === null || errors === void 0 ? void 0 : errors.length) > 0) {
      this.log.warn('Invalid config:');
      for (let e of errors) this.log.warn(`- ${e.path}: ${e.message}`);
    }

    // merge and override existing config options
    this.config = PercyConfig.merge([this.config, config], (path, prev, next) => {
      // replace arrays instead of merging
      return Array.isArray(next) && [path, next];
    });
    const concurrency = this.config.discovery.concurrency;
    const snapshotConcurrency = parseInt(process.env.PERCY_SNAPSHOT_UPLOAD_CONCURRENCY) || concurrency;
    _classPrivateFieldGet(_discovery, this).set({
      concurrency
    });
    _classPrivateFieldGet(_snapshots, this).set({
      concurrency: snapshotConcurrency
    });
    return this.config;
  }

  // Starts a local API server, a browser process, and internal queues.
  async *start() {
    // already starting or started
    if (this.readyState != null) return;
    this.readyState = 0;
    this.cliStartTime = new Date().toISOString();
    try {
      // started monitoring system metrics

      if (this.systemMonitoringEnabled()) {
        await this.configureSystemMonitor();
        await this.monitoring.logSystemInfo();
      }
      if (process.env.PERCY_CLIENT_ERROR_LOGS !== 'false') {
        this.log.warn('Notice: Percy collects CI logs to improve service and enhance your experience. These logs help us debug issues and provide insights on your dashboards, making it easier to optimize the product experience. Logs are stored securely for 30 days. You can opt out anytime with export PERCY_CLIENT_ERROR_LOGS=false, but keeping this enabled helps us offer the best support and features.');
      }
      // Not awaiting proxy check as this can be asyncronous when not enabled
      const detectProxy = detectSystemProxyAndLog(this.config.percy.useSystemProxy);
      if (this.config.percy.useSystemProxy) await detectProxy;
      // start the snapshots queue immediately when not delayed or deferred
      if (!this.delayUploads && !this.deferUploads) yield _classPrivateFieldGet(_snapshots, this).start();
      // do not start the discovery queue when not needed
      if (!this.skipDiscovery) yield _classPrivateFieldGet(_discovery, this).start();
      // start a local API server for SDK communication
      if (this.server) yield this.server.listen();
      if (this.renderingTypeProject()) {
        if (!process.env.PERCY_DO_NOT_CAPTURE_RESPONSIVE_ASSETS || process.env.PERCY_DO_NOT_CAPTURE_RESPONSIVE_ASSETS !== 'true') {
          var _this$build;
          this.deviceDetails = yield this.client.getDeviceDetails((_this$build = this.build) === null || _this$build === void 0 ? void 0 : _this$build.id);
        }
      }
      const snapshotType = this.renderingTypeProject() ? 'snapshot' : 'comparison';
      this.syncQueue = new WaitForJob(snapshotType, this);
      // log and mark this instance as started
      this.log.info('Percy has started!');
      this.readyState = 1;
    } catch (error) {
      var _this$server2;
      // on error, close any running server and end queues
      await ((_this$server2 = this.server) === null || _this$server2 === void 0 ? void 0 : _this$server2.close());
      await _classPrivateFieldGet(_discovery, this).end();
      await _classPrivateFieldGet(_snapshots, this).end();

      // mark this instance as closed unless aborting
      this.readyState = error.name !== 'AbortError' ? 3 : null;

      // throw an easier-to-understand error when the port is in use
      if (error.code === 'EADDRINUSE') {
        let errMsg = `Percy is already running or the port ${this.port} is in use`;
        await this.suggestionsForFix(errMsg);
        throw new Error(errMsg);
      } else {
        await this.suggestionsForFix(error.message);
        throw error;
      }
    }
  }

  // Resolves once snapshot and upload queues are idle
  async *idle() {
    yield* _classPrivateFieldGet(_discovery, this).idle();
    yield* _classPrivateFieldGet(_snapshots, this).idle();
  }

  // Wait for currently queued snapshots then run and wait for resulting uploads
  async *flush(options) {
    if (!this.readyState || this.readyState > 2) return;
    let callback = typeof options === 'function' ? options : null;
    options && (options = !callback ? [].concat(options) : null);

    // wait until the next event loop for synchronous snapshots
    yield new Promise(r => setImmediate(r));

    // flush and log progress for discovery before snapshots
    if (!this.skipDiscovery && _classPrivateFieldGet(_discovery, this).size) {
      if (options) yield* yieldAll(options.map(o => _classPrivateFieldGet(_discovery, this).process(o)));else yield* _classPrivateFieldGet(_discovery, this).flush(size => callback === null || callback === void 0 ? void 0 : callback('Processing', size));
    }

    // flush and log progress for snapshot uploads
    if (!this.skipUploads && _classPrivateFieldGet(_snapshots, this).size) {
      if (options) yield* yieldAll(options.map(o => _classPrivateFieldGet(_snapshots, this).process(o)));else yield* _classPrivateFieldGet(_snapshots, this).flush(size => callback === null || callback === void 0 ? void 0 : callback('Uploading', size));
    }
  }

  // Stops the local API server and closes the browser and internal queues once snapshots have
  // completed. Does nothing if not running. When `force` is true, any queued snapshots are cleared.
  async *stop(force) {
    // not started, but the browser was launched
    try {
      var _this$server3;
      if (!this.readyState && this.browser.isConnected()) {
        await this.browser.close();
      }
      if (this.syncQueue) this.syncQueue.stop();
      // not started or already stopped
      if (!this.readyState || this.readyState > 2) return;

      // close queues asap
      if (force) {
        _classPrivateFieldGet(_discovery, this).close(true);
        _classPrivateFieldGet(_snapshots, this).close(true);
      }

      // already stopping
      if (this.readyState === 2) return;
      this.readyState = 2;

      // log when force stopping
      if (force) this.log.info('Stopping percy...');

      // used to log snapshot count information
      let info = (state, size) => `${state} ` + `${size} snapshot${size !== 1 ? 's' : ''}`;
      try {
        // flush discovery and snapshot queues
        yield* this.yield.flush((state, size) => {
          this.log.progress(`${info(state, size)}...`, !!size);
        });
      } catch (error) {
        // reset ready state when aborted
        /* istanbul ignore else: all errors bubble */
        if (error.name === 'AbortError') this.readyState = 1;
        throw error;
      }

      // if dry-running, log the total number of snapshots
      if (this.dryRun && _classPrivateFieldGet(_snapshots, this).size) {
        this.log.info(info('Found', _classPrivateFieldGet(_snapshots, this).size));
      }

      // close server and end queues
      await ((_this$server3 = this.server) === null || _this$server3 === void 0 ? void 0 : _this$server3.close());
      await _classPrivateFieldGet(_discovery, this).end();
      await _classPrivateFieldGet(_snapshots, this).end();

      // mark instance as stopped
      this.readyState = 3;
    } catch (err) {
      this.log.error(err);
      throw err;
    } finally {
      // stop monitoring system metric, if not already stopped
      this.monitoring.stopMonitoring();
      clearTimeout(this.resetMonitoringId);

      // This issue doesn't comes under regular error logs,
      // it's detected if we just and stop percy server
      await this.checkForNoSnapshotCommandError();
      await this.sendBuildLogs();
    }
  }
  checkAndUpdateConcurrency() {
    // early exit if monitoring is disabled
    if (!this.systemMonitoringEnabled()) return;

    // early exit if asset discovery concurrency change is disabled
    // NOTE: system monitoring will still be running as only concurrency
    // change is disabled
    if (process.env.PERCY_DISABLE_CONCURRENCY_CHANGE === 'true') return;

    // start system monitoring if not already doing...
    // this doesn't handle cases where there is suggest cpu spikes
    // in less 1 sec range and if monitoring is not in running state
    if (this.monitoringCheckLastExecutedAt && Date.now() - this.monitoringCheckLastExecutedAt < MONITORING_INTERVAL_MS) return;
    if (!this.monitoring.running) this.configureSystemMonitor();else this.resetSystemMonitor();

    // early return if last executed was less than 5 seconds
    // as we will get the same cpu/mem info under 5 sec interval
    const {
      cpuInfo,
      memoryUsageInfo
    } = this.monitoring.getMonitoringInfo();
    this.log.debug(`cpuInfo: ${JSON.stringify(cpuInfo)}`);
    this.log.debug(`memoryInfo: ${JSON.stringify(memoryUsageInfo)}`);
    if (cpuInfo.currentUsagePercent >= 80 || memoryUsageInfo.currentUsagePercent >= 80) {
      let currentConcurrent = _classPrivateFieldGet(_discovery, this).concurrency;

      // concurrency must be betweeen [1, (default/user defined value)]
      let newConcurrency = Math.max(1, parseInt(currentConcurrent / 2));
      newConcurrency = Math.min(this.discoveryMaxConcurrency, newConcurrency);
      this.log.debug(`Downscaling discovery browser concurrency from ${_classPrivateFieldGet(_discovery, this).concurrency} to ${newConcurrency}`);
      _classPrivateFieldGet(_discovery, this).set({
        concurrency: newConcurrency
      });
    } else if (cpuInfo.currentUsagePercent <= 50 && memoryUsageInfo.currentUsagePercent <= 50) {
      let currentConcurrent = _classPrivateFieldGet(_discovery, this).concurrency;
      let newConcurrency = currentConcurrent + 2;

      // concurrency must be betweeen [1, (default/user-defined value)]
      newConcurrency = Math.min(this.discoveryMaxConcurrency, newConcurrency);
      newConcurrency = Math.max(1, newConcurrency);
      this.log.debug(`Upscaling discovery browser concurrency from ${_classPrivateFieldGet(_discovery, this).concurrency} to ${newConcurrency}`);
      _classPrivateFieldGet(_discovery, this).set({
        concurrency: newConcurrency
      });
    }

    // reset timeout to stop monitoring after no-activity of 5 mins
    this.resetSystemMonitor();
    this.monitoringCheckLastExecutedAt = Date.now();
  }

  // Takes one or more snapshots of a page while discovering resources to upload with the resulting
  // snapshots. Once asset discovery has completed for the provided snapshots, the queued task will
  // resolve and an upload task will be queued separately.
  snapshot(options, snapshotPromise = {}) {
    var _this$build2;
    if (this.readyState !== 1) {
      throw new Error('Not running');
    } else if ((_this$build2 = this.build) !== null && _this$build2 !== void 0 && _this$build2.error) {
      throw new Error(this.build.error);
    } else if (Array.isArray(options)) {
      return yieldAll(options.map(o => this.yield.snapshot(o, snapshotPromise)));
    }

    // accept a url for a sitemap or snapshot
    if (typeof options === 'string') {
      options = options.endsWith('.xml') ? {
        sitemap: options
      } : {
        url: options
      };
    }

    // validate options and add client & environment info
    options = validateSnapshotOptions(options);
    this.client.addClientInfo(options.clientInfo);
    this.client.addEnvironmentInfo(options.environmentInfo);

    // without a discovery browser, capture is not possible
    if (this.skipDiscovery && !this.dryRun && !options.domSnapshot) {
      throw new Error('Cannot capture DOM snapshots when asset discovery is disabled');
    }

    // return an async generator to allow cancelation
    return async function* () {
      let server;
      try {
        if ('serve' in options) {
          // create and start a static server
          let {
            baseUrl,
            snapshots
          } = options;
          server = yield createStaticServer(options).listen();
          baseUrl = options.baseUrl = new URL(baseUrl || '', server.address()).href;
          if (!snapshots) options.sitemap = new URL('sitemap.xml', baseUrl).href;
        }

        // gather snapshots and discover snapshot resources
        yield* discoverSnapshotResources(_classPrivateFieldGet(_discovery, this), {
          skipDiscovery: this.skipDiscovery,
          dryRun: this.dryRun,
          checkAndUpdateConcurrency: this.checkAndUpdateConcurrency.bind(this),
          snapshots: yield* gatherSnapshots(options, {
            meta: {
              build: this.build
            },
            config: this.config
          })
        }, snapshot => {
          // attaching promise resolve reject so to wait for snapshot to complete
          if (this.syncMode(snapshot)) {
            snapshotPromise[snapshot.name] = new Promise((resolve, reject) => {
              Object.assign(snapshot, {
                resolve,
                reject
              });
            });
          }
          // push each finished snapshot to the snapshots queue
          _classPrivateFieldGet(_snapshots, this).push(snapshot);
        });
      } finally {
        var _server;
        // always close any created server
        await ((_server = server) === null || _server === void 0 ? void 0 : _server.close());
      }
    }.call(this);
  }

  // Uploads one or more snapshots directly to the current Percy build
  upload(options, callback = null, screenshotFlow = null) {
    var _options$tag2;
    if (this.readyState !== 1) {
      throw new Error('Not running');
    } else if (Array.isArray(options)) {
      return yieldAll(options.map(o => this.yield.upload(o)));
    }
    // validate comparison uploads and warn about any errors

    // we are having two similar attrs in options: tags & tag
    // tags: is used as labels and is string comma-separated like "tag1,tag"
    // tag: is comparison-tag used by app-percy & poa and this is used to create a comparison-tag in BE
    // its format is object like {name: "", os:"", os_version:"", device:""}
    // DO NOT GET CONFUSED!!! :)
    if ('tag' in options || 'tiles' in options) {
      var _options$tag;
      // throw when missing required snapshot or tag name
      if (!options.name) throw new Error('Missing required snapshot name');
      if (!((_options$tag = options.tag) !== null && _options$tag !== void 0 && _options$tag.name)) throw new Error('Missing required tag name for comparison');

      // normalize, migrate, and remove certain properties from validating
      options = PercyConfig.migrate(options, '/comparison');
      let {
        clientInfo,
        environmentInfo,
        labels,
        ...comparison
      } = options;
      let errors = PercyConfig.validate(comparison, '/comparison');
      if ((errors === null || errors === void 0 ? void 0 : errors.length) > 0) {
        this.log.warn('Invalid upload options:');
        for (let e of errors) this.log.warn(`- ${e.path}: ${e.message}`);
      }
    }

    // set meta for logging
    options.meta = {
      snapshot: {
        name: options.name,
        testCase: options.testCase,
        tag: (_options$tag2 = options.tag) === null || _options$tag2 === void 0 ? void 0 : _options$tag2.name
      }
    };

    // add client & environment info
    this.client.addClientInfo(options.clientInfo);
    this.client.addEnvironmentInfo(options.environmentInfo);
    this.client.screenshotFlow = screenshotFlow;

    // Sync CLI support, attached resolve, reject promise
    if (this.syncMode(options)) {
      Object.assign(options, {
        ...callback
      });
    }

    // return an async generator to allow cancelation
    return async function* () {
      try {
        return yield* yieldTo(_classPrivateFieldGet(_snapshots, this).push(options));
      } catch (error) {
        _classPrivateFieldGet(_snapshots, this).cancel(options);
        // Detecting and suggesting fix for errors;
        await this.suggestionsForFix(error.message);
        throw error;
      }
    }.call(this);
  }
  shouldSkipAssetDiscovery(tokenType) {
    if (this.testing && JSON.stringify(this.testing) === JSON.stringify({})) {
      return true;
    }
    const assetDiscoverySupportedTypes = ['web', 'visual_scanner'];
    return !assetDiscoverySupportedTypes.includes(tokenType);
  }
  syncMode(options) {
    var _this$config;
    let syncMode = false;
    if ((_this$config = this.config) !== null && _this$config !== void 0 && (_this$config = _this$config.snapshot) !== null && _this$config !== void 0 && _this$config.sync) syncMode = true;
    if (options !== null && options !== void 0 && options.sync) syncMode = true;
    if ((options === null || options === void 0 ? void 0 : options.sync) === false) syncMode = false;
    if ((this.skipUploads || this.deferUploads || this.delayUploads) && syncMode) {
      syncMode = false;
      options.sync = false;
      if (this.delayUploads && !this.skipUploads) {
        this.log.warn('Synchronous CLI functionality is not compatible with the snapshot command. Kindly consider taking screenshots via SDKs to achieve synchronous results instead.');
      } else {
        let type = 'deferUploads option';
        if (this.skipDiscovery && this.deferUploads) type = 'upload command';
        if (this.skipUploads) type = 'skipUploads option';
        this.log.warn(`The Synchronous CLI functionality is not compatible with ${type}.`);
      }
    }
    if (syncMode) options.sync = syncMode;
    return syncMode;
  }

  // This specific error will be hard coded
  async checkForNoSnapshotCommandError() {
    let isPercyStarted = false;
    let containsSnapshotTaken = false;
    logger.query(item => {
      var _item$message, _item$message2, _item$message3;
      isPercyStarted || (isPercyStarted = item === null || item === void 0 || (_item$message = item.message) === null || _item$message === void 0 ? void 0 : _item$message.includes('Percy has started'));
      containsSnapshotTaken || (containsSnapshotTaken = item === null || item === void 0 || (_item$message2 = item.message) === null || _item$message2 === void 0 ? void 0 : _item$message2.includes('Snapshot taken'));

      // This case happens when you directly upload it using cli-upload
      containsSnapshotTaken || (containsSnapshotTaken = item === null || item === void 0 || (_item$message3 = item.message) === null || _item$message3 === void 0 ? void 0 : _item$message3.includes('Snapshot uploaded'));
      return item;
    });
    if (isPercyStarted && !containsSnapshotTaken) {
      // This is the case for No snapshot command called
      _assertClassBrand(_Percy_brand, this, _displaySuggestionLogs).call(this, [{
        failure_reason: 'Snapshot command was not called',
        reason_message: 'Snapshot Command was not called. please check your CI for errors',
        suggestion: 'Try using percy snapshot command to take snapshots',
        reference_doc_link: ['https://www.browserstack.com/docs/percy/take-percy-snapshots/']
      }]);
    }
  }
  async suggestionsForFix(errors, options = {}) {
    try {
      this.suggestionsCallCounter++;
      if (this.suggestionsCallCounter > MAX_SUGGESTION_CALLS) {
        if (this.suggestionsCallCounter === MAX_SUGGESTION_CALLS + 1) {
          this.log.debug('Rate limit exceeded for Maximum allowed suggestions per build.');
        }
        return;
      }
      const suggestionResponse = await this.client.getErrorAnalysis(errors);
      _assertClassBrand(_Percy_brand, this, _displaySuggestionLogs).call(this, suggestionResponse, options);
    } catch (e) {
      // Common error code for Proxy issues
      const PROXY_CODES = ['ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH'];
      if (!!e.code && PROXY_CODES.includes(e.code)) {
        // This can be due to proxy issue
        this.log.error('percy.io might not be reachable, check network connection, proxy and ensure that percy.io is whitelisted.');
        if (!_assertClassBrand(_Percy_brand, this, _proxyEnabled).call(this)) {
          this.log.error('If inside a proxied envirnment, please configure the following environment variables: HTTP_PROXY, [ and optionally HTTPS_PROXY if you need it ]. Refer to our documentation for more details');
        }
      }
      this.log.error('Unable to analyze error logs');
      this.log.debug(e);
    }
  }
  async sendBuildLogs() {
    if (!process.env.PERCY_TOKEN) return;
    try {
      var _this$build3, _this$build4, _this$build5, _this$build6;
      const logsObject = {
        clilogs: logger.query(log => !['ci'].includes(log.debug))
      };

      // Only add CI logs if not disabled voluntarily.
      const sendCILogs = process.env.PERCY_CLIENT_ERROR_LOGS !== 'false';
      if (sendCILogs) {
        const redactedContent = redactSecrets(logger.query(log => ['ci'].includes(log.debug)));
        logsObject.cilogs = redactedContent;
      }
      const content = base64encode(Pako.gzip(JSON.stringify(logsObject)));
      const referenceId = (_this$build3 = this.build) !== null && _this$build3 !== void 0 && _this$build3.id ? `build_${(_this$build4 = this.build) === null || _this$build4 === void 0 ? void 0 : _this$build4.id}` : (_this$build5 = this.build) === null || _this$build5 === void 0 ? void 0 : _this$build5.id;
      const eventObject = {
        content: content,
        build_id: (_this$build6 = this.build) === null || _this$build6 === void 0 ? void 0 : _this$build6.id,
        reference_id: referenceId,
        service_name: 'cli',
        base64encoded: true
      };
      // Ignore this will update once I implement logs controller.
      const logsSHA = await this.client.sendBuildLogs(eventObject);
      this.log.info(`Build's CLI${sendCILogs ? ' and CI' : ''} logs sent successfully. Please share this log ID with Percy team in case of any issues - ${logsSHA}`);
    } catch (err) {
      this.log.warn('Could not send the builds logs');
    }
  }
}
function _displaySuggestionLogs(suggestions, options = {}) {
  if (!(suggestions !== null && suggestions !== void 0 && suggestions.length)) return;
  suggestions.forEach(item => {
    const failure = item === null || item === void 0 ? void 0 : item.failure_reason;
    const failureReason = item === null || item === void 0 ? void 0 : item.reason_message;
    const suggestion = item === null || item === void 0 ? void 0 : item.suggestion;
    const referenceDocLinks = item === null || item === void 0 ? void 0 : item.reference_doc_link;
    if (options !== null && options !== void 0 && options.snapshotLevel) {
      this.log.warn(`Detected error for Snapshot: ${options === null || options === void 0 ? void 0 : options.snapshotName}`);
    } else {
      this.log.warn('Detected error for percy build');
    }
    this.log.warn(`Failure: ${failure}`);
    this.log.warn(`Failure Reason: ${failureReason}`);
    this.log.warn(`Suggestion: ${suggestion}`);
    if ((referenceDocLinks === null || referenceDocLinks === void 0 ? void 0 : referenceDocLinks.length) > 0) {
      this.log.warn('Refer to the below Doc Links for the same');
      referenceDocLinks === null || referenceDocLinks === void 0 || referenceDocLinks.forEach(_docLink => {
        this.log.warn(`* ${_docLink}`);
      });
    }
  });
}
function _proxyEnabled() {
  return !!(getProxy({
    protocol: 'https:'
  }) || getProxy({}));
}
export default Percy;