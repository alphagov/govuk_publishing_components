import type { BluetoothCharacteristicEventGenerated, BluetoothDescriptorEventGenerated, BluetoothDisableSimulation, BluetoothGattConnectionAttempted, BluetoothHandleRequestDevicePrompt, BluetoothRequestDevicePromptUpdated, BluetoothSimulateAdapter, BluetoothSimulateAdvertisement, BluetoothSimulateCharacteristic, BluetoothSimulateCharacteristicResponse, BluetoothSimulateDescriptor, BluetoothSimulateDescriptorResponse, BluetoothSimulateGattConnectionResponse, BluetoothSimulateGattDisconnection, BluetoothSimulatePreconnectedPeripheral, BluetoothSimulateService } from './bluetooth.js';
import './bluetooth.js';
import type { BrowserClose, BrowserCloseResult, BrowserCreateUserContext, BrowserCreateUserContextResult, BrowserGetClientWindows, BrowserGetClientWindowsResult, BrowserGetUserContexts, BrowserGetUserContextsResult, BrowserRemoveUserContext, BrowserRemoveUserContextResult, BrowserSetClientWindowState, BrowserSetClientWindowStateResult, BrowserSetDownloadBehavior, BrowserSetDownloadBehaviorResult } from './browser.js';
import './browser.js';
import type { BrowsingContextActivate, BrowsingContextActivateResult, BrowsingContextCaptureScreenshot, BrowsingContextCaptureScreenshotResult, BrowsingContextClose, BrowsingContextCloseResult, BrowsingContextContextCreated, BrowsingContextContextDestroyed, BrowsingContextCreate, BrowsingContextCreateResult, BrowsingContextDomContentLoaded, BrowsingContextDownloadEnd, BrowsingContextDownloadWillBegin, BrowsingContextFragmentNavigated, BrowsingContextGetTree, BrowsingContextGetTreeResult, BrowsingContextHandleUserPrompt, BrowsingContextHandleUserPromptResult, BrowsingContextHistoryUpdated, BrowsingContextLoad, BrowsingContextLocateNodes, BrowsingContextLocateNodesResult, BrowsingContextNavigate, BrowsingContextNavigateResult, BrowsingContextNavigationAborted, BrowsingContextNavigationCommitted, BrowsingContextNavigationFailed, BrowsingContextNavigationStarted, BrowsingContextPrint, BrowsingContextPrintResult, BrowsingContextReload, BrowsingContextReloadResult, BrowsingContextSetBypassCsp, BrowsingContextSetBypassCspResult, BrowsingContextSetViewport, BrowsingContextSetViewportResult, BrowsingContextStartScreencast, BrowsingContextStartScreencastResult, BrowsingContextStopScreencast, BrowsingContextStopScreencastResult, BrowsingContextTraverseHistory, BrowsingContextTraverseHistoryResult, BrowsingContextUserPromptClosed, BrowsingContextUserPromptOpened } from './browsing_context.js';
import './browsing_context.js';
import type { DigitalCredentialsSetVirtualWalletBehavior } from './digital_credentials.js';
import './digital_credentials.js';
import type { EmulationSetForcedColorsModeThemeOverride, EmulationSetForcedColorsModeThemeOverrideResult, EmulationSetGeolocationOverride, EmulationSetGeolocationOverrideResult, EmulationSetLocaleOverride, EmulationSetLocaleOverrideResult, EmulationSetMediaFeaturesOverride, EmulationSetMediaFeaturesOverrideResult, EmulationSetNetworkConditions, EmulationSetScreenOrientationOverride, EmulationSetScreenOrientationOverrideResult, EmulationSetScreenSettingsOverride, EmulationSetScriptingEnabled, EmulationSetScriptingEnabledResult, EmulationSetScrollbarTypeOverride, EmulationSetScrollbarTypeOverrideResult, EmulationSetTextLayoutModeOverride, EmulationSetTextLayoutModeOverrideResult, EmulationSetTimezoneOverride, EmulationSetTimezoneOverrideResult, EmulationSetTouchOverride, EmulationSetTouchOverrideResult, EmulationSetUserAgentOverride, EmulationSetUserAgentOverrideResult, EmulationSetViewportMetaOverride, EmulationSetViewportMetaOverrideResult } from './emulation.js';
import './emulation.js';
import type { InputFileDialogOpened, InputPerformActions, InputPerformActionsResult, InputReleaseActions, InputReleaseActionsResult, InputSetFiles, InputSetFilesResult } from './input.js';
import './input.js';
import type { LogEntryAdded } from './log.js';
import './log.js';
import type { NetworkAddDataCollector, NetworkAddDataCollectorResult, NetworkAddIntercept, NetworkAddInterceptResult, NetworkAuthRequired, NetworkBeforeRequestSent, NetworkContinueRequest, NetworkContinueRequestResult, NetworkContinueResponse, NetworkContinueResponseResult, NetworkContinueWithAuth, NetworkContinueWithAuthResult, NetworkDisownData, NetworkDisownDataResult, NetworkFailRequest, NetworkFailRequestResult, NetworkFetchError, NetworkGetData, NetworkGetDataResult, NetworkProvideResponse, NetworkProvideResponseResult, NetworkRemoveDataCollector, NetworkRemoveDataCollectorResult, NetworkRemoveIntercept, NetworkRemoveInterceptResult, NetworkResponseCompleted, NetworkResponseStarted, NetworkSetCacheBehavior, NetworkSetCacheBehaviorResult, NetworkSetExtraHeaders, NetworkSetExtraHeadersResult } from './network.js';
import './network.js';
import type { PermissionsSetPermission } from './permissions.js';
import './permissions.js';
import type { ScriptAddPreloadScript, ScriptAddPreloadScriptResult, ScriptCallFunction, ScriptCallFunctionResult, ScriptDisown, ScriptDisownResult, ScriptEvaluate, ScriptEvaluateResult, ScriptGetRealms, ScriptGetRealmsResult, ScriptMessage, ScriptRealmCreated, ScriptRealmDestroyed, ScriptRemovePreloadScript, ScriptRemovePreloadScriptResult } from './script.js';
import './script.js';
import type { SessionEnd, SessionEndResult, SessionNew, SessionNewResult, SessionStatus, SessionStatusResult, SessionSubscribe, SessionSubscribeResult, SessionUnsubscribe, SessionUnsubscribeResult } from './session.js';
import './session.js';
import type { SpeculationPrefetchStatusUpdated } from './speculation.js';
import './speculation.js';
import type { StorageDeleteCookies, StorageDeleteCookiesResult, StorageGetCookies, StorageGetCookiesResult, StorageSetCookie, StorageSetCookieResult } from './storage.js';
import './storage.js';
import type { UserAgentClientHintsSetClientHintsOverrideCommand } from './user_agent_client_hints.js';
import './user_agent_client_hints.js';
import type { WebExtensionInstall, WebExtensionInstallResult, WebExtensionUninstall, WebExtensionUninstallResult } from './webextension.js';
import './webextension.js';
export interface Command {
    id: JsUint;
}
export type CommandData = BrowserCommand | BrowsingContextCommand | EmulationCommand | InputCommand | NetworkCommand | ScriptCommand | SessionCommand | StorageCommand | WebExtensionCommand;
export interface EmptyParams {
}
export type Message = CommandResponse | ErrorResponse | Event;
export interface CommandResponse {
    type: "success";
    id: JsUint;
    result: ResultData;
}
export interface ErrorResponse {
    type: "error";
    id: JsUint | null;
    error: ErrorCode;
    message: string;
    stacktrace?: string;
}
export type ResultData = BrowserResult | BrowsingContextResult | EmulationResult | InputResult | NetworkResult | ScriptResult | SessionResult | StorageResult | WebExtensionResult;
export interface EmptyResult {
}
export interface Event {
    type: "event";
}
export type EventData = BrowsingContextEvent | InputEvent | LogEvent | NetworkEvent | ScriptEvent;
export interface Extensible {
}
export type JsInt = number;
export type JsUint = number;
export type ErrorCode = "invalid argument" | "invalid selector" | "invalid session id" | "invalid web extension" | "move target out of bounds" | "no such alert" | "no such network collector" | "no such element" | "no such frame" | "no such handle" | "no such history entry" | "no such intercept" | "no such network data" | "no such node" | "no such request" | "no such screencast" | "no such script" | "no such storage partition" | "no such user context" | "no such web extension" | "session not created" | "unable to capture screen" | "unable to close browser" | "unable to set cookie" | "unable to set file input" | "unavailable network data" | "underspecified storage partition" | "unknown command" | "unknown error" | "unsupported operation";
export type SessionCommand = SessionEnd | SessionNew | SessionStatus | SessionSubscribe | SessionUnsubscribe;
export type SessionResult = SessionEndResult | SessionNewResult | SessionStatusResult | SessionSubscribeResult | SessionUnsubscribeResult;
export type BrowserCommand = BrowserClose | BrowserCreateUserContext | BrowserGetClientWindows | BrowserGetUserContexts | BrowserRemoveUserContext | BrowserSetClientWindowState | BrowserSetDownloadBehavior;
export type BrowserResult = BrowserCloseResult | BrowserCreateUserContextResult | BrowserGetClientWindowsResult | BrowserGetUserContextsResult | BrowserRemoveUserContextResult | BrowserSetClientWindowStateResult | BrowserSetDownloadBehaviorResult;
export type BrowsingContextCommand = BrowsingContextActivate | BrowsingContextCaptureScreenshot | BrowsingContextClose | BrowsingContextCreate | BrowsingContextGetTree | BrowsingContextHandleUserPrompt | BrowsingContextLocateNodes | BrowsingContextNavigate | BrowsingContextPrint | BrowsingContextReload | BrowsingContextSetBypassCsp | BrowsingContextSetViewport | BrowsingContextStartScreencast | BrowsingContextStopScreencast | BrowsingContextTraverseHistory;
export type BrowsingContextResult = BrowsingContextActivateResult | BrowsingContextCaptureScreenshotResult | BrowsingContextCloseResult | BrowsingContextCreateResult | BrowsingContextGetTreeResult | BrowsingContextHandleUserPromptResult | BrowsingContextLocateNodesResult | BrowsingContextNavigateResult | BrowsingContextPrintResult | BrowsingContextReloadResult | BrowsingContextSetBypassCspResult | BrowsingContextSetViewportResult | BrowsingContextStartScreencastResult | BrowsingContextStopScreencastResult | BrowsingContextTraverseHistoryResult;
export type BrowsingContextEvent = BrowsingContextContextCreated | BrowsingContextContextDestroyed | BrowsingContextDomContentLoaded | BrowsingContextDownloadEnd | BrowsingContextDownloadWillBegin | BrowsingContextFragmentNavigated | BrowsingContextHistoryUpdated | BrowsingContextLoad | BrowsingContextNavigationAborted | BrowsingContextNavigationCommitted | BrowsingContextNavigationFailed | BrowsingContextNavigationStarted | BrowsingContextUserPromptClosed | BrowsingContextUserPromptOpened;
export type EmulationCommand = EmulationSetForcedColorsModeThemeOverride | EmulationSetGeolocationOverride | EmulationSetLocaleOverride | EmulationSetMediaFeaturesOverride | EmulationSetNetworkConditions | EmulationSetScreenOrientationOverride | EmulationSetScreenSettingsOverride | EmulationSetScriptingEnabled | EmulationSetScrollbarTypeOverride | EmulationSetTextLayoutModeOverride | EmulationSetTimezoneOverride | EmulationSetTouchOverride | EmulationSetUserAgentOverride | EmulationSetViewportMetaOverride;
export type EmulationResult = EmulationSetForcedColorsModeThemeOverrideResult | EmulationSetGeolocationOverrideResult | EmulationSetLocaleOverrideResult | EmulationSetMediaFeaturesOverrideResult | EmulationSetScreenOrientationOverrideResult | EmulationSetScriptingEnabledResult | EmulationSetScrollbarTypeOverrideResult | EmulationSetTextLayoutModeOverrideResult | EmulationSetTimezoneOverrideResult | EmulationSetTouchOverrideResult | EmulationSetUserAgentOverrideResult | EmulationSetViewportMetaOverrideResult;
export type NetworkCommand = NetworkAddDataCollector | NetworkAddIntercept | NetworkContinueRequest | NetworkContinueResponse | NetworkContinueWithAuth | NetworkDisownData | NetworkFailRequest | NetworkGetData | NetworkProvideResponse | NetworkRemoveDataCollector | NetworkRemoveIntercept | NetworkSetCacheBehavior | NetworkSetExtraHeaders;
export type NetworkResult = NetworkAddDataCollectorResult | NetworkAddInterceptResult | NetworkContinueRequestResult | NetworkContinueResponseResult | NetworkContinueWithAuthResult | NetworkDisownDataResult | NetworkFailRequestResult | NetworkGetDataResult | NetworkProvideResponseResult | NetworkRemoveDataCollectorResult | NetworkRemoveInterceptResult | NetworkSetCacheBehaviorResult | NetworkSetExtraHeadersResult;
export type NetworkEvent = NetworkAuthRequired | NetworkBeforeRequestSent | NetworkFetchError | NetworkResponseCompleted | NetworkResponseStarted;
export type ScriptCommand = ScriptAddPreloadScript | ScriptCallFunction | ScriptDisown | ScriptEvaluate | ScriptGetRealms | ScriptRemovePreloadScript;
export type ScriptResult = ScriptAddPreloadScriptResult | ScriptCallFunctionResult | ScriptDisownResult | ScriptEvaluateResult | ScriptGetRealmsResult | ScriptRemovePreloadScriptResult;
export type ScriptEvent = ScriptMessage | ScriptRealmCreated | ScriptRealmDestroyed;
export type StorageCommand = StorageDeleteCookies | StorageGetCookies | StorageSetCookie;
export type StorageResult = StorageDeleteCookiesResult | StorageGetCookiesResult | StorageSetCookieResult;
export type LogEvent = LogEntryAdded;
export type InputCommand = InputPerformActions | InputReleaseActions | InputSetFiles;
export type InputResult = InputPerformActionsResult | InputReleaseActionsResult | InputSetFilesResult;
export type InputEvent = InputFileDialogOpened;
export type WebExtensionCommand = WebExtensionInstall | WebExtensionUninstall;
export type WebExtensionResult = WebExtensionInstallResult | WebExtensionUninstallResult;
export type PermissionsCommand = PermissionsSetPermission;
export type SpeculationEvent = SpeculationPrefetchStatusUpdated;
export type UserAgentClientHintsCommand = UserAgentClientHintsSetClientHintsOverrideCommand;
export type BluetoothCommand = BluetoothHandleRequestDevicePrompt | BluetoothSimulateAdapter | BluetoothDisableSimulation | BluetoothSimulatePreconnectedPeripheral | BluetoothSimulateAdvertisement | BluetoothSimulateGattConnectionResponse | BluetoothSimulateGattDisconnection | BluetoothSimulateService | BluetoothSimulateCharacteristic | BluetoothSimulateCharacteristicResponse | BluetoothSimulateDescriptor | BluetoothSimulateDescriptorResponse;
export type DigitalCredentialsCommand = DigitalCredentialsSetVirtualWalletBehavior;
export type BluetoothEvent = BluetoothRequestDevicePromptUpdated | BluetoothGattConnectionAttempted | BluetoothCharacteristicEventGenerated | BluetoothDescriptorEventGenerated;
export declare const ErrorCode: Readonly<{
    readonly INVALID_ARGUMENT: "invalid argument";
    readonly INVALID_SELECTOR: "invalid selector";
    readonly INVALID_SESSION_ID: "invalid session id";
    readonly INVALID_WEB_EXTENSION: "invalid web extension";
    readonly MOVE_TARGET_OUT_OF_BOUNDS: "move target out of bounds";
    readonly NO_SUCH_ALERT: "no such alert";
    readonly NO_SUCH_NETWORK_COLLECTOR: "no such network collector";
    readonly NO_SUCH_ELEMENT: "no such element";
    readonly NO_SUCH_FRAME: "no such frame";
    readonly NO_SUCH_HANDLE: "no such handle";
    readonly NO_SUCH_HISTORY_ENTRY: "no such history entry";
    readonly NO_SUCH_INTERCEPT: "no such intercept";
    readonly NO_SUCH_NETWORK_DATA: "no such network data";
    readonly NO_SUCH_NODE: "no such node";
    readonly NO_SUCH_REQUEST: "no such request";
    readonly NO_SUCH_SCREENCAST: "no such screencast";
    readonly NO_SUCH_SCRIPT: "no such script";
    readonly NO_SUCH_STORAGE_PARTITION: "no such storage partition";
    readonly NO_SUCH_USER_CONTEXT: "no such user context";
    readonly NO_SUCH_WEB_EXTENSION: "no such web extension";
    readonly SESSION_NOT_CREATED: "session not created";
    readonly UNABLE_TO_CAPTURE_SCREEN: "unable to capture screen";
    readonly UNABLE_TO_CLOSE_BROWSER: "unable to close browser";
    readonly UNABLE_TO_SET_COOKIE: "unable to set cookie";
    readonly UNABLE_TO_SET_FILE_INPUT: "unable to set file input";
    readonly UNAVAILABLE_NETWORK_DATA: "unavailable network data";
    readonly UNDERSPECIFIED_STORAGE_PARTITION: "underspecified storage partition";
    readonly UNKNOWN_COMMAND: "unknown command";
    readonly UNKNOWN_ERROR: "unknown error";
    readonly UNSUPPORTED_OPERATION: "unsupported operation";
}>;
