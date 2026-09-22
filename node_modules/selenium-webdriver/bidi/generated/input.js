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
exports.Input = void 0;
require("./browser.js");
require("./browsing_context.js");
require("./common.js");
require("./script.js");
const record_js_1 = require("../serialization/record.js");
const enum_js_1 = require("../serialization/enum.js");
const union_js_1 = require("../serialization/union.js");
const domain_js_1 = require("../domain.js");
const InputElementOrigin = (0, record_js_1.defineRecord)('input.ElementOrigin', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "element" } }, { "name": "element", "wire": "element", "required": true, "type": { "ref": "script.SharedReference" } }]);
const InputPerformActions = (0, record_js_1.defineRecord)('input.PerformActions', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "input.performActions" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "input.PerformActionsParameters" } }]);
const InputPerformActionsParameters = (0, record_js_1.defineRecord)('input.PerformActionsParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }, { "name": "actions", "wire": "actions", "required": true, "type": { "list": { "ref": "input.SourceActions" } } }]);
const InputSourceActionsUnion = (0, union_js_1.defineUnion)('input.SourceActions', { "by": "type", "variants": [{ "value": "none", "ref": "input.NoneSourceActions" }, { "value": "key", "ref": "input.KeySourceActions" }, { "value": "pointer", "ref": "input.PointerSourceActions" }, { "value": "wheel", "ref": "input.WheelSourceActions" }] }, { "objectOnly": true });
const InputNoneSourceActions = (0, record_js_1.defineRecord)('input.NoneSourceActions', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "none" } }, { "name": "id", "wire": "id", "required": true, "type": { "primitive": "string" } }, { "name": "actions", "wire": "actions", "required": true, "type": { "list": { "ref": "input.NoneSourceAction" } } }]);
(0, record_js_1.defineAlias)('input.NoneSourceAction', { "ref": "input.PauseAction" });
const InputKeySourceActions = (0, record_js_1.defineRecord)('input.KeySourceActions', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "key" } }, { "name": "id", "wire": "id", "required": true, "type": { "primitive": "string" } }, { "name": "actions", "wire": "actions", "required": true, "type": { "list": { "ref": "input.KeySourceAction" } } }]);
const InputKeySourceActionUnion = (0, union_js_1.defineUnion)('input.KeySourceAction', { "by": "type", "variants": [{ "value": "pause", "ref": "input.PauseAction" }, { "value": "keyDown", "ref": "input.KeyDownAction" }, { "value": "keyUp", "ref": "input.KeyUpAction" }] }, { "objectOnly": true });
const InputPointerSourceActions = (0, record_js_1.defineRecord)('input.PointerSourceActions', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "pointer" } }, { "name": "id", "wire": "id", "required": true, "type": { "primitive": "string" } }, { "name": "parameters", "wire": "parameters", "required": false, "type": { "ref": "input.PointerParameters" } }, { "name": "actions", "wire": "actions", "required": true, "type": { "list": { "ref": "input.PointerSourceAction" } } }]);
const InputPointerTypeEnum = (0, enum_js_1.defineEnum)('input.PointerType', ["mouse", "pen", "touch"]);
const InputPointerParameters = (0, record_js_1.defineRecord)('input.PointerParameters', [{ "name": "pointerType", "wire": "pointerType", "required": false, "type": { "ref": "input.PointerType" } }]);
const InputPointerSourceActionUnion = (0, union_js_1.defineUnion)('input.PointerSourceAction', { "by": "type", "variants": [{ "value": "pause", "ref": "input.PauseAction" }, { "value": "pointerDown", "ref": "input.PointerDownAction" }, { "value": "pointerUp", "ref": "input.PointerUpAction" }, { "value": "pointerMove", "ref": "input.PointerMoveAction" }] }, { "objectOnly": true });
const InputWheelSourceActions = (0, record_js_1.defineRecord)('input.WheelSourceActions', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "wheel" } }, { "name": "id", "wire": "id", "required": true, "type": { "primitive": "string" } }, { "name": "actions", "wire": "actions", "required": true, "type": { "list": { "ref": "input.WheelSourceAction" } } }]);
const InputWheelSourceActionUnion = (0, union_js_1.defineUnion)('input.WheelSourceAction', { "by": "type", "variants": [{ "value": "pause", "ref": "input.PauseAction" }, { "value": "scroll", "ref": "input.WheelScrollAction" }] }, { "objectOnly": true });
const InputPauseAction = (0, record_js_1.defineRecord)('input.PauseAction', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "pause" } }, { "name": "duration", "wire": "duration", "required": false, "type": { "ref": "js-uint" } }]);
const InputKeyDownAction = (0, record_js_1.defineRecord)('input.KeyDownAction', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "keyDown" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }]);
const InputKeyUpAction = (0, record_js_1.defineRecord)('input.KeyUpAction', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "keyUp" } }, { "name": "value", "wire": "value", "required": true, "type": { "primitive": "string" } }]);
const InputPointerUpAction = (0, record_js_1.defineRecord)('input.PointerUpAction', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "pointerUp" } }, { "name": "button", "wire": "button", "required": true, "type": { "ref": "js-uint" } }]);
const InputPointerDownAction = (0, record_js_1.defineRecord)('input.PointerDownAction', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "pointerDown" } }, { "name": "button", "wire": "button", "required": true, "type": { "ref": "js-uint" } }, { "name": "width", "wire": "width", "required": false, "type": { "ref": "js-uint" } }, { "name": "height", "wire": "height", "required": false, "type": { "ref": "js-uint" } }, { "name": "pressure", "wire": "pressure", "required": false, "type": { "primitive": "number" } }, { "name": "tangentialPressure", "wire": "tangentialPressure", "required": false, "type": { "primitive": "number" } }, { "name": "twist", "wire": "twist", "required": false, "type": { "primitive": "integer" } }, { "name": "altitudeAngle", "wire": "altitudeAngle", "required": false, "type": { "primitive": "number" } }, { "name": "azimuthAngle", "wire": "azimuthAngle", "required": false, "type": { "primitive": "number" } }]);
const InputPointerMoveAction = (0, record_js_1.defineRecord)('input.PointerMoveAction', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "pointerMove" } }, { "name": "x", "wire": "x", "required": true, "type": { "primitive": "number" } }, { "name": "y", "wire": "y", "required": true, "type": { "primitive": "number" } }, { "name": "duration", "wire": "duration", "required": false, "type": { "ref": "js-uint" } }, { "name": "origin", "wire": "origin", "required": false, "type": { "ref": "input.Origin" } }, { "name": "width", "wire": "width", "required": false, "type": { "ref": "js-uint" } }, { "name": "height", "wire": "height", "required": false, "type": { "ref": "js-uint" } }, { "name": "pressure", "wire": "pressure", "required": false, "type": { "primitive": "number" } }, { "name": "tangentialPressure", "wire": "tangentialPressure", "required": false, "type": { "primitive": "number" } }, { "name": "twist", "wire": "twist", "required": false, "type": { "primitive": "integer" } }, { "name": "altitudeAngle", "wire": "altitudeAngle", "required": false, "type": { "primitive": "number" } }, { "name": "azimuthAngle", "wire": "azimuthAngle", "required": false, "type": { "primitive": "number" } }]);
const InputWheelScrollAction = (0, record_js_1.defineRecord)('input.WheelScrollAction', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "scroll" } }, { "name": "x", "wire": "x", "required": true, "type": { "ref": "js-int" } }, { "name": "y", "wire": "y", "required": true, "type": { "ref": "js-int" } }, { "name": "deltaX", "wire": "deltaX", "required": true, "type": { "ref": "js-int" } }, { "name": "deltaY", "wire": "deltaY", "required": true, "type": { "ref": "js-int" } }, { "name": "duration", "wire": "duration", "required": false, "type": { "ref": "js-uint" } }, { "name": "origin", "wire": "origin", "required": false, "type": { "ref": "input.Origin" } }]);
const InputPointerCommonProperties = (0, record_js_1.defineRecord)('input.PointerCommonProperties', [{ "name": "width", "wire": "width", "required": false, "type": { "ref": "js-uint" } }, { "name": "height", "wire": "height", "required": false, "type": { "ref": "js-uint" } }, { "name": "pressure", "wire": "pressure", "required": false, "type": { "primitive": "number" } }, { "name": "tangentialPressure", "wire": "tangentialPressure", "required": false, "type": { "primitive": "number" } }, { "name": "twist", "wire": "twist", "required": false, "type": { "primitive": "integer" } }, { "name": "altitudeAngle", "wire": "altitudeAngle", "required": false, "type": { "primitive": "number" } }, { "name": "azimuthAngle", "wire": "azimuthAngle", "required": false, "type": { "primitive": "number" } }]);
(0, record_js_1.defineAlias)('input.Origin', { "union": [{ "const": "viewport" }, { "const": "pointer" }, { "ref": "input.ElementOrigin" }], "scalar": "string", "scalarValues": ["viewport", "pointer"] });
(0, record_js_1.defineAlias)('input.PerformActionsResult', { "ref": "EmptyResult" });
const InputReleaseActions = (0, record_js_1.defineRecord)('input.ReleaseActions', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "input.releaseActions" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "input.ReleaseActionsParameters" } }]);
const InputReleaseActionsParameters = (0, record_js_1.defineRecord)('input.ReleaseActionsParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }]);
(0, record_js_1.defineAlias)('input.ReleaseActionsResult', { "ref": "EmptyResult" });
const InputSetFiles = (0, record_js_1.defineRecord)('input.SetFiles', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "input.setFiles" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "input.SetFilesParameters" } }]);
const InputSetFilesParameters = (0, record_js_1.defineRecord)('input.SetFilesParameters', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }, { "name": "element", "wire": "element", "required": true, "type": { "ref": "script.SharedReference" } }, { "name": "files", "wire": "files", "required": true, "type": { "list": { "primitive": "string" } } }]);
(0, record_js_1.defineAlias)('input.SetFilesResult', { "ref": "EmptyResult" });
const InputFileDialogOpened = (0, record_js_1.defineRecord)('input.FileDialogOpened', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "input.fileDialogOpened" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "input.FileDialogInfo" } }]);
const InputFileDialogInfo = (0, record_js_1.defineRecord)('input.FileDialogInfo', [{ "name": "context", "wire": "context", "required": true, "type": { "ref": "browsingContext.BrowsingContext" } }, { "name": "userContext", "wire": "userContext", "required": false, "type": { "ref": "browser.UserContext" } }, { "name": "element", "wire": "element", "required": false, "type": { "ref": "script.SharedReference" } }, { "name": "multiple", "wire": "multiple", "required": true, "type": { "primitive": "boolean" } }]);
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class Input extends domain_js_1.Domain {
    static async create(driver) {
        return new Input(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
    /**
     * @param {InputPerformActionsParameters} params
     * @param {BrowsingContextBrowsingContext} params.context
     * @param {Array<InputSourceActions>} params.actions
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-input-performActions
     */
    async performActions(params) {
        const validatedParams = new InputPerformActionsParameters(params);
        await this.send('input.performActions', validatedParams);
    }
    /**
     * @param {InputReleaseActionsParameters} params
     * @param {BrowsingContextBrowsingContext} params.context
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-input-releaseActions
     */
    async releaseActions(params) {
        const validatedParams = new InputReleaseActionsParameters(params);
        await this.send('input.releaseActions', validatedParams);
    }
    /**
     * @param {InputSetFilesParameters} params
     * @param {BrowsingContextBrowsingContext} params.context
     * @param {ScriptSharedReference} params.element
     * @param {Array<string>} params.files
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-input-setFiles
     */
    async setFiles(params) {
        const validatedParams = new InputSetFilesParameters(params);
        await this.send('input.setFiles', validatedParams);
    }
}
exports.Input = Input;
/** @see https://w3c.github.io/webdriver-bidi/#event-input-fileDialogOpened */
Input.FILE_DIALOG_OPENED = (0, domain_js_1.event)('input.fileDialogOpened', InputFileDialogInfo);
Input.PointerType = Object.freeze({ MOUSE: "mouse", PEN: "pen", TOUCH: "touch" });
