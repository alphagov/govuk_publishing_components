(function() {
  (function (exports) {
    'use strict';

    const process = (typeof globalThis !== "undefined" && globalThis.process) || {};
    process.env = process.env || {};
    process.env.__PERCY_BROWSERIFIED__ = true;

    // helper to create a version object from a string
    function toVersion(str) {
      str || (str = '0.0.0');
      return str.split(/\.|-/).reduce((version, part, i) => {
        let v = parseInt(part, 10);
        version[i] = isNaN(v) ? part : v;
        return version;
      }, {
        get major() {
          return this[0] || 0;
        },
        get minor() {
          return this[1] || 0;
        },
        get patch() {
          return this[2] || 0;
        },
        get prerelease() {
          return this[3];
        },
        get build() {
          return this[4];
        },
        toString() {
          return str;
        }
      });
    }

    // private version cache
    let version = toVersion();
    let type;

    // contains local percy info
    const info = {
      // get or set the CLI API address via the environment
      get address() {
        return process.env.PERCY_SERVER_ADDRESS || 'http://localhost:5338';
      },
      set address(addr) {
        return process.env.PERCY_SERVER_ADDRESS = addr;
      },
      // version information
      get version() {
        return version;
      },
      set version(v) {
        return version = toVersion(v);
      },
      get type() {
        return type;
      },
      set type(t) {
        return type = t;
      }
    };

    // Helper to send a request to the local CLI API
    async function request(path, options = {}) {
      let url = path.startsWith('http') ? path : `${info.address}${path}`;
      let response = await request.fetch(url, options);

      // maybe parse response body as json
      if (typeof response.body === 'string' && response.headers['content-type'] === 'application/json') {
        try {
          response.body = JSON.parse(response.body);
        } catch (e) {}
      }

      // throw an error if status is not ok
      if (!(response.status >= 200 && response.status < 300)) {
        throw Object.assign(new Error(), {
          message: response.body.error || /* istanbul ignore next: in tests, there's always an error message */
          `${response.status} ${response.statusText}`,
          response
        });
      }
      return response;
    }
    request.post = function post(url, json) {
      return request(url, {
        method: 'POST',
        body: JSON.stringify(json),
        timeout: 600000
      });
    };

    // environment specific implementation
    if (process.env.__PERCY_BROWSERIFIED__) {
      // use window.fetch in browsers
      const winFetch = window.fetch;
      request.fetch = async function fetch(url, options) {
        let response = await winFetch(url, options);
        return {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: await response.text()
        };
      };
    } else {
      // use http.request in node
      request.fetch = async function fetch(url, options) {
        let {
          protocol
        } = new URL(url);
        // rollup throws error for -> await ({})
        let {
          default: http
        } = protocol === 'https:' ? await ({}) : await ({});
        const requestOptions = {
          ...options
        };
        try {
          const {
            proxyAgentFor
          } = await ({});
          const agent = proxyAgentFor(url);
          if (agent) {
            requestOptions.agent = agent;
          }
        } catch (error) {
          // Failed to load proxy module or create proxy agent (e.g., missing proxy.js, invalid proxy config)
          // Continue without proxy support - requests will go directly without proxy
          /* istanbul ignore next */
          logger('sdk-utils:request').debug(`Proxy agent unavailable: ${error.message}`);
        }
        return new Promise((resolve, reject) => {
          http.request(url, requestOptions).on('response', response => {
            let body = '';
            response.on('data', chunk => body += chunk.toString());
            response.on('end', () => resolve({
              status: response.statusCode,
              statusText: response.statusMessage,
              headers: response.headers,
              body
            }));
          }).on('error', reject).end(options.body);
        });
      };
    }

    // Used when determining if a message should be logged
    const LOG_LEVELS = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    // Create a small logger util using the specified namespace
    function logger(namespace) {
      return Object.keys(LOG_LEVELS).reduce((ns, lvl) => Object.assign(ns, {
        [lvl]: (...a) => logger.log(namespace, lvl, ...a)
      }), {});
    }
    Object.assign(logger, {
      // Set and/or return the local loglevel
      loglevel: (lvl = logger.loglevel.lvl) => {
        return logger.loglevel.lvl = lvl || process.env.PERCY_LOGLEVEL || 'info';
      },
      // Track and send/write logs for the specified namespace and log level
      // remote should only be false in case of sensitive/self call for errors
      log: (ns, lvl, msg, meta, remote = true) => {
        let err = typeof msg !== 'string' && (lvl === 'error' || lvl === 'debug');

        // check if the specific level is within the local loglevel range
        if (LOG_LEVELS[lvl] != null && LOG_LEVELS[lvl] >= LOG_LEVELS[logger.loglevel()]) {
          let debug = logger.loglevel() === 'debug';
          let label = debug ? `percy:${ns}` : 'percy';

          // colorize the label when possible for consistency with the CLI logger
          if (!process.env.__PERCY_BROWSERIFIED__) label = `\u001b[95m${label}\u001b[39m`;
          msg = `[${label}] ${err && debug && msg.stack || msg}`;
          if (process.env.__PERCY_BROWSERIFIED__) {
            // use console[warn|error|log] in browsers
            console[['warn', 'error'].includes(lvl) ? lvl : 'log'](msg);
          } else {
            // use process[stdout|stderr].write in node
            process[lvl === 'info' ? 'stdout' : 'stderr'].write(msg + '\n');
          }
          if (remote && (lvl === 'error' || debug)) {
            return request.post('/percy/log', {
              level: lvl,
              message: msg,
              meta
            }).catch(_ => {
              logger.log(ns, 'error', 'Could not send logs to cli', meta, false);
            });
          }
        }
      }
    });

    // Check if Percy is enabled using the healthcheck endpoint
    async function isPercyEnabled() {
      if (info.enabled == null) {
        let log = logger('utils');
        let error;
        try {
          let response = await request('/percy/healthcheck');
          info.version = response.headers['x-percy-core-version'];
          info.config = response.body.config;
          info.build = response.body.build;
          info.enabled = true;
          info.type = response.body.type;
          info.widths = response.body.widths;
          info.deviceDetails = response.body.deviceDetails;
        } catch (e) {
          info.enabled = false;
          error = e;
        }
        if (!info.enabled) {
          log.info('Percy is not running, disabling snapshots');
          log.debug(error);
        }
      }
      return info.enabled;
    }

    const RETRY_ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT'];
    async function waitForPercyIdle() {
      try {
        return !!(await request('/percy/idle'));
      } catch (e) {
        return RETRY_ERROR_CODES.includes(e.code) && waitForPercyIdle();
      }
    }

    // Fetch and cache the @percy/dom script
    async function fetchPercyDOM() {
      if (info.domScript == null) {
        let response = await request('/percy/dom.js');
        info.domScript = response.body;
      }
      return info.domScript;
    }

    // Post snapshot data to the CLI snapshot endpoint. If the endpoint responds with a build error,
    // indicate that Percy has been disabled.
    async function postSnapshot(options, params) {
      let query = params ? `?${new URLSearchParams(params)}` : '';
      return await request.post(`/percy/snapshot${query}`, options).catch(err => {
        var _err$response;
        if ((_err$response = err.response) !== null && _err$response !== void 0 && (_err$response = _err$response.body) !== null && _err$response !== void 0 && (_err$response = _err$response.build) !== null && _err$response !== void 0 && _err$response.error) {
          info.enabled = false;
        } else {
          throw err;
        }
      });
    }

    // Post snapshot data to the CLI snapshot endpoint. If the endpoint responds with a build error,
    // indicate that Percy has been disabled.
    async function postComparison(options, params) {
      let query = params ? `?${new URLSearchParams(params)}` : '';
      return await request.post(`/percy/comparison${query}`, options).catch(err => {
        var _err$response;
        if ((_err$response = err.response) !== null && _err$response !== void 0 && (_err$response = _err$response.body) !== null && _err$response !== void 0 && (_err$response = _err$response.build) !== null && _err$response !== void 0 && _err$response.error) {
          info.enabled = false;
        } else {
          throw err;
        }
      });
    }

    // Post failed event data to the CLI event endpoint.
    async function postBuildEvents(options) {
      return await request.post('/percy/events', options).catch(err => {
        throw err;
      });
    }

    // Posts to the local Percy server one or more snapshots to flush. Given no arguments, all snapshots
    // will be flushed. Does nothing when Percy is not enabled.
    async function flushSnapshots(options) {
      if (info.enabled) {
        // accept one or more snapshot names
        options && (options = [].concat(options).map(o => typeof o === 'string' ? {
          name: o
        } : o));
        await request.post('/percy/flush', options);
      }
    }

    // Post screenshot data to the CLI automateScreenshot endpoint. If the endpoint responds with a build error,
    // indicate that Percy has been disabled.
    async function captureAutomateScreenshot(options, params) {
      let query = params ? `?${new URLSearchParams(params)}` : '';
      return await request.post(`/percy/automateScreenshot${query}`, options).catch(err => {
        var _err$response;
        if ((_err$response = err.response) !== null && _err$response !== void 0 && (_err$response = _err$response.body) !== null && _err$response !== void 0 && (_err$response = _err$response.build) !== null && _err$response !== void 0 && _err$response.error) {
          info.enabled = false;
        } else {
          throw err;
        }
      });
    }

    // Gets computed responsive widths from the Percy server for responsive snapshot capture
    async function getResponsiveWidths(widths = []) {
      let log = logger('utils');
      try {
        var _response$body;
        // Ensure widths is an array
        const widthsArray = Array.isArray(widths) ? widths : [];
        const queryParam = widthsArray.length > 0 ? `?widths=${widthsArray.join(',')}` : '';
        const response = await request(`/percy/widths-config${queryParam}`);
        return Array.isArray((_response$body = response.body) === null || _response$body === void 0 ? void 0 : _response$body.widths) ? response.body.widths : [];
      } catch (error) {
        // Log error and return empty array as fallback
        log.debug(`Failed to get responsive widths: ${error.message}`);
        return [];
      }
    }

    function isPlainObject(value) {
      return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    // Recursively merge `override` onto `base`. Plain (non-array) objects are merged
    // key-by-key so overriding one nested key keeps the base's sibling keys; arrays,
    // scalars, null and functions from `override` replace the base value wholesale.
    function deepMerge(base, override) {
      const result = {
        ...base
      };
      for (const key of Object.keys(override)) {
        const baseVal = base[key];
        const overrideVal = override[key];
        result[key] = isPlainObject(baseVal) && isPlainObject(overrideVal) ? deepMerge(baseVal, overrideVal) : overrideVal;
      }
      return result;
    }

    // Merges .percy.yml config snapshot options with per-snapshot options.
    // Per-snapshot options take priority over config options.
    //
    // The merge is deep: nested objects (e.g. `discovery`) are merged recursively so
    // a per-snapshot override of one nested key does not drop the config's sibling
    // nested keys. At the leaves, per-snapshot values win; arrays are replaced, not
    // concatenated.
    function mergeSnapshotOptions(options = {}) {
      var _percy$config;
      const configOptions = (info === null || info === void 0 || (_percy$config = info.config) === null || _percy$config === void 0 ? void 0 : _percy$config.snapshot) || {};
      return deepMerge(configOptions, options);
    }

    // Returns the readiness config for a snapshot.
    // Shallow-merge of global .percy.yml config with per-snapshot overrides:
    // per-snapshot keys win, unspecified keys are inherited from the global config.
    // SDKs obtain percy.config via the healthcheck endpoint in isPercyEnabled().
    //
    // Why shallow-merge instead of `||`:
    //   - `options.readiness = {}` would otherwise wipe the global config entirely.
    //   - A partial per-snapshot override like `{ stabilityWindowMs: 500 }` would
    //     drop a global `preset: disabled` kill switch — silently re-enabling the
    //     gate for a snapshot the user thought was opted out.
    function getReadinessConfig(snapshotOptions = {}) {
      var _percy$config;
      return {
        ...(((_percy$config = info.config) === null || _percy$config === void 0 || (_percy$config = _percy$config.snapshot) === null || _percy$config === void 0 ? void 0 : _percy$config.readiness) || {}),
        ...((snapshotOptions === null || snapshotOptions === void 0 ? void 0 : snapshotOptions.readiness) || {})
      };
    }

    // Returns true if readiness should be skipped for this snapshot.
    function isReadinessDisabled(snapshotOptions = {}) {
      let config = getReadinessConfig(snapshotOptions);
      return (config === null || config === void 0 ? void 0 : config.preset) === 'disabled';
    }

    // Returns a JavaScript code string that SDKs evaluate in the browser
    // to run readiness checks BEFORE serialize.
    //
    // This is the READINESS-ONLY call. Serialize stays as a separate sync call.
    // The two-call pattern:
    //   1. await evaluate(waitForReadyScript(config))     — async, readiness
    //   2. evaluate('return PercyDOM.serialize(options)')  — sync, unchanged
    //
    // Usage:
    //   // Puppeteer/Playwright (page.evaluate auto-awaits):
    //   await page.evaluate(waitForReadyScript(config));
    //
    //   // Selenium (executeAsyncScript with callback):
    //   driver.execute_async_script(waitForReadyScript(config, { callback: true }));
    //
    // Graceful degradation:
    //   - If PercyDOM.waitForReady is not available (old CLI): resolves immediately
    //   - If waitForReady throws: resolves immediately (catch swallows the error)
    //   - If readiness times out: waitForReady resolves with { timed_out: true }
    //
    // IMPORTANT: The output is intended for CDP / executeScript / executeAsyncScript channels.
    // Do NOT inline this string into HTML — `</script>` sequences in user config would break out
    // of a <script> tag. SDK authors must add HTML escaping before any HTML-inline use.
    function waitForReadyScript(readinessConfig = {}, {
      callback = false
    } = {}) {
      // U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) are valid in JSON strings but
      // were illegal in JS source string literals before ES2019. Escaping them keeps the emitted
      // script source legal on older engines that may host the SDK eval.
      let config = JSON.stringify(readinessConfig).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
      if (callback) {
        // For executeAsyncScript — last argument is the callback
        return `
        var done = arguments[arguments.length - 1];
        try {
          if (typeof PercyDOM !== 'undefined' && typeof PercyDOM.waitForReady === 'function') {
            PercyDOM.waitForReady(${config}).then(function(r) { done(r); }).catch(function() { done(); });
          } else { done(); }
        } catch(e) { done(); }
      `;
      }

      // For page.evaluate (auto-awaits the returned Promise). This MUST be a single
      // expression: page.evaluate(string) evaluates the string as a script, where a
      // top-level `return` is a SyntaxError ("Illegal return statement"). A ternary
      // expression yields the waitForReady Promise (auto-awaited) or undefined.
      return `
      (typeof PercyDOM !== 'undefined' && typeof PercyDOM.waitForReady === 'function')
        ? PercyDOM.waitForReady(${config})
        : undefined
    `;
    }

    // Runs the readiness gate end-to-end so every JS SDK collapses to a single
    // call. The SDK's only responsibility is to provide an `evalScript` callback
    // that ships the script string to the browser via its driver's evaluator
    // (page.evaluate, driver.executeAsyncScript, b.executeAsync, etc.).
    //
    // Centralised here:
    //   - isReadinessDisabled kill-switch check
    //   - getReadinessConfig shallow-merge of global + per-snapshot config
    //   - waitForReadyScript script generation (callback or promise mode)
    //   - try/catch with debug logging — serialize is never blocked
    //
    // Returns: the diagnostics object from PercyDOM.waitForReady, or null
    // when readiness is disabled / unavailable / failed. The caller attaches
    // the non-null result to domSnapshot.readiness_diagnostics.
    //
    // Usage:
    //   // Puppeteer/Playwright (promise-mode):
    //   const diag = await utils.runReadinessGate(
    //     (script) => page.evaluate(script),
    //     options,
    //     { log }
    //   );
    //
    //   // Selenium-js / WebdriverIO / Nightwatch (callback-mode):
    //   const diag = await utils.runReadinessGate(
    //     (script) => driver.executeAsyncScript(script),
    //     options,
    //     { callback: true, log }
    //   );
    async function runReadinessGate(evalScript, snapshotOptions = {}, {
      callback = false,
      log
    } = {}) {
      if (isReadinessDisabled(snapshotOptions)) return null;
      const config = getReadinessConfig(snapshotOptions);
      const script = waitForReadyScript(config, {
        callback
      });
      try {
        return await evalScript(script);
      } catch (err) {
        if (log && typeof log.debug === 'function') {
          log.debug(`waitForReady failed, proceeding to serialize: ${(err === null || err === void 0 ? void 0 : err.message) || err}`);
        }
        return null;
      }
    }

    // Iframe depth constants shared with @percy/dom's serialize-frames. Kept
    // here so external Percy SDKs (Capybara, Cypress, Playwright, etc.) can
    // clamp their own pre-CLI configuration to the same bounds the CLI enforces.
    //
    // MIRROR: must match @percy/dom/src/serialize-frames.js. The pair is kept
    // duplicated (rather than imported across the package boundary) because the
    // previous cross-package import broke Node 14 CI; the parity test below
    // enforces alignment instead. Don't change one without changing the other.
    const DEFAULT_MAX_IFRAME_DEPTH = 3;
    const HARD_MAX_IFRAME_DEPTH = 10;
    function clampIframeDepth(raw) {
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 1) return DEFAULT_MAX_IFRAME_DEPTH;
      return Math.min(Math.floor(n), HARD_MAX_IFRAME_DEPTH);
    }

    // Canonical list of iframe `src` URL prefixes that out-of-process SDK frame
    // walks (Capybara, Nightwatch, Playwright, Puppeteer, Selenium, ...) must NOT
    // switch into / serialize: browser-internal pages, non-HTTP schemes, and
    // pseudo-protocols that either can't be navigated cross-process or are unsafe
    // to recurse into. SINGLE SOURCE OF TRUTH — every SDK previously hand-copied
    // this list (it drifted into 4 divergent versions), so they now consume it
    // from here instead. `startsWith`, case-insensitive.
    const UNSUPPORTED_IFRAME_SRCS = ['about:', 'chrome:', 'chrome-extension:', 'devtools:', 'edge:', 'opera:', 'view-source:', 'data:', 'javascript:', 'blob:', 'vbscript:', 'file:', 'ws:', 'wss:', 'ftp:'];

    // True when an iframe `src` should be skipped by an SDK frame walk. A missing
    // / empty src is treated as unsupported (nothing to navigate to).
    function isUnsupportedIframeSrc(src) {
      if (!src) return true;
      const s = String(src).toLowerCase();
      return UNSUPPORTED_IFRAME_SRCS.some(prefix => s.startsWith(prefix));
    }

    // Normalize a raw ignore-selectors value (array | string | unset) into a
    // clean string[]. PercyDOM does `selectors?.length && selectors.some(...)`,
    // which throws when handed a bare string (has .length, no .some), so SDKs
    // must normalize before forwarding — this is the shared primitive.
    function normalizeIgnoreSelectors(value) {
      if (!value) return [];
      if (Array.isArray(value)) return value.filter(s => typeof s === 'string' && s.length);
      if (typeof value === 'string') return [value];
      return [];
    }

    // Resolve the effective maxIframeDepth for a snapshot: per-snapshot option
    // wins over the global `percy.config.snapshot.maxIframeDepth`, then the value
    // is clamped to [1, HARD_MAX_IFRAME_DEPTH] (invalid/<1 -> default).
    function resolveMaxFrameDepth(options = {}) {
      var _percy$config;
      let raw = options.maxIframeDepth;
      if (raw == null) raw = info === null || info === void 0 || (_percy$config = info.config) === null || _percy$config === void 0 || (_percy$config = _percy$config.snapshot) === null || _percy$config === void 0 ? void 0 : _percy$config.maxIframeDepth;
      return clampIframeDepth(raw);
    }

    // Resolve the effective ignoreIframeSelectors for a snapshot: per-snapshot
    // option wins; when absent, fall back to the global
    // `percy.config.snapshot.ignoreIframeSelectors`. Always returns a string[].
    function resolveIgnoreSelectors(options = {}) {
      var _percy$config2;
      const perSnapshot = normalizeIgnoreSelectors(options.ignoreIframeSelectors ?? options.ignoreSelectors);
      if (perSnapshot.length) return perSnapshot;
      return normalizeIgnoreSelectors(info === null || info === void 0 || (_percy$config2 = info.config) === null || _percy$config2 === void 0 || (_percy$config2 = _percy$config2.snapshot) === null || _percy$config2 === void 0 ? void 0 : _percy$config2.ignoreIframeSelectors);
    }

    var index = /*#__PURE__*/Object.freeze({
      __proto__: null,
      logger: logger,
      percy: info,
      request: request,
      isPercyEnabled: isPercyEnabled,
      waitForPercyIdle: waitForPercyIdle,
      fetchPercyDOM: fetchPercyDOM,
      postSnapshot: postSnapshot,
      postComparison: postComparison,
      flushSnapshots: flushSnapshots,
      captureAutomateScreenshot: captureAutomateScreenshot,
      postBuildEvents: postBuildEvents,
      getResponsiveWidths: getResponsiveWidths,
      mergeSnapshotOptions: mergeSnapshotOptions,
      DEFAULT_MAX_IFRAME_DEPTH: DEFAULT_MAX_IFRAME_DEPTH,
      HARD_MAX_IFRAME_DEPTH: HARD_MAX_IFRAME_DEPTH,
      clampIframeDepth: clampIframeDepth,
      UNSUPPORTED_IFRAME_SRCS: UNSUPPORTED_IFRAME_SRCS,
      isUnsupportedIframeSrc: isUnsupportedIframeSrc,
      normalizeIgnoreSelectors: normalizeIgnoreSelectors,
      resolveMaxFrameDepth: resolveMaxFrameDepth,
      resolveIgnoreSelectors: resolveIgnoreSelectors,
      waitForReadyScript: waitForReadyScript,
      getReadinessConfig: getReadinessConfig,
      isReadinessDisabled: isReadinessDisabled,
      runReadinessGate: runReadinessGate,
      'default': index
    });

    exports.DEFAULT_MAX_IFRAME_DEPTH = DEFAULT_MAX_IFRAME_DEPTH;
    exports.HARD_MAX_IFRAME_DEPTH = HARD_MAX_IFRAME_DEPTH;
    exports.UNSUPPORTED_IFRAME_SRCS = UNSUPPORTED_IFRAME_SRCS;
    exports.captureAutomateScreenshot = captureAutomateScreenshot;
    exports.clampIframeDepth = clampIframeDepth;
    exports["default"] = index;
    exports.fetchPercyDOM = fetchPercyDOM;
    exports.flushSnapshots = flushSnapshots;
    exports.getReadinessConfig = getReadinessConfig;
    exports.getResponsiveWidths = getResponsiveWidths;
    exports.isPercyEnabled = isPercyEnabled;
    exports.isReadinessDisabled = isReadinessDisabled;
    exports.isUnsupportedIframeSrc = isUnsupportedIframeSrc;
    exports.logger = logger;
    exports.mergeSnapshotOptions = mergeSnapshotOptions;
    exports.normalizeIgnoreSelectors = normalizeIgnoreSelectors;
    exports.percy = info;
    exports.postBuildEvents = postBuildEvents;
    exports.postComparison = postComparison;
    exports.postSnapshot = postSnapshot;
    exports.request = request;
    exports.resolveIgnoreSelectors = resolveIgnoreSelectors;
    exports.resolveMaxFrameDepth = resolveMaxFrameDepth;
    exports.runReadinessGate = runReadinessGate;
    exports.waitForPercyIdle = waitForPercyIdle;
    exports.waitForReadyScript = waitForReadyScript;

    Object.defineProperty(exports, '__esModule', { value: true });

  })(this.PercySDKUtils = this.PercySDKUtils || {});
}).call(window);

if (typeof define === "function" && define.amd) {
  define("@percy/sdk-utils", [], () => window.PercySDKUtils);
} else if (typeof module === "object" && module.exports) {
  module.exports = window.PercySDKUtils;
}
