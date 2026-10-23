import type { BrowserUserContext } from './browser.js';
import './browser.js';
import type { BrowsingContextBrowsingContext } from './browsing_context.js';
import './browsing_context.js';
import type { EmptyResult, JsInt, JsUint } from './common.js';
import './common.js';
import type { ScriptSharedReference } from './script.js';
import './script.js';
import { Domain, type EventDescriptor } from '../domain.js';
export interface InputElementOrigin {
    type: "element";
    element: ScriptSharedReference;
}
export interface InputPerformActions {
    method: "input.performActions";
    params: InputPerformActionsParameters;
}
export interface InputPerformActionsParameters {
    context: BrowsingContextBrowsingContext;
    actions: Array<InputSourceActions>;
}
export type InputSourceActions = InputNoneSourceActions | InputKeySourceActions | InputPointerSourceActions | InputWheelSourceActions;
export interface InputNoneSourceActions {
    type: "none";
    id: string;
    actions: Array<InputNoneSourceAction>;
}
export type InputNoneSourceAction = InputPauseAction;
export interface InputKeySourceActions {
    type: "key";
    id: string;
    actions: Array<InputKeySourceAction>;
}
export type InputKeySourceAction = InputPauseAction | InputKeyDownAction | InputKeyUpAction;
export interface InputPointerSourceActions {
    type: "pointer";
    id: string;
    parameters?: InputPointerParameters;
    actions: Array<InputPointerSourceAction>;
}
export type InputPointerType = "mouse" | "pen" | "touch";
export interface InputPointerParameters {
    pointerType?: InputPointerType;
}
export type InputPointerSourceAction = InputPauseAction | InputPointerDownAction | InputPointerUpAction | InputPointerMoveAction;
export interface InputWheelSourceActions {
    type: "wheel";
    id: string;
    actions: Array<InputWheelSourceAction>;
}
export type InputWheelSourceAction = InputPauseAction | InputWheelScrollAction;
export interface InputPauseAction {
    type: "pause";
    duration?: JsUint;
}
export interface InputKeyDownAction {
    type: "keyDown";
    value: string;
}
export interface InputKeyUpAction {
    type: "keyUp";
    value: string;
}
export interface InputPointerUpAction {
    type: "pointerUp";
    button: JsUint;
}
export interface InputPointerDownAction {
    type: "pointerDown";
    button: JsUint;
    width?: JsUint;
    height?: JsUint;
    pressure?: number;
    tangentialPressure?: number;
    twist?: number;
    altitudeAngle?: number;
    azimuthAngle?: number;
}
export interface InputPointerMoveAction {
    type: "pointerMove";
    x: number;
    y: number;
    duration?: JsUint;
    origin?: InputOrigin;
    width?: JsUint;
    height?: JsUint;
    pressure?: number;
    tangentialPressure?: number;
    twist?: number;
    altitudeAngle?: number;
    azimuthAngle?: number;
}
export interface InputWheelScrollAction {
    type: "scroll";
    x: JsInt;
    y: JsInt;
    deltaX: JsInt;
    deltaY: JsInt;
    duration?: JsUint;
    origin?: InputOrigin;
}
export interface InputPointerCommonProperties {
    width?: JsUint;
    height?: JsUint;
    pressure?: number;
    tangentialPressure?: number;
    twist?: number;
    altitudeAngle?: number;
    azimuthAngle?: number;
}
export type InputOrigin = "viewport" | "pointer" | InputElementOrigin;
export type InputPerformActionsResult = EmptyResult;
export interface InputReleaseActions {
    method: "input.releaseActions";
    params: InputReleaseActionsParameters;
}
export interface InputReleaseActionsParameters {
    context: BrowsingContextBrowsingContext;
}
export type InputReleaseActionsResult = EmptyResult;
export interface InputSetFiles {
    method: "input.setFiles";
    params: InputSetFilesParameters;
}
export interface InputSetFilesParameters {
    context: BrowsingContextBrowsingContext;
    element: ScriptSharedReference;
    files: Array<string>;
}
export type InputSetFilesResult = EmptyResult;
export interface InputFileDialogOpened {
    method: "input.fileDialogOpened";
    params: InputFileDialogInfo;
}
export interface InputFileDialogInfo {
    context: BrowsingContextBrowsingContext;
    userContext?: BrowserUserContext;
    element?: ScriptSharedReference;
    multiple: boolean;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Input extends Domain {
    /** @see https://w3c.github.io/webdriver-bidi/#event-input-fileDialogOpened */
    static readonly FILE_DIALOG_OPENED: EventDescriptor<InputFileDialogInfo>;
    static readonly PointerType: Readonly<{
        readonly MOUSE: "mouse";
        readonly PEN: "pen";
        readonly TOUCH: "touch";
    }>;
    static create(driver: unknown): Promise<Input>;
    /**
     * @param {InputPerformActionsParameters} params
     * @param {BrowsingContextBrowsingContext} params.context
     * @param {Array<InputSourceActions>} params.actions
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-input-performActions
     */
    performActions(params: InputPerformActionsParameters): Promise<void>;
    /**
     * @param {InputReleaseActionsParameters} params
     * @param {BrowsingContextBrowsingContext} params.context
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-input-releaseActions
     */
    releaseActions(params: InputReleaseActionsParameters): Promise<void>;
    /**
     * @param {InputSetFilesParameters} params
     * @param {BrowsingContextBrowsingContext} params.context
     * @param {ScriptSharedReference} params.element
     * @param {Array<string>} params.files
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-input-setFiles
     */
    setFiles(params: InputSetFilesParameters): Promise<void>;
}
