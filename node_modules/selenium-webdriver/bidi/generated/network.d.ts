import type { BrowserUserContext } from './browser.js';
import './browser.js';
import type { BrowsingContextBrowsingContext, BrowsingContextNavigation } from './browsing_context.js';
import './browsing_context.js';
import type { EmptyResult, JsInt, JsUint } from './common.js';
import './common.js';
import type { ScriptStackTrace } from './script.js';
import './script.js';
import { Domain, type EventDescriptor } from '../domain.js';
export interface NetworkAuthChallenge {
    scheme: string;
    realm: string;
}
export interface NetworkAuthCredentials {
    type: "password";
    username: string;
    password: string;
}
export interface NetworkBaseParameters {
    context: BrowsingContextBrowsingContext | null;
    isBlocked: boolean;
    navigation: BrowsingContextNavigation | null;
    redirectCount: JsUint;
    request: NetworkRequestData;
    timestamp: JsUint;
    userContext?: BrowserUserContext | null;
    intercepts?: Array<NetworkIntercept>;
}
export type NetworkBytesValue = NetworkStringValue | NetworkBase64Value;
export interface NetworkStringValue {
    type: "string";
    value: string;
}
export interface NetworkBase64Value {
    type: "base64";
    value: string;
}
export type NetworkCollector = string;
export type NetworkCollectorType = "blob";
export type NetworkSameSite = "strict" | "lax" | "none" | "default";
export interface NetworkCookie {
    name: string;
    value: NetworkBytesValue;
    domain: string;
    path: string;
    size: JsUint;
    httpOnly: boolean;
    secure: boolean;
    sameSite: NetworkSameSite;
    expiry?: JsUint;
}
export interface NetworkCookieHeader {
    name: string;
    value: NetworkBytesValue;
}
export type NetworkDataType = "request" | "response";
export interface NetworkFetchTimingInfo {
    timeOrigin: number;
    requestTime: number;
    redirectStart: number;
    redirectEnd: number;
    fetchStart: number;
    dnsStart: number;
    dnsEnd: number;
    connectStart: number;
    connectEnd: number;
    tlsStart: number;
    requestStart: number;
    responseStart: number;
    responseEnd: number;
}
export interface NetworkHeader {
    name: string;
    value: NetworkBytesValue;
}
export interface NetworkInitiator {
    columnNumber?: JsUint;
    lineNumber?: JsUint;
    request?: NetworkRequest;
    stackTrace?: ScriptStackTrace;
    type?: NetworkInitiatorType;
}
export type NetworkIntercept = string;
export type NetworkRequest = string;
export interface NetworkRequestData {
    request: NetworkRequest;
    url: string;
    method: string;
    headers: Array<NetworkHeader>;
    cookies: Array<NetworkCookie>;
    headersSize: JsUint;
    bodySize: JsUint | null;
    destination: string;
    initiatorType: string | null;
    timings: NetworkFetchTimingInfo;
}
export interface NetworkResponseContent {
    size: JsUint;
}
export interface NetworkResponseData {
    url: string;
    protocol: string;
    status: JsUint;
    statusText: string;
    fromCache: boolean;
    headers: Array<NetworkHeader>;
    mimeType: string;
    bytesReceived: JsUint;
    headersSize: JsUint | null;
    bodySize: JsUint | null;
    content: NetworkResponseContent;
    authChallenges?: Array<NetworkAuthChallenge>;
}
export interface NetworkSetCookieHeader {
    name: string;
    value: NetworkBytesValue;
    domain?: string;
    httpOnly?: boolean;
    expiry?: string;
    maxAge?: JsInt;
    path?: string;
    sameSite?: NetworkSameSite;
    secure?: boolean;
}
export type NetworkUrlPattern = NetworkUrlPatternPattern | NetworkUrlPatternString;
export interface NetworkUrlPatternPattern {
    type: "pattern";
    protocol?: string;
    hostname?: string;
    port?: string;
    pathname?: string;
    search?: string;
}
export interface NetworkUrlPatternString {
    type: "string";
    pattern: string;
}
export interface NetworkAddDataCollector {
    method: "network.addDataCollector";
    params: NetworkAddDataCollectorParameters;
}
export interface NetworkAddDataCollectorParameters {
    dataTypes: Array<NetworkDataType>;
    maxEncodedDataSize: JsUint;
    collectorType?: NetworkCollectorType;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export interface NetworkAddDataCollectorResult {
    collector: NetworkCollector;
}
export interface NetworkAddIntercept {
    method: "network.addIntercept";
    params: NetworkAddInterceptParameters;
}
export interface NetworkAddInterceptParameters {
    phases: Array<NetworkInterceptPhase>;
    contexts?: Array<BrowsingContextBrowsingContext>;
    urlPatterns?: Array<NetworkUrlPattern>;
}
export type NetworkInterceptPhase = "beforeRequestSent" | "responseStarted" | "authRequired";
export interface NetworkAddInterceptResult {
    intercept: NetworkIntercept;
}
export interface NetworkContinueRequest {
    method: "network.continueRequest";
    params: NetworkContinueRequestParameters;
}
export interface NetworkContinueRequestParameters {
    request: NetworkRequest;
    body?: NetworkBytesValue;
    cookies?: Array<NetworkCookieHeader>;
    headers?: Array<NetworkHeader>;
    method?: string;
    url?: string;
}
export type NetworkContinueRequestResult = EmptyResult;
export interface NetworkContinueResponse {
    method: "network.continueResponse";
    params: NetworkContinueResponseParameters;
}
export interface NetworkContinueResponseParameters {
    request: NetworkRequest;
    cookies?: Array<NetworkSetCookieHeader>;
    credentials?: NetworkAuthCredentials;
    headers?: Array<NetworkHeader>;
    reasonPhrase?: string;
    statusCode?: JsUint;
}
export type NetworkContinueResponseResult = EmptyResult;
export interface NetworkContinueWithAuth {
    method: "network.continueWithAuth";
    params: NetworkContinueWithAuthParameters;
}
export type NetworkContinueWithAuthParameters = NetworkContinueWithAuthParameters_Credentials | NetworkContinueWithAuthParameters_NoCredentials;
export type NetworkContinueWithAuthResult = EmptyResult;
export interface NetworkDisownData {
    method: "network.disownData";
    params: NetworkDisownDataParameters;
}
export interface NetworkDisownDataParameters {
    dataType: NetworkDataType;
    collector: NetworkCollector;
    request: NetworkRequest;
}
export type NetworkDisownDataResult = EmptyResult;
export interface NetworkFailRequest {
    method: "network.failRequest";
    params: NetworkFailRequestParameters;
}
export interface NetworkFailRequestParameters {
    request: NetworkRequest;
}
export type NetworkFailRequestResult = EmptyResult;
export interface NetworkGetData {
    method: "network.getData";
    params: NetworkGetDataParameters;
}
export interface NetworkGetDataParameters {
    dataType: NetworkDataType;
    collector?: NetworkCollector;
    disown?: boolean;
    request: NetworkRequest;
}
export interface NetworkGetDataResult {
    bytes: NetworkBytesValue;
}
export interface NetworkProvideResponse {
    method: "network.provideResponse";
    params: NetworkProvideResponseParameters;
}
export interface NetworkProvideResponseParameters {
    request: NetworkRequest;
    body?: NetworkBytesValue;
    cookies?: Array<NetworkSetCookieHeader>;
    headers?: Array<NetworkHeader>;
    reasonPhrase?: string;
    statusCode?: JsUint;
}
export type NetworkProvideResponseResult = EmptyResult;
export interface NetworkRemoveDataCollector {
    method: "network.removeDataCollector";
    params: NetworkRemoveDataCollectorParameters;
}
export interface NetworkRemoveDataCollectorParameters {
    collector: NetworkCollector;
}
export type NetworkRemoveDataCollectorResult = EmptyResult;
export interface NetworkRemoveIntercept {
    method: "network.removeIntercept";
    params: NetworkRemoveInterceptParameters;
}
export interface NetworkRemoveInterceptParameters {
    intercept: NetworkIntercept;
}
export type NetworkRemoveInterceptResult = EmptyResult;
export interface NetworkSetCacheBehavior {
    method: "network.setCacheBehavior";
    params: NetworkSetCacheBehaviorParameters;
}
export interface NetworkSetCacheBehaviorParameters {
    cacheBehavior: NetworkSetCacheBehaviorParametersCacheBehavior;
    contexts?: Array<BrowsingContextBrowsingContext>;
}
export type NetworkSetCacheBehaviorResult = EmptyResult;
export interface NetworkSetExtraHeaders {
    method: "network.setExtraHeaders";
    params: NetworkSetExtraHeadersParameters;
}
export interface NetworkSetExtraHeadersParameters {
    headers: Array<NetworkHeader>;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type NetworkSetExtraHeadersResult = EmptyResult;
export interface NetworkAuthRequired {
    method: "network.authRequired";
    params: NetworkAuthRequiredParameters;
}
export interface NetworkAuthRequiredParameters {
    context: BrowsingContextBrowsingContext | null;
    isBlocked: boolean;
    navigation: BrowsingContextNavigation | null;
    redirectCount: JsUint;
    request: NetworkRequestData;
    timestamp: JsUint;
    userContext?: BrowserUserContext | null;
    intercepts?: Array<NetworkIntercept>;
    response: NetworkResponseData;
}
export interface NetworkBeforeRequestSent {
    method: "network.beforeRequestSent";
    params: NetworkBeforeRequestSentParameters;
}
export interface NetworkBeforeRequestSentParameters {
    context: BrowsingContextBrowsingContext | null;
    isBlocked: boolean;
    navigation: BrowsingContextNavigation | null;
    redirectCount: JsUint;
    request: NetworkRequestData;
    timestamp: JsUint;
    userContext?: BrowserUserContext | null;
    intercepts?: Array<NetworkIntercept>;
    initiator?: NetworkInitiator;
}
export interface NetworkFetchError {
    method: "network.fetchError";
    params: NetworkFetchErrorParameters;
}
export interface NetworkFetchErrorParameters {
    context: BrowsingContextBrowsingContext | null;
    isBlocked: boolean;
    navigation: BrowsingContextNavigation | null;
    redirectCount: JsUint;
    request: NetworkRequestData;
    timestamp: JsUint;
    userContext?: BrowserUserContext | null;
    intercepts?: Array<NetworkIntercept>;
    errorText: string;
}
export interface NetworkResponseCompleted {
    method: "network.responseCompleted";
    params: NetworkResponseCompletedParameters;
}
export interface NetworkResponseCompletedParameters {
    context: BrowsingContextBrowsingContext | null;
    isBlocked: boolean;
    navigation: BrowsingContextNavigation | null;
    redirectCount: JsUint;
    request: NetworkRequestData;
    timestamp: JsUint;
    userContext?: BrowserUserContext | null;
    intercepts?: Array<NetworkIntercept>;
    response: NetworkResponseData;
}
export interface NetworkResponseStarted {
    method: "network.responseStarted";
    params: NetworkResponseStartedParameters;
}
export interface NetworkResponseStartedParameters {
    context: BrowsingContextBrowsingContext | null;
    isBlocked: boolean;
    navigation: BrowsingContextNavigation | null;
    redirectCount: JsUint;
    request: NetworkRequestData;
    timestamp: JsUint;
    userContext?: BrowserUserContext | null;
    intercepts?: Array<NetworkIntercept>;
    response: NetworkResponseData;
}
export type NetworkInitiatorType = "parser" | "script" | "preflight" | "other";
export type NetworkContinueWithAuthNoCredentialsAction = "default" | "cancel";
export type NetworkSetCacheBehaviorParametersCacheBehavior = "default" | "bypass";
export interface NetworkContinueWithAuthParameters_Credentials {
    request: NetworkRequest;
    action: "provideCredentials";
    credentials: NetworkAuthCredentials;
}
export interface NetworkContinueWithAuthParameters_NoCredentials {
    request: NetworkRequest;
    action: NetworkContinueWithAuthNoCredentialsAction;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Network extends Domain {
    /** @see https://w3c.github.io/webdriver-bidi/#event-network-authRequired */
    static readonly AUTH_REQUIRED: EventDescriptor<NetworkAuthRequiredParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-network-beforeRequestSent */
    static readonly BEFORE_REQUEST_SENT: EventDescriptor<NetworkBeforeRequestSentParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-network-fetchError */
    static readonly FETCH_ERROR: EventDescriptor<NetworkFetchErrorParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-network-responseCompleted */
    static readonly RESPONSE_COMPLETED: EventDescriptor<NetworkResponseCompletedParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-network-responseStarted */
    static readonly RESPONSE_STARTED: EventDescriptor<NetworkResponseStartedParameters>;
    static readonly CollectorType: Readonly<{
        readonly BLOB: "blob";
    }>;
    static readonly SameSite: Readonly<{
        readonly STRICT: "strict";
        readonly LAX: "lax";
        readonly NONE: "none";
        readonly DEFAULT: "default";
    }>;
    static readonly DataType: Readonly<{
        readonly REQUEST: "request";
        readonly RESPONSE: "response";
    }>;
    static readonly InterceptPhase: Readonly<{
        readonly BEFORE_REQUEST_SENT: "beforeRequestSent";
        readonly RESPONSE_STARTED: "responseStarted";
        readonly AUTH_REQUIRED: "authRequired";
    }>;
    static readonly InitiatorType: Readonly<{
        readonly PARSER: "parser";
        readonly SCRIPT: "script";
        readonly PREFLIGHT: "preflight";
        readonly OTHER: "other";
    }>;
    static readonly ContinueWithAuthNoCredentialsAction: Readonly<{
        readonly DEFAULT: "default";
        readonly CANCEL: "cancel";
    }>;
    static readonly SetCacheBehaviorParametersCacheBehavior: Readonly<{
        readonly DEFAULT: "default";
        readonly BYPASS: "bypass";
    }>;
    static create(driver: unknown): Promise<Network>;
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
    addDataCollector(params: NetworkAddDataCollectorParameters): Promise<NetworkAddDataCollectorResult>;
    /**
     * @param {NetworkAddInterceptParameters} params
     * @param {Array<NetworkInterceptPhase>} params.phases
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<NetworkUrlPattern>} [params.urlPatterns]
     * @returns {Promise<NetworkAddInterceptResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-addIntercept
     */
    addIntercept(params: NetworkAddInterceptParameters): Promise<NetworkAddInterceptResult>;
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
    continueRequest(params: NetworkContinueRequestParameters): Promise<void>;
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
    continueResponse(params: NetworkContinueResponseParameters): Promise<void>;
    /**
     * @param {NetworkContinueWithAuthParameters} params
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-continueWithAuth
     */
    continueWithAuth(params: NetworkContinueWithAuthParameters): Promise<void>;
    /**
     * @param {NetworkDisownDataParameters} params
     * @param {NetworkDataType} params.dataType
     * @param {NetworkCollector} params.collector
     * @param {NetworkRequest} params.request
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-disownData
     */
    disownData(params: NetworkDisownDataParameters): Promise<void>;
    /**
     * @param {NetworkFailRequestParameters} params
     * @param {NetworkRequest} params.request
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-failRequest
     */
    failRequest(params: NetworkFailRequestParameters): Promise<void>;
    /**
     * @param {NetworkGetDataParameters} params
     * @param {NetworkDataType} params.dataType
     * @param {NetworkCollector} [params.collector]
     * @param {boolean} [params.disown]
     * @param {NetworkRequest} params.request
     * @returns {Promise<NetworkGetDataResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-getData
     */
    getData(params: NetworkGetDataParameters): Promise<NetworkGetDataResult>;
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
    provideResponse(params: NetworkProvideResponseParameters): Promise<void>;
    /**
     * @param {NetworkRemoveDataCollectorParameters} params
     * @param {NetworkCollector} params.collector
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-removeDataCollector
     */
    removeDataCollector(params: NetworkRemoveDataCollectorParameters): Promise<void>;
    /**
     * @param {NetworkRemoveInterceptParameters} params
     * @param {NetworkIntercept} params.intercept
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-removeIntercept
     */
    removeIntercept(params: NetworkRemoveInterceptParameters): Promise<void>;
    /**
     * @param {NetworkSetCacheBehaviorParameters} params
     * @param {NetworkSetCacheBehaviorParametersCacheBehavior} params.cacheBehavior
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-setCacheBehavior
     */
    setCacheBehavior(params: NetworkSetCacheBehaviorParameters): Promise<void>;
    /**
     * @param {NetworkSetExtraHeadersParameters} params
     * @param {Array<NetworkHeader>} params.headers
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-network-setExtraHeaders
     */
    setExtraHeaders(params: NetworkSetExtraHeadersParameters): Promise<void>;
}
