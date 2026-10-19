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
exports.Storage = void 0;
require("./browsing_context.js");
require("./common.js");
require("./network.js");
const record_js_1 = require("../serialization/record.js");
const union_js_1 = require("../serialization/union.js");
const domain_js_1 = require("../domain.js");
const StoragePartitionKey = (0, record_js_1.defineRecord)('storage.PartitionKey', [{ "name": "userContext", "wire": "userContext", "required": false, "type": { "primitive": "string" } }, { "name": "sourceOrigin", "wire": "sourceOrigin", "required": false, "type": { "primitive": "string" } }], { "extensible": true });
const StorageGetCookies = (0, record_js_1.defineRecord)('storage.GetCookies', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "storage.getCookies" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "storage.GetCookiesParameters" } }]);
const StorageCookieFilter = (0, record_js_1.defineRecord)('storage.CookieFilter', [{ "name": "name", "wire": "name", "required": false, "type": { "primitive": "string" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "network.BytesValue" } }, { "name": "domain", "wire": "domain", "required": false, "type": { "primitive": "string" } }, { "name": "path", "wire": "path", "required": false, "type": { "primitive": "string" } }, { "name": "size", "wire": "size", "required": false, "type": { "ref": "js-uint" } }, { "name": "httpOnly", "wire": "httpOnly", "required": false, "type": { "primitive": "boolean" } }, { "name": "secure", "wire": "secure", "required": false, "type": { "primitive": "boolean" } }, { "name": "sameSite", "wire": "sameSite", "required": false, "type": { "ref": "network.SameSite" } }, { "name": "expiry", "wire": "expiry", "required": false, "type": { "ref": "js-uint" } }], { "extensible": true });
const StorageBrowsingContextPartitionDescriptor = (0, record_js_1.defineRecord)('storage.BrowsingContextPartitionDescriptor', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "context" } }, { "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }]);
const StorageStorageKeyPartitionDescriptor = (0, record_js_1.defineRecord)('storage.StorageKeyPartitionDescriptor', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "storageKey" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "primitive": "string" } }, { "name": "sourceOrigin", "wire": "sourceOrigin", "required": false, "type": { "primitive": "string" } }], { "extensible": true });
const StoragePartitionDescriptorUnion = (0, union_js_1.defineUnion)('storage.PartitionDescriptor', { "by": "type", "variants": [{ "value": "context", "ref": "storage.BrowsingContextPartitionDescriptor" }, { "value": "storageKey", "ref": "storage.StorageKeyPartitionDescriptor" }] }, { "objectOnly": true });
const StorageGetCookiesParameters = (0, record_js_1.defineRecord)('storage.GetCookiesParameters', [{ "name": "filter", "wire": "filter", "required": false, "type": { "ref": "storage.CookieFilter" } }, { "name": "partition", "wire": "partition", "required": false, "type": { "ref": "storage.PartitionDescriptor" } }]);
const StorageGetCookiesResult = (0, record_js_1.defineRecord)('storage.GetCookiesResult', [{ "name": "cookies", "wire": "cookies", "required": true, "type": { "list": { "ref": "network.Cookie" } } }, { "name": "partitionKey", "wire": "partitionKey", "required": true, "type": { "ref": "storage.PartitionKey" } }]);
const StorageSetCookie = (0, record_js_1.defineRecord)('storage.SetCookie', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "storage.setCookie" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "storage.SetCookieParameters" } }]);
const StoragePartialCookie = (0, record_js_1.defineRecord)('storage.PartialCookie', [{ "name": "name", "wire": "name", "required": true, "type": { "primitive": "string" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "network.BytesValue" } }, { "name": "domain", "wire": "domain", "required": true, "type": { "primitive": "string" } }, { "name": "path", "wire": "path", "required": false, "type": { "primitive": "string" } }, { "name": "httpOnly", "wire": "httpOnly", "required": false, "type": { "primitive": "boolean" } }, { "name": "secure", "wire": "secure", "required": false, "type": { "primitive": "boolean" } }, { "name": "sameSite", "wire": "sameSite", "required": false, "type": { "ref": "network.SameSite" } }, { "name": "expiry", "wire": "expiry", "required": false, "type": { "ref": "js-uint" } }], { "extensible": true });
const StorageSetCookieParameters = (0, record_js_1.defineRecord)('storage.SetCookieParameters', [{ "name": "cookie", "wire": "cookie", "required": true, "type": { "ref": "storage.PartialCookie" } }, { "name": "partition", "wire": "partition", "required": false, "type": { "ref": "storage.PartitionDescriptor" } }]);
const StorageSetCookieResult = (0, record_js_1.defineRecord)('storage.SetCookieResult', [{ "name": "partitionKey", "wire": "partitionKey", "required": true, "type": { "ref": "storage.PartitionKey" } }]);
const StorageDeleteCookies = (0, record_js_1.defineRecord)('storage.DeleteCookies', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "storage.deleteCookies" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "storage.DeleteCookiesParameters" } }]);
const StorageDeleteCookiesParameters = (0, record_js_1.defineRecord)('storage.DeleteCookiesParameters', [{ "name": "filter", "wire": "filter", "required": false, "type": { "ref": "storage.CookieFilter" } }, { "name": "partition", "wire": "partition", "required": false, "type": { "ref": "storage.PartitionDescriptor" } }]);
const StorageDeleteCookiesResult = (0, record_js_1.defineRecord)('storage.DeleteCookiesResult', [{ "name": "partitionKey", "wire": "partitionKey", "required": true, "type": { "ref": "storage.PartitionKey" } }]);
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class Storage extends domain_js_1.Domain {
    static async create(driver) {
        return new Storage(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
    /**
     * @param {StorageDeleteCookiesParameters} params
     * @param {StorageCookieFilter} [params.filter]
     * @param {StoragePartitionDescriptor} [params.partition]
     * @returns {Promise<StorageDeleteCookiesResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-storage-deleteCookies
     */
    async deleteCookies(params) {
        const validatedParams = new StorageDeleteCookiesParameters(params);
        const result = await this.send('storage.deleteCookies', validatedParams);
        return StorageDeleteCookiesResult.fromWire(result);
    }
    /**
     * @param {StorageGetCookiesParameters} params
     * @param {StorageCookieFilter} [params.filter]
     * @param {StoragePartitionDescriptor} [params.partition]
     * @returns {Promise<StorageGetCookiesResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-storage-getCookies
     */
    async getCookies(params) {
        const validatedParams = new StorageGetCookiesParameters(params);
        const result = await this.send('storage.getCookies', validatedParams);
        return StorageGetCookiesResult.fromWire(result);
    }
    /**
     * @param {StorageSetCookieParameters} params
     * @param {StoragePartialCookie} params.cookie
     * @param {StoragePartitionDescriptor} [params.partition]
     * @returns {Promise<StorageSetCookieResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-storage-setCookie
     */
    async setCookie(params) {
        const validatedParams = new StorageSetCookieParameters(params);
        const result = await this.send('storage.setCookie', validatedParams);
        return StorageSetCookieResult.fromWire(result);
    }
}
exports.Storage = Storage;
