"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getResponsiveWidths = getResponsiveWidths;
var _request = _interopRequireDefault(require("./request.js"));
var _logger = _interopRequireDefault(require("./logger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Gets computed responsive widths from the Percy server for responsive snapshot capture
async function getResponsiveWidths(widths = []) {
  let log = (0, _logger.default)('utils');
  try {
    var _response$body;
    // Ensure widths is an array
    const widthsArray = Array.isArray(widths) ? widths : [];
    const queryParam = widthsArray.length > 0 ? `?widths=${widthsArray.join(',')}` : '';
    const response = await (0, _request.default)(`/percy/widths-config${queryParam}`);
    return Array.isArray((_response$body = response.body) === null || _response$body === void 0 ? void 0 : _response$body.widths) ? response.body.widths : [];
  } catch (error) {
    // Log error and return empty array as fallback
    log.debug(`Failed to get responsive widths: ${error.message}`);
    return [];
  }
}
var _default = exports.default = getResponsiveWidths;