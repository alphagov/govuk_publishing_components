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
exports.Script = void 0;
require("./browser.js");
require("./browsing_context.js");
require("./common.js");
const record_js_1 = require("../serialization/record.js");
const enum_js_1 = require("../serialization/enum.js");
const union_js_1 = require("../serialization/union.js");
const domain_js_1 = require("../domain.js");
(0, record_js_1.defineAlias)('script.Channel', { "primitive": "string" });
const ScriptChannelValue = (0, record_js_1.defineRecord)('script.ChannelValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "channel" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.ChannelProperties" } }]);
const ScriptChannelProperties = (0, record_js_1.defineRecord)('script.ChannelProperties', [{ "name": "channel", "wire": "channel", "required": true, "type": { "ref": "script.Channel" } }, { "name": "serializationOptions", "wire": "serializationOptions", "required": false, "type": { "ref": "script.SerializationOptions" } }, { "name": "ownership", "wire": "ownership", "required": false, "type": { "ref": "script.ResultOwnership" } }]);
const ScriptEvaluateResultUnion = (0, union_js_1.defineUnion)('script.EvaluateResult', { "by": "type", "variants": [{ "value": "success", "ref": "script.EvaluateResultSuccess" }, { "value": "exception", "ref": "script.EvaluateResultException" }] }, { "objectOnly": true });
const ScriptEvaluateResultSuccess = (0, record_js_1.defineRecord)('script.EvaluateResultSuccess', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "success" } }, { "name": "result", "wire": "result", "required": true, "type": { "ref": "script.RemoteValue" } }, { "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }]);
const ScriptEvaluateResultException = (0, record_js_1.defineRecord)('script.EvaluateResultException', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "exception" } }, { "name": "exceptionDetails", "wire": "exceptionDetails", "required": true, "type": { "ref": "script.ExceptionDetails" } }, { "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }]);
const ScriptExceptionDetails = (0, record_js_1.defineRecord)('script.ExceptionDetails', [{ "name": "columnNumber", "wire": "columnNumber", "required": true, "type": { "ref": "js-uint" } }, { "name": "exception", "wire": "exception", "required": true, "type": { "ref": "script.RemoteValue" } }, { "name": "lineNumber", "wire": "lineNumber", "required": true, "type": { "ref": "js-uint" } }, { "name": "stackTrace", "wire": "stackTrace", "required": true, "type": { "ref": "script.StackTrace" } }, { "name": "text", "wire": "text", "required": true, "type": { "primitive": "string" } }]);
(0, record_js_1.defineAlias)('script.Handle', { "primitive": "string" });
(0, record_js_1.defineAlias)('script.InternalId', { "primitive": "string" });
const ScriptLocalValueUnion = (0, union_js_1.defineUnion)('script.LocalValue', { "by": "type", "variants": [{ "value": "undefined", "ref": "script.UndefinedValue" }, { "value": "null", "ref": "script.NullValue" }, { "value": "string", "ref": "script.StringValue" }, { "value": "number", "ref": "script.NumberValue" }, { "value": "boolean", "ref": "script.BooleanValue" }, { "value": "bigint", "ref": "script.BigIntValue" }, { "value": "channel", "ref": "script.ChannelValue" }, { "value": "array", "ref": "script.ArrayLocalValue" }, { "value": "date", "ref": "script.DateLocalValue" }, { "value": "map", "ref": "script.MapLocalValue" }, { "value": "object", "ref": "script.ObjectLocalValue" }, { "value": "regexp", "ref": "script.RegExpLocalValue" }, { "value": "set", "ref": "script.SetLocalValue" }], "default": "script.RemoteReference" }, { "objectOnly": true });
(0, record_js_1.defineAlias)('script.ListLocalValue', { "list": { "ref": "script.LocalValue" } });
const ScriptArrayLocalValue = (0, record_js_1.defineRecord)('script.ArrayLocalValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "array" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.ListLocalValue" } }]);
const ScriptDateLocalValue = (0, record_js_1.defineRecord)('script.DateLocalValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "date" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }]);
(0, record_js_1.defineAlias)('script.MappingLocalValue', { "list": { "list": { "union": [{ "ref": "script.LocalValue" }, { "primitive": "string" }], "scalar": "string" } } });
const ScriptMapLocalValue = (0, record_js_1.defineRecord)('script.MapLocalValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "map" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.MappingLocalValue" } }]);
const ScriptObjectLocalValue = (0, record_js_1.defineRecord)('script.ObjectLocalValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "object" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.MappingLocalValue" } }]);
const ScriptRegExpValue = (0, record_js_1.defineRecord)('script.RegExpValue', [{ "name": "pattern", "wire": "pattern", "required": true, "type": { "primitive": "string" } }, { "name": "flags", "wire": "flags", "required": false, "type": { "primitive": "string" } }]);
const ScriptRegExpLocalValue = (0, record_js_1.defineRecord)('script.RegExpLocalValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "regexp" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.RegExpValue" } }]);
const ScriptSetLocalValue = (0, record_js_1.defineRecord)('script.SetLocalValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "set" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.ListLocalValue" } }]);
(0, record_js_1.defineAlias)('script.PreloadScript', { "primitive": "string" });
(0, record_js_1.defineAlias)('script.Realm', { "primitive": "string" });
const ScriptPrimitiveProtocolValueUnion = (0, union_js_1.defineUnion)('script.PrimitiveProtocolValue', { "by": "type", "variants": [{ "value": "undefined", "ref": "script.UndefinedValue" }, { "value": "null", "ref": "script.NullValue" }, { "value": "string", "ref": "script.StringValue" }, { "value": "number", "ref": "script.NumberValue" }, { "value": "boolean", "ref": "script.BooleanValue" }, { "value": "bigint", "ref": "script.BigIntValue" }] }, { "objectOnly": true });
const ScriptUndefinedValue = (0, record_js_1.defineRecord)('script.UndefinedValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "undefined" } }]);
const ScriptNullValue = (0, record_js_1.defineRecord)('script.NullValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "null" } }]);
const ScriptStringValue = (0, record_js_1.defineRecord)('script.StringValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "string" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }]);
const ScriptSpecialNumberEnum = (0, enum_js_1.defineEnum)('script.SpecialNumber', ["NaN", "-0", "Infinity", "-Infinity"]);
const ScriptNumberValue = (0, record_js_1.defineRecord)('script.NumberValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "number" } }, { "name": "value", "wire": "value", "required": true, "type": { "union": [{ "primitive": "number" }, { "ref": "script.SpecialNumber" }], "scalar": "number" } }]);
const ScriptBooleanValue = (0, record_js_1.defineRecord)('script.BooleanValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "boolean" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "boolean" } }]);
const ScriptBigIntValue = (0, record_js_1.defineRecord)('script.BigIntValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "bigint" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }]);
const ScriptRealmInfoUnion = (0, union_js_1.defineUnion)('script.RealmInfo', { "by": "type", "variants": [{ "value": "window", "ref": "script.WindowRealmInfo" }, { "value": "dedicated-worker", "ref": "script.DedicatedWorkerRealmInfo" }, { "value": "shared-worker", "ref": "script.SharedWorkerRealmInfo" }, { "value": "service-worker", "ref": "script.ServiceWorkerRealmInfo" }, { "value": "worker", "ref": "script.WorkerRealmInfo" }, { "value": "paint-worklet", "ref": "script.PaintWorkletRealmInfo" }, { "value": "audio-worklet", "ref": "script.AudioWorkletRealmInfo" }, { "value": "worklet", "ref": "script.WorkletRealmInfo" }] }, { "objectOnly": true });
const ScriptBaseRealmInfo = (0, record_js_1.defineRecord)('script.BaseRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }]);
const ScriptWindowRealmInfo = (0, record_js_1.defineRecord)('script.WindowRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "window" } }, { "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext" } }, { "name": "sandbox", "wire": "sandbox", "required": false, "type": { "primitive": "string" } }]);
const ScriptDedicatedWorkerRealmInfo = (0, record_js_1.defineRecord)('script.DedicatedWorkerRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "dedicated-worker" } }, { "name": "owners", "wire": "owners", "required": true, "type": { "list": { "ref": "script.Realm" } } }]);
const ScriptSharedWorkerRealmInfo = (0, record_js_1.defineRecord)('script.SharedWorkerRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "shared-worker" } }]);
const ScriptServiceWorkerRealmInfo = (0, record_js_1.defineRecord)('script.ServiceWorkerRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "service-worker" } }]);
const ScriptWorkerRealmInfo = (0, record_js_1.defineRecord)('script.WorkerRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "worker" } }]);
const ScriptPaintWorkletRealmInfo = (0, record_js_1.defineRecord)('script.PaintWorkletRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "paint-worklet" } }]);
const ScriptAudioWorkletRealmInfo = (0, record_js_1.defineRecord)('script.AudioWorkletRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "audio-worklet" } }]);
const ScriptWorkletRealmInfo = (0, record_js_1.defineRecord)('script.WorkletRealmInfo', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "origin", "wire": "origin", "required": true, "type": { "primitive": "string" } }, { "name": "type", "wire": "type", "required": true, "type": { "const": "worklet" } }]);
const ScriptRealmTypeEnum = (0, enum_js_1.defineEnum)('script.RealmType', ["window", "dedicated-worker", "shared-worker", "service-worker", "worker", "paint-worklet", "audio-worklet", "worklet"]);
const ScriptRemoteReferenceUnion = (0, union_js_1.defineUnion)('script.RemoteReference', { "ordered": [{ "ref": "script.SharedReference", "requires": ["sharedId"] }, { "ref": "script.RemoteObjectReference", "requires": ["handle"] }] }, { "objectOnly": true });
const ScriptSharedReference = (0, record_js_1.defineRecord)('script.SharedReference', [{ "name": "sharedId", "wire": "sharedId", "required": true, "type": { "ref": "script.SharedId" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }], { "extensible": true });
const ScriptRemoteObjectReference = (0, record_js_1.defineRecord)('script.RemoteObjectReference', [{ "name": "handle", "wire": "handle", "required": true, "type": { "ref": "script.Handle" } }, { "name": "sharedId", "wire": "sharedId", "required": false, "type": { "ref": "script.SharedId" } }], { "extensible": true });
const ScriptRemoteValueUnion = (0, union_js_1.defineUnion)('script.RemoteValue', { "by": "type", "variants": [{ "value": "undefined", "ref": "script.UndefinedValue" }, { "value": "null", "ref": "script.NullValue" }, { "value": "string", "ref": "script.StringValue" }, { "value": "number", "ref": "script.NumberValue" }, { "value": "boolean", "ref": "script.BooleanValue" }, { "value": "bigint", "ref": "script.BigIntValue" }, { "value": "symbol", "ref": "script.SymbolRemoteValue" }, { "value": "array", "ref": "script.ArrayRemoteValue" }, { "value": "object", "ref": "script.ObjectRemoteValue" }, { "value": "function", "ref": "script.FunctionRemoteValue" }, { "value": "regexp", "ref": "script.RegExpRemoteValue" }, { "value": "date", "ref": "script.DateRemoteValue" }, { "value": "map", "ref": "script.MapRemoteValue" }, { "value": "set", "ref": "script.SetRemoteValue" }, { "value": "weakmap", "ref": "script.WeakMapRemoteValue" }, { "value": "weakset", "ref": "script.WeakSetRemoteValue" }, { "value": "generator", "ref": "script.GeneratorRemoteValue" }, { "value": "error", "ref": "script.ErrorRemoteValue" }, { "value": "proxy", "ref": "script.ProxyRemoteValue" }, { "value": "promise", "ref": "script.PromiseRemoteValue" }, { "value": "typedarray", "ref": "script.TypedArrayRemoteValue" }, { "value": "arraybuffer", "ref": "script.ArrayBufferRemoteValue" }, { "value": "nodelist", "ref": "script.NodeListRemoteValue" }, { "value": "htmlcollection", "ref": "script.HTMLCollectionRemoteValue" }, { "value": "node", "ref": "script.NodeRemoteValue" }, { "value": "window", "ref": "script.WindowProxyRemoteValue" }] }, { "objectOnly": true });
(0, record_js_1.defineAlias)('script.ListRemoteValue', { "list": { "ref": "script.RemoteValue" } });
(0, record_js_1.defineAlias)('script.MappingRemoteValue', { "list": { "list": { "union": [{ "ref": "script.RemoteValue" }, { "primitive": "string" }], "scalar": "string" } } });
const ScriptSymbolRemoteValue = (0, record_js_1.defineRecord)('script.SymbolRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "symbol" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptArrayRemoteValue = (0, record_js_1.defineRecord)('script.ArrayRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "array" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "script.ListRemoteValue" } }]);
const ScriptObjectRemoteValue = (0, record_js_1.defineRecord)('script.ObjectRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "object" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "script.MappingRemoteValue" } }]);
const ScriptFunctionRemoteValue = (0, record_js_1.defineRecord)('script.FunctionRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "function" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptRegExpRemoteValue = (0, record_js_1.defineRecord)('script.RegExpRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "regexp" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.RegExpValue" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptDateRemoteValue = (0, record_js_1.defineRecord)('script.DateRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "date" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptMapRemoteValue = (0, record_js_1.defineRecord)('script.MapRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "map" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "script.MappingRemoteValue" } }]);
const ScriptSetRemoteValue = (0, record_js_1.defineRecord)('script.SetRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "set" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "script.ListRemoteValue" } }]);
const ScriptWeakMapRemoteValue = (0, record_js_1.defineRecord)('script.WeakMapRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "weakmap" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptWeakSetRemoteValue = (0, record_js_1.defineRecord)('script.WeakSetRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "weakset" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptGeneratorRemoteValue = (0, record_js_1.defineRecord)('script.GeneratorRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "generator" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptErrorRemoteValue = (0, record_js_1.defineRecord)('script.ErrorRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "error" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptProxyRemoteValue = (0, record_js_1.defineRecord)('script.ProxyRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "proxy" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptPromiseRemoteValue = (0, record_js_1.defineRecord)('script.PromiseRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "promise" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptTypedArrayRemoteValue = (0, record_js_1.defineRecord)('script.TypedArrayRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "typedarray" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptArrayBufferRemoteValue = (0, record_js_1.defineRecord)('script.ArrayBufferRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "arraybuffer" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptNodeListRemoteValue = (0, record_js_1.defineRecord)('script.NodeListRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "nodelist" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "script.ListRemoteValue" } }]);
const ScriptHtmlCollectionRemoteValue = (0, record_js_1.defineRecord)('script.HTMLCollectionRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "htmlcollection" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "script.ListRemoteValue" } }]);
const ScriptNodeRemoteValue = (0, record_js_1.defineRecord)('script.NodeRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "node" } }, { "name": "sharedId", "wire": "sharedId", "required": false, "type": { "ref": "script.SharedId" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }, { "name": "value", "wire": "value", "required": false, "type": { "ref": "script.NodeProperties" } }]);
const ScriptNodeProperties = (0, record_js_1.defineRecord)('script.NodeProperties', [{ "name": "nodeType", "wire": "nodeType", "required": true, "type": { "ref": "js-uint" } }, { "name": "childNodeCount", "wire": "childNodeCount", "required": true, "type": { "ref": "js-uint" } }, { "name": "attributes", "wire": "attributes", "required": false, "type": { "ref": "script.NodePropertiesAttributes" } }, { "name": "children", "wire": "children", "required": false, "type": { "list": { "ref": "script.NodeRemoteValue" } } }, { "name": "localName", "wire": "localName", "required": false, "type": { "primitive": "string" } }, { "name": "mode", "wire": "mode", "required": false, "type": { "ref": "script.NodePropertiesMode" } }, { "name": "namespaceURI", "wire": "namespaceURI", "required": false, "type": { "primitive": "string" } }, { "name": "nodeValue", "wire": "nodeValue", "required": false, "type": { "primitive": "string" } }, { "name": "shadowRoot", "wire": "shadowRoot", "required": false, "type": { "ref": "script.NodeRemoteValue", "nullable": true } }]);
const ScriptWindowProxyRemoteValue = (0, record_js_1.defineRecord)('script.WindowProxyRemoteValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "window" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "script.WindowProxyProperties" } }, { "name": "handle", "wire": "handle", "required": false, "type": { "ref": "script.Handle" } }, { "name": "internalId", "wire": "internalId", "required": false, "type": { "ref": "script.InternalId" } }]);
const ScriptWindowProxyProperties = (0, record_js_1.defineRecord)('script.WindowProxyProperties', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }]);
const ScriptResultOwnershipEnum = (0, enum_js_1.defineEnum)('script.ResultOwnership', ["root", "none"]);
const ScriptSerializationOptions = (0, record_js_1.defineRecord)('script.SerializationOptions', [{ "name": "maxDomDepth", "wire": "maxDomDepth", "required": false, "type": { "ref": "js-uint", "nullable": true } }, { "name": "maxObjectDepth", "wire": "maxObjectDepth", "required": false, "type": { "ref": "js-uint", "nullable": true } }, { "name": "includeShadowTree", "wire": "includeShadowTree", "required": false, "type": { "ref": "script.SerializationOptionsIncludeShadowTree" } }]);
(0, record_js_1.defineAlias)('script.SharedId', { "primitive": "string" });
const ScriptStackFrame = (0, record_js_1.defineRecord)('script.StackFrame', [{ "name": "columnNumber", "wire": "columnNumber", "required": true, "type": { "ref": "js-uint" } }, { "name": "functionName", "wire": "functionName", "required": true, "type": { "primitive": "string" } }, { "name": "lineNumber", "wire": "lineNumber", "required": true, "type": { "ref": "js-uint" } }, { "name": "url", "wire": "url", "required": true, "type": { "primitive": "string" } }]);
const ScriptStackTrace = (0, record_js_1.defineRecord)('script.StackTrace', [{ "name": "callFrames", "wire": "callFrames", "required": true, "type": { "list": { "ref": "script.StackFrame" } } }]);
const ScriptSource = (0, record_js_1.defineRecord)('script.Source', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }, { "name": "context", "wire": "context", "required": false, "type": { "ref": "browsingContext.BrowsingContext" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext" } }]);
const ScriptRealmTarget = (0, record_js_1.defineRecord)('script.RealmTarget', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }]);
const ScriptContextTarget = (0, record_js_1.defineRecord)('script.ContextTarget', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }, { "name": "sandbox", "wire": "sandbox", "required": false, "type": { "primitive": "string" } }]);
const ScriptTargetUnion = (0, union_js_1.defineUnion)('script.Target', { "ordered": [{ "ref": "script.ContextTarget", "requires": ["context"] }, { "ref": "script.RealmTarget", "requires": ["realm"] }] }, { "objectOnly": true });
const ScriptAddPreloadScript = (0, record_js_1.defineRecord)('script.AddPreloadScript', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.addPreloadScript" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.AddPreloadScriptParameters" } }]);
const ScriptAddPreloadScriptParameters = (0, record_js_1.defineRecord)('script.AddPreloadScriptParameters', [{ "name": "functionDeclaration", "wire": "functionDeclaration", "required": true, "type": { "primitive": "string" } }, { "name": "arguments", "wire": "arguments", "required": false, "type": { "list": { "ref": "script.ChannelValue" } } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }, { "name": "sandbox", "wire": "sandbox", "required": false, "type": { "primitive": "string" } }]);
const ScriptAddPreloadScriptResult = (0, record_js_1.defineRecord)('script.AddPreloadScriptResult', [{ "name": "script", "wire": "script", "required": true, "type": { "ref": "script.PreloadScript" } }]);
const ScriptDisown = (0, record_js_1.defineRecord)('script.Disown', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.disown" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.DisownParameters" } }]);
const ScriptDisownParameters = (0, record_js_1.defineRecord)('script.DisownParameters', [{ "name": "handles", "wire": "handles", "required": true, "type": { "list": { "ref": "script.Handle" } } }, { "name": "target", "wire": "target", "required": true, "type": { "ref": "script.Target" } }]);
(0, record_js_1.defineAlias)('script.DisownResult', { "ref": "EmptyResult" });
const ScriptCallFunction = (0, record_js_1.defineRecord)('script.CallFunction', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.callFunction" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.CallFunctionParameters" } }]);
const ScriptCallFunctionParameters = (0, record_js_1.defineRecord)('script.CallFunctionParameters', [{ "name": "functionDeclaration", "wire": "functionDeclaration", "required": true, "type": { "primitive": "string" } }, { "name": "awaitPromise", "wire": "awaitPromise", "required": true, "type": { "primitive": "boolean" } }, { "name": "target", "wire": "target", "required": true, "type": { "ref": "script.Target" } }, { "name": "arguments", "wire": "arguments", "required": false, "type": { "list": { "ref": "script.LocalValue" } } }, { "name": "resultOwnership", "wire": "resultOwnership", "required": false, "type": { "ref": "script.ResultOwnership" } }, { "name": "serializationOptions", "wire": "serializationOptions", "required": false, "type": { "ref": "script.SerializationOptions" } }, { "name": "this", "wire": "this", "required": false, "type": { "ref": "script.LocalValue" } }, { "name": "userActivation", "wire": "userActivation", "required": false, "type": { "primitive": "boolean" } }]);
(0, record_js_1.defineAlias)('script.CallFunctionResult', { "ref": "script.EvaluateResult" });
const ScriptEvaluate = (0, record_js_1.defineRecord)('script.Evaluate', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.evaluate" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.EvaluateParameters" } }]);
const ScriptEvaluateParameters = (0, record_js_1.defineRecord)('script.EvaluateParameters', [{ "name": "expression", "wire": "expression", "required": true, "type": { "primitive": "string" } }, { "name": "target", "wire": "target", "required": true, "type": { "ref": "script.Target" } }, { "name": "awaitPromise", "wire": "awaitPromise", "required": true, "type": { "primitive": "boolean" } }, { "name": "resultOwnership", "wire": "resultOwnership", "required": false, "type": { "ref": "script.ResultOwnership" } }, { "name": "serializationOptions", "wire": "serializationOptions", "required": false, "type": { "ref": "script.SerializationOptions" } }, { "name": "userActivation", "wire": "userActivation", "required": false, "type": { "primitive": "boolean" } }]);
const ScriptGetRealms = (0, record_js_1.defineRecord)('script.GetRealms', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.getRealms" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.GetRealmsParameters" } }]);
const ScriptGetRealmsParameters = (0, record_js_1.defineRecord)('script.GetRealmsParameters', [{ "name": "context", "wire": "context", "required": false, "type": { "ref": "browsingContext.BrowsingContext" } }, { "name": "type", "wire": "type", "required": false, "type": { "ref": "script.RealmType" } }]);
const ScriptGetRealmsResult = (0, record_js_1.defineRecord)('script.GetRealmsResult', [{ "name": "realms", "wire": "realms", "required": true, "type": { "list": { "ref": "script.RealmInfo" } } }]);
const ScriptRemovePreloadScript = (0, record_js_1.defineRecord)('script.RemovePreloadScript', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.removePreloadScript" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.RemovePreloadScriptParameters" } }]);
const ScriptRemovePreloadScriptParameters = (0, record_js_1.defineRecord)('script.RemovePreloadScriptParameters', [{ "name": "script", "wire": "script", "required": true, "type": { "ref": "script.PreloadScript" } }]);
(0, record_js_1.defineAlias)('script.RemovePreloadScriptResult', { "ref": "EmptyResult" });
const ScriptMessage = (0, record_js_1.defineRecord)('script.Message', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.message" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.MessageParameters" } }]);
const ScriptMessageParameters = (0, record_js_1.defineRecord)('script.MessageParameters', [{ "name": "channel", "wire": "channel", "required": true, "type": { "ref": "script.Channel" } }, { "name": "data", "wire": "data", "required": true, "type": { "ref": "script.RemoteValue" } }, { "name": "source", "wire": "source", "required": true, "type": { "ref": "script.Source" } }]);
const ScriptRealmCreated = (0, record_js_1.defineRecord)('script.RealmCreated', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.realmCreated" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.RealmInfo" } }]);
const ScriptRealmDestroyed = (0, record_js_1.defineRecord)('script.RealmDestroyed', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "script.realmDestroyed" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "script.RealmDestroyedParameters" } }]);
const ScriptRealmDestroyedParameters = (0, record_js_1.defineRecord)('script.RealmDestroyedParameters', [{ "name": "realm", "wire": "realm", "required": true, "type": { "ref": "script.Realm" } }]);
const ScriptNodePropertiesModeEnum = (0, enum_js_1.defineEnum)('script.NodePropertiesMode', ["open", "closed"]);
const ScriptSerializationOptionsIncludeShadowTreeEnum = (0, enum_js_1.defineEnum)('script.SerializationOptionsIncludeShadowTree', ["none", "open", "all"]);
const ScriptNodePropertiesAttributes = (0, record_js_1.defineRecord)('script.NodePropertiesAttributes', []);
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class Script extends domain_js_1.Domain {
    static async create(driver) {
        return new Script(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
    /**
     * @param {ScriptAddPreloadScriptParameters} params
     * @param {string} params.functionDeclaration
     * @param {Array<ScriptChannelValue>} [params.arguments]
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @param {string} [params.sandbox]
     * @returns {Promise<ScriptAddPreloadScriptResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-addPreloadScript
     */
    async addPreloadScript(params) {
        const validatedParams = new ScriptAddPreloadScriptParameters(params);
        const result = await this.send('script.addPreloadScript', validatedParams);
        return ScriptAddPreloadScriptResult.fromWire(result);
    }
    /**
     * @param {ScriptCallFunctionParameters} params
     * @param {string} params.functionDeclaration
     * @param {boolean} params.awaitPromise
     * @param {ScriptTarget} params.target
     * @param {Array<ScriptLocalValue>} [params.arguments]
     * @param {ScriptResultOwnership} [params.resultOwnership]
     * @param {ScriptSerializationOptions} [params.serializationOptions]
     * @param {ScriptLocalValue} [params.this]
     * @param {boolean} [params.userActivation]
     * @returns {Promise<ScriptCallFunctionResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-callFunction
     */
    async callFunction(params) {
        const validatedParams = new ScriptCallFunctionParameters(params);
        const result = await this.send('script.callFunction', validatedParams);
        return ScriptEvaluateResultUnion.fromWire(result);
    }
    /**
     * @param {ScriptDisownParameters} params
     * @param {Array<ScriptHandle>} params.handles
     * @param {ScriptTarget} params.target
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-disown
     */
    async disown(params) {
        const validatedParams = new ScriptDisownParameters(params);
        await this.send('script.disown', validatedParams);
    }
    /**
     * @param {ScriptEvaluateParameters} params
     * @param {string} params.expression
     * @param {ScriptTarget} params.target
     * @param {boolean} params.awaitPromise
     * @param {ScriptResultOwnership} [params.resultOwnership]
     * @param {ScriptSerializationOptions} [params.serializationOptions]
     * @param {boolean} [params.userActivation]
     * @returns {Promise<ScriptEvaluateResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-evaluate
     */
    async evaluate(params) {
        const validatedParams = new ScriptEvaluateParameters(params);
        const result = await this.send('script.evaluate', validatedParams);
        return ScriptEvaluateResultUnion.fromWire(result);
    }
    /**
     * @param {ScriptGetRealmsParameters} params
     * @param {BrowsingContextBrowsingContext} [params.context]
     * @param {ScriptRealmType} [params.type]
     * @returns {Promise<ScriptGetRealmsResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-getRealms
     */
    async getRealms(params) {
        const validatedParams = new ScriptGetRealmsParameters(params);
        const result = await this.send('script.getRealms', validatedParams);
        return ScriptGetRealmsResult.fromWire(result);
    }
    /**
     * @param {ScriptRemovePreloadScriptParameters} params
     * @param {ScriptPreloadScript} params.script
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-removePreloadScript
     */
    async removePreloadScript(params) {
        const validatedParams = new ScriptRemovePreloadScriptParameters(params);
        await this.send('script.removePreloadScript', validatedParams);
    }
}
exports.Script = Script;
/** @see https://w3c.github.io/webdriver-bidi/#event-script-message */
Script.MESSAGE = (0, domain_js_1.event)('script.message', ScriptMessageParameters);
/** @see https://w3c.github.io/webdriver-bidi/#event-script-realmCreated */
Script.REALM_CREATED = (0, domain_js_1.event)('script.realmCreated', ScriptRealmInfoUnion);
/** @see https://w3c.github.io/webdriver-bidi/#event-script-realmDestroyed */
Script.REALM_DESTROYED = (0, domain_js_1.event)('script.realmDestroyed', ScriptRealmDestroyedParameters);
Script.SpecialNumber = Object.freeze({ NA_N: "NaN", _0: "-0", INFINITY: "Infinity", _INFINITY: "-Infinity" });
Script.RealmType = Object.freeze({ WINDOW: "window", DEDICATED_WORKER: "dedicated-worker", SHARED_WORKER: "shared-worker", SERVICE_WORKER: "service-worker", WORKER: "worker", PAINT_WORKLET: "paint-worklet", AUDIO_WORKLET: "audio-worklet", WORKLET: "worklet" });
Script.ResultOwnership = Object.freeze({ ROOT: "root", NONE: "none" });
Script.NodePropertiesMode = Object.freeze({ OPEN: "open", CLOSED: "closed" });
Script.SerializationOptionsIncludeShadowTree = Object.freeze({ NONE: "none", OPEN: "open", ALL: "all" });
