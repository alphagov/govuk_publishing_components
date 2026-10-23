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
exports.Network = void 0;
require("./browser.js");
require("./browsing_context.js");
require("./common.js");
require("./script.js");
const record_js_1 = require("../serialization/record.js");
const enum_js_1 = require("../serialization/enum.js");
const union_js_1 = require("../serialization/union.js");
const domain_js_1 = require("../domain.js");
const NetworkAuthChallenge = (0, record_js_1.defineRecord)('network.AuthChallenge', [{ "name": "scheme", "wire": "scheme", "required": true, "type": { "primitive": "string" } }, { "name": "realm", "wire": "realm", "required": true, "type": { "primitive": "string" } }]);
const NetworkAuthCredentials = (0, record_js_1.defineRecord)('network.AuthCredentials', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "password" } }, { "name": "username", "wire": "username", "required": true, "type": { "primitive": "string" } }, { "name": "password", "wire": "password", "required": true, "type": { "primitive": "string" } }]);
const NetworkBaseParameters = (0, record_js_1.defineRecord)('network.BaseParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext", "nullable": true } }, { "name": "isBlocked", "wire": "isBlocked", "required": true, "type": { "primitive": "boolean" } }, { "name": "navigation", "wire": "navigation", "required": true, "type": { "ref": "browsingContext.Navigation", "nullable": true } }, { "name": "redirectCount", "wire": "redirectCount", "required": true, "type": { "ref": "js-uint" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.RequestData" } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext", "nullable": true } }, { "name": "intercepts", "wire": "intercepts", "required": false, "type": { "list": { "ref": "network.Intercept" } } }]);
const NetworkBytesValueUnion = (0, union_js_1.defineUnion)('network.BytesValue', { "by": "type", "variants": [{ "value": "string", "ref": "network.StringValue" }, { "value": "base64", "ref": "network.Base64Value" }] }, { "objectOnly": true });
const NetworkStringValue = (0, record_js_1.defineRecord)('network.StringValue', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "string" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }]);
const NetworkBase64Value = (0, record_js_1.defineRecord)('network.Base64Value', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "base64" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }]);
(0, record_js_1.defineAlias)('network.Collector', { "primitive": "string" });
const NetworkCollectorTypeEnum = (0, enum_js_1.defineEnum)('network.CollectorType', ["blob"]);
const NetworkSameSiteEnum = (0, enum_js_1.defineEnum)('network.SameSite', ["strict", "lax", "none", "default"]);
const NetworkCookie = (0, record_js_1.defineRecord)('network.Cookie', [{ "name": "name", "wire": "name", "required": true, "type": { "primitive": "string" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "network.BytesValue" } }, { "name": "domain", "wire": "domain", "required": true, "type": { "primitive": "string" } }, { "name": "path", "wire": "path", "required": true, "type": { "primitive": "string" } }, { "name": "size", "wire": "size", "required": true, "type": { "ref": "js-uint" } }, { "name": "httpOnly", "wire": "httpOnly", "required": true, "type": { "primitive": "boolean" } }, { "name": "secure", "wire": "secure", "required": true, "type": { "primitive": "boolean" } }, { "name": "sameSite", "wire": "sameSite", "required": true, "type": { "ref": "network.SameSite" } }, { "name": "expiry", "wire": "expiry", "required": false, "type": { "ref": "js-uint" } }], { "extensible": true });
const NetworkCookieHeader = (0, record_js_1.defineRecord)('network.CookieHeader', [{ "name": "name", "wire": "name", "required": true, "type": { "primitive": "string" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "network.BytesValue" } }]);
const NetworkDataTypeEnum = (0, enum_js_1.defineEnum)('network.DataType', ["request", "response"]);
const NetworkFetchTimingInfo = (0, record_js_1.defineRecord)('network.FetchTimingInfo', [{ "name": "timeOrigin", "wire": "timeOrigin", "required": true, "type": { "primitive": "number" } }, { "name": "requestTime", "wire": "requestTime", "required": true, "type": { "primitive": "number" } }, { "name": "redirectStart", "wire": "redirectStart", "required": true, "type": { "primitive": "number" } }, { "name": "redirectEnd", "wire": "redirectEnd", "required": true, "type": { "primitive": "number" } }, { "name": "fetchStart", "wire": "fetchStart", "required": true, "type": { "primitive": "number" } }, { "name": "dnsStart", "wire": "dnsStart", "required": true, "type": { "primitive": "number" } }, { "name": "dnsEnd", "wire": "dnsEnd", "required": true, "type": { "primitive": "number" } }, { "name": "connectStart", "wire": "connectStart", "required": true, "type": { "primitive": "number" } }, { "name": "connectEnd", "wire": "connectEnd", "required": true, "type": { "primitive": "number" } }, { "name": "tlsStart", "wire": "tlsStart", "required": true, "type": { "primitive": "number" } }, { "name": "requestStart", "wire": "requestStart", "required": true, "type": { "primitive": "number" } }, { "name": "responseStart", "wire": "responseStart", "required": true, "type": { "primitive": "number" } }, { "name": "responseEnd", "wire": "responseEnd", "required": true, "type": { "primitive": "number" } }]);
const NetworkHeader = (0, record_js_1.defineRecord)('network.Header', [{ "name": "name", "wire": "name", "required": true, "type": { "primitive": "string" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "network.BytesValue" } }]);
const NetworkInitiator = (0, record_js_1.defineRecord)('network.Initiator', [{ "name": "columnNumber", "wire": "columnNumber", "required": false, "type": { "ref": "js-uint" } }, { "name": "lineNumber", "wire": "lineNumber", "required": false, "type": { "ref": "js-uint" } }, { "name": "request", "wire": "request", "required": false, "type": { "ref": "network.Request" } }, { "name": "stackTrace", "wire": "stackTrace", "required": false, "type": { "ref": "script.StackTrace" } }, { "name": "type", "wire": "type", "required": false, "type": { "ref": "network.InitiatorType" } }]);
(0, record_js_1.defineAlias)('network.Intercept', { "primitive": "string" });
(0, record_js_1.defineAlias)('network.Request', { "primitive": "string" });
const NetworkRequestData = (0, record_js_1.defineRecord)('network.RequestData', [{ "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }, { "name": "url", "wire": "url", "required": true, "type": { "primitive": "string" } }, { "name": "method", "wire": "method", "required": true, "type": { "primitive": "string" } }, { "name": "headers", "wire": "headers", "required": true, "type": { "list": { "ref": "network.Header" } } }, { "name": "cookies", "wire": "cookies", "required": true, "type": { "list": { "ref": "network.Cookie" } } }, { "name": "headersSize", "wire": "headersSize", "required": true, "type": { "ref": "js-uint" } }, { "name": "bodySize", "wire": "bodySize", "required": true, "type": { "ref": "js-uint", "nullable": true } }, { "name": "destination", "wire": "destination", "required": true, "type": { "primitive": "string" } }, { "name": "initiatorType", "wire": "initiatorType", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "timings", "wire": "timings", "required": true, "type": { "ref": "network.FetchTimingInfo" } }]);
const NetworkResponseContent = (0, record_js_1.defineRecord)('network.ResponseContent', [{ "name": "size", "wire": "size", "required": true, "type": { "ref": "js-uint" } }]);
const NetworkResponseData = (0, record_js_1.defineRecord)('network.ResponseData', [{ "name": "url", "wire": "url", "required": true, "type": { "primitive": "string" } }, { "name": "protocol", "wire": "protocol", "required": true, "type": { "primitive": "string" } }, { "name": "status", "wire": "status", "required": true, "type": { "ref": "js-uint" } }, { "name": "statusText", "wire": "statusText", "required": true, "type": { "primitive": "string" } }, { "name": "fromCache", "wire": "fromCache", "required": true, "type": { "primitive": "boolean" } }, { "name": "headers", "wire": "headers", "required": true, "type": { "list": { "ref": "network.Header" } } }, { "name": "mimeType", "wire": "mimeType", "required": true, "type": { "primitive": "string" } }, { "name": "bytesReceived", "wire": "bytesReceived", "required": true, "type": { "ref": "js-uint" } }, { "name": "headersSize", "wire": "headersSize", "required": true, "type": { "ref": "js-uint", "nullable": true } }, { "name": "bodySize", "wire": "bodySize", "required": true, "type": { "ref": "js-uint", "nullable": true } }, { "name": "content", "wire": "content", "required": true, "type": { "ref": "network.ResponseContent" } }, { "name": "authChallenges", "wire": "authChallenges", "required": false, "type": { "list": { "ref": "network.AuthChallenge" } } }]);
const NetworkSetCookieHeader = (0, record_js_1.defineRecord)('network.SetCookieHeader', [{ "name": "name", "wire": "name", "required": true, "type": { "primitive": "string" } }, { "name": "value", "wire": "value", "required": true, "type": { "ref": "network.BytesValue" } }, { "name": "domain", "wire": "domain", "required": false, "type": { "primitive": "string" } }, { "name": "httpOnly", "wire": "httpOnly", "required": false, "type": { "primitive": "boolean" } }, { "name": "expiry", "wire": "expiry", "required": false, "type": { "primitive": "string" } }, { "name": "maxAge", "wire": "maxAge", "required": false, "type": { "ref": "js-int" } }, { "name": "path", "wire": "path", "required": false, "type": { "primitive": "string" } }, { "name": "sameSite", "wire": "sameSite", "required": false, "type": { "ref": "network.SameSite" } }, { "name": "secure", "wire": "secure", "required": false, "type": { "primitive": "boolean" } }]);
const NetworkUrlPatternUnion = (0, union_js_1.defineUnion)('network.UrlPattern', { "by": "type", "variants": [{ "value": "pattern", "ref": "network.UrlPatternPattern" }, { "value": "string", "ref": "network.UrlPatternString" }] }, { "objectOnly": true });
const NetworkUrlPatternPattern = (0, record_js_1.defineRecord)('network.UrlPatternPattern', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "pattern" } }, { "name": "protocol", "wire": "protocol", "required": false, "type": { "primitive": "string" } }, { "name": "hostname", "wire": "hostname", "required": false, "type": { "primitive": "string" } }, { "name": "port", "wire": "port", "required": false, "type": { "primitive": "string" } }, { "name": "pathname", "wire": "pathname", "required": false, "type": { "primitive": "string" } }, { "name": "search", "wire": "search", "required": false, "type": { "primitive": "string" } }]);
const NetworkUrlPatternString = (0, record_js_1.defineRecord)('network.UrlPatternString', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "string" } }, { "name": "pattern", "wire": "pattern", "required": true, "type": { "primitive": "string" } }]);
const NetworkAddDataCollector = (0, record_js_1.defineRecord)('network.AddDataCollector', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.addDataCollector" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.AddDataCollectorParameters" } }]);
const NetworkAddDataCollectorParameters = (0, record_js_1.defineRecord)('network.AddDataCollectorParameters', [{ "name": "dataTypes", "wire": "dataTypes", "required": true, "type": { "list": { "ref": "network.DataType" } } }, { "name": "maxEncodedDataSize", "wire": "maxEncodedDataSize", "required": true, "type": { "ref": "js-uint" } }, { "name": "collectorType", "wire": "collectorType", "required": false, "type": { "ref": "network.CollectorType" } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
const NetworkAddDataCollectorResult = (0, record_js_1.defineRecord)('network.AddDataCollectorResult', [{ "name": "collector", "wire": "collector", "required": true, "type": { "ref": "network.Collector" } }]);
const NetworkAddIntercept = (0, record_js_1.defineRecord)('network.AddIntercept', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.addIntercept" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.AddInterceptParameters" } }]);
const NetworkAddInterceptParameters = (0, record_js_1.defineRecord)('network.AddInterceptParameters', [{ "name": "phases", "wire": "phases", "required": true, "type": { "list": { "ref": "network.InterceptPhase" } } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "urlPatterns", "wire": "urlPatterns", "required": false, "type": { "list": { "ref": "network.UrlPattern" } } }]);
const NetworkInterceptPhaseEnum = (0, enum_js_1.defineEnum)('network.InterceptPhase', ["beforeRequestSent", "responseStarted", "authRequired"]);
const NetworkAddInterceptResult = (0, record_js_1.defineRecord)('network.AddInterceptResult', [{ "name": "intercept", "wire": "intercept", "required": true, "type": { "ref": "network.Intercept" } }]);
const NetworkContinueRequest = (0, record_js_1.defineRecord)('network.ContinueRequest', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.continueRequest" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.ContinueRequestParameters" } }]);
const NetworkContinueRequestParameters = (0, record_js_1.defineRecord)('network.ContinueRequestParameters', [{ "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }, { "name": "body", "wire": "body", "required": false, "type": { "ref": "network.BytesValue" } }, { "name": "cookies", "wire": "cookies", "required": false, "type": { "list": { "ref": "network.CookieHeader" } } }, { "name": "headers", "wire": "headers", "required": false, "type": { "list": { "ref": "network.Header" } } }, { "name": "method", "wire": "method", "required": false, "type": { "primitive": "string" } }, { "name": "url", "wire": "url", "required": false, "type": { "primitive": "string" } }]);
(0, record_js_1.defineAlias)('network.ContinueRequestResult', { "ref": "EmptyResult" });
const NetworkContinueResponse = (0, record_js_1.defineRecord)('network.ContinueResponse', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.continueResponse" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.ContinueResponseParameters" } }]);
const NetworkContinueResponseParameters = (0, record_js_1.defineRecord)('network.ContinueResponseParameters', [{ "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }, { "name": "cookies", "wire": "cookies", "required": false, "type": { "list": { "ref": "network.SetCookieHeader" } } }, { "name": "credentials", "wire": "credentials", "required": false, "type": { "ref": "network.AuthCredentials" } }, { "name": "headers", "wire": "headers", "required": false, "type": { "list": { "ref": "network.Header" } } }, { "name": "reasonPhrase", "wire": "reasonPhrase", "required": false, "type": { "primitive": "string" } }, { "name": "statusCode", "wire": "statusCode", "required": false, "type": { "ref": "js-uint" } }]);
(0, record_js_1.defineAlias)('network.ContinueResponseResult', { "ref": "EmptyResult" });
const NetworkContinueWithAuth = (0, record_js_1.defineRecord)('network.ContinueWithAuth', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.continueWithAuth" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.ContinueWithAuthParameters" } }]);
const NetworkContinueWithAuthParametersUnion = (0, union_js_1.defineUnion)('network.ContinueWithAuthParameters', { "by": "action", "variants": [{ "value": "provideCredentials", "ref": "network.ContinueWithAuthParameters_Credentials" }], "default": "network.ContinueWithAuthParameters_NoCredentials" }, { "objectOnly": true });
(0, record_js_1.defineAlias)('network.ContinueWithAuthResult', { "ref": "EmptyResult" });
const NetworkDisownData = (0, record_js_1.defineRecord)('network.DisownData', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.disownData" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.DisownDataParameters" } }]);
const NetworkDisownDataParameters = (0, record_js_1.defineRecord)('network.DisownDataParameters', [{ "name": "dataType", "wire": "dataType", "required": true, "type": { "ref": "network.DataType" } }, { "name": "collector", "wire": "collector", "required": true, "type": { "ref": "network.Collector" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }]);
(0, record_js_1.defineAlias)('network.DisownDataResult', { "ref": "EmptyResult" });
const NetworkFailRequest = (0, record_js_1.defineRecord)('network.FailRequest', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.failRequest" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.FailRequestParameters" } }]);
const NetworkFailRequestParameters = (0, record_js_1.defineRecord)('network.FailRequestParameters', [{ "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }]);
(0, record_js_1.defineAlias)('network.FailRequestResult', { "ref": "EmptyResult" });
const NetworkGetData = (0, record_js_1.defineRecord)('network.GetData', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.getData" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.GetDataParameters" } }]);
const NetworkGetDataParameters = (0, record_js_1.defineRecord)('network.GetDataParameters', [{ "name": "dataType", "wire": "dataType", "required": true, "type": { "ref": "network.DataType" } }, { "name": "collector", "wire": "collector", "required": false, "type": { "ref": "network.Collector" } }, { "name": "disown", "wire": "disown", "required": false, "type": { "primitive": "boolean" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }]);
const NetworkGetDataResult = (0, record_js_1.defineRecord)('network.GetDataResult', [{ "name": "bytes", "wire": "bytes", "required": true, "type": { "ref": "network.BytesValue" } }]);
const NetworkProvideResponse = (0, record_js_1.defineRecord)('network.ProvideResponse', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.provideResponse" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.ProvideResponseParameters" } }]);
const NetworkProvideResponseParameters = (0, record_js_1.defineRecord)('network.ProvideResponseParameters', [{ "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }, { "name": "body", "wire": "body", "required": false, "type": { "ref": "network.BytesValue" } }, { "name": "cookies", "wire": "cookies", "required": false, "type": { "list": { "ref": "network.SetCookieHeader" } } }, { "name": "headers", "wire": "headers", "required": false, "type": { "list": { "ref": "network.Header" } } }, { "name": "reasonPhrase", "wire": "reasonPhrase", "required": false, "type": { "primitive": "string" } }, { "name": "statusCode", "wire": "statusCode", "required": false, "type": { "ref": "js-uint" } }]);
(0, record_js_1.defineAlias)('network.ProvideResponseResult', { "ref": "EmptyResult" });
const NetworkRemoveDataCollector = (0, record_js_1.defineRecord)('network.RemoveDataCollector', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.removeDataCollector" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.RemoveDataCollectorParameters" } }]);
const NetworkRemoveDataCollectorParameters = (0, record_js_1.defineRecord)('network.RemoveDataCollectorParameters', [{ "name": "collector", "wire": "collector", "required": true, "type": { "ref": "network.Collector" } }]);
(0, record_js_1.defineAlias)('network.RemoveDataCollectorResult', { "ref": "EmptyResult" });
const NetworkRemoveIntercept = (0, record_js_1.defineRecord)('network.RemoveIntercept', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.removeIntercept" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.RemoveInterceptParameters" } }]);
const NetworkRemoveInterceptParameters = (0, record_js_1.defineRecord)('network.RemoveInterceptParameters', [{ "name": "intercept", "wire": "intercept", "required": true, "type": { "ref": "network.Intercept" } }]);
(0, record_js_1.defineAlias)('network.RemoveInterceptResult', { "ref": "EmptyResult" });
const NetworkSetCacheBehavior = (0, record_js_1.defineRecord)('network.SetCacheBehavior', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.setCacheBehavior" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.SetCacheBehaviorParameters" } }]);
const NetworkSetCacheBehaviorParameters = (0, record_js_1.defineRecord)('network.SetCacheBehaviorParameters', [{ "name": "cacheBehavior", "wire": "cacheBehavior", "required": true, "type": { "ref": "network.SetCacheBehaviorParametersCacheBehavior" } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }]);
(0, record_js_1.defineAlias)('network.SetCacheBehaviorResult', { "ref": "EmptyResult" });
const NetworkSetExtraHeaders = (0, record_js_1.defineRecord)('network.SetExtraHeaders', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.setExtraHeaders" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.SetExtraHeadersParameters" } }]);
const NetworkSetExtraHeadersParameters = (0, record_js_1.defineRecord)('network.SetExtraHeadersParameters', [{ "name": "headers", "wire": "headers", "required": true, "type": { "list": { "ref": "network.Header" } } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('network.SetExtraHeadersResult', { "ref": "EmptyResult" });
const NetworkAuthRequired = (0, record_js_1.defineRecord)('network.AuthRequired', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.authRequired" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.AuthRequiredParameters" } }]);
const NetworkAuthRequiredParameters = (0, record_js_1.defineRecord)('network.AuthRequiredParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext", "nullable": true } }, { "name": "isBlocked", "wire": "isBlocked", "required": true, "type": { "primitive": "boolean" } }, { "name": "navigation", "wire": "navigation", "required": true, "type": { "ref": "browsingContext.Navigation", "nullable": true } }, { "name": "redirectCount", "wire": "redirectCount", "required": true, "type": { "ref": "js-uint" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.RequestData" } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext", "nullable": true } }, { "name": "intercepts", "wire": "intercepts", "required": false, "type": { "list": { "ref": "network.Intercept" } } }, { "name": "response", "wire": "response", "required": true, "type": { "ref": "network.ResponseData" } }]);
const NetworkBeforeRequestSent = (0, record_js_1.defineRecord)('network.BeforeRequestSent', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.beforeRequestSent" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.BeforeRequestSentParameters" } }]);
const NetworkBeforeRequestSentParameters = (0, record_js_1.defineRecord)('network.BeforeRequestSentParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext", "nullable": true } }, { "name": "isBlocked", "wire": "isBlocked", "required": true, "type": { "primitive": "boolean" } }, { "name": "navigation", "wire": "navigation", "required": true, "type": { "ref": "browsingContext.Navigation", "nullable": true } }, { "name": "redirectCount", "wire": "redirectCount", "required": true, "type": { "ref": "js-uint" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.RequestData" } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext", "nullable": true } }, { "name": "intercepts", "wire": "intercepts", "required": false, "type": { "list": { "ref": "network.Intercept" } } }, { "name": "initiator", "wire": "initiator", "required": false, "type": { "ref": "network.Initiator" } }]);
const NetworkFetchError = (0, record_js_1.defineRecord)('network.FetchError', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.fetchError" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.FetchErrorParameters" } }]);
const NetworkFetchErrorParameters = (0, record_js_1.defineRecord)('network.FetchErrorParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext", "nullable": true } }, { "name": "isBlocked", "wire": "isBlocked", "required": true, "type": { "primitive": "boolean" } }, { "name": "navigation", "wire": "navigation", "required": true, "type": { "ref": "browsingContext.Navigation", "nullable": true } }, { "name": "redirectCount", "wire": "redirectCount", "required": true, "type": { "ref": "js-uint" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.RequestData" } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext", "nullable": true } }, { "name": "intercepts", "wire": "intercepts", "required": false, "type": { "list": { "ref": "network.Intercept" } } }, { "name": "errorText", "wire": "errorText", "required": true, "type": { "primitive": "string" } }]);
const NetworkResponseCompleted = (0, record_js_1.defineRecord)('network.ResponseCompleted', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.responseCompleted" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.ResponseCompletedParameters" } }]);
const NetworkResponseCompletedParameters = (0, record_js_1.defineRecord)('network.ResponseCompletedParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext", "nullable": true } }, { "name": "isBlocked", "wire": "isBlocked", "required": true, "type": { "primitive": "boolean" } }, { "name": "navigation", "wire": "navigation", "required": true, "type": { "ref": "browsingContext.Navigation", "nullable": true } }, { "name": "redirectCount", "wire": "redirectCount", "required": true, "type": { "ref": "js-uint" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.RequestData" } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext", "nullable": true } }, { "name": "intercepts", "wire": "intercepts", "required": false, "type": { "list": { "ref": "network.Intercept" } } }, { "name": "response", "wire": "response", "required": true, "type": { "ref": "network.ResponseData" } }]);
const NetworkResponseStarted = (0, record_js_1.defineRecord)('network.ResponseStarted', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "network.responseStarted" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "network.ResponseStartedParameters" } }]);
const NetworkResponseStartedParameters = (0, record_js_1.defineRecord)('network.ResponseStartedParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext", "nullable": true } }, { "name": "isBlocked", "wire": "isBlocked", "required": true, "type": { "primitive": "boolean" } }, { "name": "navigation", "wire": "navigation", "required": true, "type": { "ref": "browsingContext.Navigation", "nullable": true } }, { "name": "redirectCount", "wire": "redirectCount", "required": true, "type": { "ref": "js-uint" } }, { "name": "request", "wire": "request", "required": true, "type": { "ref": "network.RequestData" } }, { "name": "timestamp", "wire": "timestamp", "required": true, "type": { "ref": "js-uint" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext", "nullable": true } }, { "name": "intercepts", "wire": "intercepts", "required": false, "type": { "list": { "ref": "network.Intercept" } } }, { "name": "response", "wire": "response", "required": true, "type": { "ref": "network.ResponseData" } }]);
const NetworkInitiatorTypeEnum = (0, enum_js_1.defineEnum)('network.InitiatorType', ["parser", "script", "preflight", "other"]);
const NetworkContinueWithAuthNoCredentialsActionEnum = (0, enum_js_1.defineEnum)('network.ContinueWithAuthNoCredentialsAction', ["default", "cancel"]);
const NetworkSetCacheBehaviorParametersCacheBehaviorEnum = (0, enum_js_1.defineEnum)('network.SetCacheBehaviorParametersCacheBehavior', ["default", "bypass"]);
const NetworkContinueWithAuthParameters_Credentials = (0, record_js_1.defineRecord)('network.ContinueWithAuthParameters_Credentials', [{ "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }, { "name": "action", "wire": "action", "required": true, "type": { "const": "provideCredentials" } }, { "name": "credentials", "wire": "credentials", "required": true, "type": { "ref": "network.AuthCredentials" } }]);
const NetworkContinueWithAuthParameters_NoCredentials = (0, record_js_1.defineRecord)('network.ContinueWithAuthParameters_NoCredentials', [{ "name": "request", "wire": "request", "required": true, "type": { "ref": "network.Request" } }, { "name": "action", "wire": "action", "required": true, "type": { "ref": "network.ContinueWithAuthNoCredentialsAction" } }]);
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class Network extends domain_js_1.Domain {
    static async create(driver) {
        return new Network(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
    /**
     * @param {NetworkAddDataCollectorParameters} params
     * @param {Array<NetworkDataType>} params.dataTypes
     * @param {JsUint} params.maxEncodedDataSize
     * @param {NetworkCollectorType} [params.collectorType]
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<NetworkAddDataCollectorResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-addDataCollector
     */
    async addDataCollector(params) {
        const validatedParams = new NetworkAddDataCollectorParameters(params);
        const result = await this.send('network.addDataCollector', validatedParams);
        return NetworkAddDataCollectorResult.fromWire(result);
    }
    /**
     * @param {NetworkAddInterceptParameters} params
     * @param {Array<NetworkInterceptPhase>} params.phases
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<NetworkUrlPattern>} [params.urlPatterns]
     * @returns {Promise<NetworkAddInterceptResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-addIntercept
     */
    async addIntercept(params) {
        const validatedParams = new NetworkAddInterceptParameters(params);
        const result = await this.send('network.addIntercept', validatedParams);
        return NetworkAddInterceptResult.fromWire(result);
    }
    /**
     * @param {NetworkContinueRequestParameters} params
     * @param {NetworkRequest} params.request
     * @param {NetworkBytesValue} [params.body]
     * @param {Array<NetworkCookieHeader>} [params.cookies]
     * @param {Array<NetworkHeader>} [params.headers]
     * @param {string} [params.method]
     * @param {string} [params.url]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-continueRequest
     */
    async continueRequest(params) {
        const validatedParams = new NetworkContinueRequestParameters(params);
        await this.send('network.continueRequest', validatedParams);
    }
    /**
     * @param {NetworkContinueResponseParameters} params
     * @param {NetworkRequest} params.request
     * @param {Array<NetworkSetCookieHeader>} [params.cookies]
     * @param {NetworkAuthCredentials} [params.credentials]
     * @param {Array<NetworkHeader>} [params.headers]
     * @param {string} [params.reasonPhrase]
     * @param {JsUint} [params.statusCode]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-continueResponse
     */
    async continueResponse(params) {
        const validatedParams = new NetworkContinueResponseParameters(params);
        await this.send('network.continueResponse', validatedParams);
    }
    /**
     * @param {NetworkContinueWithAuthParameters} params
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-continueWithAuth
     */
    async continueWithAuth(params) {
        const validatedParams = NetworkContinueWithAuthParametersUnion.build(params);
        await this.send('network.continueWithAuth', validatedParams);
    }
    /**
     * @param {NetworkDisownDataParameters} params
     * @param {NetworkDataType} params.dataType
     * @param {NetworkCollector} params.collector
     * @param {NetworkRequest} params.request
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-disownData
     */
    async disownData(params) {
        const validatedParams = new NetworkDisownDataParameters(params);
        await this.send('network.disownData', validatedParams);
    }
    /**
     * @param {NetworkFailRequestParameters} params
     * @param {NetworkRequest} params.request
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-failRequest
     */
    async failRequest(params) {
        const validatedParams = new NetworkFailRequestParameters(params);
        await this.send('network.failRequest', validatedParams);
    }
    /**
     * @param {NetworkGetDataParameters} params
     * @param {NetworkDataType} params.dataType
     * @param {NetworkCollector} [params.collector]
     * @param {boolean} [params.disown]
     * @param {NetworkRequest} params.request
     * @returns {Promise<NetworkGetDataResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-getData
     */
    async getData(params) {
        const validatedParams = new NetworkGetDataParameters(params);
        const result = await this.send('network.getData', validatedParams);
        return NetworkGetDataResult.fromWire(result);
    }
    /**
     * @param {NetworkProvideResponseParameters} params
     * @param {NetworkRequest} params.request
     * @param {NetworkBytesValue} [params.body]
     * @param {Array<NetworkSetCookieHeader>} [params.cookies]
     * @param {Array<NetworkHeader>} [params.headers]
     * @param {string} [params.reasonPhrase]
     * @param {JsUint} [params.statusCode]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-provideResponse
     */
    async provideResponse(params) {
        const validatedParams = new NetworkProvideResponseParameters(params);
        await this.send('network.provideResponse', validatedParams);
    }
    /**
     * @param {NetworkRemoveDataCollectorParameters} params
     * @param {NetworkCollector} params.collector
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-removeDataCollector
     */
    async removeDataCollector(params) {
        const validatedParams = new NetworkRemoveDataCollectorParameters(params);
        await this.send('network.removeDataCollector', validatedParams);
    }
    /**
     * @param {NetworkRemoveInterceptParameters} params
     * @param {NetworkIntercept} params.intercept
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-removeIntercept
     */
    async removeIntercept(params) {
        const validatedParams = new NetworkRemoveInterceptParameters(params);
        await this.send('network.removeIntercept', validatedParams);
    }
    /**
     * @param {NetworkSetCacheBehaviorParameters} params
     * @param {NetworkSetCacheBehaviorParametersCacheBehavior} params.cacheBehavior
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-setCacheBehavior
     */
    async setCacheBehavior(params) {
        const validatedParams = new NetworkSetCacheBehaviorParameters(params);
        await this.send('network.setCacheBehavior', validatedParams);
    }
    /**
     * @param {NetworkSetExtraHeadersParameters} params
     * @param {Array<NetworkHeader>} params.headers
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-setExtraHeaders
     */
    async setExtraHeaders(params) {
        const validatedParams = new NetworkSetExtraHeadersParameters(params);
        await this.send('network.setExtraHeaders', validatedParams);
    }
}
exports.Network = Network;
/** @see https://w3c.github.io/webdriver-bidi/#event-network-authRequired */
Network.AUTH_REQUIRED = (0, domain_js_1.event)('network.authRequired', NetworkAuthRequiredParameters);
/** @see https://w3c.github.io/webdriver-bidi/#event-network-beforeRequestSent */
Network.BEFORE_REQUEST_SENT = (0, domain_js_1.event)('network.beforeRequestSent', NetworkBeforeRequestSentParameters);
/** @see https://w3c.github.io/webdriver-bidi/#event-network-fetchError */
Network.FETCH_ERROR = (0, domain_js_1.event)('network.fetchError', NetworkFetchErrorParameters);
/** @see https://w3c.github.io/webdriver-bidi/#event-network-responseCompleted */
Network.RESPONSE_COMPLETED = (0, domain_js_1.event)('network.responseCompleted', NetworkResponseCompletedParameters);
/** @see https://w3c.github.io/webdriver-bidi/#event-network-responseStarted */
Network.RESPONSE_STARTED = (0, domain_js_1.event)('network.responseStarted', NetworkResponseStartedParameters);
Network.CollectorType = Object.freeze({ BLOB: "blob" });
Network.SameSite = Object.freeze({ STRICT: "strict", LAX: "lax", NONE: "none", DEFAULT: "default" });
Network.DataType = Object.freeze({ REQUEST: "request", RESPONSE: "response" });
Network.InterceptPhase = Object.freeze({ BEFORE_REQUEST_SENT: "beforeRequestSent", RESPONSE_STARTED: "responseStarted", AUTH_REQUIRED: "authRequired" });
Network.InitiatorType = Object.freeze({ PARSER: "parser", SCRIPT: "script", PREFLIGHT: "preflight", OTHER: "other" });
Network.ContinueWithAuthNoCredentialsAction = Object.freeze({ DEFAULT: "default", CANCEL: "cancel" });
Network.SetCacheBehaviorParametersCacheBehavior = Object.freeze({ DEFAULT: "default", BYPASS: "bypass" });
