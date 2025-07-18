"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.captureAutomateScreenshot = captureAutomateScreenshot;
exports.default = void 0;
var _percyInfo = _interopRequireDefault(require("./percy-info.js"));
var _request = _interopRequireDefault(require("./request.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Post screenshot data to the CLI automateScreenshot endpoint. If the endpoint responds with a build error,
// indicate that Percy has been disabled.
async function captureAutomateScreenshot(options, params) {
  let query = params ? `?${new URLSearchParams(params)}` : '';
  return await _request.default.post(`/percy/automateScreenshot${query}`, options).catch(err => {
    var _err$response;
    if ((_err$response = err.response) !== null && _err$response !== void 0 && (_err$response = _err$response.body) !== null && _err$response !== void 0 && (_err$response = _err$response.build) !== null && _err$response !== void 0 && _err$response.error) {
      _percyInfo.default.enabled = false;
    } else {
      throw err;
    }
  });
}
var _default = exports.default = captureAutomateScreenshot;