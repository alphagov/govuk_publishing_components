import type { BrowserUserContext } from './browser.js';
import './browser.js';
import type { BrowsingContextBrowsingContext } from './browsing_context.js';
import './browsing_context.js';
import type { EmptyResult, JsUint } from './common.js';
import './common.js';
import { Domain } from '../domain.js';
export interface EmulationSetForcedColorsModeThemeOverride {
    method: "emulation.setForcedColorsModeThemeOverride";
    params: EmulationSetForcedColorsModeThemeOverrideParameters;
}
export interface EmulationSetForcedColorsModeThemeOverrideParameters {
    theme: EmulationForcedColorsModeTheme | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationForcedColorsModeTheme = "light" | "dark";
export type EmulationSetForcedColorsModeThemeOverrideResult = EmptyResult;
export interface EmulationSetGeolocationOverride {
    method: "emulation.setGeolocationOverride";
    params: EmulationSetGeolocationOverrideParameters;
}
export type EmulationSetGeolocationOverrideParameters = EmulationSetGeolocationOverrideParameters_Coordinates | EmulationSetGeolocationOverrideParameters_Error;
export interface EmulationGeolocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
}
export interface EmulationGeolocationPositionError {
    type: "positionUnavailable";
}
export type EmulationSetGeolocationOverrideResult = EmptyResult;
export interface EmulationSetLocaleOverride {
    method: "emulation.setLocaleOverride";
    params: EmulationSetLocaleOverrideParameters;
}
export interface EmulationSetLocaleOverrideParameters {
    locale: string | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetLocaleOverrideResult = EmptyResult;
export interface EmulationSetMediaFeaturesOverride {
    method: "emulation.setMediaFeaturesOverride";
    params: EmulationSetMediaFeaturesOverrideParameters;
}
export interface EmulationSetMediaFeaturesOverrideParameters {
    features: EmulationMediaFeatures | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export interface EmulationMediaFeatures {
    anyHover?: EmulationMediaFeaturesAnyHover | null;
    anyPointer?: EmulationMediaFeaturesAnyPointer | null;
    color?: JsUint | null;
    colorGamut?: EmulationMediaFeaturesColorGamut | null;
    colorIndex?: JsUint | null;
    displayMode?: EmulationMediaFeaturesDisplayMode | null;
    dynamicRange?: EmulationMediaFeaturesDynamicRange | null;
    environmentBlending?: EmulationMediaFeaturesEnvironmentBlending | null;
    forcedColors?: EmulationMediaFeaturesForcedColors | null;
    grid?: EmulationMediaFeaturesGrid | null;
    horizontalViewportSegments?: JsUint | null;
    hover?: EmulationMediaFeaturesHover | null;
    invertedColors?: EmulationMediaFeaturesInvertedColors | null;
    monochrome?: JsUint | null;
    navControls?: EmulationMediaFeaturesNavControls | null;
    overflowBlock?: EmulationMediaFeaturesOverflowBlock | null;
    overflowInline?: EmulationMediaFeaturesOverflowInline | null;
    pointer?: EmulationMediaFeaturesPointer | null;
    prefersColorScheme?: EmulationMediaFeaturesPrefersColorScheme | null;
    prefersContrast?: EmulationMediaFeaturesPrefersContrast | null;
    prefersReducedData?: EmulationMediaFeaturesPrefersReducedData | null;
    prefersReducedMotion?: EmulationMediaFeaturesPrefersReducedMotion | null;
    prefersReducedTransparency?: EmulationMediaFeaturesPrefersReducedTransparency | null;
    scan?: EmulationMediaFeaturesScan | null;
    scripting?: EmulationMediaFeaturesScripting | null;
    update?: EmulationMediaFeaturesUpdate | null;
    verticalViewportSegments?: JsUint | null;
    videoColorGamut?: EmulationMediaFeaturesVideoColorGamut | null;
    videoDynamicRange?: EmulationMediaFeaturesVideoDynamicRange | null;
}
export type EmulationSetMediaFeaturesOverrideResult = EmptyResult;
export interface EmulationSetNetworkConditions {
    method: "emulation.setNetworkConditions";
    params: EmulationSetNetworkConditionsParameters;
}
export interface EmulationSetNetworkConditionsParameters {
    networkConditions: EmulationNetworkConditions | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationNetworkConditions = EmulationNetworkConditionsOffline;
export interface EmulationNetworkConditionsOffline {
    type: "offline";
}
export type EmulationSetNetworkConditionsResult = EmptyResult;
export interface EmulationSetScreenSettingsOverride {
    method: "emulation.setScreenSettingsOverride";
    params: EmulationSetScreenSettingsOverrideParameters;
}
export interface EmulationScreenArea {
    width: JsUint;
    height: JsUint;
}
export interface EmulationSetScreenSettingsOverrideParameters {
    screenArea: EmulationScreenArea | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetScreenSettingsOverrideResult = EmptyResult;
export interface EmulationSetScreenOrientationOverride {
    method: "emulation.setScreenOrientationOverride";
    params: EmulationSetScreenOrientationOverrideParameters;
}
export type EmulationScreenOrientationNatural = "portrait" | "landscape";
export type EmulationScreenOrientationType = "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary";
export interface EmulationScreenOrientation {
    natural: EmulationScreenOrientationNatural;
    type: EmulationScreenOrientationType;
}
export interface EmulationSetScreenOrientationOverrideParameters {
    screenOrientation: EmulationScreenOrientation | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetScreenOrientationOverrideResult = EmptyResult;
export interface EmulationSetUserAgentOverride {
    method: "emulation.setUserAgentOverride";
    params: EmulationSetUserAgentOverrideParameters;
}
export interface EmulationSetUserAgentOverrideParameters {
    userAgent: string | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetUserAgentOverrideResult = EmptyResult;
export interface EmulationSetViewportMetaOverride {
    method: "emulation.setViewportMetaOverride";
    params: EmulationSetViewportMetaOverrideParameters;
}
export interface EmulationSetViewportMetaOverrideParameters {
    viewportMeta: true | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetViewportMetaOverrideResult = EmptyResult;
export interface EmulationSetScriptingEnabled {
    method: "emulation.setScriptingEnabled";
    params: EmulationSetScriptingEnabledParameters;
}
export interface EmulationSetScriptingEnabledParameters {
    enabled: false | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetScriptingEnabledResult = EmptyResult;
export interface EmulationSetScrollbarTypeOverride {
    method: "emulation.setScrollbarTypeOverride";
    params: EmulationSetScrollbarTypeOverrideParameters;
}
export interface EmulationSetScrollbarTypeOverrideParameters {
    scrollbarType: EmulationSetScrollbarTypeOverrideParametersScrollbarType | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetScrollbarTypeOverrideResult = EmptyResult;
export interface EmulationSetTextLayoutModeOverride {
    method: "emulation.setTextLayoutModeOverride";
    params: EmulationSetTextLayoutModeOverrideParameters;
}
export interface EmulationSetTextLayoutModeOverrideParameters {
    textLayoutMode: EmulationTextLayoutMode | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationTextLayoutMode = "mobile";
export type EmulationSetTextLayoutModeOverrideResult = EmptyResult;
export interface EmulationSetTimezoneOverride {
    method: "emulation.setTimezoneOverride";
    params: EmulationSetTimezoneOverrideParameters;
}
export interface EmulationSetTimezoneOverrideParameters {
    timezone: string | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetTimezoneOverrideResult = EmptyResult;
export interface EmulationSetTouchOverride {
    method: "emulation.setTouchOverride";
    params: EmulationSetTouchOverrideParameters;
}
export interface EmulationSetTouchOverrideParameters {
    maxTouchPoints: JsUint | null;
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
}
export type EmulationSetTouchOverrideResult = EmptyResult;
export type EmulationMediaFeaturesAnyHover = "none" | "hover";
export type EmulationMediaFeaturesAnyPointer = "none" | "coarse" | "fine";
export type EmulationMediaFeaturesColorGamut = "srgb" | "p3" | "rec2020";
export type EmulationMediaFeaturesDisplayMode = "fullscreen" | "standalone" | "minimal-ui" | "browser" | "picture-in-picture";
export type EmulationMediaFeaturesDynamicRange = "standard" | "high";
export type EmulationMediaFeaturesEnvironmentBlending = "opaque" | "additive" | "subtractive";
export type EmulationMediaFeaturesForcedColors = "none" | "active";
export type EmulationMediaFeaturesGrid = 0 | 1;
export type EmulationMediaFeaturesHover = "none" | "hover";
export type EmulationMediaFeaturesInvertedColors = "none" | "inverted";
export type EmulationMediaFeaturesNavControls = "none" | "back";
export type EmulationMediaFeaturesOverflowBlock = "none" | "scroll" | "optional-paged" | "paged";
export type EmulationMediaFeaturesOverflowInline = "none" | "scroll";
export type EmulationMediaFeaturesPointer = "none" | "coarse" | "fine";
export type EmulationMediaFeaturesPrefersColorScheme = "light" | "dark";
export type EmulationMediaFeaturesPrefersContrast = "no-preference" | "more" | "less" | "custom";
export type EmulationMediaFeaturesPrefersReducedData = "no-preference" | "reduce";
export type EmulationMediaFeaturesPrefersReducedMotion = "no-preference" | "reduce";
export type EmulationMediaFeaturesPrefersReducedTransparency = "no-preference" | "reduce";
export type EmulationMediaFeaturesScan = "interlace" | "progressive";
export type EmulationMediaFeaturesScripting = "none" | "initial-only" | "enabled";
export type EmulationMediaFeaturesUpdate = "none" | "slow" | "fast";
export type EmulationMediaFeaturesVideoColorGamut = "srgb" | "p3" | "rec2020";
export type EmulationMediaFeaturesVideoDynamicRange = "standard" | "high";
export type EmulationSetScrollbarTypeOverrideParametersScrollbarType = "classic" | "overlay";
export interface EmulationSetGeolocationOverrideParameters_Coordinates {
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
    coordinates: EmulationGeolocationCoordinates | null;
}
export interface EmulationSetGeolocationOverrideParameters_Error {
    contexts?: Array<BrowsingContextBrowsingContext>;
    userContexts?: Array<BrowserUserContext>;
    error: EmulationGeolocationPositionError;
}
/**
 * This is an unsupported API. No compatibility guarantees are provided.
 * It tracks the W3C WebDriver BiDi specification directly. As the specification
 * evolves, this API will change or be removed without prior notice.
 */
export declare class Emulation extends Domain {
    static readonly ForcedColorsModeTheme: Readonly<{
        readonly LIGHT: "light";
        readonly DARK: "dark";
    }>;
    static readonly ScreenOrientationNatural: Readonly<{
        readonly PORTRAIT: "portrait";
        readonly LANDSCAPE: "landscape";
    }>;
    static readonly ScreenOrientationType: Readonly<{
        readonly PORTRAIT_PRIMARY: "portrait-primary";
        readonly PORTRAIT_SECONDARY: "portrait-secondary";
        readonly LANDSCAPE_PRIMARY: "landscape-primary";
        readonly LANDSCAPE_SECONDARY: "landscape-secondary";
    }>;
    static readonly TextLayoutMode: Readonly<{
        readonly MOBILE: "mobile";
    }>;
    static readonly MediaFeaturesAnyHover: Readonly<{
        readonly NONE: "none";
        readonly HOVER: "hover";
    }>;
    static readonly MediaFeaturesAnyPointer: Readonly<{
        readonly NONE: "none";
        readonly COARSE: "coarse";
        readonly FINE: "fine";
    }>;
    static readonly MediaFeaturesColorGamut: Readonly<{
        readonly SRGB: "srgb";
        readonly P3: "p3";
        readonly REC2020: "rec2020";
    }>;
    static readonly MediaFeaturesDisplayMode: Readonly<{
        readonly FULLSCREEN: "fullscreen";
        readonly STANDALONE: "standalone";
        readonly MINIMAL_UI: "minimal-ui";
        readonly BROWSER: "browser";
        readonly PICTURE_IN_PICTURE: "picture-in-picture";
    }>;
    static readonly MediaFeaturesDynamicRange: Readonly<{
        readonly STANDARD: "standard";
        readonly HIGH: "high";
    }>;
    static readonly MediaFeaturesEnvironmentBlending: Readonly<{
        readonly OPAQUE: "opaque";
        readonly ADDITIVE: "additive";
        readonly SUBTRACTIVE: "subtractive";
    }>;
    static readonly MediaFeaturesForcedColors: Readonly<{
        readonly NONE: "none";
        readonly ACTIVE: "active";
    }>;
    static readonly MediaFeaturesGrid: Readonly<{
        readonly _0: 0;
        readonly _1: 1;
    }>;
    static readonly MediaFeaturesHover: Readonly<{
        readonly NONE: "none";
        readonly HOVER: "hover";
    }>;
    static readonly MediaFeaturesInvertedColors: Readonly<{
        readonly NONE: "none";
        readonly INVERTED: "inverted";
    }>;
    static readonly MediaFeaturesNavControls: Readonly<{
        readonly NONE: "none";
        readonly BACK: "back";
    }>;
    static readonly MediaFeaturesOverflowBlock: Readonly<{
        readonly NONE: "none";
        readonly SCROLL: "scroll";
        readonly OPTIONAL_PAGED: "optional-paged";
        readonly PAGED: "paged";
    }>;
    static readonly MediaFeaturesOverflowInline: Readonly<{
        readonly NONE: "none";
        readonly SCROLL: "scroll";
    }>;
    static readonly MediaFeaturesPointer: Readonly<{
        readonly NONE: "none";
        readonly COARSE: "coarse";
        readonly FINE: "fine";
    }>;
    static readonly MediaFeaturesPrefersColorScheme: Readonly<{
        readonly LIGHT: "light";
        readonly DARK: "dark";
    }>;
    static readonly MediaFeaturesPrefersContrast: Readonly<{
        readonly NO_PREFERENCE: "no-preference";
        readonly MORE: "more";
        readonly LESS: "less";
        readonly CUSTOM: "custom";
    }>;
    static readonly MediaFeaturesPrefersReducedData: Readonly<{
        readonly NO_PREFERENCE: "no-preference";
        readonly REDUCE: "reduce";
    }>;
    static readonly MediaFeaturesPrefersReducedMotion: Readonly<{
        readonly NO_PREFERENCE: "no-preference";
        readonly REDUCE: "reduce";
    }>;
    static readonly MediaFeaturesPrefersReducedTransparency: Readonly<{
        readonly NO_PREFERENCE: "no-preference";
        readonly REDUCE: "reduce";
    }>;
    static readonly MediaFeaturesScan: Readonly<{
        readonly INTERLACE: "interlace";
        readonly PROGRESSIVE: "progressive";
    }>;
    static readonly MediaFeaturesScripting: Readonly<{
        readonly NONE: "none";
        readonly INITIAL_ONLY: "initial-only";
        readonly ENABLED: "enabled";
    }>;
    static readonly MediaFeaturesUpdate: Readonly<{
        readonly NONE: "none";
        readonly SLOW: "slow";
        readonly FAST: "fast";
    }>;
    static readonly MediaFeaturesVideoColorGamut: Readonly<{
        readonly SRGB: "srgb";
        readonly P3: "p3";
        readonly REC2020: "rec2020";
    }>;
    static readonly MediaFeaturesVideoDynamicRange: Readonly<{
        readonly STANDARD: "standard";
        readonly HIGH: "high";
    }>;
    static readonly SetScrollbarTypeOverrideParametersScrollbarType: Readonly<{
        readonly CLASSIC: "classic";
        readonly OVERLAY: "overlay";
    }>;
    static create(driver: unknown): Promise<Emulation>;
    /**
     * @param {EmulationSetForcedColorsModeThemeOverrideParameters} params
     * @param {EmulationForcedColorsModeTheme | null} params.theme
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setForcedColorsModeThemeOverride
     */
    setForcedColorsModeThemeOverride(params: EmulationSetForcedColorsModeThemeOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetGeolocationOverrideParameters} params
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setGeolocationOverride
     */
    setGeolocationOverride(params: EmulationSetGeolocationOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetLocaleOverrideParameters} params
     * @param {string | null} params.locale
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setLocaleOverride
     */
    setLocaleOverride(params: EmulationSetLocaleOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetMediaFeaturesOverrideParameters} params
     * @param {EmulationMediaFeatures | null} params.features
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setMediaFeaturesOverride
     */
    setMediaFeaturesOverride(params: EmulationSetMediaFeaturesOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetNetworkConditionsParameters} params
     * @param {EmulationNetworkConditions | null} params.networkConditions
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setNetworkConditions
     */
    setNetworkConditions(params: EmulationSetNetworkConditionsParameters): Promise<void>;
    /**
     * @param {EmulationSetScreenOrientationOverrideParameters} params
     * @param {EmulationScreenOrientation | null} params.screenOrientation
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScreenOrientationOverride
     */
    setScreenOrientationOverride(params: EmulationSetScreenOrientationOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetScreenSettingsOverrideParameters} params
     * @param {EmulationScreenArea | null} params.screenArea
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScreenSettingsOverride
     */
    setScreenSettingsOverride(params: EmulationSetScreenSettingsOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetScriptingEnabledParameters} params
     * @param {false | null} params.enabled
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScriptingEnabled
     */
    setScriptingEnabled(params: EmulationSetScriptingEnabledParameters): Promise<void>;
    /**
     * @param {EmulationSetScrollbarTypeOverrideParameters} params
     * @param {EmulationSetScrollbarTypeOverrideParametersScrollbarType | null} params.scrollbarType
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setScrollbarTypeOverride
     */
    setScrollbarTypeOverride(params: EmulationSetScrollbarTypeOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetTextLayoutModeOverrideParameters} params
     * @param {EmulationTextLayoutMode | null} params.textLayoutMode
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setTextLayoutModeOverride
     */
    setTextLayoutModeOverride(params: EmulationSetTextLayoutModeOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetTimezoneOverrideParameters} params
     * @param {string | null} params.timezone
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setTimezoneOverride
     */
    setTimezoneOverride(params: EmulationSetTimezoneOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetTouchOverrideParameters} params
     * @param {JsUint | null} params.maxTouchPoints
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setTouchOverride
     */
    setTouchOverride(params: EmulationSetTouchOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetUserAgentOverrideParameters} params
     * @param {string | null} params.userAgent
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setUserAgentOverride
     */
    setUserAgentOverride(params: EmulationSetUserAgentOverrideParameters): Promise<void>;
    /**
     * @param {EmulationSetViewportMetaOverrideParameters} params
     * @param {true | null} params.viewportMeta
     * @param {Array<BrowsingContextBrowsingContext>} [params.contexts]
     * @param {Array<BrowserUserContext>} [params.userContexts]
     * @returns {Promise<void>}
     * @see https://w3c.github.io/webdriver-bidi/#command-emulation-setViewportMetaOverride
     */
    setViewportMetaOverride(params: EmulationSetViewportMetaOverrideParameters): Promise<void>;
}
