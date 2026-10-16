"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getReadinessConfig = getReadinessConfig;
exports.isReadinessDisabled = isReadinessDisabled;
exports.runReadinessGate = runReadinessGate;
exports.waitForReadyScript = waitForReadyScript;
var _percyInfo = _interopRequireDefault(require("./percy-info.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
    ...(((_percy$config = _percyInfo.default.config) === null || _percy$config === void 0 || (_percy$config = _percy$config.snapshot) === null || _percy$config === void 0 ? void 0 : _percy$config.readiness) || {}),
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
var _default = exports.default = waitForReadyScript;