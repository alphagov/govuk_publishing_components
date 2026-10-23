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
exports.Emulation = void 0;
require("./browser.js");
require("./browsing_context.js");
require("./common.js");
const record_js_1 = require("../serialization/record.js");
const enum_js_1 = require("../serialization/enum.js");
const union_js_1 = require("../serialization/union.js");
const domain_js_1 = require("../domain.js");
const EmulationSetForcedColorsModeThemeOverride = (0, record_js_1.defineRecord)('emulation.SetForcedColorsModeThemeOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setForcedColorsModeThemeOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetForcedColorsModeThemeOverrideParameters" } }]);
const EmulationSetForcedColorsModeThemeOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetForcedColorsModeThemeOverrideParameters', [{ "name": "theme", "wire": "theme", "required": true, "type": { "ref": "emulation.ForcedColorsModeTheme", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
const EmulationForcedColorsModeThemeEnum = (0, enum_js_1.defineEnum)('emulation.ForcedColorsModeTheme', ["light", "dark"]);
(0, record_js_1.defineAlias)('emulation.SetForcedColorsModeThemeOverrideResult', { "ref": "EmptyResult" });
const EmulationSetGeolocationOverride = (0, record_js_1.defineRecord)('emulation.SetGeolocationOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setGeolocationOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetGeolocationOverrideParameters" } }]);
const EmulationSetGeolocationOverrideParametersUnion = (0, union_js_1.defineUnion)('emulation.SetGeolocationOverrideParameters', { "ordered": [{ "ref": "emulation.SetGeolocationOverrideParameters_Coordinates", "requires": ["coordinates"] }, { "ref": "emulation.SetGeolocationOverrideParameters_Error", "requires": ["error"] }] }, { "objectOnly": true });
const EmulationGeolocationCoordinates = (0, record_js_1.defineRecord)('emulation.GeolocationCoordinates', [{ "name": "latitude", "wire": "latitude", "required": true, "type": { "primitive": "number" } }, { "name": "longitude", "wire": "longitude", "required": true, "type": { "primitive": "number" } }, { "name": "accuracy", "wire": "accuracy", "required": false, "type": { "primitive": "number" } }, { "name": "altitude", "wire": "altitude", "required": false, "type": { "primitive": "number", "nullable": true } }, { "name": "altitudeAccuracy", "wire": "altitudeAccuracy", "required": false, "type": { "primitive": "number", "nullable": true } }, { "name": "heading", "wire": "heading", "required": false, "type": { "primitive": "number", "nullable": true } }, { "name": "speed", "wire": "speed", "required": false, "type": { "primitive": "number", "nullable": true } }]);
const EmulationGeolocationPositionError = (0, record_js_1.defineRecord)('emulation.GeolocationPositionError', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "positionUnavailable" } }]);
(0, record_js_1.defineAlias)('emulation.SetGeolocationOverrideResult', { "ref": "EmptyResult" });
const EmulationSetLocaleOverride = (0, record_js_1.defineRecord)('emulation.SetLocaleOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setLocaleOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetLocaleOverrideParameters" } }]);
const EmulationSetLocaleOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetLocaleOverrideParameters', [{ "name": "locale", "wire": "locale", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetLocaleOverrideResult', { "ref": "EmptyResult" });
const EmulationSetMediaFeaturesOverride = (0, record_js_1.defineRecord)('emulation.SetMediaFeaturesOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setMediaFeaturesOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetMediaFeaturesOverrideParameters" } }]);
const EmulationSetMediaFeaturesOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetMediaFeaturesOverrideParameters', [{ "name": "features", "wire": "features", "required": true, "type": { "ref": "emulation.MediaFeatures", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
const EmulationMediaFeatures = (0, record_js_1.defineRecord)('emulation.MediaFeatures', [{ "name": "anyHover", "wire": "any-hover", "required": false, "type": { "ref": "emulation.MediaFeaturesAnyHover", "nullable": true } }, { "name": "anyPointer", "wire": "any-pointer", "required": false, "type": { "ref": "emulation.MediaFeaturesAnyPointer", "nullable": true } }, { "name": "color", "wire": "color", "required": false, "type": { "ref": "js-uint", "nullable": true } }, { "name": "colorGamut", "wire": "color-gamut", "required": false, "type": { "ref": "emulation.MediaFeaturesColorGamut", "nullable": true } }, { "name": "colorIndex", "wire": "color-index", "required": false, "type": { "ref": "js-uint", "nullable": true } }, { "name": "displayMode", "wire": "display-mode", "required": false, "type": { "ref": "emulation.MediaFeaturesDisplayMode", "nullable": true } }, { "name": "dynamicRange", "wire": "dynamic-range", "required": false, "type": { "ref": "emulation.MediaFeaturesDynamicRange", "nullable": true } }, { "name": "environmentBlending", "wire": "environment-blending", "required": false, "type": { "ref": "emulation.MediaFeaturesEnvironmentBlending", "nullable": true } }, { "name": "forcedColors", "wire": "forced-colors", "required": false, "type": { "ref": "emulation.MediaFeaturesForcedColors", "nullable": true } }, { "name": "grid", "wire": "grid", "required": false, "type": { "ref": "emulation.MediaFeaturesGrid", "nullable": true } }, { "name": "horizontalViewportSegments", "wire": "horizontal-viewport-segments", "required": false, "type": { "ref": "js-uint", "nullable": true } }, { "name": "hover", "wire": "hover", "required": false, "type": { "ref": "emulation.MediaFeaturesHover", "nullable": true } }, { "name": "invertedColors", "wire": "inverted-colors", "required": false, "type": { "ref": "emulation.MediaFeaturesInvertedColors", "nullable": true } }, { "name": "monochrome", "wire": "monochrome", "required": false, "type": { "ref": "js-uint", "nullable": true } }, { "name": "navControls", "wire": "nav-controls", "required": false, "type": { "ref": "emulation.MediaFeaturesNavControls", "nullable": true } }, { "name": "overflowBlock", "wire": "overflow-block", "required": false, "type": { "ref": "emulation.MediaFeaturesOverflowBlock", "nullable": true } }, { "name": "overflowInline", "wire": "overflow-inline", "required": false, "type": { "ref": "emulation.MediaFeaturesOverflowInline", "nullable": true } }, { "name": "pointer", "wire": "pointer", "required": false, "type": { "ref": "emulation.MediaFeaturesPointer", "nullable": true } }, { "name": "prefersColorScheme", "wire": "prefers-color-scheme", "required": false, "type": { "ref": "emulation.MediaFeaturesPrefersColorScheme", "nullable": true } }, { "name": "prefersContrast", "wire": "prefers-contrast", "required": false, "type": { "ref": "emulation.MediaFeaturesPrefersContrast", "nullable": true } }, { "name": "prefersReducedData", "wire": "prefers-reduced-data", "required": false, "type": { "ref": "emulation.MediaFeaturesPrefersReducedData", "nullable": true } }, { "name": "prefersReducedMotion", "wire": "prefers-reduced-motion", "required": false, "type": { "ref": "emulation.MediaFeaturesPrefersReducedMotion", "nullable": true } }, { "name": "prefersReducedTransparency", "wire": "prefers-reduced-transparency", "required": false, "type": { "ref": "emulation.MediaFeaturesPrefersReducedTransparency", "nullable": true } }, { "name": "scan", "wire": "scan", "required": false, "type": { "ref": "emulation.MediaFeaturesScan", "nullable": true } }, { "name": "scripting", "wire": "scripting", "required": false, "type": { "ref": "emulation.MediaFeaturesScripting", "nullable": true } }, { "name": "update", "wire": "update", "required": false, "type": { "ref": "emulation.MediaFeaturesUpdate", "nullable": true } }, { "name": "verticalViewportSegments", "wire": "vertical-viewport-segments", "required": false, "type": { "ref": "js-uint", "nullable": true } }, { "name": "videoColorGamut", "wire": "video-color-gamut", "required": false, "type": { "ref": "emulation.MediaFeaturesVideoColorGamut", "nullable": true } }, { "name": "videoDynamicRange", "wire": "video-dynamic-range", "required": false, "type": { "ref": "emulation.MediaFeaturesVideoDynamicRange", "nullable": true } }]);
(0, record_js_1.defineAlias)('emulation.SetMediaFeaturesOverrideResult', { "ref": "EmptyResult" });
const EmulationSetNetworkConditions = (0, record_js_1.defineRecord)('emulation.SetNetworkConditions', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setNetworkConditions" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetNetworkConditionsParameters" } }]);
const EmulationSetNetworkConditionsParameters = (0, record_js_1.defineRecord)('emulation.SetNetworkConditionsParameters', [{ "name": "networkConditions", "wire": "networkConditions", "required": true, "type": { "ref": "emulation.NetworkConditions", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.NetworkConditions', { "ref": "emulation.NetworkConditionsOffline" });
const EmulationNetworkConditionsOffline = (0, record_js_1.defineRecord)('emulation.NetworkConditionsOffline', [{ "name": "type", "wire": "type", "required": true, "type": { "const": "offline" } }]);
(0, record_js_1.defineAlias)('emulation.SetNetworkConditionsResult', { "ref": "EmptyResult" });
const EmulationSetScreenSettingsOverride = (0, record_js_1.defineRecord)('emulation.SetScreenSettingsOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setScreenSettingsOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetScreenSettingsOverrideParameters" } }]);
const EmulationScreenArea = (0, record_js_1.defineRecord)('emulation.ScreenArea', [{ "name": "width", "wire": "width", "required": true, "type": { "ref": "js-uint" } }, { "name": "height", "wire": "height", "required": true, "type": { "ref": "js-uint" } }]);
const EmulationSetScreenSettingsOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetScreenSettingsOverrideParameters', [{ "name": "screenArea", "wire": "screenArea", "required": true, "type": { "ref": "emulation.ScreenArea", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetScreenSettingsOverrideResult', { "ref": "EmptyResult" });
const EmulationSetScreenOrientationOverride = (0, record_js_1.defineRecord)('emulation.SetScreenOrientationOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setScreenOrientationOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetScreenOrientationOverrideParameters" } }]);
const EmulationScreenOrientationNaturalEnum = (0, enum_js_1.defineEnum)('emulation.ScreenOrientationNatural', ["portrait", "landscape"]);
const EmulationScreenOrientationTypeEnum = (0, enum_js_1.defineEnum)('emulation.ScreenOrientationType', ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"]);
const EmulationScreenOrientation = (0, record_js_1.defineRecord)('emulation.ScreenOrientation', [{ "name": "natural", "wire": "natural", "required": true, "type": { "ref": "emulation.ScreenOrientationNatural" } }, { "name": "type", "wire": "type", "required": true, "type": { "ref": "emulation.ScreenOrientationType" } }]);
const EmulationSetScreenOrientationOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetScreenOrientationOverrideParameters', [{ "name": "screenOrientation", "wire": "screenOrientation", "required": true, "type": { "ref": "emulation.ScreenOrientation", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetScreenOrientationOverrideResult', { "ref": "EmptyResult" });
const EmulationSetUserAgentOverride = (0, record_js_1.defineRecord)('emulation.SetUserAgentOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setUserAgentOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetUserAgentOverrideParameters" } }]);
const EmulationSetUserAgentOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetUserAgentOverrideParameters', [{ "name": "userAgent", "wire": "userAgent", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetUserAgentOverrideResult', { "ref": "EmptyResult" });
const EmulationSetViewportMetaOverride = (0, record_js_1.defineRecord)('emulation.SetViewportMetaOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setViewportMetaOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetViewportMetaOverrideParameters" } }]);
const EmulationSetViewportMetaOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetViewportMetaOverrideParameters', [{ "name": "viewportMeta", "wire": "viewportMeta", "required": true, "type": { "const": true, "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetViewportMetaOverrideResult', { "ref": "EmptyResult" });
const EmulationSetScriptingEnabled = (0, record_js_1.defineRecord)('emulation.SetScriptingEnabled', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setScriptingEnabled" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetScriptingEnabledParameters" } }]);
const EmulationSetScriptingEnabledParameters = (0, record_js_1.defineRecord)('emulation.SetScriptingEnabledParameters', [{ "name": "enabled", "wire": "enabled", "required": true, "type": { "const": false, "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetScriptingEnabledResult', { "ref": "EmptyResult" });
const EmulationSetScrollbarTypeOverride = (0, record_js_1.defineRecord)('emulation.SetScrollbarTypeOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setScrollbarTypeOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetScrollbarTypeOverrideParameters" } }]);
const EmulationSetScrollbarTypeOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetScrollbarTypeOverrideParameters', [{ "name": "scrollbarType", "wire": "scrollbarType", "required": true, "type": { "ref": "emulation.SetScrollbarTypeOverrideParametersScrollbarType", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetScrollbarTypeOverrideResult', { "ref": "EmptyResult" });
const EmulationSetTextLayoutModeOverride = (0, record_js_1.defineRecord)('emulation.SetTextLayoutModeOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setTextLayoutModeOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetTextLayoutModeOverrideParameters" } }]);
const EmulationSetTextLayoutModeOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetTextLayoutModeOverrideParameters', [{ "name": "textLayoutMode", "wire": "textLayoutMode", "required": true, "type": { "ref": "emulation.TextLayoutMode", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
const EmulationTextLayoutModeEnum = (0, enum_js_1.defineEnum)('emulation.TextLayoutMode', ["mobile"]);
(0, record_js_1.defineAlias)('emulation.SetTextLayoutModeOverrideResult', { "ref": "EmptyResult" });
const EmulationSetTimezoneOverride = (0, record_js_1.defineRecord)('emulation.SetTimezoneOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setTimezoneOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetTimezoneOverrideParameters" } }]);
const EmulationSetTimezoneOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetTimezoneOverrideParameters', [{ "name": "timezone", "wire": "timezone", "required": true, "type": { "primitive": "string", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetTimezoneOverrideResult', { "ref": "EmptyResult" });
const EmulationSetTouchOverride = (0, record_js_1.defineRecord)('emulation.SetTouchOverride', [{ "name": "method", "wire": "method", "required": true, "type": { "const": "emulation.setTouchOverride" } }, { "name": "params", "wire": "params", "required": true, "type": { "ref": "emulation.SetTouchOverrideParameters" } }]);
const EmulationSetTouchOverrideParameters = (0, record_js_1.defineRecord)('emulation.SetTouchOverrideParameters', [{ "name": "maxTouchPoints", "wire": "maxTouchPoints", "required": true, "type": { "ref": "js-uint", "nullable": true } }, { "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }]);
(0, record_js_1.defineAlias)('emulation.SetTouchOverrideResult', { "ref": "EmptyResult" });
const EmulationMediaFeaturesAnyHoverEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesAnyHover', ["none", "hover"]);
const EmulationMediaFeaturesAnyPointerEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesAnyPointer', ["none", "coarse", "fine"]);
const EmulationMediaFeaturesColorGamutEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesColorGamut', ["srgb", "p3", "rec2020"]);
const EmulationMediaFeaturesDisplayModeEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesDisplayMode', ["fullscreen", "standalone", "minimal-ui", "browser", "picture-in-picture"]);
const EmulationMediaFeaturesDynamicRangeEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesDynamicRange', ["standard", "high"]);
const EmulationMediaFeaturesEnvironmentBlendingEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesEnvironmentBlending', ["opaque", "additive", "subtractive"]);
const EmulationMediaFeaturesForcedColorsEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesForcedColors', ["none", "active"]);
const EmulationMediaFeaturesGridEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesGrid', [0, 1]);
const EmulationMediaFeaturesHoverEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesHover', ["none", "hover"]);
const EmulationMediaFeaturesInvertedColorsEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesInvertedColors', ["none", "inverted"]);
const EmulationMediaFeaturesNavControlsEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesNavControls', ["none", "back"]);
const EmulationMediaFeaturesOverflowBlockEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesOverflowBlock', ["none", "scroll", "optional-paged", "paged"]);
const EmulationMediaFeaturesOverflowInlineEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesOverflowInline', ["none", "scroll"]);
const EmulationMediaFeaturesPointerEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesPointer', ["none", "coarse", "fine"]);
const EmulationMediaFeaturesPrefersColorSchemeEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesPrefersColorScheme', ["light", "dark"]);
const EmulationMediaFeaturesPrefersContrastEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesPrefersContrast', ["no-preference", "more", "less", "custom"]);
const EmulationMediaFeaturesPrefersReducedDataEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesPrefersReducedData', ["no-preference", "reduce"]);
const EmulationMediaFeaturesPrefersReducedMotionEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesPrefersReducedMotion', ["no-preference", "reduce"]);
const EmulationMediaFeaturesPrefersReducedTransparencyEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesPrefersReducedTransparency', ["no-preference", "reduce"]);
const EmulationMediaFeaturesScanEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesScan', ["interlace", "progressive"]);
const EmulationMediaFeaturesScriptingEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesScripting', ["none", "initial-only", "enabled"]);
const EmulationMediaFeaturesUpdateEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesUpdate', ["none", "slow", "fast"]);
const EmulationMediaFeaturesVideoColorGamutEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesVideoColorGamut', ["srgb", "p3", "rec2020"]);
const EmulationMediaFeaturesVideoDynamicRangeEnum = (0, enum_js_1.defineEnum)('emulation.MediaFeaturesVideoDynamicRange', ["standard", "high"]);
const EmulationSetScrollbarTypeOverrideParametersScrollbarTypeEnum = (0, enum_js_1.defineEnum)('emulation.SetScrollbarTypeOverrideParametersScrollbarType', ["classic", "overlay"]);
const EmulationSetGeolocationOverrideParameters_Coordinates = (0, record_js_1.defineRecord)('emulation.SetGeolocationOverrideParameters_Coordinates', [{ "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }, { "name": "coordinates", "wire": "coordinates", "required": true, "type": { "ref": "emulation.GeolocationCoordinates", "nullable": true } }]);
const EmulationSetGeolocationOverrideParameters_Error = (0, record_js_1.defineRecord)('emulation.SetGeolocationOverrideParameters_Error', [{ "name": "contexts", "wire": "contexts", "required": false, "type": { "list": { "ref": "browsingContext.BrowsingContext" } } }, { "name": "userContexts", "wire": "userContexts", "required": false, "type": { "list": { "ref": "browser.UserContext" } } }, { "name": "error", "wire": "error", "required": true, "type": { "ref": "emulation.GeolocationPositionError" } }]);
// --- Implementation ---
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
class Emulation extends domain_js_1.Domain {
    static async create(driver) {
        return new Emulation(await domain_js_1.Domain.connect(driver), domain_js_1.DOMAIN_TOKEN);
    }
    /**
     * @param {EmulationSetForcedColorsModeThemeOverrideParameters} params
     * @param {EmulationForcedColorsModeTheme | null} params.theme
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setForcedColorsModeThemeOverride
     */
    async setForcedColorsModeThemeOverride(params) {
        const validatedParams = new EmulationSetForcedColorsModeThemeOverrideParameters(params);
        await this.send('emulation.setForcedColorsModeThemeOverride', validatedParams);
    }
    /**
     * @param {EmulationSetGeolocationOverrideParameters} params
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setGeolocationOverride
     */
    async setGeolocationOverride(params) {
        const validatedParams = EmulationSetGeolocationOverrideParametersUnion.build(params);
        await this.send('emulation.setGeolocationOverride', validatedParams);
    }
    /**
     * @param {EmulationSetLocaleOverrideParameters} params
     * @param {string | null} params.locale
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setLocaleOverride
     */
    async setLocaleOverride(params) {
        const validatedParams = new EmulationSetLocaleOverrideParameters(params);
        await this.send('emulation.setLocaleOverride', validatedParams);
    }
    /**
     * @param {EmulationSetMediaFeaturesOverrideParameters} params
     * @param {EmulationMediaFeatures | null} params.features
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setMediaFeaturesOverride
     */
    async setMediaFeaturesOverride(params) {
        const validatedParams = new EmulationSetMediaFeaturesOverrideParameters(params);
        await this.send('emulation.setMediaFeaturesOverride', validatedParams);
    }
    /**
     * @param {EmulationSetNetworkConditionsParameters} params
     * @param {EmulationNetworkConditions | null} params.networkConditions
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setNetworkConditions
     */
    async setNetworkConditions(params) {
        const validatedParams = new EmulationSetNetworkConditionsParameters(params);
        await this.send('emulation.setNetworkConditions', validatedParams);
    }
    /**
     * @param {EmulationSetScreenOrientationOverrideParameters} params
     * @param {EmulationScreenOrientation | null} params.screenOrientation
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScreenOrientationOverride
     */
    async setScreenOrientationOverride(params) {
        const validatedParams = new EmulationSetScreenOrientationOverrideParameters(params);
        await this.send('emulation.setScreenOrientationOverride', validatedParams);
    }
    /**
     * @param {EmulationSetScreenSettingsOverrideParameters} params
     * @param {EmulationScreenArea | null} params.screenArea
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScreenSettingsOverride
     */
    async setScreenSettingsOverride(params) {
        const validatedParams = new EmulationSetScreenSettingsOverrideParameters(params);
        await this.send('emulation.setScreenSettingsOverride', validatedParams);
    }
    /**
     * @param {EmulationSetScriptingEnabledParameters} params
     * @param {false | null} params.enabled
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScriptingEnabled
     */
    async setScriptingEnabled(params) {
        const validatedParams = new EmulationSetScriptingEnabledParameters(params);
        await this.send('emulation.setScriptingEnabled', validatedParams);
    }
    /**
     * @param {EmulationSetScrollbarTypeOverrideParameters} params
     * @param {EmulationSetScrollbarTypeOverrideParametersScrollbarType | null} params.scrollbarType
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScrollbarTypeOverride
     */
    async setScrollbarTypeOverride(params) {
        const validatedParams = new EmulationSetScrollbarTypeOverrideParameters(params);
        await this.send('emulation.setScrollbarTypeOverride', validatedParams);
    }
    /**
     * @param {EmulationSetTextLayoutModeOverrideParameters} params
     * @param {EmulationTextLayoutMode | null} params.textLayoutMode
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setTextLayoutModeOverride
     */
    async setTextLayoutModeOverride(params) {
        const validatedParams = new EmulationSetTextLayoutModeOverrideParameters(params);
        await this.send('emulation.setTextLayoutModeOverride', validatedParams);
    }
    /**
     * @param {EmulationSetTimezoneOverrideParameters} params
     * @param {string | null} params.timezone
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setTimezoneOverride
     */
    async setTimezoneOverride(params) {
        const validatedParams = new EmulationSetTimezoneOverrideParameters(params);
        await this.send('emulation.setTimezoneOverride', validatedParams);
    }
    /**
     * @param {EmulationSetTouchOverrideParameters} params
     * @param {JsUint | null} params.maxTouchPoints
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setTouchOverride
     */
    async setTouchOverride(params) {
        const validatedParams = new EmulationSetTouchOverrideParameters(params);
        await this.send('emulation.setTouchOverride', validatedParams);
    }
    /**
     * @param {EmulationSetUserAgentOverrideParameters} params
     * @param {string | null} params.userAgent
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setUserAgentOverride
     */
    async setUserAgentOverride(params) {
        const validatedParams = new EmulationSetUserAgentOverrideParameters(params);
        await this.send('emulation.setUserAgentOverride', validatedParams);
    }
    /**
     * @param {EmulationSetViewportMetaOverrideParameters} params
     * @param {true | null} params.viewportMeta
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setViewportMetaOverride
     */
    async setViewportMetaOverride(params) {
        const validatedParams = new EmulationSetViewportMetaOverrideParameters(params);
        await this.send('emulation.setViewportMetaOverride', validatedParams);
    }
}
exports.Emulation = Emulation;
Emulation.ForcedColorsModeTheme = Object.freeze({ LIGHT: "light", DARK: "dark" });
Emulation.ScreenOrientationNatural = Object.freeze({ PORTRAIT: "portrait", LANDSCAPE: "landscape" });
Emulation.ScreenOrientationType = Object.freeze({ PORTRAIT_PRIMARY: "portrait-primary", PORTRAIT_SECONDARY: "portrait-secondary", LANDSCAPE_PRIMARY: "landscape-primary", LANDSCAPE_SECONDARY: "landscape-secondary" });
Emulation.TextLayoutMode = Object.freeze({ MOBILE: "mobile" });
Emulation.MediaFeaturesAnyHover = Object.freeze({ NONE: "none", HOVER: "hover" });
Emulation.MediaFeaturesAnyPointer = Object.freeze({ NONE: "none", COARSE: "coarse", FINE: "fine" });
Emulation.MediaFeaturesColorGamut = Object.freeze({ SRGB: "srgb", P3: "p3", REC2020: "rec2020" });
Emulation.MediaFeaturesDisplayMode = Object.freeze({ FULLSCREEN: "fullscreen", STANDALONE: "standalone", MINIMAL_UI: "minimal-ui", BROWSER: "browser", PICTURE_IN_PICTURE: "picture-in-picture" });
Emulation.MediaFeaturesDynamicRange = Object.freeze({ STANDARD: "standard", HIGH: "high" });
Emulation.MediaFeaturesEnvironmentBlending = Object.freeze({ OPAQUE: "opaque", ADDITIVE: "additive", SUBTRACTIVE: "subtractive" });
Emulation.MediaFeaturesForcedColors = Object.freeze({ NONE: "none", ACTIVE: "active" });
Emulation.MediaFeaturesGrid = Object.freeze({ _0: 0, _1: 1 });
Emulation.MediaFeaturesHover = Object.freeze({ NONE: "none", HOVER: "hover" });
Emulation.MediaFeaturesInvertedColors = Object.freeze({ NONE: "none", INVERTED: "inverted" });
Emulation.MediaFeaturesNavControls = Object.freeze({ NONE: "none", BACK: "back" });
Emulation.MediaFeaturesOverflowBlock = Object.freeze({ NONE: "none", SCROLL: "scroll", OPTIONAL_PAGED: "optional-paged", PAGED: "paged" });
Emulation.MediaFeaturesOverflowInline = Object.freeze({ NONE: "none", SCROLL: "scroll" });
Emulation.MediaFeaturesPointer = Object.freeze({ NONE: "none", COARSE: "coarse", FINE: "fine" });
Emulation.MediaFeaturesPrefersColorScheme = Object.freeze({ LIGHT: "light", DARK: "dark" });
Emulation.MediaFeaturesPrefersContrast = Object.freeze({ NO_PREFERENCE: "no-preference", MORE: "more", LESS: "less", CUSTOM: "custom" });
Emulation.MediaFeaturesPrefersReducedData = Object.freeze({ NO_PREFERENCE: "no-preference", REDUCE: "reduce" });
Emulation.MediaFeaturesPrefersReducedMotion = Object.freeze({ NO_PREFERENCE: "no-preference", REDUCE: "reduce" });
Emulation.MediaFeaturesPrefersReducedTransparency = Object.freeze({ NO_PREFERENCE: "no-preference", REDUCE: "reduce" });
Emulation.MediaFeaturesScan = Object.freeze({ INTERLACE: "interlace", PROGRESSIVE: "progressive" });
Emulation.MediaFeaturesScripting = Object.freeze({ NONE: "none", INITIAL_ONLY: "initial-only", ENABLED: "enabled" });
Emulation.MediaFeaturesUpdate = Object.freeze({ NONE: "none", SLOW: "slow", FAST: "fast" });
Emulation.MediaFeaturesVideoColorGamut = Object.freeze({ SRGB: "srgb", P3: "p3", REC2020: "rec2020" });
Emulation.MediaFeaturesVideoDynamicRange = Object.freeze({ STANDARD: "standard", HIGH: "high" });
Emulation.SetScrollbarTypeOverrideParametersScrollbarType = Object.freeze({ CLASSIC: "classic", OVERLAY: "overlay" });
