"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.mergeSnapshotOptions = mergeSnapshotOptions;
var _percyInfo = _interopRequireDefault(require("./percy-info.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  const configOptions = (_percyInfo.default === null || _percyInfo.default === void 0 || (_percy$config = _percyInfo.default.config) === null || _percy$config === void 0 ? void 0 : _percy$config.snapshot) || {};
  return deepMerge(configOptions, options);
}
var _default = exports.default = mergeSnapshotOptions;