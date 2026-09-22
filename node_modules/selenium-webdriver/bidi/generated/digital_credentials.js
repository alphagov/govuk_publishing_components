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
exports.DigitalCredentials = void 0;
require("./common.js");
const record_js_1 = require("../serialization/record.js");
const enum_js_1 = require("../serialization/enum.js");
const domain_js_1 = require("../domain.js");
const DigitalCredentialsVirtualWalletActionEnum = (0, enum_js_1.defineEnum)('digitalCredentials.VirtualWalletAction', ["decline", "respond", "wait", "clear"]);
const DigitalCredentialsSetVirtualWalletBehaviorParameters = (0, record_js_1.defineRecord)('digitalCredentials.SetVirtualWalletBehaviorParameters', [{ "name": "action", "wire": "action", "required": true, "type": { "ref": "digitalCredentials.VirtualWalletAction" } }, { "name": "context", "wire": "context", "required": false, "type": { "primitive": "string" } }, { "name": "protocol", "wire": "protocol", "required": false, "type": { "primitive": "string" } }, { "name": "response", "wire": "response", "required": false, "type": { "ref": "digitalCredentials.SetVirtualWalletBehaviorParametersResponse" } }]);
const DigitalCredentialsSetVirtualWalletBehavior = (0, record_js_1.defineRecord)('digitalCredentials.SetVirtualWalletBehavior', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "digitalCredentials.setVirtualWalletBehavior" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "digitalCredentials.SetVirtualWalletBehaviorParameters" } }]);
(0, record_js_1.defineAlias)('digitalCredentials.SetVirtualWalletBehaviorResult', { "ref": "EmptyResult" });
const DigitalCredentialsSetVirtualWalletBehaviorParametersResponse = (0, record_js_1.defineRecord)('digitalCredentials.SetVirtualWalletBehaviorParametersResponse', [], { "extensible": true });
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class DigitalCredentials extends domain_js_1.Domain {
    static async create(driver) {
        return new DigitalCredentials(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
    /**
     * @param {DigitalCredentialsSetVirtualWalletBehaviorParameters} params
     * @param {DigitalCredentialsVirtualWalletAction} params.action
     * @param {string} [params.context]
     * @param {string} [params.protocol]
     * @param {DigitalCredentialsSetVirtualWalletBehaviorParametersResponse} [params.response]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-digitalCredentials-setVirtualWalletBehavior
     */
    async setVirtualWalletBehavior(params) {
        const validatedParams = new DigitalCredentialsSetVirtualWalletBehaviorParameters(params);
        await this.send('digitalCredentials.setVirtualWalletBehavior', validatedParams);
    }
}
exports.DigitalCredentials = DigitalCredentials;
DigitalCredentials.VirtualWalletAction = Object.freeze({ DECLINE: "decline", RESPOND: "respond", WAIT: "wait", CLEAR: "clear" });
