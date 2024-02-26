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

  var luxOrigin = "https://lux.speedcurve.com";
  function fromObject(obj) {
    var autoMode = getProperty(obj, "auto", true);
    return {
      auto: autoMode,
      beaconUrl: getProperty(obj, "beaconUrl", luxOrigin + "/lux/"),
      conversions: getProperty(obj, "conversions"),
      customerid: getProperty(obj, "customerid"),
      errorBeaconUrl: getProperty(obj, "errorBeaconUrl", luxOrigin + "/error/"),
      jspagelabel: getProperty(obj, "jspagelabel"),
      label: getProperty(obj, "label"),
      maxBeaconUrlLength: getProperty(obj, "maxBeaconUrlLength", 8190),
      maxBeaconUTEntries: getProperty(obj, "maxBeaconUTEntries", 20),
      maxErrors: getProperty(obj, "maxErrors", 5),
      maxMeasureTime: getProperty(obj, "maxMeasureTime", 60000),
      minMeasureTime: getProperty(obj, "minMeasureTime", 0),
      newBeaconOnPageShow: getProperty(obj, "newBeaconOnPageShow", false),
      samplerate: getProperty(obj, "samplerate", 100),
      sendBeaconOnPageHidden: getProperty(obj, "sendBeaconOnPageHidden", autoMode),
      serverTiming: getProperty(obj, "serverTiming"),
      trackErrors: getProperty(obj, "trackErrors", true),
      trackHiddenPages: getProperty(obj, "trackHiddenPages", false),
      pagegroups: getProperty(obj, "pagegroups"),
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
  var max = Math.max;
  /**
  * Clamp a number so that it is never less than 0
  */
  function clamp(x) {
    return max(0, x);
  }
  function sortNumeric(a, b) {
    return a - b;
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
      var nativeEntry = navEntries[0];
      var entry_1 = {
        navigationStart: 0,
        activationStart: 0,
      };
      for (var key in nativeEntry) {
        entry_1[key] = nativeEntry[key];
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
    {
      for (var key in timing) {
        if (typeof timing[key] === "number" && key !== "navigationStart") {
          entry[key] = floor(timing[key] - timing.navigationStart);
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
    afterPrerender(function () {
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
    });
  }
  function afterPrerender(cb) {
    if (document.prerendering) {
      document.addEventListener("prerenderingchange", cb, true);
    }
    else {
      cb();
    }
  }
  function wasPrerendered() {
    return document.prerendering || getNavigationEntry().activationStart > 0;
  }
  function wasRedirected() {
    return getNavigationEntry().redirectCount > 0 || timing.redirectEnd > 0;
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
    PageLabelFromUrlPattern: 1 << 9,
    PageWasPrerendered: 1 << 10,
    PageWasBfCacheRestored: 1 << 11,
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
    SendCancelledPageHidden: 13,
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
  var maximumSessionValue = 0;
  function addEntry$2(entry) {
    if (!entry.hadRecentInput) {
      var firstEntry = sessionEntries[0];
      var latestEntry = sessionEntries[sessionEntries.length - 1];
      if (sessionEntries.length && (entry.startTime - latestEntry.startTime >= 1000 || entry.startTime - firstEntry.startTime >= 5000)) {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }
      else {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      }
      maximumSessionValue = max(maximumSessionValue, sessionValue);
    }
  }
  function reset$1() {
    sessionValue = 0;
    sessionEntries = [];
    maximumSessionValue = 0;
  }
  function getCLS() {
    return maximumSessionValue;
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
        existingEntry.duration = max(duration, existingEntry.duration);
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

  var ALL_ENTRIES = [];
  function observe(type, callback, options) {
    if (typeof PerformanceObserver === "function" &&
    PerformanceObserver.supportedEntryTypes.includes(type)) {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) { return callback(entry); });
      });
      po.observe(Object.assign({ type: type, buffered: true }, { options: options }));
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

  /**
  * A server timing metric that has its value set to the duration field
  */
  var TYPE_DURATION = "r";
  /**
  * When a description metric has no value, we consider it to be a boolean and set it to this value.
  */
  var BOOLEAN_TRUE_VALUE = "true";
  function getKeyValuePairs(config, serverTiming) {
    var pairs = {};
    serverTiming.forEach(function (stEntry) {
      var name = stEntry.name;
      var description = stEntry.description;
      if (name in config) {
        var spec = config[name];
        var multiplier = spec[1];
        if (spec[0] === TYPE_DURATION) {
          pairs[name] = stEntry.duration * (multiplier || 1);
        }
        else if (description && multiplier) {
          var numericValue = parseFloat(description);
          if (!isNaN(numericValue)) {
            pairs[name] = numericValue * multiplier;
          }
        }
        else {
          pairs[name] = description || BOOLEAN_TRUE_VALUE;
        }
      }
    });
    return pairs;
  }

  function getMatchesFromPatternMap(patternMap, hostname, pathname, firstOnly) {
    var matches = [];
    for (var key in patternMap) {
      var patterns = patternMap[key];
      if (Array.isArray(patterns)) {
        for (var i in patterns) {
          var pattern = patterns[i];
          if (typeof pattern === "string" && patternMatchesUrl(pattern, hostname, pathname)) {
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
    return new RegExp("^" + escapeStringForRegExp(pattern).replace(/\*/g, ".*") + "$", "i");
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
    // This ID usually appended to the end of the lux.js as a query string when
    // using the SpeedCurve hosted version - but we have to include it here as
    // this is self hosted.
    LUX.customerid = 47044334;
    // Set the sample rate to 1% to avoid all events being sent.
    LUX.samplerate = 1;
    // -------------------------------------------------------------------------
    /// End
    // -------------------------------------------------------------------------
    var SCRIPT_VERSION = "313";
    var logger = new Logger();
    var globalConfig = fromObject(LUX);
    logger.logEvent(LogEvent.EvaluationStart, [SCRIPT_VERSION, globalConfig]);
    // Variable aliases that allow the minifier to reduce file size.
    var document = window.document;
    var addEventListener = window.addEventListener;
    var removeEventListener = window.removeEventListener;
    var setTimeout = window.setTimeout;
    var clearTimeout = window.clearTimeout;
    var encodeURIComponent = window.encodeURIComponent;
    var thisScript = document.currentScript || {};
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
    addEventListener("error", errorHandler);
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
        var entryTime = entry.processingStart - entry.startTime;
        if (!gFirstInputDelay || gFirstInputDelay < entryTime) {
          gFirstInputDelay = floor(entryTime);
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
    var gCustomDataTimeout; // setTimeout timer for sending a Custom data beacon after onload
    var gMaxMeasureTimeout; // setTimeout timer for sending the beacon after a maximum measurement time
    var pageRestoreTime; // ms since navigationStart representing when the page was restored from the bfcache
    /**
    * To measure the way a user experienced a metric, we measure metrics relative to the time the user
    * started viewing the page. On prerendered pages, this is activationStart. On bfcache restores, this
    * is the page restore time. On all other pages this value will be zero.
    */
    var getZeroTime = function () {
      var _a;
      return Math.max(pageRestoreTime || 0, getNavigationEntry().activationStart, ((_a = _getMark(START_MARK)) === null || _a === void 0 ? void 0 : _a.startTime) || 0);
    };
    /**
    * Most time-based metrics that LUX reports should be relative to the "zero" marker, rounded down
    * to the nearest unit so as not to report times in the future, and clamped to zero.
    */
    var processTimeMetric = function (value) { return clamp(floor(value - getZeroTime())); };
    /**
    * Some values should only be reported if they are non-zero. The exception to this is when the page
    * was prerendered or restored from BF cache
    */
    var shouldReportValue = function (value) { return value > 0 || pageRestoreTime || wasPrerendered(); };
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
        gFirstInputDelay = floor(delay);
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
        removeEventListener("pointerup", onPointerUp, ghListenerOptions);
        removeEventListener("pointercancel", onPointerCancel, ghListenerOptions);
      }
      addEventListener("pointerup", onPointerUp, ghListenerOptions);
      addEventListener("pointercancel", onPointerCancel, ghListenerOptions);
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
      addEventListener(eventType, onInput, ghListenerOptions);
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
        return floor(sinceNavigationStart - startMark.startTime);
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
      {
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
      {
        var navEntry = getNavigationEntry();
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
      var tZero = getZeroTime();
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
          hUT[name].startTime = max(startTime, hUT[name].startTime);
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
      getEntries("element").forEach(function (entry) {
        if (entry.identifier && entry.startTime) {
          var value = processTimeMetric(entry.startTime);
          if (shouldReportValue(value)) {
            logger.logEvent(LogEvent.PerformanceEntryProcessed, [entry]);
            aET.push(entry.identifier + "|" + value);
          }
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
        var tZero_1 = getZeroTime();
        longTaskEntries.forEach(function (entry) {
          var dur = floor(entry.duration);
          if (entry.startTime < tZero_1) {
            // In a SPA it is possible that we were in the middle of a Long Task when
            // LUX.init() was called. If so, only include the duration after tZero.
            dur -= tZero_1 - entry.startTime;
          }
          // Only process entries that we calculated to have a valid duration
          if (dur > 0) {
            logger.logEvent(LogEvent.PerformanceEntryProcessed, [entry]);
            var type = entry.attribution[0].name;
            if (!hCPU[type]) {
              hCPU[type] = 0;
              hCPUDetails[type] = "";
            }
            hCPU[type] += dur;
            // Send back the raw startTime and duration, as well as the adjusted duration.
            hCPUDetails[type] += "," + floor(entry.startTime) + "|" + dur;
          }
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
      hStats.count +
      ",d|" +
      hStats.median +
      ",x|" +
      hStats.max +
      (typeof hStats.fci === "undefined" ? "" : ",i|" + hStats.fci);
      sCPU += "s|" + hCPU[jsType] + sStats + hCPUDetails[jsType];
      return sCPU;
    }
    // Return a hash of "stats" about the CPU details incl. count, max, and median.
    function cpuStats(sDetails) {
      // tuples of starttime|duration, eg: ,456|250,789|250,1012|250
      var max = 0;
      // FCI is beginning of 5 second window of no Long Tasks _after_ first contentful paint
      var fcp = getFcp();
      var fci = fcp || 0;
      // If FCP is not supported, we can't calculate a valid FCI.
      var bFoundFci = typeof fcp === "undefined";
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
              var val = processTimeMetric(start + dur);
              if (shouldReportValue(val)) {
                fci = val; // FCI is now the end of this Long Task
              }
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
      aValues.sort(sortNumeric);
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
        var aResources = performance.getEntriesByName(thisScript.src);
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
        // _after_ window.onload. So we have to send a Custom data beacon that
        // includes the new custom data.
        // Do setTimeout so that if there are multiple back-to-back addData calls
        // we get them all in one beacon.
        if (gCustomDataTimeout) {
          // Cancel the timer for any previous beacons so that if they have not
          // yet been sent we can combine all the data in a new beacon.
          clearTimeout(gCustomDataTimeout);
        }
        gCustomDataTimeout = setTimeout(_sendCustomData, 100);
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
    /**
    * Re-initialize lux.js to start a new "page". This is typically called within a SPA at the
    * beginning of a page transition, but is also called internally when the BF cache is restored.
    */
    function _init(startTime, clearFlags) {
      if (clearFlags === void 0) { clearFlags = true; }
      // Some customers (incorrectly) call LUX.init on the very first page load of a SPA. This would
      // cause some first-page-only data (like paint metrics) to be lost. To prevent this, we silently
      // bail from this function when we detect an unnecessary LUX.init call.
      var endMark = _getMark(END_MARK);
      if (!endMark) {
        return;
      }
      // Mark the "navigationStart" for this SPA page. A start time can be passed through, for example
      // to set a page's start time as an event timestamp.
      if (startTime) {
        _mark(START_MARK, { startTime: startTime });
      }
      else {
        _mark(START_MARK);
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
      reset$1();
      reset();
      nErrors = 0;
      gFirstInputDelay = undefined;
      // Clear flags then set the flag that init was called (ie, this is a SPA).
      if (clearFlags) {
        gFlags = 0;
        gFlags = addFlag(gFlags, Flags.InitCalled);
      }
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
        if (e.src && !e.async && !e.defer && 0 !== (e.compareDocumentPosition(lastViewportElem) & 4)) {
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
      if (startMark && endMark && !pageRestoreTime) {
        // This is a SPA page view, so send the SPA marks & measures instead of Nav Timing.
        // Note: pageRestoreTime indicates this was a bfcache restore, which we don't want to treat as a SPA.
        var start = floor(startMark.startTime); // the start mark is "zero"
        ns += start; // "navigationStart" for a SPA is the real navigationStart plus the start mark
        var end = floor(endMark.startTime) - start; // delta from start mark
        s =
        ns +
        // fetchStart and activationStart are the same as navigationStart for a SPA
        "as" +
        0 +
        "fs" +
        0 +
        "ls" +
        end +
        "le" +
        end +
        "";
      }
      else if (performance.timing) {
        // Return the real Nav Timing metrics because this is the "main" page view (not a SPA)
        var navEntry_1 = getNavigationEntry();
        var startRender = getStartRender();
        var fcp = getFcp();
        var lcp = getLcp();
        var prefixNTValue = function (key, prefix, ignoreZero) {
          if (typeof navEntry_1[key] === "number") {
            var value = navEntry_1[key];
            // We allow zero values for most navigation timing metrics, but for some metrics we want
            // to ignore zeroes. The exceptions are that all metrics can be zero if the page was either
            // prerendered or restored from the BF cache.
            if (shouldReportValue(value) || !ignoreZero) {
              return prefix + processTimeMetric(value);
            }
          }
          return "";
        };
        var loadEventStartStr = prefixNTValue("loadEventStart", "ls", true);
        var loadEventEndStr = prefixNTValue("loadEventEnd", "le", true);
        if (pageRestoreTime && startMark && endMark) {
          // For bfcache restores, we set the load time to the time it took for the page to be restored.
          var loadTime = floor(endMark.startTime - startMark.startTime);
          loadEventStartStr = "ls" + loadTime;
          loadEventEndStr = "le" + loadTime;
        }
        var redirect = wasRedirected();
        var isSecure = document.location.protocol === "https:";
        s = [
          ns,
          "as" + clamp(navEntry_1.activationStart),
          redirect && !pageRestoreTime ? prefixNTValue("redirectStart", "rs") : "",
          redirect && !pageRestoreTime ? prefixNTValue("redirectEnd", "re") : "",
          prefixNTValue("fetchStart", "fs"),
          prefixNTValue("domainLookupStart", "ds"),
          prefixNTValue("domainLookupEnd", "de"),
          prefixNTValue("connectStart", "cs"),
          isSecure ? prefixNTValue("secureConnectionStart", "sc") : "",
          prefixNTValue("connectEnd", "ce"),
          prefixNTValue("requestStart", "qs"),
          prefixNTValue("responseStart", "bs"),
          prefixNTValue("responseEnd", "be"),
          prefixNTValue("domInteractive", "oi", true),
          prefixNTValue("domContentLoadedEventStart", "os", true),
          prefixNTValue("domContentLoadedEventEnd", "oe", true),
          prefixNTValue("domComplete", "oc", true),
          loadEventStartStr,
          loadEventEndStr,
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
          var value = processTimeMetric(entry.startTime);
          if (shouldReportValue(value)) {
            return value;
          }
        }
      }
      return undefined;
    }
    // Return Largest Contentful Paint or undefined if not supported.
    function getLcp() {
      var lcpEntries = getEntries("largest-contentful-paint");
      if (lcpEntries.length) {
        var lastEntry = lcpEntries[lcpEntries.length - 1];
        var value = processTimeMetric(lastEntry.startTime);
        if (shouldReportValue(value)) {
          logger.logEvent(LogEvent.PerformanceEntryProcessed, [lastEntry]);
          return value;
        }
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
          var paintValues = paintEntries.map(function (entry) { return entry.startTime; }).sort(sortNumeric);
          // Use the earliest valid paint entry as the start render time.
          for (var i = 0; i < paintValues.length; i++) {
            var value = processTimeMetric(paintValues[i]);
            if (shouldReportValue(value)) {
              return value;
            }
          }
        }
      }
      if (performance.timing && timing.msFirstPaint && true) {
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
      return LUX.customerid || "";
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
      var height = max(body ? body.scrollHeight : 0, body ? body.offsetHeight : 0, docelem ? docelem.clientHeight : 0, docelem ? docelem.scrollHeight : 0, docelem ? docelem.offsetHeight : 0);
      return height;
    }
    function docWidth(doc) {
      var body = doc.body, docelem = doc.documentElement;
      var width = max(body ? body.scrollWidth : 0, body ? body.offsetWidth : 0, docelem ? docelem.clientWidth : 0, docelem ? docelem.scrollWidth : 0, docelem ? docelem.offsetWidth : 0);
      return width;
    }
    // Return the main HTML document transfer size (in bytes).
    function docSize() {
      return getNavigationEntry().encodedBodySize || 0;
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
      return (lt[0] >= 0 && lt[1] >= 0 && lt[0] < vw && lt[1] < vh && e.offsetWidth > 0 && e.offsetHeight > 0);
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
      gMaxMeasureTimeout = setTimeout(function () {
        gFlags = addFlag(gFlags, Flags.BeaconSentAfterTimeout);
        _sendLux();
      }, globalConfig.maxMeasureTime - _now());
    }
    function clearMaxMeasureTimeout() {
      if (gMaxMeasureTimeout) {
        clearTimeout(gMaxMeasureTimeout);
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
      var customDataValues = valuesToString(customData);
      if (customDataValues) {
        queryParams.push("CD=" + customDataValues);
        clearUpdateCustomData();
      }
      return globalConfig.beaconUrl + "?" + queryParams.join("&");
    }
    // Beacon back the LUX data.
    function _sendLux() {
      var _a;
      if (!isVisible() && !globalConfig.trackHiddenPages) {
        logger.logEvent(LogEvent.SendCancelledPageHidden);
        return;
      }
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
      if (globalConfig.serverTiming) {
        var navEntry = getNavigationEntry();
        if (navEntry.serverTiming) {
          var stPairs = getKeyValuePairs(globalConfig.serverTiming, navEntry.serverTiming);
          for (var name_2 in stPairs) {
            _addData(name_2, stPairs[name_2]);
          }
        }
      }
      if (LUX.conversions) {
        getMatchesFromPatternMap(LUX.conversions, location.hostname, location.pathname).forEach(function (conversion) {
          LUX.addData(conversion, BOOLEAN_TRUE);
        });
      }
      // We want ALL beacons to have ALL the data used for query filters (geo, pagelabel, browser, & custom data).
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
      clearTimeout(ixTimerId);
      ixTimerId = setTimeout(_sendIx, 100);
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
    // Beacon back custom data that is recorded _after_ the main beacon was sent
    // (i.e., custom data after window.onload).
    function _sendCustomData() {
      var customerid = getCustomerId();
      if (!customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        !gbLuxSent // LUX has NOT been sent yet, so wait to include it there
      ) {
        return;
      }
      var customDataValues = valuesToString(getUpdatedCustomData());
      if (customDataValues) {
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
      var keyCode = e.keyCode;
      /**
      * Ignore modifier keys
      *
      * 16 = Shift
      * 17 = Control
      * 18 = Alt
      * 20 = Caps Lock
      * 224 = Meta/Command
      */
      if (keyCode === 16 || keyCode === 17 || keyCode === 18 || keyCode === 20 || keyCode === 224) {
        return;
      }
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
      if (addEventListener) {
        addEventListener(type, callback, useCapture);
      }
      else if (window.attachEvent && true) {
        window.attachEvent("on" + type, callback);
      }
    }
    // Wrapper to support older browsers (<= IE8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function removeListener(type, callback, useCapture) {
      if (useCapture === void 0) { useCapture = false; }
      if (removeEventListener) {
        removeEventListener(type, callback, useCapture);
      }
      else if (window.detachEvent && true) {
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
          gFlags = addFlag(gFlags, Flags.PageLabelFromUrlPattern);
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
      var sendBeaconWhenVisible_1 = function () {
        if (globalConfig.trackHiddenPages) {
          _sendLux();
        }
        else {
          onVisible(_sendLux);
        }
      };
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
            sendBeaconWhenVisible_1();
          }
          else {
            // Ow, send the beacon slightly after window.onload.
            addListener("load", function () {
              setTimeout(sendBeaconWhenVisible_1, 200);
            });
          }
        }
        else {
          // Try again after the minimum measurement time has elapsed
          setTimeout(sendBeaconAfterMinimumMeasureTime_1, timeRemaining);
        }
      };
      sendBeaconAfterMinimumMeasureTime_1();
    }
    // When newBeaconOnPageShow = true, we initiate a new page view whenever a page is restored from
    // bfcache. Since we have no "onload" event to hook into after a bfcache restore, we rely on the
    // unload and maxMeasureTime handlers to send the beacon.
    if (globalConfig.newBeaconOnPageShow) {
      addEventListener("pageshow", function (event) {
        if (event.persisted) {
          // Record the timestamp of the bfcache restore
          pageRestoreTime = event.timeStamp;
          // In Chromium, document.visibilityState is still "hidden" when pageshow fires after a bfcache
          // restore. Wrapping this in a setTimeout ensures the browser has enough time to update the
          // visibility.
          // See https://bugs.chromium.org/p/chromium/issues/detail?id=1133363
          setTimeout(function () {
            if (gbLuxSent) {
              // If the beacon was already sent for this page, we start a new page view and mark the
              // load time as the time it took to restore the page.
              _init(pageRestoreTime, false);
              _markLoadTime();
            }
            // Flag the current page as a bfcache restore
            gFlags = addFlag(gFlags, Flags.PageWasBfCacheRestored);
          }, 0);
        }
      });
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
