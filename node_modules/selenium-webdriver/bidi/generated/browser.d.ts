import type { EmptyParams, EmptyResult, JsInt, JsUint } from './common.js';
import './common.js';
import type { SessionProxyConfiguration, SessionUserPromptHandler } from './session.js';
import './session.js';
import { Domain } from '../domain.js';
export type BrowserClientWindow = string;
export interface BrowserClientWindowInfo {
    active: boolean;
    clientWindow: BrowserClientWindow;
    height: JsUint;
    state: BrowserClientWindowInfoState;
    width: JsUint;
    x: JsInt;
    y: JsInt;
}
export type BrowserUserContext = string;
export interface BrowserUserContextInfo {
    userContext: BrowserUserContext;
}
export interface BrowserClose {
    method: "browser.close";
    params: EmptyParams;
}
export type BrowserCloseResult = EmptyResult;
export interface BrowserCreateUserContext {
    method: "browser.createUserContext";
    params: BrowserCreateUserContextParameters;
}
export interface BrowserCreateUserContextParameters {
    acceptInsecureCerts?: boolean;
    proxy?: SessionProxyConfiguration;
    unhandledPromptBehavior?: SessionUserPromptHandler;
}
export type BrowserCreateUserContextResult = BrowserUserContextInfo;
export interface BrowserGetClientWindows {
    method: "browser.getClientWindows";
    params: EmptyParams;
}
export interface BrowserGetClientWindowsResult {
    clientWindows: Array<BrowserClientWindowInfo>;
}
export interface BrowserGetUserContexts {
    method: "browser.getUserContexts";
    params: EmptyParams;
}
export interface BrowserGetUserContextsResult {
    userContexts: Array<BrowserUserContextInfo>;
}
export interface BrowserRemoveUserContext {
    method: "browser.removeUserContext";
    params: BrowserRemoveUserContextParameters;
}
export interface BrowserRemoveUserContextParameters {
    userContext: BrowserUserContext;
}
export type BrowserRemoveUserContextResult = EmptyResult;
export interface BrowserSetClientWindowState {
    method: "browser.setClientWindowState";
    params: BrowserSetClientWindowStateParameters;
}
export type BrowserSetClientWindowStateParameters = BrowserSetClientWindowStateParameters_ClientWindowNamedState | BrowserSetClientWindowStateParameters_ClientWindowRectState;
export type BrowserSetClientWindowStateResult = BrowserClientWindowInfo;
export interface BrowserSetDownloadBehavior {
    method: "browser.setDownloadBehavior";
    params: BrowserSetDownloadBehaviorParameters;
}
export interface BrowserSetDownloadBehaviorParameters {
    downloadBehavior: BrowserDownloadBehavior | null;
    userContexts?: Array<BrowserUserContext>;
}
export type BrowserDownloadBehavior = BrowserDownloadBehavior_Allowed | BrowserDownloadBehavior_Denied;
export type BrowserSetDownloadBehaviorResult = EmptyResult;
export type BrowserClientWindowInfoState = "fullscreen" | "maximized" | "minimized" | "normal";
export type BrowserClientWindowNamedStateState = "fullscreen" | "maximized" | "minimized";
export interface BrowserSetClientWindowStateParameters_ClientWindowNamedState {
    clientWindow: BrowserClientWindow;
    state: BrowserClientWindowNamedStateState;
}
export interface BrowserSetClientWindowStateParameters_ClientWindowRectState {
    clientWindow: BrowserClientWindow;
    state: "normal";
    width?: JsUint;
    height?: JsUint;
    x?: JsInt;
    y?: JsInt;
}
export interface BrowserDownloadBehavior_Allowed {
    type: "allowed";
    destinationFolder: string;
}
export interface BrowserDownloadBehavior_Denied {
    type: "denied";
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Browser extends Domain {
    static readonly ClientWindowInfoState: Readonly<{
        readonly FULLSCREEN: "fullscreen";
        readonly MAXIMIZED: "maximized";
        readonly MINIMIZED: "minimized";
        readonly NORMAL: "normal";
    }>;
    static readonly ClientWindowNamedStateState: Readonly<{
        readonly FULLSCREEN: "fullscreen";
        readonly MAXIMIZED: "maximized";
        readonly MINIMIZED: "minimized";
    }>;
    static create(driver: unknown): Promise<Browser>;
    /**
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-close
     */
    close(): Promise<void>;
    /**
     * @param {BrowserCreateUserContextParameters} params
     * @param {boolean} [params.acceptInsecureCerts]
     * @param {SessionProxyConfiguration} [params.proxy]
     * @param {SessionUserPromptHandler} [params.unhandledPromptBehavior]
     * @returns {Promise<BrowserCreateUserContextResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-createUserContext
     */
    createUserContext(params: BrowserCreateUserContextParameters): Promise<BrowserCreateUserContextResult>;
    /**
     * @returns {Promise<BrowserGetClientWindowsResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-getClientWindows
     */
    getClientWindows(): Promise<BrowserGetClientWindowsResult>;
    /**
     * @returns {Promise<BrowserGetUserContextsResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-getUserContexts
     */
    getUserContexts(): Promise<BrowserGetUserContextsResult>;
    /**
     * @param {BrowserRemoveUserContextParameters} params
     * @param {BrowserUserContext} params.userContext
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-removeUserContext
     */
    removeUserContext(params: BrowserRemoveUserContextParameters): Promise<void>;
    /**
     * @param {BrowserSetClientWindowStateParameters} params
     * @returns {Promise<BrowserSetClientWindowStateResult>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-setClientWindowState
     */
    setClientWindowState(params: BrowserSetClientWindowStateParameters): Promise<BrowserSetClientWindowStateResult>;
    /**
     * @param {BrowserSetDownloadBehaviorParameters} params
     * @param {BrowserDownloadBehavior | null} params.downloadBehavior
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-browser-setDownloadBehavior
     */
    setDownloadBehavior(params: BrowserSetDownloadBehaviorParameters): Promise<void>;
}
