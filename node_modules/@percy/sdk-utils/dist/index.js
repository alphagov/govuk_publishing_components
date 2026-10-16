"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNSUPPORTED_IFRAME_SRCS = exports.HARD_MAX_IFRAME_DEPTH = exports.DEFAULT_MAX_IFRAME_DEPTH = void 0;
Object.defineProperty(exports, "captureAutomateScreenshot", {
  enumerable: true,
  get: function () {
    return _postScreenshot.default;
  }
});
exports.clampIframeDepth = clampIframeDepth;
exports.default = void 0;
Object.defineProperty(exports, "fetchPercyDOM", {
  enumerable: true,
  get: function () {
    return _percyDom.default;
  }
});
Object.defineProperty(exports, "flushSnapshots", {
  enumerable: true,
  get: function () {
    return _flushSnapshots.default;
  }
});
Object.defineProperty(exports, "getReadinessConfig", {
  enumerable: true,
  get: function () {
    return _serializeDom.getReadinessConfig;
  }
});
Object.defineProperty(exports, "getResponsiveWidths", {
  enumerable: true,
  get: function () {
    return _getResponsiveWidths.default;
  }
});
Object.defineProperty(exports, "isPercyEnabled", {
  enumerable: true,
  get: function () {
    return _percyEnabled.default;
  }
});
Object.defineProperty(exports, "isReadinessDisabled", {
  enumerable: true,
  get: function () {
    return _serializeDom.isReadinessDisabled;
  }
});
exports.isUnsupportedIframeSrc = isUnsupportedIframeSrc;
Object.defineProperty(exports, "logger", {
  enumerable: true,
  get: function () {
    return _logger.default;
  }
});
Object.defineProperty(exports, "mergeSnapshotOptions", {
  enumerable: true,
  get: function () {
    return _mergeSnapshotOptions.default;
  }
});
exports.normalizeIgnoreSelectors = normalizeIgnoreSelectors;
Object.defineProperty(exports, "percy", {
  enumerable: true,
  get: function () {
    return _percyInfo.default;
  }
});
Object.defineProperty(exports, "postBuildEvents", {
  enumerable: true,
  get: function () {
    return _postBuildEvent.default;
  }
});
Object.defineProperty(exports, "postComparison", {
  enumerable: true,
  get: function () {
    return _postComparison.default;
  }
});
Object.defineProperty(exports, "postSnapshot", {
  enumerable: true,
  get: function () {
    return _postSnapshot.default;
  }
});
Object.defineProperty(exports, "request", {
  enumerable: true,
  get: function () {
    return _request.default;
  }
});
exports.resolveIgnoreSelectors = resolveIgnoreSelectors;
exports.resolveMaxFrameDepth = resolveMaxFrameDepth;
Object.defineProperty(exports, "runReadinessGate", {
  enumerable: true,
  get: function () {
    return _serializeDom.runReadinessGate;
  }
});
Object.defineProperty(exports, "waitForPercyIdle", {
  enumerable: true,
  get: function () {
    return _percyIdle.default;
  }
});
Object.defineProperty(exports, "waitForReadyScript", {
  enumerable: true,
  get: function () {
    return _serializeDom.waitForReadyScript;
  }
});
var _logger = _interopRequireDefault(require("./logger.js"));
var _percyInfo = _interopRequireDefault(require("./percy-info.js"));
var _request = _interopRequireDefault(require("./request.js"));
var _percyEnabled = _interopRequireDefault(require("./percy-enabled.js"));
var _percyIdle = _interopRequireDefault(require("./percy-idle.js"));
var _percyDom = _interopRequireDefault(require("./percy-dom.js"));
var _postSnapshot = _interopRequireDefault(require("./post-snapshot.js"));
var _postComparison = _interopRequireDefault(require("./post-comparison.js"));
var _postBuildEvent = _interopRequireDefault(require("./post-build-event.js"));
var _flushSnapshots = _interopRequireDefault(require("./flush-snapshots.js"));
var _postScreenshot = _interopRequireDefault(require("./post-screenshot.js"));
var _getResponsiveWidths = _interopRequireDefault(require("./get-responsive-widths.js"));
var _mergeSnapshotOptions = _interopRequireDefault(require("./merge-snapshot-options.js"));
var _serializeDom = require("./serialize-dom.js");
var _default = _interopRequireWildcard(require("./index.js"));
exports.default = _default;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Iframe depth constants shared with @percy/dom's serialize-frames. Kept
// here so external Percy SDKs (Capybara, Cypress, Playwright, etc.) can
// clamp their own pre-CLI configuration to the same bounds the CLI enforces.
//
// MIRROR: must match @percy/dom/src/serialize-frames.js. The pair is kept
// duplicated (rather than imported across the package boundary) because the
// previous cross-package import broke Node 14 CI; the parity test below
// enforces alignment instead. Don't change one without changing the other.
const DEFAULT_MAX_IFRAME_DEPTH = exports.DEFAULT_MAX_IFRAME_DEPTH = 3;
const HARD_MAX_IFRAME_DEPTH = exports.HARD_MAX_IFRAME_DEPTH = 10;
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
const UNSUPPORTED_IFRAME_SRCS = exports.UNSUPPORTED_IFRAME_SRCS = ['about:', 'chrome:', 'chrome-extension:', 'devtools:', 'edge:', 'opera:', 'view-source:', 'data:', 'javascript:', 'blob:', 'vbscript:', 'file:', 'ws:', 'wss:', 'ftp:'];

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
  if (raw == null) raw = _percyInfo.default === null || _percyInfo.default === void 0 || (_percy$config = _percyInfo.default.config) === null || _percy$config === void 0 || (_percy$config = _percy$config.snapshot) === null || _percy$config === void 0 ? void 0 : _percy$config.maxIframeDepth;
  return clampIframeDepth(raw);
}

// Resolve the effective ignoreIframeSelectors for a snapshot: per-snapshot
// option wins; when absent, fall back to the global
// `percy.config.snapshot.ignoreIframeSelectors`. Always returns a string[].
function resolveIgnoreSelectors(options = {}) {
  var _percy$config2;
  const perSnapshot = normalizeIgnoreSelectors(options.ignoreIframeSelectors ?? options.ignoreSelectors);
  if (perSnapshot.length) return perSnapshot;
  return normalizeIgnoreSelectors(_percyInfo.default === null || _percyInfo.default === void 0 || (_percy$config2 = _percyInfo.default.config) === null || _percy$config2 === void 0 || (_percy$config2 = _percy$config2.snapshot) === null || _percy$config2 === void 0 ? void 0 : _percy$config2.ignoreIframeSelectors);
}

// export the namespace by default