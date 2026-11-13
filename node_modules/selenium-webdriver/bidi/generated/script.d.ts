import type { BrowserUserContext } from './browser.js';
import './browser.js';
import type { BrowsingContextBrowsingContext } from './browsing_context.js';
import './browsing_context.js';
import type { EmptyResult, JsUint } from './common.js';
import './common.js';
import { Domain, type EventDescriptor } from '../domain.js';
export type ScriptChannel = string;
export interface ScriptChannelValue {
    type: "channel";
    value: ScriptChannelProperties;
}
export interface ScriptChannelProperties {
    channel: ScriptChannel;
    serializationOptions?: ScriptSerializationOptions;
    ownership?: ScriptResultOwnership;
}
export type ScriptEvaluateResult = ScriptEvaluateResultSuccess | ScriptEvaluateResultException;
export interface ScriptEvaluateResultSuccess {
    type: "success";
    result: ScriptRemoteValue;
    realm: ScriptRealm;
}
export interface ScriptEvaluateResultException {
    type: "exception";
    exceptionDetails: ScriptExceptionDetails;
    realm: ScriptRealm;
}
export interface ScriptExceptionDetails {
    columnNumber: JsUint;
    exception: ScriptRemoteValue;
    lineNumber: JsUint;
    stackTrace: ScriptStackTrace;
    text: string;
}
export type ScriptHandle = string;
export type ScriptInternalId = string;
export type ScriptLocalValue = ScriptRemoteReference | ScriptPrimitiveProtocolValue | ScriptChannelValue | ScriptArrayLocalValue | ScriptDateLocalValue | ScriptMapLocalValue | ScriptObjectLocalValue | ScriptRegExpLocalValue | ScriptSetLocalValue;
export type ScriptListLocalValue = Array<ScriptLocalValue>;
export interface ScriptArrayLocalValue {
    type: "array";
    value: ScriptListLocalValue;
}
export interface ScriptDateLocalValue {
    type: "date";
    value: string;
}
export type ScriptMappingLocalValue = Array<Array<ScriptLocalValue | string>>;
export interface ScriptMapLocalValue {
    type: "map";
    value: ScriptMappingLocalValue;
}
export interface ScriptObjectLocalValue {
    type: "object";
    value: ScriptMappingLocalValue;
}
export interface ScriptRegExpValue {
    pattern: string;
    flags?: string;
}
export interface ScriptRegExpLocalValue {
    type: "regexp";
    value: ScriptRegExpValue;
}
export interface ScriptSetLocalValue {
    type: "set";
    value: ScriptListLocalValue;
}
export type ScriptPreloadScript = string;
export type ScriptRealm = string;
export type ScriptPrimitiveProtocolValue = ScriptUndefinedValue | ScriptNullValue | ScriptStringValue | ScriptNumberValue | ScriptBooleanValue | ScriptBigIntValue;
export interface ScriptUndefinedValue {
    type: "undefined";
}
export interface ScriptNullValue {
    type: "null";
}
export interface ScriptStringValue {
    type: "string";
    value: string;
}
export type ScriptSpecialNumber = "NaN" | "-0" | "Infinity" | "-Infinity";
export interface ScriptNumberValue {
    type: "number";
    value: number | ScriptSpecialNumber;
}
export interface ScriptBooleanValue {
    type: "boolean";
    value: boolean;
}
export interface ScriptBigIntValue {
    type: "bigint";
    value: string;
}
export type ScriptRealmInfo = ScriptWindowRealmInfo | ScriptDedicatedWorkerRealmInfo | ScriptSharedWorkerRealmInfo | ScriptServiceWorkerRealmInfo | ScriptWorkerRealmInfo | ScriptPaintWorkletRealmInfo | ScriptAudioWorkletRealmInfo | ScriptWorkletRealmInfo;
export interface ScriptBaseRealmInfo {
    realm: ScriptRealm;
    origin: string;
}
export interface ScriptWindowRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "window";
    context: BrowsingContextBrowsingContext;
    userContext?: BrowserUserContext;
    sandbox?: string;
}
export interface ScriptDedicatedWorkerRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "dedicated-worker";
    owners: Array<ScriptRealm>;
}
export interface ScriptSharedWorkerRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "shared-worker";
}
export interface ScriptServiceWorkerRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "service-worker";
}
export interface ScriptWorkerRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "worker";
}
export interface ScriptPaintWorkletRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "paint-worklet";
}
export interface ScriptAudioWorkletRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "audio-worklet";
}
export interface ScriptWorkletRealmInfo {
    realm: ScriptRealm;
    origin: string;
    type: "worklet";
}
export type ScriptRealmType = "window" | "dedicated-worker" | "shared-worker" | "service-worker" | "worker" | "paint-worklet" | "audio-worklet" | "worklet";
export type ScriptRemoteReference = ScriptSharedReference | ScriptRemoteObjectReference;
export interface ScriptSharedReference {
    sharedId: ScriptSharedId;
    handle?: ScriptHandle;
}
export interface ScriptRemoteObjectReference {
    handle: ScriptHandle;
    sharedId?: ScriptSharedId;
}
export type ScriptRemoteValue = ScriptPrimitiveProtocolValue | ScriptSymbolRemoteValue | ScriptArrayRemoteValue | ScriptObjectRemoteValue | ScriptFunctionRemoteValue | ScriptRegExpRemoteValue | ScriptDateRemoteValue | ScriptMapRemoteValue | ScriptSetRemoteValue | ScriptWeakMapRemoteValue | ScriptWeakSetRemoteValue | ScriptGeneratorRemoteValue | ScriptErrorRemoteValue | ScriptProxyRemoteValue | ScriptPromiseRemoteValue | ScriptTypedArrayRemoteValue | ScriptArrayBufferRemoteValue | ScriptNodeListRemoteValue | ScriptHtmlCollectionRemoteValue | ScriptNodeRemoteValue | ScriptWindowProxyRemoteValue;
export type ScriptListRemoteValue = Array<ScriptRemoteValue>;
export type ScriptMappingRemoteValue = Array<Array<ScriptRemoteValue | string>>;
export interface ScriptSymbolRemoteValue {
    type: "symbol";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptArrayRemoteValue {
    type: "array";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
    value?: ScriptListRemoteValue;
}
export interface ScriptObjectRemoteValue {
    type: "object";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
    value?: ScriptMappingRemoteValue;
}
export interface ScriptFunctionRemoteValue {
    type: "function";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptRegExpRemoteValue {
    type: "regexp";
    value: ScriptRegExpValue;
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptDateRemoteValue {
    type: "date";
    value: string;
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptMapRemoteValue {
    type: "map";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
    value?: ScriptMappingRemoteValue;
}
export interface ScriptSetRemoteValue {
    type: "set";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
    value?: ScriptListRemoteValue;
}
export interface ScriptWeakMapRemoteValue {
    type: "weakmap";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptWeakSetRemoteValue {
    type: "weakset";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptGeneratorRemoteValue {
    type: "generator";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptErrorRemoteValue {
    type: "error";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptProxyRemoteValue {
    type: "proxy";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptPromiseRemoteValue {
    type: "promise";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptTypedArrayRemoteValue {
    type: "typedarray";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptArrayBufferRemoteValue {
    type: "arraybuffer";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptNodeListRemoteValue {
    type: "nodelist";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
    value?: ScriptListRemoteValue;
}
export interface ScriptHtmlCollectionRemoteValue {
    type: "htmlcollection";
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
    value?: ScriptListRemoteValue;
}
export interface ScriptNodeRemoteValue {
    type: "node";
    sharedId?: ScriptSharedId;
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
    value?: ScriptNodeProperties;
}
export interface ScriptNodeProperties {
    nodeType: JsUint;
    childNodeCount: JsUint;
    attributes?: ScriptNodePropertiesAttributes;
    children?: Array<ScriptNodeRemoteValue>;
    localName?: string;
    mode?: ScriptNodePropertiesMode;
    namespaceURI?: string;
    nodeValue?: string;
    shadowRoot?: ScriptNodeRemoteValue | null;
}
export interface ScriptWindowProxyRemoteValue {
    type: "window";
    value: ScriptWindowProxyProperties;
    handle?: ScriptHandle;
    internalId?: ScriptInternalId;
}
export interface ScriptWindowProxyProperties {
    context: BrowsingContextBrowsingContext;
}
export type ScriptResultOwnership = "root" | "none";
export interface ScriptSerializationOptions {
    maxDomDepth?: JsUint | null;
    maxObjectDepth?: JsUint | null;
    includeShadowTree?: ScriptSerializationOptionsIncludeShadowTree;
}
export type ScriptSharedId = string;
export interface ScriptStackFrame {
    columnNumber: JsUint;
    functionName: string;
    lineNumber: JsUint;
    url: string;
}
export interface ScriptStackTrace {
    callFrames: Array<ScriptStackFrame>;
}
export interface ScriptSource {
    realm: ScriptRealm;
    context?: BrowsingContextBrowsingContext;
    userContext?: BrowserUserContext;
}
export interface ScriptRealmTarget {
    realm: ScriptRealm;
}
export interface ScriptContextTarget {
    context: BrowsingContextBrowsingContext;
    sandbox?: string;
}
export type ScriptTarget = ScriptContextTarget | ScriptRealmTarget;
export interface ScriptAddPreloadScript {
    method: "script.addPreloadScript";
    params: ScriptAddPreloadScriptParameters;
}
export interface ScriptAddPreloadScriptParameters {
    functionDeclaration: string;
    arguments?: Array<ScriptChannelValue>;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
    sandbox?: string;
}
export interface ScriptAddPreloadScriptResult {
    script: ScriptPreloadScript;
}
export interface ScriptDisown {
    method: "script.disown";
    params: ScriptDisownParameters;
}
export interface ScriptDisownParameters {
    handles: Array<ScriptHandle>;
    target: ScriptTarget;
}
export type ScriptDisownResult = EmptyResult;
export interface ScriptCallFunction {
    method: "script.callFunction";
    params: ScriptCallFunctionParameters;
}
export interface ScriptCallFunctionParameters {
    functionDeclaration: string;
    awaitPromise: boolean;
    target: ScriptTarget;
    arguments?: Array<ScriptLocalValue>;
    resultOwnership?: ScriptResultOwnership;
    serializationOptions?: ScriptSerializationOptions;
    this?: ScriptLocalValue;
    userActivation?: boolean;
}
export type ScriptCallFunctionResult = ScriptEvaluateResult;
export interface ScriptEvaluate {
    method: "script.evaluate";
    params: ScriptEvaluateParameters;
}
export interface ScriptEvaluateParameters {
    expression: string;
    target: ScriptTarget;
    awaitPromise: boolean;
    resultOwnership?: ScriptResultOwnership;
    serializationOptions?: ScriptSerializationOptions;
    userActivation?: boolean;
}
export interface ScriptGetRealms {
    method: "script.getRealms";
    params: ScriptGetRealmsParameters;
}
export interface ScriptGetRealmsParameters {
    context?: BrowsingContextBrowsingContext;
    type?: ScriptRealmType;
}
export interface ScriptGetRealmsResult {
    realms: Array<ScriptRealmInfo>;
}
export interface ScriptRemovePreloadScript {
    method: "script.removePreloadScript";
    params: ScriptRemovePreloadScriptParameters;
}
export interface ScriptRemovePreloadScriptParameters {
    script: ScriptPreloadScript;
}
export type ScriptRemovePreloadScriptResult = EmptyResult;
export interface ScriptMessage {
    method: "script.message";
    params: ScriptMessageParameters;
}
export interface ScriptMessageParameters {
    channel: ScriptChannel;
    data: ScriptRemoteValue;
    source: ScriptSource;
}
export interface ScriptRealmCreated {
    method: "script.realmCreated";
    params: ScriptRealmInfo;
}
export interface ScriptRealmDestroyed {
    method: "script.realmDestroyed";
    params: ScriptRealmDestroyedParameters;
}
export interface ScriptRealmDestroyedParameters {
    realm: ScriptRealm;
}
export type ScriptNodePropertiesMode = "open" | "closed";
export type ScriptSerializationOptionsIncludeShadowTree = "none" | "open" | "all";
export interface ScriptNodePropertiesAttributes {
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Script extends Domain {
    /** @see https://w3c.github.io/webdriver-bidi/#event-script-message */
    static readonly MESSAGE: EventDescriptor<ScriptMessageParameters>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-script-realmCreated */
    static readonly REALM_CREATED: EventDescriptor<ScriptRealmInfo>;
    /** @see https://w3c.github.io/webdriver-bidi/#event-script-realmDestroyed */
    static readonly REALM_DESTROYED: EventDescriptor<ScriptRealmDestroyedParameters>;
    static readonly SpecialNumber: Readonly<{
        readonly NA_N: "NaN";
        readonly _0: "-0";
        readonly INFINITY: "Infinity";
        readonly _INFINITY: "-Infinity";
    }>;
    static readonly RealmType: Readonly<{
        readonly WINDOW: "window";
        readonly DEDICATED_WORKER: "dedicated-worker";
        readonly SHARED_WORKER: "shared-worker";
        readonly SERVICE_WORKER: "service-worker";
        readonly WORKER: "worker";
        readonly PAINT_WORKLET: "paint-worklet";
        readonly AUDIO_WORKLET: "audio-worklet";
        readonly WORKLET: "worklet";
    }>;
    static readonly ResultOwnership: Readonly<{
        readonly ROOT: "root";
        readonly NONE: "none";
    }>;
    static readonly NodePropertiesMode: Readonly<{
        readonly OPEN: "open";
        readonly CLOSED: "closed";
    }>;
    static readonly SerializationOptionsIncludeShadowTree: Readonly<{
        readonly NONE: "none";
        readonly OPEN: "open";
        readonly ALL: "all";
    }>;
    static create(driver: unknown): Promise<Script>;
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
    addPreloadScript(params: ScriptAddPreloadScriptParameters): Promise<ScriptAddPreloadScriptResult>;
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
    callFunction(params: ScriptCallFunctionParameters): Promise<ScriptCallFunctionResult>;
    /**
     * @param {ScriptDisownParameters} params
     * @param {Array<ScriptHandle>} params.handles
     * @param {ScriptTarget} params.target
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-disown
     */
    disown(params: ScriptDisownParameters): Promise<void>;
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
    evaluate(params: ScriptEvaluateParameters): Promise<ScriptEvaluateResult>;
    /**
     * @param {ScriptGetRealmsParameters} params
     * @param {BrowsingContextBrowsingContext} [params.context]
     * @param {ScriptRealmType} [params.type]
     * @returns {Promise<ScriptGetRealmsResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-getRealms
     */
    getRealms(params: ScriptGetRealmsParameters): Promise<ScriptGetRealmsResult>;
    /**
     * @param {ScriptRemovePreloadScriptParameters} params
     * @param {ScriptPreloadScript} params.script
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-script-removePreloadScript
     */
    removePreloadScript(params: ScriptRemovePreloadScriptParameters): Promise<void>;
}
