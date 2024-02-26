"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.postBuildEvents = postBuildEvents;
var _request = _interopRequireDefault(require("./request.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Post failed event data to the CLI event endpoint.
async function postBuildEvents(options) {
  return await _request.default.post('/percy/events', options).catch(err => {
    throw err;
  });
}
var _default = postBuildEvents;
exports.default = _default;