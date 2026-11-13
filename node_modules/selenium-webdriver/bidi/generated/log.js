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
exports.Log = void 0;
require("./common.js");
require("./script.js");
const record_js_1 = require("../serialization/record.js");
const enum_js_1 = require("../serialization/enum.js");
const union_js_1 = require("../serialization/union.js");
const domain_js_1 = require("../domain.js");
const LogLevelEnum = (0, enum_js_1.defineEnum)('log.Level', ["debug", "info", "warn", "error"]);
const LogEntryUnion = (0, union_js_1.defineUnion)('log.Entry', { "by": "type", "variants": [{ "value": "console", "ref": "log.ConsoleLogEntry" }, { "value": "javascript", "ref": "log.JavascriptLogEntry" }], "default": "log.GenericLogEntry" }, { "objectOnly": true });
const LogBaseLogEntry = (0, record_js_1.defineRecord)('log.BaseLogEntry', [{ "name": "level", "wire": "level", "required": true, "type": { "ref": "log.Level" } }, { "name": "source", "wire": "source", "required": true, "type": { "ref": "script.Source" } }, { "name": "text", "wire": "text", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "stackTrace", "wire": "stackTrace", "required": false, "type": { "ref": "script.StackTrace" } }]);
const LogGenericLogEntry = (0, record_js_1.defineRecord)('log.GenericLogEntry', [{ "name": "level", "wire": "level", "required": true, "type": { "ref": "log.Level" } }, { "name": "source", "wire": "source", "required": true, "type": { "ref": "script.Source" } }, { "name": "text", "wire": "text", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "stackTrace", "wire": "stackTrace", "required": false, "type": { "ref": "script.StackTrace" } }, { "name": "type", "wire": "type", "required": true, "type": { "primitive": "string" } }]);
const LogConsoleLogEntry = (0, record_js_1.defineRecord)('log.ConsoleLogEntry', [{ "name": "level", "wire": "level", "required": true, "type": { "ref": "log.Level" } }, { "name": "source", "wire": "source", "required": true, "type": { "ref": "script.Source" } }, { "name": "text", "wire": "text", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "stackTrace", "wire": "stackTrace", "required": false, "type": { "ref": "script.StackTrace" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "console" } }, { "name": "method", "wire": "method", "required": true, "type": { "primitive": "string" } }, { "name": "args", "wire": "args", "required": true, "type": { "list": { "ref": "script.RemoteValue" } } }]);
const LogJavascriptLogEntry = (0, record_js_1.defineRecord)('log.JavascriptLogEntry', [{ "name": "level", "wire": "level", "required": true, "type": { "ref": "log.Level" } }, { "name": "source", "wire": "source", "required": true, "type": { "ref": "script.Source" } }, { "name": "text", "wire": "text", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "stackTrace", "wire": "stackTrace", "required": false, "type": { "ref": "script.StackTrace" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "javascript" } }]);
const LogEntryAdded = (0, record_js_1.defineRecord)('log.EntryAdded', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "log.entryAdded" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "log.Entry" } }]);
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class Log extends domain_js_1.Domain {
    static async create(driver) {
        return new Log(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
}
exports.Log = Log;
/** @see https://w3c.github.io/webdriver-bidi/#event-log-entryAdded */
Log.ENTRY_ADDED = (0, domain_js_1.event)('log.entryAdded', LogEntryUnion);
Log.Level = Object.freeze({ DEBUG: "debug", INFO: "info", WARN: "warn", ERROR: "error" });
