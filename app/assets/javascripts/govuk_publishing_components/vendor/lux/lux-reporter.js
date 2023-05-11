/* eslint-disable */

/*
 * Part of Speedcurve's LUX script, which allows us to run real user metrics on
 * pages using the public layout template.
 *
 * See docs/real-user-metrics.md for more information.
 */

/* ! Remember to keep these settings at the end of this file when updating LUX:
 *
 *  * `LUX.customerid = 47044334` to let LUX know who this is
 *  * `LUX.debug = false` turns debugging on and off. Left set to false - and
 *    kept in the file so it's easier to remember that this can be turned on.
 *
 * ! And the sample rate needs to be set inside the main function that's
 *   assigned to `LUX`:

*  * `LUX.samplerate = 1` to set sample rate to 1% of users.
 */

(function () {
  'use strict';
  /**
   * Fit an array of user timing delimited strings into a URL and return both the entries that fit and
   * the remaining entries that didn't fit.
   */
  function fitUserTimingEntries(utValues, config, url) {
    // Start with the maximum allowed UT entries per beacon
    var beaconUtValues = utValues.slice(0, config.maxBeaconUTEntries);
    var remainingUtValues = utValues.slice(config.maxBeaconUTEntries);
    // Trim UT entries until they fit within the maximum URL length, ensuring at least one UT entry
    // is included.
    while ((url + "&UT=" + beaconUtValues.join(",")).length > config.maxBeaconUrlLength &&
      beaconUtValues.length > 1) {
      remainingUtValues.unshift(beaconUtValues.pop());
    }
    return [beaconUtValues, remainingUtValues];
  }

  function fromObject(obj) {
    var autoMode = getProperty(obj, "auto", true);
    return {
      auto: autoMode,
      autoWhenHidden: getProperty(obj, "autoWhenHidden", false),
      beaconUrl: getProperty(obj, "beaconUrl", "https://lux.speedcurve.com/lux/"),
      conversions: getProperty(obj, "conversions", undefined),
      customerid: getProperty(obj, "customerid", undefined),
      errorBeaconUrl: getProperty(obj, "errorBeaconUrl", "https://lux.speedcurve.com/error/"),
      jspagelabel: getProperty(obj, "jspagelabel", undefined),
      label: getProperty(obj, "label", undefined),
      maxBeaconUrlLength: getProperty(obj, "maxBeaconUrlLength", 8190),
      maxBeaconUTEntries: getProperty(obj, "maxBeaconUTEntries", 20),
      maxErrors: getProperty(obj, "maxErrors", 5),
      maxMeasureTime: getProperty(obj, "maxMeasureTime", 60000),
      minMeasureTime: getProperty(obj, "minMeasureTime", 0),
      samplerate: getProperty(obj, "samplerate", 100),
      sendBeaconOnPageHidden: getProperty(obj, "sendBeaconOnPageHidden", autoMode),
      trackErrors: getProperty(obj, "trackErrors", true),
      pagegroups: getProperty(obj, "pagegroups", undefined),
    };
  }
  function getProperty(obj, key, defaultValue) {
    if (typeof obj[key] !== "undefined") {
      return obj[key];
    }
    return defaultValue;
  }

  var START_MARK = "LUX_start";
  var END_MARK = "LUX_end";
  var BOOLEAN_TRUE = "true";

  var customDataValues = {};
  var updatedCustomData = {};
  function addCustomDataValue(name, value) {
    var typeV = typeof value;
    if (customDataValues[name] !== value) {
      // If the value is new or different to the previous value, record it so that later we can send
      // only the values that have changed.
      updatedCustomData[name] = value;
    }
    if (typeV === "string" || typeV === "number" || typeV === "boolean") {
      customDataValues[name] = value;
    }
    if (typeV === "undefined" || value === null) {
      delete customDataValues[name];
    }
  }
  function getAllCustomData() {
    return customDataValues;
  }
  function getUpdatedCustomData() {
    return updatedCustomData;
  }
  function clearUpdateCustomData() {
    updatedCustomData = {};
  }
  /**
   * Convert a set of custom data values to the string format expected by the backend.
   */
  function valuesToString(values) {
    var strings = [];
    for (var key in values) {
              // Convert all values to strings
      var value = "" + values[key];
              // Strip out reserved characters (, and | are used as delimiters)
      key = key.replace(/,/g, "").replace(/\|/g, "");
      value = value.replace(/,/g, "").replace(/\|/g, "");
      strings.push(key + "|" + value);
    }
    return encodeURIComponent(strings.join(","));
  }

  function floor(x) {
    return Math.floor(x);
  }

  function now() {
    return Date.now ? Date.now() : +new Date();
  }

  var scriptStartTime = now();

  var _a;
  // If the various performance APIs aren't available, we export an empty object to
  // prevent having to make regular typeof checks.
  var performance = window.performance || {};
  var timing = performance.timing || {
    // If performance.timing isn't available, we attempt to polyfill the navigationStart value.
    // Our first attempt is from LUX.ns, which is the time that the snippet execution began. If this
    // is not available, we fall back to the time that the current script execution began.
    navigationStart: ((_a = window.LUX) === null || _a === void 0 ? void 0 : _a.ns) || scriptStartTime,
  };
  function msSinceNavigationStart() {
    if (performance.now) {
      return floor(performance.now());
    }
    return now() - timing.navigationStart;
  }
  function navigationType() {
    if (performance.navigation && typeof performance.navigation.type !== "undefined") {
      return performance.navigation.type;
    }
    return "";
  }
  function getNavigationEntry() {
    var navEntries = getEntriesByType("navigation");
    if (navEntries.length) {
      var entry_1 = navEntries[0];
      entry_1.navigationStart = 0;
      if (typeof entry_1.activationStart === "undefined") {
        entry_1.activationStart = 0;
      }
      return entry_1;
    }
    var navType = navigationType();
    var entry = {
      navigationStart: 0,
      activationStart: 0,
      startTime: 0,
      type: navType == 2 ? "back_forward" : navType === 1 ? "reload" : "navigate",
    };
    if (__ENABLE_POLYFILLS) {
      for (var key in timing) {
        if (typeof timing[key] === "number" && key !== "navigationStart") {
          entry[key] = Math.max(0, timing[key] - timing.navigationStart);
        }
      }
    }
    return entry;
  }
  /**
   * Simple wrapper around performance.getEntriesByType to provide fallbacks for
   * legacy browsers, and work around edge cases where undefined is returned instead
   * of an empty PerformanceEntryList.
   */
  function getEntriesByType(type) {
    if (typeof performance.getEntriesByType === "function") {
      var entries = performance.getEntriesByType(type);
      if (entries && entries.length) {
        return entries;
      }
    }
    return [];
  }

  function isVisible() {
    if (document.visibilityState) {
      return document.visibilityState === "visible";
    }
          // For browsers that don't support document.visibilityState, we assume the page is visible.
    return true;
  }
  function onVisible(cb) {
    if (isVisible()) {
      cb();
    }
    else {
      var onVisibleCallback_1 = function () {
        if (isVisible()) {
          cb();
          removeEventListener("visibilitychange", onVisibleCallback_1);
        }
      };
      addEventListener("visibilitychange", onVisibleCallback_1, true);
    }
  }
  function wasPrerendered() {
    return document.prerendering || getNavigationEntry().activationStart > 0;
  }

  var Flags = {
    InitCalled: 1 << 0,
    NavTimingNotSupported: 1 << 1,
    UserTimingNotSupported: 1 << 2,
    VisibilityStateNotVisible: 1 << 3,
    BeaconSentFromUnloadHandler: 1 << 4,
    BeaconSentAfterTimeout: 1 << 5,
    PageLabelFromDocumentTitle: 1 << 6,
    PageLabelFromLabelProp: 1 << 7,
    PageLabelFromGlobalVariable: 1 << 8,
    PageLabelFromPagegroup: 1 << 9,
    PageWasPrerendered: 1 << 10,
  };
  function addFlag(flags, flag) {
    return flags | flag;
  }

  function hasParentNode(el) {
    if (el.parentNode && el.parentNode.tagName) {
      return true;
    }
    return false;
  }

  /**
  * Get the interaction attribution name for an element
  */
  function interactionAttributionForElement(el) {
    // Our first preference is to use the data-sctrack attribute from anywhere in the tree
    var trackId = getClosestScTrackAttribute(el);
    if (trackId) {
      return trackId;
    }
    // The second preference is to use the element's ID
    if (el.id) {
      return el.id;
    }
    // The third preference is to use the text content of a button or link
    var isSubmitInput = el.tagName === "INPUT" && el.type === "submit";
    var isButton = el.tagName === "BUTTON";
    var isLink = el.tagName === "A";
    if (isSubmitInput && el.value) {
      return el.value;
    }
    if ((isButton || isLink) && el.innerText) {
      return el.innerText;
    }
    if (hasParentNode(el)) {
      return interactionAttributionForElement(el.parentNode);
    }
    // No suitable attribute was found
    return "";
  }
  function getClosestScTrackAttribute(el) {
    var _a;
    if (el.hasAttribute("data-sctrack")) {
      var trackId = (_a = el.getAttribute("data-sctrack")) === null || _a === void 0 ? void 0 : _a.trim();
      if (trackId) {
        return trackId;
      }
    }
    if (hasParentNode(el)) {
      return getClosestScTrackAttribute(el.parentNode);
    }
    return null;
  }

  var LogEvent = {
    // Internal events
    EvaluationStart: 1,
    EvaluationEnd: 2,
    InitCalled: 3,
    MarkCalled: 4,
    MeasureCalled: 5,
    AddDataCalled: 6,
    SendCalled: 7,
    ForceSampleCalled: 8,
    DataCollectionStart: 9,
    UnloadHandlerTriggered: 10,
    OnloadHandlerTriggered: 11,
    MarkLoadTimeCalled: 12,
    // Data collection events
    SessionIsSampled: 21,
    SessionIsNotSampled: 22,
    MainBeaconSent: 23,
    UserTimingBeaconSent: 24,
    InteractionBeaconSent: 25,
    CustomDataBeaconSent: 26,
    // Metric information
    NavigationStart: 41,
    PerformanceEntryReceived: 42,
    PerformanceEntryProcessed: 43,
    // Errors
    PerformanceObserverError: 51,
    InputEventPermissionError: 52,
    InnerHtmlAccessError: 53,
    EventTargetAccessError: 54,
    CookieReadError: 55,
    CookieSetError: 56,
    PageLabelEvaluationError: 57,
    // Browser support messages
    NavTimingNotSupported: 71,
    PaintTimingNotSupported: 72,
  };
  var Logger = /** @class */ (function () {
  function Logger() {
    this.events = [];
  }
  Logger.prototype.logEvent = function (event, args) {
    if (args === void 0) { args = []; }
    this.events.push([now(), event, args]);
  };
  Logger.prototype.getEvents = function () {
    return this.events;
  };
  return Logger;
  }());
  var sessionValue = 0;
  var sessionEntries = [];
  function addEntry$2(entry) {
    if (!entry.hadRecentInput) {
      var firstEntry = sessionEntries[0];
      var latestEntry = sessionEntries[sessionEntries.length - 1];
      if (sessionEntries.length &&
        (entry.startTime - latestEntry.startTime >= 1000 ||
          entry.startTime - firstEntry.startTime >= 5000)) {
        reset$1();
      }
      sessionValue += entry.value;
      sessionEntries.push(entry);
    }
  }
  function reset$1() {
    sessionValue = 0;
    sessionEntries = [];
  }
  function getCLS() {
    return sessionValue;
  }

  /**
   * This implementation is based on the web-vitals implementation, however it is stripped back to the
   * bare minimum required to measure just the INP value and does not store the actual event entries.
   */
  // The maximum number of interactions to store
  var MAX_INTERACTIONS = 10;
  // A list of the slowest interactions
  var slowestEntries = [];
  // A map of the slowest interactions by ID
  var slowestEntriesMap = {};
  // The total number of interactions recorded on the page
  var interactionCountEstimate = 0;
  function reset() {
    interactionCountEstimate = 0;
    slowestEntries = [];
    slowestEntriesMap = {};
  }
  function addEntry$1(entry) {
    if (entry.interactionId || (entry.entryType === "first-input" && !entryExists(entry))) {
      var duration = entry.duration, startTime = entry.startTime, interactionId = entry.interactionId;
      var existingEntry = slowestEntriesMap[interactionId];
      if (existingEntry) {
        existingEntry.duration = Math.max(duration, existingEntry.duration);
      }
      else {
        interactionCountEstimate++;
        slowestEntriesMap[interactionId] = { duration: duration, interactionId: interactionId, startTime: startTime };
        slowestEntries.push(slowestEntriesMap[interactionId]);
      }
      // Only store the longest <MAX_INTERACTIONS> interactions
      slowestEntries.sort(function (a, b) { return b.duration - a.duration; });
      slowestEntries.splice(MAX_INTERACTIONS).forEach(function (entry) {
        delete slowestEntriesMap[entry.interactionId];
      });
    }
  }
  function entryExists(e1) {
    return slowestEntries.some(function (e2) { return e1.startTime === e2.startTime && e1.duration === e2.duration; });
  }
  /**
   * Returns an estimated high percentile INP value based on the total number of interactions on the
   * current page.
   */
  function getHighPercentileINP() {
    var _a;
    var index = Math.min(slowestEntries.length - 1, Math.floor(getInteractionCount() / 50));
    return (_a = slowestEntries[index]) === null || _a === void 0 ? void 0 : _a.duration;
  }
  function getInteractionCount() {
    if ("interactionCount" in performance) {
      return performance.interactionCount;
    }
    return interactionCountEstimate;
  }

  /**
   * Get the number of milliseconds between navigationStart and the given PerformanceNavigationTiming key
   */
  function getNavTimingValue(key) {
    var navEntry = getNavigationEntry();
    var relativeTo = key === "activationStart" ? 0 : navEntry.activationStart;
    if (typeof navEntry[key] === "number") {
      return Math.max(0, navEntry[key] - relativeTo);
    }
    return undefined;
  }

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function() {
    __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };

  var ALL_ENTRIES = [];
  function observe(type, callback, options) {
    if (typeof PerformanceObserver === "function" &&
      PerformanceObserver.supportedEntryTypes.includes(type)) {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) { return callback(entry); });
      });
    po.observe(__assign({ type: type, buffered: true }, options));
    return po;
  }
  return undefined;
  }
  function getEntries(type) {
    return ALL_ENTRIES.filter(function (entry) { return entry.entryType === type; });
  }
  function addEntry(entry) {
    ALL_ENTRIES.push(entry);
  }
  function clearEntries() {
    ALL_ENTRIES.splice(0);
  }

  function getMatchesFromPatternMap(patternMap, hostname, pathname, firstOnly) {
    var matches = [];
    for (var key in patternMap) {
      var patterns = patternMap[key];
      if (Array.isArray(patterns)) {
        for (var i in patterns) {
          var pattern = patterns[i];
          if (patternMatchesUrl(pattern, hostname, pathname)) {
            if (firstOnly) {
              return key;
            }
            matches.push(key);
          }
        }
      }
    }
    if (firstOnly) {
      return undefined;
    }
    return matches;
  }
  function patternMatchesUrl(pattern, hostname, pathname) {
    var regex = createRegExpFromPattern(pattern);
    if (pattern.charAt(0) === "/") {
      // Rule is a pathname only
      return regex.test(pathname);
    }
    // Rule is a hostname and pathname
    return regex.test(hostname + pathname);
  }
  function createRegExpFromPattern(pattern) {
    return new RegExp("^" + escapeStringForRegExp(pattern).replaceAll("*", ".*") + "$", "i");
  }
  function escapeStringForRegExp(str) {
    // Note: we don't escape * because it's our own special symbol!
    return str.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
  }

  var LUX = window.LUX || {};
  var scriptEndTime = scriptStartTime;
  LUX = (function () {
    // -------------------------------------------------------------------------
    // Settings
    // -------------------------------------------------------------------------
    // Set the sample rate to 1% to avoid all events being sent.
    LUX.samplerate = 1;
    // -------------------------------------------------------------------------
    /// End
    // -------------------------------------------------------------------------
    var SCRIPT_VERSION = "308";
    var logger = new Logger();
    var globalConfig = fromObject(LUX);
    logger.logEvent(LogEvent.EvaluationStart, [SCRIPT_VERSION]);
    // Log JS errors.
    var nErrors = 0;
    function errorHandler(e) {
      if (!globalConfig.trackErrors) {
        return;
      }
      nErrors++;
      if (e && typeof e.filename !== "undefined" && typeof e.message !== "undefined") {
        // Always send LUX errors
        var isLuxError = e.filename.indexOf("/lux.js?") > -1 || e.message.indexOf("LUX") > -1;
        if (isLuxError || (nErrors <= globalConfig.maxErrors && _sample())) {
          // Sample & limit other errors.
          // Send the error beacon.
          new Image().src =
            globalConfig.errorBeaconUrl +
            "?v=" +
            SCRIPT_VERSION +
            "&id=" +
            getCustomerId() +
            "&fn=" +
            encodeURIComponent(e.filename) +
            "&ln=" +
            e.lineno +
            "&cn=" +
            e.colno +
            "&msg=" +
            encodeURIComponent(e.message) +
            "&l=" +
            encodeURIComponent(_getPageLabel()) +
            (connectionType() ? "&ct=" + connectionType() : "") +
            "&HN=" +
            encodeURIComponent(document.location.hostname) +
            "&PN=" +
            encodeURIComponent(document.location.pathname);
        }
      }
    }
    window.addEventListener("error", errorHandler);
    var logEntry = function (entry) {
      logger.logEvent(LogEvent.PerformanceEntryReceived, [entry]);
    };
    // Most PerformanceEntry types we log an event for and add it to the global entry store.
    var processAndLogEntry = function (entry) {
      addEntry(entry);
      logEntry(entry);
    };
    // Before long tasks were buffered, we added a PerformanceObserver to the lux.js snippet to capture
    // any long tasks that occurred before the full script was loaded. To deal with this, we process
    // all of the snippet long tasks, and we check for double-ups in the new PerformanceObserver.
    var snippetLongTasks = typeof window.LUX_al === "object" ? window.LUX_al : [];
    snippetLongTasks.forEach(processAndLogEntry);
    try {
      observe("longtask", function (entry) {
        if (ALL_ENTRIES.indexOf(entry) === -1) {
          processAndLogEntry(entry);
        }
      });
      observe("largest-contentful-paint", processAndLogEntry);
      observe("element", processAndLogEntry);
      observe("paint", processAndLogEntry);
      observe("layout-shift", function (entry) {
        addEntry$2(entry);
        logEntry(entry);
      });
      observe("first-input", function (entry) {
        var fid = entry.processingStart - entry.startTime;
        if (!gFirstInputDelay || gFirstInputDelay < fid) {
          gFirstInputDelay = fid;
        }
        // Allow first-input events to be considered for INP
        addEntry$1(entry);
      });
      // TODO: Add { durationThreshold: 40 } once performance.interactionCount is widely supported.
      // Right now we have to count every event to get the total interaction count so that we can
      // estimate a high percentile value for INP.
      observe("event", addEntry$1);
    }
    catch (e) {
      logger.logEvent(LogEvent.PerformanceObserverError, [e]);
    }
    // Bitmask of flags for this session & page
    var gFlags = 0;
    var gaMarks = [];
    var gaMeasures = [];
    var ghIx = {}; // hash for Interaction Metrics (scroll, click, keyboard)
    var gbLuxSent = 0; // have we sent the LUX data? (avoid sending twice in unload)
    var gbNavSent = 0; // have we sent the Nav Timing beacon yet? (avoid sending twice for SPA)
    var gbIxSent = 0; // have we sent the IX data? (avoid sending twice for SPA)
    var gbFirstPV = 1; // this is the first page view (vs. a SPA "soft nav")
    var gSessionTimeout = 30 * 60; // number of seconds after which we consider a session to have "timed out" (used for calculating bouncerate)
    var gSyncId = createSyncId(); // if we send multiple beacons, use this to sync them (eg, LUX & IX) (also called "luxid")
    var gUid = refreshUniqueId(gSyncId); // cookie for this session ("Unique ID")
    var gCustomerDataTimeout; // setTimeout timer for sending a Customer Data beacon after onload
    var gMaxMeasureTimeout; // setTimeout timer for sending the beacon after a maximum measurement time
    var navEntry = getNavigationEntry();
    if (_sample()) {
      logger.logEvent(LogEvent.SessionIsSampled, [globalConfig.samplerate]);
    }
    else {
      logger.logEvent(LogEvent.SessionIsNotSampled, [globalConfig.samplerate]);
    }
    var gLuxSnippetStart = LUX.ns ? LUX.ns - timing.navigationStart : 0;
    if (!performance.timing) {
      logger.logEvent(LogEvent.NavTimingNotSupported);
      gFlags = addFlag(gFlags, Flags.NavTimingNotSupported);
    }
    logger.logEvent(LogEvent.NavigationStart, [timing.navigationStart]);
    ////////////////////// FID BEGIN
    // FIRST INPUT DELAY (FID)
    // The basic idea behind FID is to attach various input event listeners and measure the time
    // between when the event happens and when the handler executes. That is FID.
    var gFirstInputDelay;
    var gaEventTypes = ["click", "mousedown", "keydown", "touchstart", "pointerdown"]; // NOTE: does NOT include scroll!
    var ghListenerOptions = { passive: true, capture: true };
    // Record the FIRST input delay.
    function recordDelay(delay) {
      if (!gFirstInputDelay) {
        gFirstInputDelay = delay;
        // remove event listeners
        gaEventTypes.forEach(function (eventType) {
          removeEventListener(eventType, onInput, ghListenerOptions);
        });
      }
    }
    // Pointer events are special. Ignore scrolling by looking for pointercancel
    // events because FID does not include scrolling nor pinch/zooming.
    function onPointerDown(delay) {
      function onPointerUp() {
        recordDelay(delay);
        removeListeners();
      }
      // Do NOT record FID - this is a scroll.
      function onPointerCancel() {
        removeListeners();
      }
      function removeListeners() {
        window.removeEventListener("pointerup", onPointerUp, ghListenerOptions);
        window.removeEventListener("pointercancel", onPointerCancel, ghListenerOptions);
      }
      window.addEventListener("pointerup", onPointerUp, ghListenerOptions);
      window.addEventListener("pointercancel", onPointerCancel, ghListenerOptions);
    }
    // Record FID as the delta between when the event happened and when the
    // listener was able to execute.
    function onInput(evt) {
      var bCancelable = false;
      try {
        // Seeing "Permission denied" errors, so do a simple try-catch.
        bCancelable = evt.cancelable;
      }
      catch (e) {
        // bail - no need to return anything
        logger.logEvent(LogEvent.InputEventPermissionError);
        return;
      }
      if (bCancelable) {
        var now_1 = _now(true);
        var eventTimeStamp = evt.timeStamp;
        if (eventTimeStamp > 1520000000) {
          // If the event timeStamp is an epoch time instead of a time relative to NavigationStart,
          // then compare it to Date.now() instead of performance.now().
          now_1 = Number(new Date());
        }
        if (eventTimeStamp > now_1) {
          // If there is a race condition and eventTimeStamp happened after
          // this code was executed, something is wrong. Bail.
          return;
        }
        var delay = now_1 - eventTimeStamp;
        if (evt.type === "pointerdown") {
          // special case
          onPointerDown(delay);
        }
        else {
          recordDelay(delay);
        }
      }
    }
    // Attach event listener to input events.
    gaEventTypes.forEach(function (eventType) {
      window.addEventListener(eventType, onInput, ghListenerOptions);
    });
    ////////////////////// FID END
    /**
     * Returns the time elapsed (in ms) since navigationStart. For SPAs, returns
     * the time elapsed since the last LUX.init call.
     *
     * When `absolute = true` the time is always relative to navigationStart, even
     * in SPAs.
     */
    function _now(absolute) {
      var sinceNavigationStart = msSinceNavigationStart();
      var startMark = _getMark(START_MARK);
      // For SPA page views, we use our internal mark as a reference point
      if (startMark && !absolute) {
        return sinceNavigationStart - startMark.startTime;
      }
      // For "regular" page views, we can use performance.now() if it's available...
      return sinceNavigationStart;
    }
    // This is a wrapper around performance.mark that falls back to a polyfill when the User Timing
    // API isn't supported.
    function _mark() {
      var _a, _b;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      logger.logEvent(LogEvent.MarkCalled, args);
      if (performance.mark) {
        // Use the native performance.mark where possible...
        return performance.mark.apply(performance, args);
      }
      // ...Otherwise provide a polyfill
      if (__ENABLE_POLYFILLS) {
        var name_1 = args[0];
        var detail = ((_a = args[1]) === null || _a === void 0 ? void 0 : _a.detail) || null;
        var startTime = ((_b = args[1]) === null || _b === void 0 ? void 0 : _b.startTime) || _now();
        var entry = {
          entryType: "mark",
          duration: 0,
          name: name_1,
          detail: detail,
          startTime: startTime,
        };
        gaMarks.push(entry);
        gFlags = addFlag(gFlags, Flags.UserTimingNotSupported);
        return entry;
      }
    }
    // This is a wrapper around performance.measure that falls back to a polyfill when the User Timing
    // API isn't supported.
    function _measure() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      logger.logEvent(LogEvent.MeasureCalled, args);
      var name = args[0];
      var startMarkName = args[1];
      var endMarkName = args[2];
      var options;
      if (typeof startMarkName === "object") {
        options = args[1];
        startMarkName = options.start;
        endMarkName = options.end;
      }
      if (typeof startMarkName === "undefined") {
        // Without a start mark specified, performance.measure defaults to using navigationStart
        if (_getMark(START_MARK)) {
          // For SPAs that have already called LUX.init(), we use our internal start mark instead of
          // navigationStart
          startMarkName = START_MARK;
        }
        else {
          // For regular page views, we need to patch the navigationStart behaviour because IE11 throws
          // a SyntaxError without a start mark
          startMarkName = "navigationStart";
        }
        // Since we've potentially modified the start mark, we need to shove it back into whichever
        // argument it belongs in.
        if (options) {
          // If options were provided, we need to avoid specifying a start mark if an end mark and
          // duration were already specified.
          if (!options.end || !options.duration) {
            args[1].start = startMarkName;
          }
        }
        else {
          args[1] = startMarkName;
        }
      }
      if (performance.measure) {
        // Use the native performance.measure where possible...
        return performance.measure.apply(performance, args);
      }
      // ...Otherwise provide a polyfill
      if (__ENABLE_POLYFILLS) {
        var startTime = typeof startMarkName === "number" ? startMarkName : 0;
        var endTime = typeof endMarkName === "number" ? endMarkName : _now();
        var throwError = function (missingMark) {
          throw new DOMException("Failed to execute 'measure' on 'Performance': The mark '" +
            missingMark +
            "' does not exist");
        };
        if (typeof startMarkName === "string") {
          var startMark = _getMark(startMarkName);
          if (startMark) {
            startTime = startMark.startTime;
          }
          else if (typeof navEntry[startMarkName] === "number") {
            // the mark name can also be a property from Navigation Timing
            startTime = navEntry[startMarkName];
          }
          else {
            throwError(startMarkName);
          }
        }
        if (typeof endMarkName === "string") {
          var endMark = _getMark(endMarkName);
          if (endMark) {
            endTime = endMark.startTime;
          }
          else if (typeof navEntry[endMarkName] === "number") {
            // the mark name can also be a property from Navigation Timing
            endTime = navEntry[endMarkName];
          }
          else {
            throwError(endMarkName);
          }
        }
        var duration = endTime - startTime;
        var detail = null;
        if (options) {
          if (options.duration) {
            duration = options.duration;
          }
          detail = options.detail;
        }
        var entry = {
          entryType: "measure",
          name: name,
          detail: detail,
          startTime: startTime,
          duration: duration,
        };
        gaMeasures.push(entry);
        gFlags = addFlag(gFlags, Flags.UserTimingNotSupported);
        return entry;
      }
    }
    // Return THE LAST mark that matches the name.
    function _getMark(name) {
      return _getM(name, _getMarks());
    }
    function _getM(name, aItems) {
      if (aItems) {
        for (var i = aItems.length - 1; i >= 0; i--) {
          var m = aItems[i];
          if (name === m.name) {
            return m;
          }
        }
      }
      return undefined;
    }
    // Return an array of marks.
    function _getMarks() {
      var marks = getEntriesByType("mark");
      if (marks.length) {
        return marks;
      }
      return gaMarks;
    }
    // Return an array of measures.
    function _getMeasures() {
      var measures = getEntriesByType("measure");
      if (measures.length) {
        return measures;
      }
      return gaMeasures;
    }
    // Return a string of User Timing Metrics formatted for beacon querystring.
    function userTimingValues() {
      // The User Timing spec allows for there to be multiple marks with the same name,
      // and multiple measures with the same name. But we can only send back one value
      // for a name, so we always take the maximum value.
      var hUT = {};
      var startMark = _getMark(START_MARK);
      // For user timing values taken in a SPA page load, we need to adjust them
      // so that they're zeroed against the last LUX.init() call.
      var tZero = startMark ? startMark.startTime : 0;
      // marks
      _getMarks().forEach(function (mark) {
        var name = mark.name;
        if (name === START_MARK || name === END_MARK) {
          // Don't include the internal marks in the beacon
          return;
        }
        var startTime = floor(mark.startTime - tZero);
        if (startTime < 0) {
          // Exclude marks that were taken before the current SPA page view
          return;
        }
        if (typeof hUT[name] === "undefined") {
          hUT[name] = { startTime: startTime };
        }
        else {
          hUT[name].startTime = Math.max(startTime, hUT[name].startTime);
        }
      });
      // measures
      _getMeasures().forEach(function (measure) {
        if (startMark && measure.startTime < startMark.startTime) {
          // Exclude measures that were taken before the current SPA page view
          return;
        }
        var name = measure.name;
        var startTime = floor(measure.startTime - tZero);
        var duration = floor(measure.duration);
        if (typeof hUT[name] === "undefined" || startTime > hUT[name].startTime) {
          hUT[name] = { startTime: startTime, duration: duration };
        }
      });
      // Convert the user timing values into a delimited string. This string takes the format
      // markName|startTime,measureName|startTime|duration,[markName...]
      var aUT = [];
      for (var utName in hUT) {
        var _a = hUT[utName], startTime = _a.startTime, duration = _a.duration;
        var utParts = [utName, startTime];
        if (typeof duration !== "undefined") {
          utParts.push(duration);
        }
        aUT.push(utParts.join("|"));
      }
      return aUT;
    }
    // Return a string of Element Timing Metrics formatted for beacon querystring.
    function elementTimingValues() {
      var aET = [];
      var startMark = _getMark(START_MARK);
      var tZero = startMark ? startMark.startTime : 0;
      getEntries("element").forEach(function (entry) {
        if (entry.identifier && entry.startTime) {
          logger.logEvent(LogEvent.PerformanceEntryProcessed, [entry]);
          aET.push(entry.identifier + "|" + floor(entry.startTime - tZero));
        }
      });
      return aET.join(",");
    }
    // Return a string of CPU times formatted for beacon querystring.
    function cpuTimes() {
      if (!("PerformanceLongTaskTiming" in self)) {
        // Do not return any CPU metrics if Long Tasks API is not supported.
        return "";
      }
      var sCPU = "";
      var hCPU = {};
      var hCPUDetails = {}; // TODO - Could remove this later after large totals go away.
      var longTaskEntries = getEntries("longtask");
      // Add up totals for each "type" of long task
      if (longTaskEntries.length) {
        // Long Task start times are relative to NavigationStart which is "0".
        // But if it is a SPA then the relative start time is gStartMark.
        var startMark = _getMark(START_MARK);
        var tZero_1 = startMark ? startMark.startTime : 0;
        // Do not include Long Tasks that start after the page is done.
        // For full page loads, "done" is loadEventEnd.
        var tEnd_1 = timing.loadEventEnd - timing.navigationStart;
        if (startMark) {
          // For SPA page loads (determined by the presence of a start mark), "done" is gEndMark.
          var endMark = _getMark(END_MARK);
          if (endMark) {
            tEnd_1 = endMark.startTime;
          }
        }
        longTaskEntries.forEach(function (entry) {
          var dur = floor(entry.duration);
          if (entry.startTime < tZero_1) {
            // In a SPA it is possible that we were in the middle of a Long Task when
            // LUX.init() was called. If so, only include the duration after tZero.
            dur -= tZero_1 - entry.startTime;
          }
          else if (entry.startTime >= tEnd_1) {
            // In a SPA it is possible that a Long Task started after loadEventEnd but before our
            // callback from setTimeout(200) happened. Do not include anything that started after tEnd.
            return;
          }
          logger.logEvent(LogEvent.PerformanceEntryProcessed, [entry]);
          var type = entry.attribution[0].name; // TODO - is there ever more than 1 attribution???
          if (!hCPU[type]) {
            // initialize this category
            hCPU[type] = 0;
            hCPUDetails[type] = "";
          }
          hCPU[type] += dur;
          // Send back the raw startTime and duration, as well as the adjusted duration.
          hCPUDetails[type] += "," + floor(entry.startTime) + "|" + dur;
        });
      }
      // TODO - Add more types if/when they become available.
      var jsType = typeof hCPU["script"] !== "undefined" ? "script" : "unknown"; // spec changed from "script" to "unknown" Nov 2018
      if (typeof hCPU[jsType] === "undefined") {
        // Initialize default values for pages that have *no Long Tasks*.
        hCPU[jsType] = 0;
        hCPUDetails[jsType] = "";
      }
      var hStats = cpuStats(hCPUDetails[jsType]);
      var sStats = ",n|" +
        hStats["count"] +
        ",d|" +
        hStats["median"] +
        ",x|" +
        hStats["max"] +
        (0 === hStats["fci"] ? "" : ",i|" + hStats["fci"]); // only add FCI if it is non-zero
      sCPU += "s|" + hCPU[jsType] + sStats + hCPUDetails[jsType];
      return sCPU;
    }
    // Return a hash of "stats" about the CPU details incl. count, max, and median.
    function cpuStats(sDetails) {
      // tuples of starttime|duration, eg: ,456|250,789|250,1012|250
      var max = 0;
      var fci = getFcp() || 0; // FCI is beginning of 5 second window of no Long Tasks _after_ first contentful paint
      // If FCP is 0 then that means FCP is not supported.
      // If FCP is not supported then we can NOT calculate a valid FCI.
      // Thus, leave FCI = 0 and exclude it from the beacon above.
      var bFoundFci = 0 === fci ? true : false;
      var aValues = [];
      var aTuples = sDetails.split(",");
      for (var i = 0; i < aTuples.length; i++) {
        var aTuple = aTuples[i].split("|");
        if (aTuple.length === 2) {
          var start = parseInt(aTuple[0]);
          var dur = parseInt(aTuple[1]);
          aValues.push(dur);
          max = dur > max ? dur : max;
          // FCI
          if (!bFoundFci && start > fci) {
            // should always be true (assumes Long Tasks are in chrono order)
            if (start - fci > 5000) {
              // More than 5 seconds of inactivity!
              // FCI is the previous value we set (eg, FCI or the _end_ of the previous Long Task)
              bFoundFci = true;
            }
            else {
              // Less than 5 seconds of inactivity
              fci = start + dur; // FCI is now the end of this Long Task
            }
          }
        }
      }
      var count = aValues.length;
      var median = arrayMedian(aValues);
      return { count: count, median: median, max: max, fci: fci };
    }
    function getCLS$1() {
      if (!("LayoutShift" in self)) {
        return undefined;
      }
      // The DCLS column in Redshift is REAL (FLOAT4) which stores a maximum
      // of 6 significant digits.
      return getCLS().toFixed(6);
    }
    // Return the median value from an array of integers.
    function arrayMedian(aValues) {
      if (0 === aValues.length) {
        return 0;
      }
      var half = floor(aValues.length / 2);
      aValues.sort(function (a, b) {
        return a - b;
      });
      if (aValues.length % 2) {
        // Return the middle value.
        return aValues[half];
      }
      else {
        // Return the average of the two middle values.
        return Math.round((aValues[half - 1] + aValues[half]) / 2.0);
      }
    }
    // Track how long it took lux.js to load via Resource Timing.
    function selfLoading() {
      var sLuxjs = "";
      if (performance.getEntriesByName) {
        // Get the lux script URL (including querystring params).
        var luxScript = getScriptElement("/js/lux.js");
        if (luxScript) {
          var aResources = performance.getEntriesByName(luxScript.src);
          if (aResources && aResources.length) {
            var r = aResources[0];
            // DO NOT USE DURATION!!!!!
            // See https://www.stevesouders.com/blog/2014/11/25/serious-confusion-with-resource-timing/
            var dns = floor(r.domainLookupEnd - r.domainLookupStart);
            var tcp = floor(r.connectEnd - r.connectStart);
            var fb = floor(r.responseStart - r.requestStart);
            var content = floor(r.responseEnd - r.responseStart);
            var networkDuration = dns + tcp + fb + content;
            var parseEval = scriptEndTime - scriptStartTime;
            var transferSize = r.encodedBodySize ? r.encodedBodySize : 0;
            // Instead of a delimiter use a 1-letter abbreviation as a separator.
            sLuxjs =
              "d" +
              dns +
              "t" +
              tcp +
              "f" +
              fb +
              "c" +
              content +
              "n" +
              networkDuration +
              "e" +
              parseEval +
              "r" +
              globalConfig.samplerate + // sample rate
              (typeof transferSize === "number" ? "x" + transferSize : "") +
              (typeof gLuxSnippetStart === "number" ? "l" + gLuxSnippetStart : "") +
              "s" +
              (scriptStartTime - timing.navigationStart) + // when lux.js started getting evaluated relative to navigationStart
              "";
          }
        }
      }
      return sLuxjs;
    }
    // _clearIx
    function _clearIx() {
      ghIx = {};
    }
    // Return a string of Interaction Metrics formatted for beacon querystring.
    function ixValues() {
      var aIx = [];
      for (var key in ghIx) {
        aIx.push(key + "|" + ghIx[key]);
      }
      return aIx.join(",");
    }
    function _addData(name, value) {
      logger.logEvent(LogEvent.AddDataCalled, [name, value]);
      if (typeof name === "string") {
        addCustomDataValue(name, value);
      }
      if (gbLuxSent) {
        // This is special: We want to allow customers to call LUX.addData()
        // _after_ window.onload. So we have to send a Customer Data beacon that
        // includes the new customer data.
        // Do setTimeout so that if there are multiple back-to-back addData calls
        // we get them all in one beacon.
        if (gCustomerDataTimeout) {
          // Cancel the timer for any previous beacons so that if they have not
          // yet been sent we can combine all the data in a new beacon.
          window.clearTimeout(gCustomerDataTimeout);
        }
        gCustomerDataTimeout = window.setTimeout(_sendCustomerData, 100);
      }
    }
    // _sample()
    // Return true if beacons for this page should be sampled.
    function _sample() {
      if (typeof gUid === "undefined" || typeof globalConfig.samplerate === "undefined") {
        return false; // bail
      }
      var nThis = ("" + gUid).substr(-2); // number for THIS page - from 00 to 99
      return parseInt(nThis) < globalConfig.samplerate;
    }
    // _init()
    // Use this function in Single Page Apps to reset things.
    // This function should ONLY be called within a SPA!
    // Otherwise, you might clear marks & measures that were set by a shim.
    function _init() {
      // Some customers (incorrectly) call LUX.init on the very first page load of a SPA. This would
      // cause some first-page-only data (like paint metrics) to be lost. To prevent this, we silently
      // bail from this function when we detect an unnecessary LUX.init call.
      var endMark = _getMark(END_MARK);
      if (!endMark) {
        return;
      }
      logger.logEvent(LogEvent.InitCalled);
      // Clear all interactions from the previous "page".
      _clearIx();
      // Since we actively disable IX handlers, we re-add them each time.
      _removeIxHandlers();
      _addIxHandlers();
      // Reset a bunch of flags.
      gbNavSent = 0;
      gbLuxSent = 0;
      gbIxSent = 0;
      gbFirstPV = 0;
      gSyncId = createSyncId();
      gUid = refreshUniqueId(gSyncId);
      clearEntries();
      reset$1();
      reset();
      nErrors = 0;
      gFirstInputDelay = undefined;
      // Clear flags then set the flag that init was called (ie, this is a SPA).
      gFlags = 0;
      gFlags = addFlag(gFlags, Flags.InitCalled);
      // Mark the "navigationStart" for this SPA page.
      _mark(START_MARK);
      // Reset the maximum measure timeout
      createMaxMeasureTimeout();
    }
    // Return the number of blocking (synchronous) external scripts in the page.
    function blockingScripts() {
      var lastViewportElem = lastViewportElement();
      if (!lastViewportElem) {
        // If we can not find the last DOM element in the viewport,
        // use the old technique of just counting sync scripts.
        return syncScripts();
      }
      // Find all the synchronous scripts that are ABOVE the last DOM element in the
      // viewport. (If they are BELOW then they do not block rendering of initial viewport.)
      var aElems = document.getElementsByTagName("script");
      var num = 0;
      for (var i = 0, len = aElems.length; i < len; i++) {
        var e = aElems[i];
        if (e.src &&
          !e.async &&
          !e.defer &&
          0 !== (e.compareDocumentPosition(lastViewportElem) & 4)) {
          // If the script has a SRC and async is false and it occurs BEFORE the last viewport element,
          // then increment the counter.
          num++;
        }
      }
      return num;
    }
    // Return the number of blocking (synchronous) external scripts in the page.
    function blockingStylesheets() {
      var nBlocking = 0;
      var aElems = document.getElementsByTagName("link");
      for (var i = 0, len = aElems.length; i < len; i++) {
        var e = aElems[i];
        if (e.href && "stylesheet" === e.rel && 0 !== e.href.indexOf("data:")) {
          if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            e.onloadcssdefined ||
            "print" === e.media ||
            "style" === e.as ||
            (typeof e.onload === "function" && e.media === "all")) ;
          else {
            nBlocking++;
          }
        }
      }
      return nBlocking;
    }
    // Return the number of synchronous external scripts in the page.
    function syncScripts() {
      var aElems = document.getElementsByTagName("script");
      var num = 0;
      for (var i = 0, len = aElems.length; i < len; i++) {
        var e = aElems[i];
        if (e.src && !e.async && !e.defer) {
          // If the script has a SRC and async is false, then increment the counter.
          num++;
        }
      }
      return num;
    }
    // Return the number of external scripts in the page.
    function numScripts() {
      var aElems = document.getElementsByTagName("script");
      var num = 0;
      for (var i = 0, len = aElems.length; i < len; i++) {
        var e = aElems[i];
        if (e.src) {
          num++;
        }
      }
      return num;
    }
    // Return the number of stylesheets in the page.
    function numStylesheets() {
      var aElems = document.getElementsByTagName("link");
      var num = 0;
      for (var i = 0, len = aElems.length; i < len; i++) {
        var e = aElems[i];
        if (e.href && "stylesheet" == e.rel) {
          num++;
        }
      }
      return num;
    }
    function inlineTagSize(tagName) {
      var aElems = document.getElementsByTagName(tagName);
      var size = 0;
      for (var i = 0, len = aElems.length; i < len; i++) {
        var e = aElems[i];
        try {
          size += e.innerHTML.length;
        }
        catch (e) {
          // It seems like IE throws an error when accessing the innerHTML property
          logger.logEvent(LogEvent.InnerHtmlAccessError);
          return -1;
        }
      }
      return size;
    }
    function getNavTiming() {
      var s = "";
      var ns = timing.navigationStart;
      var startMark = _getMark(START_MARK);
      var endMark = _getMark(END_MARK);
      if (startMark && endMark) {
        // This is a SPA page view, so send the SPA marks & measures instead of Nav Timing.
        var start = floor(startMark.startTime); // the start mark is "zero"
        ns += start; // "navigationStart" for a SPA is the real navigationStart plus the start mark
        var end = floor(endMark.startTime) - start; // delta from start mark
        s =
          ns +
          "fs" +
          0 + // fetchStart is the same as navigationStart for a SPA
          "ls" +
          end +
          "le" +
          end +
          "";
      }
      else if (performance.timing) {
        // Return the real Nav Timing metrics because this is the "main" page view (not a SPA)
        var startRender = getStartRender();
        var fcp = getFcp();
        var lcp = getLcp();
        var prefixNTValue = function (key, prefix) {
          var value = getNavTimingValue(key);
          if (typeof value === "undefined") {
            return "";
          }
          return prefix + value;
        };
        s = [
          ns,
          prefixNTValue("activationStart", "as"),
          prefixNTValue("redirectStart", "rs"),
          prefixNTValue("redirectEnd", "re"),
          prefixNTValue("fetchStart", "fs"),
          prefixNTValue("domainLookupStart", "ds"),
          prefixNTValue("domainLookupEnd", "de"),
          prefixNTValue("connectStart", "cs"),
          prefixNTValue("secureConnectionStart", "sc"),
          prefixNTValue("connectEnd", "ce"),
          prefixNTValue("requestStart", "qs"),
          prefixNTValue("responseStart", "bs"),
          prefixNTValue("responseEnd", "be"),
          prefixNTValue("domInteractive", "oi"),
          prefixNTValue("domContentLoadedEventStart", "os"),
          prefixNTValue("domContentLoadedEventEnd", "oe"),
          prefixNTValue("domComplete", "oc"),
          prefixNTValue("loadEventStart", "ls"),
          prefixNTValue("loadEventEnd", "le"),
          typeof startRender !== "undefined" ? "sr" + startRender : "",
          typeof fcp !== "undefined" ? "fc" + fcp : "",
          typeof lcp !== "undefined" ? "lc" + lcp : "",
        ].join("");
      }
      else if (endMark) {
        // This is a "main" page view that does NOT support Navigation Timing - strange.
        var end = floor(endMark.startTime);
        s =
          ns +
          "fs" +
          0 + // fetchStart is the same as navigationStart
          "ls" +
          end +
          "le" +
          end +
          "";
      }
      return s;
    }
    // Return First Contentful Paint or undefined if not supported.
    function getFcp() {
      var paintEntries = getEntriesByType("paint");
      for (var i = 0; i < paintEntries.length; i++) {
        var entry = paintEntries[i];
        if (entry.name === "first-contentful-paint") {
          return floor(entry.startTime);
        }
      }
      return undefined;
    }
    // Return Largest Contentful Paint or undefined if not supported.
    function getLcp() {
      var lcpEntries = getEntries("largest-contentful-paint");
      if (lcpEntries.length) {
        var lastEntry = lcpEntries[lcpEntries.length - 1];
        logger.logEvent(LogEvent.PerformanceEntryProcessed, [lastEntry]);
        return floor(lastEntry.startTime);
      }
      return undefined;
    }
    // Return best guess at Start Render time (in ms).
    // Mostly works on just Chrome and IE.
    // Return undefined if not supported.
    function getStartRender() {
      if ("PerformancePaintTiming" in self) {
        var paintEntries = getEntriesByType("paint");
        if (paintEntries.length) {
          // If the Paint Timing API is supported, use the value of the first paint event
          var paintValues = paintEntries.map(function (entry) { return entry.startTime; });
          return floor(Math.min.apply(null, paintValues));
        }
      }
      if (performance.timing && timing.msFirstPaint && __ENABLE_POLYFILLS) {
        // If IE/Edge, use the prefixed `msFirstPaint` property (see http://msdn.microsoft.com/ff974719).
        return floor(timing.msFirstPaint - timing.navigationStart);
      }
      logger.logEvent(LogEvent.PaintTimingNotSupported);
      return undefined;
    }
    function getINP() {
      if (!("PerformanceEventTiming" in self)) {
        return undefined;
      }
      return getHighPercentileINP();
    }
    function getCustomerId() {
      if (typeof LUX.customerid === "undefined") {
        // Extract the id of the lux.js script element.
        var luxScript = getScriptElement("/js/lux.js");
        if (luxScript) {
          LUX.customerid = getQuerystringParam(luxScript.src, "id");
        }
      }
      return LUX.customerid || "";
    }
    // Return the SCRIPT DOM element whose SRC contains the URL snippet.
    // This is used to find the LUX script element.
    function getScriptElement(urlsnippet) {
      var aScripts = document.getElementsByTagName("script");
      for (var i = 0, len = aScripts.length; i < len; i++) {
        var script = aScripts[i];
        if (script.src && -1 !== script.src.indexOf(urlsnippet)) {
          return script;
        }
      }
      return undefined;
    }
    function getQuerystringParam(url, name) {
      var qs = url.split("?")[1];
      var aTuples = qs.split("&");
      for (var i = 0, len = aTuples.length; i < len; i++) {
        var tuple = aTuples[i];
        var aTuple = tuple.split("=");
        var key = aTuple[0];
        if (name === key) {
          return aTuple[1];
        }
      }
      return undefined;
    }
    function avgDomDepth() {
      var aElems = document.getElementsByTagName("*");
      var i = aElems.length;
      var totalParents = 0;
      while (i--) {
        totalParents += numParents(aElems[i]);
      }
      var average = Math.round(totalParents / aElems.length);
      return average;
    }
    function numParents(elem) {
      var n = 0;
      if (elem.parentNode) {
        while ((elem = elem.parentNode)) {
          n++;
        }
      }
      return n;
    }
    function docHeight(doc) {
      var body = doc.body, docelem = doc.documentElement;
      var height = Math.max(body ? body.scrollHeight : 0, body ? body.offsetHeight : 0, docelem ? docelem.clientHeight : 0, docelem ? docelem.scrollHeight : 0, docelem ? docelem.offsetHeight : 0);
      return height;
    }
    function docWidth(doc) {
      var body = doc.body, docelem = doc.documentElement;
      var width = Math.max(body ? body.scrollWidth : 0, body ? body.offsetWidth : 0, docelem ? docelem.clientWidth : 0, docelem ? docelem.scrollWidth : 0, docelem ? docelem.offsetWidth : 0);
      return width;
    }
    // Return the main HTML document transfer size (in bytes).
    function docSize() {
      return navEntry.encodedBodySize || 0;
    }
    // Return the connection type based on Network Information API.
    // Note this API is in flux.
    function connectionType() {
      var c = navigator.connection;
      var connType = "";
      if (c && c.effectiveType) {
        connType = c.effectiveType;
        if ("slow-2g" === connType) {
          connType = "Slow 2G";
        }
        else if ("2g" === connType || "3g" === connType || "4g" === connType || "5g" === connType) {
          connType = connType.toUpperCase();
        }
        else {
          connType = connType.charAt(0).toUpperCase() + connType.slice(1);
        }
      }
      return connType;
    }
    // Return an array of image elements that are in the top viewport.
    function imagesATF() {
      var aImages = document.getElementsByTagName("img");
      var aImagesAtf = [];
      if (aImages) {
        for (var i = 0, len = aImages.length; i < len; i++) {
          var image = aImages[i];
          if (inViewport(image)) {
            aImagesAtf.push(image);
          }
        }
      }
      return aImagesAtf;
    }
    // Return the last element in the viewport.
    function lastViewportElement(parent) {
      if (!parent) {
        // We call this function recursively passing in the parent element,
        // but if no parent then start with BODY.
        parent = document.body;
      }
      var lastChildInViewport;
      if (parent) {
        // Got errors that parent was null so testing again here.
        // Find the last child that is in the viewport.
        // Elements are listed in DOM order.
        var aChildren = parent.children;
        if (aChildren) {
          for (var i = 0, len = aChildren.length; i < len; i++) {
            var child = aChildren[i];
            if (inViewport(child)) {
              // The children are in DOM order, so we just have to
              // save the LAST child that was in the viewport.
              lastChildInViewport = child;
            }
          }
        }
      }
      if (lastChildInViewport) {
        // See if this last child has any children in the viewport.
        return lastViewportElement(lastChildInViewport);
      }
      else {
        // If NONE of the children are in the viewport, return the parent.
        // This assumes that the parent is in the viewport because it was passed in.
        return parent;
      }
    }
    // Return true if the element is in the viewport.
    function inViewport(e) {
      var vh = document.documentElement.clientHeight;
      var vw = document.documentElement.clientWidth;
      // Return true if the top-left corner is in the viewport and it has width & height.
      var lt = findPos(e);
      return (lt[0] >= 0 &&
        lt[1] >= 0 &&
        lt[0] < vw &&
        lt[1] < vh &&
        e.offsetWidth > 0 &&
        e.offsetHeight > 0);
    }
    // Return an array containing the top & left coordinates of the element.
    // from http://www.quirksmode.org/js/findpos.html
    function findPos(e) {
      var curleft = 0;
      var curtop = 0;
      while (e) {
        curleft += e.offsetLeft;
        curtop += e.offsetTop;
        e = e.offsetParent;
      }
      return [curleft, curtop];
    }
    // Mark the load time of the current page. Intended to be used in SPAs where it is not desirable to
    // send the beacon as soon as the page has finished loading.
    function _markLoadTime(time) {
      logger.logEvent(LogEvent.MarkLoadTimeCalled, [time]);
      if (time) {
        _mark(END_MARK, { startTime: time });
      }
      else {
        _mark(END_MARK);
      }
    }
    function createMaxMeasureTimeout() {
      clearMaxMeasureTimeout();
      gMaxMeasureTimeout = window.setTimeout(function () {
        gFlags = addFlag(gFlags, Flags.BeaconSentAfterTimeout);
        _sendLux();
      }, globalConfig.maxMeasureTime - _now());
    }
    function clearMaxMeasureTimeout() {
      if (gMaxMeasureTimeout) {
        window.clearTimeout(gMaxMeasureTimeout);
      }
    }
    function _getBeaconUrl(customData) {
      var queryParams = [
        "v=" + SCRIPT_VERSION,
        "id=" + getCustomerId(),
        "sid=" + gSyncId,
        "uid=" + gUid,
        "l=" + encodeURIComponent(_getPageLabel()),
        "HN=" + encodeURIComponent(document.location.hostname),
        "PN=" + encodeURIComponent(document.location.pathname),
      ];
      if (gFlags) {
        queryParams.push("fl=" + gFlags);
      }
      var customerData = valuesToString(customData);
      if (customerData) {
        queryParams.push("CD=" + customerData);
        clearUpdateCustomData();
      }
      return globalConfig.beaconUrl + "?" + queryParams.join("&");
    }
    // Beacon back the LUX data.
    function _sendLux() {
      var _a;
      clearMaxMeasureTimeout();
      var customerid = getCustomerId();
      if (!customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        gbLuxSent // LUX data already sent
      ) {
        return;
      }
      logger.logEvent(LogEvent.DataCollectionStart);
      var startMark = _getMark(START_MARK);
      var endMark = _getMark(END_MARK);
      if (!startMark || (endMark && endMark.startTime < startMark.startTime)) {
        // Record the synthetic loadEventStart time for this page, unless it was already recorded
        // with LUX.markLoadTime()
        _markLoadTime();
      }
      var sIx = "";
      var INP = getINP();
      // It's possible that the interaction beacon has been sent before the main beacon. We don't want
      // to send the interaction metrics twice, so we only include them here if the interaction beacon
      // has not been sent.
      if (!gbIxSent) {
        sIx = ixValues();
        if (sIx === "") {
          // If there are no interaction metrics, we
          INP = undefined;
        }
      }
      var sET = elementTimingValues(); // Element Timing data
      var sCPU = cpuTimes();
      var CLS = getCLS$1();
      var sLuxjs = selfLoading();
      if (!isVisible()) {
        gFlags = addFlag(gFlags, Flags.VisibilityStateNotVisible);
      }
      if (wasPrerendered()) {
        gFlags = addFlag(gFlags, Flags.PageWasPrerendered);
      }
      if (LUX.conversions) {
        getMatchesFromPatternMap(LUX.conversions, location.hostname, location.pathname).forEach(function (conversion) {
          LUX.addData(conversion, BOOLEAN_TRUE);
        });
      }
      // We want ALL beacons to have ALL the data used for query filters (geo, pagelabel, browser, & customerdata).
      // So we create a base URL that has all the necessary information:
      var baseUrl = _getBeaconUrl(getAllCustomData());
      var is = inlineTagSize("script");
      var ic = inlineTagSize("style");
      var metricsQueryString =
        // only send Nav Timing and lux.js metrics on initial pageload (not for SPA page views)
        (gbNavSent ? "" : "&NT=" + getNavTiming()) +
        (gbFirstPV ? "&LJS=" + sLuxjs : "") +
        // Page Stats
        "&PS=ns" +
        numScripts() +
        "bs" +
        blockingScripts() +
        (is > -1 ? "is" + is : "") +
        "ss" +
        numStylesheets() +
        "bc" +
        blockingStylesheets() +
        (ic > -1 ? "ic" + ic : "") +
        "ia" +
        imagesATF().length +
        "it" +
        document.getElementsByTagName("img").length + // total number of images
        "dd" +
        avgDomDepth() +
        "nd" +
        document.getElementsByTagName("*").length + // numdomelements
        "vh" +
        document.documentElement.clientHeight + // see http://www.quirksmode.org/mobile/viewports.html
        "vw" +
        document.documentElement.clientWidth +
        "dh" +
        docHeight(document) +
        "dw" +
        docWidth(document) +
        (docSize() ? "ds" + docSize() : "") + // document HTTP transfer size (bytes)
        (connectionType() ? "ct" + connectionType() + "_" : "") + // delimit with "_" since values can be non-numeric so need a way to extract with regex in VCL
        "er" +
        nErrors +
        "nt" +
        navigationType() +
        (navigator.deviceMemory ? "dm" + Math.round(navigator.deviceMemory) : "") + // device memory (GB)
        (sIx ? "&IX=" + sIx : "") +
        (typeof gFirstInputDelay !== "undefined" ? "&FID=" + gFirstInputDelay : "") +
        (sCPU ? "&CPU=" + sCPU : "") +
        (sET ? "&ET=" + sET : "") + // element timing
        (typeof CLS !== "undefined" ? "&CLS=" + CLS : "") +
        (typeof INP !== "undefined" ? "&INP=" + INP : "");
      // We add the user timing entries last so that we can split them to reduce the URL size if necessary.
      var utValues = userTimingValues();
      var _b = fitUserTimingEntries(utValues, globalConfig, baseUrl + metricsQueryString), beaconUtValues = _b[0], remainingUtValues = _b[1];
      // Send the MAIN LUX beacon.
      var mainBeaconUrl = baseUrl +
      metricsQueryString +
      (beaconUtValues.length > 0 ? "&UT=" + beaconUtValues.join(",") : "");
      logger.logEvent(LogEvent.MainBeaconSent, [mainBeaconUrl]);
      _sendBeacon(mainBeaconUrl);
      // Set some states.
      gbLuxSent = 1;
      gbNavSent = 1;
      gbIxSent = sIx ? 1 : 0;
      // Send other beacons for JUST User Timing.
      while (remainingUtValues.length) {
        _a = fitUserTimingEntries(remainingUtValues, globalConfig, baseUrl), beaconUtValues = _a[0], remainingUtValues = _a[1];
        var utBeaconUrl = baseUrl + "&UT=" + beaconUtValues.join(",");
        logger.logEvent(LogEvent.UserTimingBeaconSent, [utBeaconUrl]);
        _sendBeacon(utBeaconUrl);
      }
    }
    var ixTimerId;
    function _sendIxAfterDelay() {
      window.clearTimeout(ixTimerId);
      ixTimerId = window.setTimeout(_sendIx, 100);
    }
    // Beacon back the IX data separately (need to sync with LUX beacon on the backend).
    function _sendIx() {
      var customerid = getCustomerId();
      if (!customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        gbIxSent || // IX data already sent
        !gbLuxSent // LUX has NOT been sent yet, so wait to include it there
      ) {
        return;
      }
      var sIx = ixValues(); // Interaction Metrics
      var INP = getINP();
      if (sIx) {
      var beaconUrl = _getBeaconUrl(getUpdatedCustomData()) +
        "&IX=" +
        sIx +
        (typeof gFirstInputDelay !== "undefined" ? "&FID=" + gFirstInputDelay : "") +
        (typeof INP !== "undefined" ? "&INP=" + INP : "");
        logger.logEvent(LogEvent.InteractionBeaconSent, [beaconUrl]);
        _sendBeacon(beaconUrl);
        gbIxSent = 1;
      }
    }
    // Beacon back customer data that is recorded _after_ the main beacon was sent
    // (i.e., customer data after window.onload).
    function _sendCustomerData() {
      var customerid = getCustomerId();
      if (!customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        !gbLuxSent // LUX has NOT been sent yet, so wait to include it there
      ) {
        return;
      }
      var sCustomerData = valuesToString(getUpdatedCustomData());
      if (sCustomerData) {
        var beaconUrl = _getBeaconUrl(getUpdatedCustomData());
        logger.logEvent(LogEvent.CustomDataBeaconSent, [beaconUrl]);
        _sendBeacon(beaconUrl);
      }
    }
    function _sendBeacon(url) {
      new Image().src = url;
    }
    // INTERACTION METRICS
    // Register event handlers to detect Interaction Metrics.
    // We only need to detect the FIRST of each event, after which we remove the handler for that event..
    // Each event handler is a standalone function so we can reference that function in removeListener.
    // If the event(s) happen before LUX finishes, then the IX metric(s) is(are) sent with LUX.
    // Most of the time, however, IX happens *after* LUX, so we send a separate IX beacon but
    // only beacon back the first interaction that happens.
    function _scrollHandler() {
      // Note for scroll input we don't remove the handlers or send the IX beacon because we want to
      // capture click and key events as well, since these are typically more important than scrolls.
      if (typeof ghIx["s"] === "undefined") {
        ghIx["s"] = _now();
      }
    }
    function _keyHandler(e) {
      _removeIxHandlers();
      if (typeof ghIx["k"] === "undefined") {
        ghIx["k"] = _now();
        if (e && e.target instanceof Element) {
          var trackId = interactionAttributionForElement(e.target);
          if (trackId) {
            ghIx["ki"] = trackId;
          }
        }
        _sendIxAfterDelay();
      }
    }
    function _clickHandler(e) {
      _removeIxHandlers();
      if (typeof ghIx["c"] === "undefined") {
        ghIx["c"] = _now();
        var target = void 0;
        try {
          // Seeing "Permission denied" errors, so do a simple try-catch.
          if (e && e.target instanceof Element) {
            target = e.target;
          }
        }
        catch (e) {
          logger.logEvent(LogEvent.EventTargetAccessError);
        }
        if (target) {
          if (e.clientX) {
            // Save the x&y of the mouse click.
            ghIx["cx"] = e.clientX;
            ghIx["cy"] = e.clientY;
          }
          var trackId = interactionAttributionForElement(target);
          if (trackId) {
            ghIx["ci"] = trackId;
          }
        }
        _sendIxAfterDelay();
      }
    }
    // Wrapper to support older browsers (<= IE8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function addListener(type, callback, useCapture) {
      if (useCapture === void 0) { useCapture = false; }
      if (window.addEventListener) {
        window.addEventListener(type, callback, useCapture);
      }
      else if (window.attachEvent && __ENABLE_POLYFILLS) {
        window.attachEvent("on" + type, callback);
      }
    }
    // Wrapper to support older browsers (<= IE8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function removeListener(type, callback, useCapture) {
      if (useCapture === void 0) { useCapture = false; }
      if (window.removeEventListener) {
        window.removeEventListener(type, callback, useCapture);
      }
      else if (window.detachEvent && __ENABLE_POLYFILLS) {
        window.detachEvent("on" + type, callback);
      }
    }
    function _addUnloadHandlers() {
      var onunload = function () {
        gFlags = addFlag(gFlags, Flags.BeaconSentFromUnloadHandler);
        logger.logEvent(LogEvent.UnloadHandlerTriggered);
        _sendLux();
        _sendIx();
      };
      // As well as visibilitychange, we also listen for pagehide. This is really only for browsers
      // with buggy visibilitychange implementations. For much older browsers that don't support
      // pagehide, we use unload and beforeunload.
      if ("onpagehide" in self) {
        addListener("pagehide", onunload, true);
      }
      else {
        addListener("unload", onunload, true);
        addListener("beforeunload", onunload, true);
      }
      addListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
          onunload();
        }
      }, true);
    }
    function _addIxHandlers() {
      addListener("scroll", _scrollHandler);
      addListener("keydown", _keyHandler);
      addListener("mousedown", _clickHandler);
    }
    function _removeIxHandlers() {
      removeListener("scroll", _scrollHandler);
      removeListener("keydown", _keyHandler);
      removeListener("mousedown", _clickHandler);
    }
    // This is a big number (epoch ms . random) that is used to matchup a LUX beacon with a separate IX beacon
    // (because they get sent at different times). Each "page view" (including SPA) should have a
    // unique gSyncId.
    function createSyncId(inSampleBucket) {
      if (inSampleBucket === void 0) { inSampleBucket = false; }
      if (inSampleBucket) {
        // "00" matches all sample rates
        return Number(new Date()) + "00000";
      }
      return Number(new Date()) + _padLeft(String(Math.round(100000 * Math.random())), "00000");
    }
    // Unique ID (also known as Session ID)
    // We use this to track all the page views in a single user session.
    // If there is NOT a UID then set it to the new value (which is the same as the "sync ID" for this page).
    // Refresh its expiration date and return its value.
    function refreshUniqueId(newValue) {
      var uid = _getCookie("lux_uid");
      if (!uid || uid.length < 11) {
        uid = newValue;
      }
      else {
        // Prevent sessions lasting more than 24 hours.
        // The first 10 characters of uid is the epoch time when the session started.
        var uidStart = parseInt(uid.substring(0, 10));
        var now_2 = Number(new Date()) / 1000; // in seconds
        if (now_2 - uidStart > 24 * 60 * 60) {
          // older than 24 hours - reset to new value
          uid = newValue;
        }
      }
      setUniqueId(uid);
      return uid;
    }
    function setUniqueId(uid) {
      _setCookie("lux_uid", uid, gSessionTimeout);
      return uid;
    }
    // We use gUid (session ID) to do sampling. We make this available to customers so
    // they can do sampling (A/B testing) using the same session ID.
    function _getUniqueId() {
      return gUid;
    }
    // Return the current page label.
    function _getPageLabel() {
      if (LUX.label) {
        gFlags = addFlag(gFlags, Flags.PageLabelFromLabelProp);
        return LUX.label;
      }
      if (typeof LUX.pagegroups !== "undefined") {
        var label = getMatchesFromPatternMap(LUX.pagegroups, location.hostname, location.pathname, true);
        if (label) {
          gFlags = addFlag(gFlags, Flags.PageLabelFromPagegroup);
          return label;
        }
      }
      if (typeof LUX.jspagelabel !== "undefined") {
        var evaluateJsPageLabel = Function('"use strict"; return ' + LUX.jspagelabel);
        try {
          var label = evaluateJsPageLabel();
          if (label) {
            gFlags = addFlag(gFlags, Flags.PageLabelFromGlobalVariable);
            return label;
          }
        }
        catch (e) {
          logger.logEvent(LogEvent.PageLabelEvaluationError, [LUX.jspagelabel, e]);
        }
      }
      // default to document.title
      gFlags = addFlag(gFlags, Flags.PageLabelFromDocumentTitle);
      return document.title;
    }
    function _getCookie(name) {
      try {
        // Seeing "Permission denied" errors, so do a simple try-catch.
        var aTuples = document.cookie.split(";");
        for (var i = 0; i < aTuples.length; i++) {
          var aTuple = aTuples[i].split("=");
          if (name === aTuple[0].trim()) {
            // cookie name starts with " " if not first
            return unescape(aTuple[1]);
          }
        }
      }
      catch (e) {
        logger.logEvent(LogEvent.CookieReadError);
      }
      return undefined;
    }
    function _setCookie(name, value, seconds) {
      try {
        document.cookie =
          name +
          "=" +
          escape(value) +
          (seconds ? "; max-age=" + seconds : "") +
          "; path=/; SameSite=Lax";
      }
      catch (e) {
        logger.logEvent(LogEvent.CookieSetError);
      }
    }
    // "padding" MUST be the length of the resulting string, eg, "0000" if you want a result of length 4.
    function _padLeft(str, padding) {
      return (padding + str).slice(-padding.length);
    }
    // Set "LUX.auto=false" to disable send results automatically and
    // instead you must call LUX.send() explicitly.
    if (globalConfig.auto) {
      var sendBeaconAfterMinimumMeasureTime_1 = function () {
        var elapsedTime = _now();
        var timeRemaining = globalConfig.minMeasureTime - elapsedTime;
        if (timeRemaining <= 0) {
          logger.logEvent(LogEvent.OnloadHandlerTriggered, [
            elapsedTime,
            globalConfig.minMeasureTime,
          ]);
          if (document.readyState === "complete") {
            // If onload has already passed, send the beacon now.
            _sendLux();
          }
          else {
            // Ow, send the beacon slightly after window.onload.
            addListener("load", function () {
              setTimeout(_sendLux, 200);
            });
          }
        }
        else {
          // Try again after the minimum measurement time has elapsed
          setTimeout(sendBeaconAfterMinimumMeasureTime_1, timeRemaining);
        }
      };
      if (globalConfig.autoWhenHidden) {
        // The autoWhenHidden config forces the beacon to be sent even when the page is not visible.
        sendBeaconAfterMinimumMeasureTime_1();
      }
      else {
        // Otherwise we only send the beacon when the page is visible.
        onVisible(sendBeaconAfterMinimumMeasureTime_1);
      }
    }
    // Add the unload handlers when sendBeaconOnPageHidden is enabled
    if (globalConfig.sendBeaconOnPageHidden) {
      _addUnloadHandlers();
    }
    // Regardless of userConfig.auto, we need to register the IX handlers immediately.
    _addIxHandlers();
    // Set the maximum measurement timer
    createMaxMeasureTimeout();
    /**
     * LUX functions and properties must be attached to the existing global object to ensure that
     * changes made to the global object are reflected in the "internal" LUX object, and vice versa.
     */
    var globalLux = globalConfig;
    // Functions
    globalLux.mark = _mark;
    globalLux.measure = _measure;
    globalLux.init = _init;
    globalLux.markLoadTime = _markLoadTime;
    globalLux.send = function () {
      logger.logEvent(LogEvent.SendCalled);
      _sendLux();
    };
    globalLux.addData = _addData;
    globalLux.getSessionId = _getUniqueId; // so customers can do their own sampling
    globalLux.getDebug = function () { return logger.getEvents(); };
    globalLux.forceSample = function () {
      logger.logEvent(LogEvent.ForceSampleCalled);
      setUniqueId(createSyncId(true));
    };
    globalLux.doUpdate = function () {
      // Deprecated, intentionally empty.
    };
    globalLux.cmd = _runCommand;
    // Public properties
    globalLux.version = SCRIPT_VERSION;
    /**
     * Run a command from the command queue
     */
    function _runCommand(_a) {
      var fn = _a[0], args = _a.slice(1);
      if (typeof globalLux[fn] === "function") {
        // eslint-disable-next-line @typescript-eslint/ban-types
        globalLux[fn].apply(globalLux, args);
      }
    }
    // Process the command queue
    if (LUX.ac && LUX.ac.length) {
      LUX.ac.forEach(_runCommand);
    }
    // process the error events that happened before lux.js got loaded
    if (typeof window.LUX_ae !== "undefined") {
      window.LUX_ae.forEach(errorHandler);
    }
    logger.logEvent(LogEvent.EvaluationEnd);
    return globalLux;
  })();
  window.LUX = LUX;
  scriptEndTime = now();
  // ---------------------------------------------------------------------------
  // More settings
  // ---------------------------------------------------------------------------
  //
  // This ID usually appended to the end of the lux.js as a query string when
  // using the SpeedCurve hosted version - but we have to include it here as
  // this is self hosted.
  LUX.customerid = 47044334;

  // Setting debug to `true` shows what happening as it happens. Running
  // `LUX.getDebug()` in the browser's console will show the history of what's
  // happened.
  // LUX.debug = true;

  // Forces sampling - useful for when used with `debug = true`
  // LUX.forceSample()

  // ---------------------------------------------------------------------------
  // End of more settings
  // ---------------------------------------------------------------------------
})();
//# sourceMappingURL=lux.js.map
