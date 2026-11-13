"use strict";
// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Browser = void 0;
require("./common.js");
require("./session.js");
const record_js_1 = require("../serialization/record.js");
const enum_js_1 = require("../serialization/enum.js");
const union_js_1 = require("../serialization/union.js");
const domain_js_1 = require("../domain.js");
(0, record_js_1.defineAlias)('browser.ClientWindow', { "primitive": "string" });
const BrowserClientWindowInfo = (0, record_js_1.defineRecord)('browser.ClientWindowInfo', [{ "name": "active", "wire": "active", "required": true, "type": { "primitive": "boolean" } }, { "name": "clientWindow", "wire": "clientWindow", "required": true, "type": { "ref": "browser.ClientWindow" } }, { "name": "height", "wire": "height", "required": true, "type": { "ref": "js-uint" } }, { "name": "state", "wire": "state", "required": true, "type": { "ref": "browser.ClientWindowInfoState" } }, { "name": "width", "wire": "width", "required": true, "type": { "ref": "js-uint" } }, { "name": "x", "wire": "x", "required": true, "type": { "ref": "js-int" } }, { "name": "y", "wire": "y", "required": true, "type": { "ref": "js-int" } }]);
(0, record_js_1.defineAlias)('browser.UserContext', { "primitive": "string" });
const BrowserUserContextInfo = (0, record_js_1.defineRecord)('browser.UserContextInfo', [{ "name": "userContext", "wire": "userContext", "required": true, "type": { "ref": "browser.UserContext" } }]);
const BrowserClose = (0, record_js_1.defineRecord)('browser.Close', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "browser.close" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "EmptyParams" } }]);
(0, record_js_1.defineAlias)('browser.CloseResult', { "ref": "EmptyResult" });
const BrowserCreateUserContext = (0, record_js_1.defineRecord)('browser.CreateUserContext', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "browser.createUserContext" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "browser.CreateUserContextParameters" } }]);
const BrowserCreateUserContextParameters = (0, record_js_1.defineRecord)('browser.CreateUserContextParameters', [{ "name": "acceptInsecureCerts", "wire": "acceptInsecureCerts", "required": false, "type": { "primitive": "boolean" } }, { "name": "proxy", "wire": "proxy", "required": false, "type": { "ref": "session.ProxyConfiguration" } }, { "name": "unhandledPromptBehavior", "wire": "unhandledPromptBehavior", "required": false, "type": { "ref": "session.UserPromptHandler" } }]);
(0, record_js_1.defineAlias)('browser.CreateUserContextResult', { "ref": "browser.UserContextInfo" });
const BrowserGetClientWindows = (0, record_js_1.defineRecord)('browser.GetClientWindows', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "browser.getClientWindows" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "EmptyParams" } }]);
const BrowserGetClientWindowsResult = (0, record_js_1.defineRecord)('browser.GetClientWindowsResult', [{ "name": "clientWindows", "wire": "clientWindows", "required": true, "type": { "list": { "ref": "browser.ClientWindowInfo" } } }]);
const BrowserGetUserContexts = (0, record_js_1.defineRecord)('browser.GetUserContexts', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "browser.getUserContexts" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "EmptyParams" } }]);
const BrowserGetUserContextsResult = (0, record_js_1.defineRecord)('browser.GetUserContextsResult', [{ "name": "userContexts", "wire": "userContexts", "required": true, "type": { "list": { "ref": "browser.UserContextInfo" } } }]);
const BrowserRemoveUserContext = (0, record_js_1.defineRecord)('browser.RemoveUserContext', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "browser.removeUserContext" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "browser.RemoveUserContextParameters" } }]);
const BrowserRemoveUserContextParameters = (0, record_js_1.defineRecord)('browser.RemoveUserContextParameters', [{ "name": "userContext", "wire": "userContext", "required": true, "type": { "ref": "browser.UserContext" } }]);
(0, record_js_1.defineAlias)('browser.RemoveUserContextResult', { "ref": "EmptyResult" });
const BrowserSetClientWindowState = (0, record_js_1.defineRecord)('browser.SetClientWindowState', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "browser.setClientWindowState" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "browser.SetClientWindowStateParameters" } }]);
const BrowserSetClientWindowStateParametersUnion = (0, union_js_1.defineUnion)('browser.SetClientWindowStateParameters', { "by": "state", "variants": [{ "value": "normal", "ref": "browser.SetClientWindowStateParameters_ClientWindowRectState" }], "default": "browser.SetClientWindowStateParameters_ClientWindowNamedState" }, { "objectOnly": true });
(0, record_js_1.defineAlias)('browser.SetClientWindowStateResult', { "ref": "browser.ClientWindowInfo" });
const BrowserSetDownloadBehavior = (0, record_js_1.defineRecord)('browser.SetDownloadBehavior', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "browser.setDownloadBehavior" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "browser.SetDownloadBehaviorParameters" } }]);
const BrowserSetDownloadBehaviorParameters = (0, record_js_1.defineRecord)('browser.SetDownloadBehaviorParameters', [{ "name": "downloadBehavior", "wire": "downloadBehavior", "required": true, "type": { "ref": "browser.DownloadBehavior", "nullable": true } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
const BrowserDownloadBehaviorUnion = (0, union_js_1.defineUnion)('browser.DownloadBehavior', { "by": "type", "variants": [{ "value": "allowed", "ref": "browser.DownloadBehavior_Allowed" }, { "value": "denied", "ref": "browser.DownloadBehavior_Denied" }] }, { "objectOnly": true });
(0, record_js_1.defineAlias)('browser.SetDownloadBehaviorResult', { "ref": "EmptyResult" });
const BrowserClientWindowInfoStateEnum = (0, enum_js_1.defineEnum)('browser.ClientWindowInfoState', ["fullscreen", "maximized", "minimized", "normal"]);
const BrowserClientWindowNamedStateStateEnum = (0, enum_js_1.defineEnum)('browser.ClientWindowNamedStateState', ["fullscreen", "maximized", "minimized"]);
const BrowserSetClientWindowStateParameters_ClientWindowNamedState = (0, record_js_1.defineRecord)('browser.SetClientWindowStateParameters_ClientWindowNamedState', [{ "name": "clientWindow", "wire": "clientWindow", "required": true, "type": { "ref": "browser.ClientWindow" } }, { "name": "state", "wire": "state", "required": true, "type": { "ref": "browser.ClientWindowNamedStateState" } }]);
const BrowserSetClientWindowStateParameters_ClientWindowRectState = (0, record_js_1.defineRecord)('browser.SetClientWindowStateParameters_ClientWindowRectState', [{ "name": "clientWindow", "wire": "clientWindow", "required": true, "type": { "ref": "browser.ClientWindow" } }, { "name": "state", "wire": "state", "required": true, "type": { "const": "normal" } }, { "name": "width", "wire": "width", "required": false, "type": { "ref": "js-uint" } }, { "name": "height", "wire": "height", "required": false, "type": { "ref": "js-uint" } }, { "name": "x", "wire": "x", "required": false, "type": { "ref": "js-int" } }, { "name": "y", "wire": "y", "required": false, "type": { "ref": "js-int" } }]);
const BrowserDownloadBehavior_Allowed = (0, record_js_1.defineRecord)('browser.DownloadBehavior_Allowed', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "allowed" } }, { "name": "destinationFolder", "wire": "destinationFolder", "required": true, "type": { "primitive": "string" } }]);
const BrowserDownloadBehavior_Denied = (0, record_js_1.defineRecord)('browser.DownloadBehavior_Denied', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "denied" } }]);
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class Browser extends domain_js_1.Domain {
    static async create(driver) {
        return new Browser(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
    /**
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-close
     */
    async close() {
        await this.send('browser.close', {});
    }
    /**
     * @param {BrowserCreateUserContextParameters} params
     * @param {boolean} [params.acceptInsecureCerts]
     * @param {SessionProxyConfiguration} [params.proxy]
     * @param {SessionUserPromptHandler} [params.unhandledPromptBehavior]
     * @returns {Promise<BrowserCreateUserContextResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-createUserContext
     */
    async createUserContext(params) {
        const validatedParams = new BrowserCreateUserContextParameters(params);
        const result = await this.send('browser.createUserContext', validatedParams);
        return BrowserUserContextInfo.fromWire(result);
    }
    /**
     * @returns {Promise<BrowserGetClientWindowsResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-getClientWindows
     */
    async getClientWindows() {
        const result = await this.send('browser.getClientWindows', {});
        return BrowserGetClientWindowsResult.fromWire(result);
    }
    /**
     * @returns {Promise<BrowserGetUserContextsResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-getUserContexts
     */
    async getUserContexts() {
        const result = await this.send('browser.getUserContexts', {});
        return BrowserGetUserContextsResult.fromWire(result);
    }
    /**
     * @param {BrowserRemoveUserContextParameters} params
     * @param {BrowserUserContext} params.userContext
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-removeUserContext
     */
    async removeUserContext(params) {
        const validatedParams = new BrowserRemoveUserContextParameters(params);
        await this.send('browser.removeUserContext', validatedParams);
    }
    /**
     * @param {BrowserSetClientWindowStateParameters} params
     * @returns {Promise<BrowserSetClientWindowStateResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-setClientWindowState
     */
    async setClientWindowState(params) {
        const validatedParams = BrowserSetClientWindowStateParametersUnion.build(params);
        const result = await this.send('browser.setClientWindowState', validatedParams);
        return BrowserClientWindowInfo.fromWire(result);
    }
    /**
     * @param {BrowserSetDownloadBehaviorParameters} params
     * @param {BrowserDownloadBehavior | null} params.downloadBehavior
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-setDownloadBehavior
     */
    async setDownloadBehavior(params) {
        const validatedParams = new BrowserSetDownloadBehaviorParameters(params);
        await this.send('browser.setDownloadBehavior', validatedParams);
    }
}
exports.Browser = Browser;
Browser.ClientWindowInfoState = Object.freeze({ FULLSCREEN: "fullscreen", MAXIMIZED: "maximized", MINIMIZED: "minimized", NORMAL: "normal" });
Browser.ClientWindowNamedStateState = Object.freeze({ FULLSCREEN: "fullscreen", MAXIMIZED: "maximized", MINIMIZED: "minimized" });
