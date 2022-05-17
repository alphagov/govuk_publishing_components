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
  "use strict";

  function now() {
    return Date.now ? Date.now() : +new Date();
  }

  var LUX_t_start = now();

  function fromObject(obj) {
    var autoMode = getProperty(obj, "auto", true);
    return {
      auto: autoMode,
      beaconUrl: getProperty(obj, "beaconUrl", "https://lux.speedcurve.com/lux/"),
      customerid: getProperty(obj, "customerid", undefined),
      debug: getProperty(obj, "debug", false),
      errorBeaconUrl: getProperty(obj, "errorBeaconUrl", "https://lux.speedcurve.com/error/"),
      jspagelabel: getProperty(obj, "jspagelabel", undefined),
      label: getProperty(obj, "label", undefined),
      maxErrors: getProperty(obj, "maxErrors", 5),
      maxMeasureTime: getProperty(obj, "maxMeasureTime", 60000),
      measureUntil: getProperty(obj, "measureUntil", "onload"),
      minMeasureTime: getProperty(obj, "minMeasureTime", 0),
      samplerate: getProperty(obj, "samplerate", 100),
      sendBeaconOnPageHidden: getProperty(obj, "sendBeaconOnPageHidden", autoMode),
      trackErrors: getProperty(obj, "trackErrors", true),
    };
  }
  function getProperty(obj, key, defaultValue) {
    if (typeof obj[key] !== "undefined") {
      return obj[key];
    }
    return defaultValue;
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
      if (args === void 0) {
        args = [];
      }
      this.events.push([now(), event, args]);
    };
    Logger.prototype.getEvents = function () {
      return this.events;
    };
    return Logger;
  })();

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
  };
  function addFlag(flags, flag) {
    return flags | flag;
  }

  // If the various performance APIs aren't available, we export an empty object to
  // prevent having to make regular typeof checks.
  var performance = window.performance || {};
  var timing = performance.timing || {};
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
    } else if (typeof performance.webkitGetEntriesByType === "function") {
      var entries = performance.webkitGetEntriesByType(type);
      if (entries && entries.length) {
        return entries;
      }
    }
    return [];
  }

  var LUX = window.LUX || {};
  // Get a timestamp as close to navigationStart as possible.
  var _navigationStart = LUX.ns ? LUX.ns : now();
  var LUX_t_end = LUX_t_start;
  LUX = (function () {
    // -------------------------------------------------------------------------
    // Settings
    // -------------------------------------------------------------------------
    // Set the sample rate to 1% to avoid all events being sent.
    LUX.samplerate = 1;
    // -------------------------------------------------------------------------
    /// End
    // -------------------------------------------------------------------------

    var SCRIPT_VERSION = "301";
    var logger = new Logger();
    var userConfig = fromObject(LUX);
    logger.logEvent(LogEvent.EvaluationStart, [SCRIPT_VERSION]);
    // Log JS errors.
    var nErrors = 0;
    function errorHandler(e) {
      if (!userConfig.trackErrors) {
        return;
      }
      nErrors++;
      if (
        e &&
        typeof e.filename !== "undefined" &&
        typeof e.message !== "undefined"
      ) {
        // Always send LUX errors
        var isLuxError =
          e.filename.indexOf("/lux.js?") > -1 || e.message.indexOf("LUX") > -1;
        if (isLuxError || (nErrors <= userConfig.maxErrors && _sample())) {
          // Sample & limit other errors.
          // Send the error beacon.
          new Image().src =
            userConfig.errorBeaconUrl +
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
    // Initialize performance observer
    // Note: This code was later added to the LUX snippet. In the snippet we ONLY collect
    //       Long Task entries because that is the only entry type that can not be buffered.
    //       We _copy_ any Long Tasks collected by the snippet and ignore it after that.
    var gaSnippetLongTasks =
      typeof window.LUX_al === "object" ? window.LUX_al : [];
    var gaPerfEntries = gaSnippetLongTasks.slice(); // array of Long Tasks (prefer the array from the snippet)
    if (typeof PerformanceObserver === "function") {
      var perfObserver = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          logger.logEvent(LogEvent.PerformanceEntryReceived, [entry]);
          // Only record long tasks that weren't already recorded by the PerformanceObserver in the snippet
          if (
            entry.entryType !== "longtask" ||
            gaPerfEntries.indexOf(entry) === -1
          ) {
            gaPerfEntries.push(entry);
          }
        });
      });
      try {
        if (typeof PerformanceLongTaskTiming === "function") {
          perfObserver.observe({ type: "longtask", buffered: true });
        }
        if (typeof LargestContentfulPaint === "function") {
          perfObserver.observe({
            type: "largest-contentful-paint",
            buffered: true,
          });
        }
        if (typeof PerformanceElementTiming === "function") {
          perfObserver.observe({ type: "element", buffered: true });
        }
        if (typeof PerformancePaintTiming === "function") {
          perfObserver.observe({ type: "paint", buffered: true });
        }
        if (typeof LayoutShift === "function") {
          perfObserver.observe({ type: "layout-shift", buffered: true });
        }
      } catch (e) {
        logger.logEvent(LogEvent.PerformanceObserverError, [e]);
      }
    }
    // Bitmask of flags for this session & page
    var gFlags = 0;
    // array of marks where each element is a hash
    var gaMarks = typeof LUX.gaMarks !== "undefined" ? LUX.gaMarks : [];
    // array of measures where each element is a hash
    var gaMeasures =
      typeof LUX.gaMeasures !== "undefined" ? LUX.gaMeasures : [];
    var ghIx = {}; // hash for Interaction Metrics (scroll, click, keyboard)
    var ghData = {}; // hash for data that is specific to the customer (eg, userid, conversion info)
    var gbLuxSent = 0; // have we sent the LUX data? (avoid sending twice in unload)
    var gbNavSent = 0; // have we sent the Nav Timing beacon yet? (avoid sending twice for SPA)
    var gbIxSent = 0; // have we sent the IX data? (avoid sending twice for SPA)
    var gbFirstPV = 1; // this is the first page view (vs. a SPA "soft nav")
    var gStartMark = "LUX_start"; // the name of the mark that corresponds to "navigationStart" for SPA
    var gEndMark = "LUX_end"; // the name of the mark that corresponds to "loadEventStart" for SPA
    var gSessionTimeout = 30 * 60; // number of seconds after which we consider a session to have "timed out" (used for calculating bouncerate)
    var gSyncId = createSyncId(); // if we send multiple beacons, use this to sync them (eg, LUX & IX) (also called "luxid")
    var gUid = refreshUniqueId(gSyncId); // cookie for this session ("Unique ID")
    var gCustomerDataTimeout; // setTimeout timer for sending a Customer Data beacon after onload
    var gMaxMeasureTimeout; // setTimeout timer for sending the beacon after a maximum measurement time
    var gMaxQuerystring = 8190; // split the beacon querystring if it gets longer than this
    if (_sample()) {
      logger.logEvent(LogEvent.SessionIsSampled, [userConfig.samplerate]);
    } else {
      logger.logEvent(LogEvent.SessionIsNotSampled, [userConfig.samplerate]);
    }
    var gLuxSnippetStart = 0;
    if (timing.navigationStart) {
      _navigationStart = timing.navigationStart;
      // Record when the LUX snippet was evaluated relative to navigationStart.
      gLuxSnippetStart = LUX.ns ? LUX.ns - _navigationStart : 0;
    } else {
      logger.logEvent(LogEvent.NavTimingNotSupported);
      gFlags = addFlag(gFlags, Flags.NavTimingNotSupported);
    }
    logger.logEvent(LogEvent.NavigationStart, [_navigationStart]);
    ////////////////////// FID BEGIN
    // FIRST INPUT DELAY (FID)
    // The basic idea behind FID is to attach various input event listeners and measure the time
    // between when the event happens and when the handler executes. That is FID.
    var gFirstInputDelay; // this is FID
    var gaEventTypes = [
      "click",
      "mousedown",
      "keydown",
      "touchstart",
      "pointerdown",
    ]; // NOTE: does NOT include scroll!
    var ghListenerOptions = { passive: true, capture: true };
    // Record the FIRST input delay.
    function recordDelay(delay) {
      if (!gFirstInputDelay) {
        gFirstInputDelay = Math.round(delay); // milliseconds
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
        window.removeEventListener(
          "pointercancel",
          onPointerCancel,
          ghListenerOptions
        );
      }
      window.addEventListener("pointerup", onPointerUp, ghListenerOptions);
      window.addEventListener(
        "pointercancel",
        onPointerCancel,
        ghListenerOptions
      );
    }
    // Record FID as the delta between when the event happened and when the
    // listener was able to execute.
    function onInput(evt) {
      var bCancelable = false;
      try {
        // Seeing "Permission denied" errors, so do a simple try-catch.
        bCancelable = evt.cancelable;
      } catch (e) {
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
        if ("pointerdown" == evt.type) {
          // special case
          onPointerDown(delay);
        } else {
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
      var msSinceNavigationStart = now() - _navigationStart;
      var startMark = _getMark(gStartMark);
      // For SPA page views, we use our internal mark as a reference point
      if (startMark && !absolute) {
        return msSinceNavigationStart - startMark.startTime;
      }
      // For "regular" page views, we can use performance.now() if it's available...
      if (performance.now) {
        return performance.now();
      }
      // ... or we can use navigationStart as a reference point
      return msSinceNavigationStart;
    }
    // set a mark
    // NOTE: It's possible to set multiple marks with the same name.
    function _mark(name) {
      logger.logEvent(LogEvent.MarkCalled, [name]);
      if (performance.mark) {
        return performance.mark(name);
      } else if (performance.webkitMark) {
        return performance.webkitMark(name);
      }
      gFlags = addFlag(gFlags, Flags.UserTimingNotSupported);
      // Shim
      var entry = {
        name: name,
        detail: null,
        entryType: "mark",
        startTime: _now(),
        duration: 0,
      };
      gaMarks.push(entry);
      return entry;
    }
    // compute a measurement (delta)
    function _measure(name, startMarkName, endMarkName) {
      logger.logEvent(LogEvent.MeasureCalled, [
        name,
        startMarkName,
        endMarkName,
      ]);
      if (typeof startMarkName === "undefined" && _getMark(gStartMark)) {
        // If a start mark is not specified, but the user has called _init() to set a new start,
        // then use the new start base time (similar to navigationStart) as the start mark.
        startMarkName = gStartMark;
      }
      if (performance.measure) {
        // IE 11 does not handle null and undefined correctly
        if (startMarkName) {
          if (endMarkName) {
            return performance.measure(name, startMarkName, endMarkName);
          } else {
            return performance.measure(name, startMarkName);
          }
        } else {
          return performance.measure(name);
        }
      } else if (performance.webkitMeasure) {
        return performance.webkitMeasure(name, startMarkName, endMarkName);
      }
      // shim:
      var startTime = 0,
        endTime = _now();
      if (startMarkName) {
        var startMark = _getMark(startMarkName);
        if (startMark) {
          startTime = startMark.startTime;
        } else if (timing[startMarkName]) {
          // the mark name can also be a property from Navigation Timing
          startTime = timing[startMarkName] - timing.navigationStart;
        } else {
          throw new DOMException(
            "Failed to execute 'measure' on 'Performance': The mark '".concat(
              startMarkName,
              "' does not exist"
            )
          );
        }
      }
      if (endMarkName) {
        var endMark = _getMark(endMarkName);
        if (endMark) {
          endTime = endMark.startTime;
        } else if (timing[endMarkName]) {
          // the mark name can also be a property from Navigation Timing
          endTime = timing[endMarkName] - timing.navigationStart;
        } else {
          throw new DOMException(
            "Failed to execute 'measure' on 'Performance': The mark '".concat(
              endMarkName,
              "' does not exist"
            )
          );
        }
      }
      // Shim
      var entry = {
        name: name,
        detail: null,
        entryType: "measure",
        startTime: startTime,
        duration: endTime - startTime,
      };
      gaMeasures.push(entry);
      return entry;
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
      // for a name, so we always take the MAX value. We do this by first creating a
      // hash that has the max value for each name.
      var hUT = {};
      var startMark = _getMark(gStartMark);
      var endMark = _getMark(gEndMark);
      // marks
      var aMarks = _getMarks();
      if (aMarks) {
        aMarks.forEach(function (m) {
          if (m === startMark || m === endMark) {
            // Don't include the internal marks in the beacon
            return;
          }
          var name = m.name;
          // For user timing values taken in a SPA page load, we need to adjust them
          // so that they're zeroed against the last LUX.init() call. We zero every
          // UT value except for the internal LUX start mark.
          var tZero =
            name !== gStartMark && startMark ? startMark.startTime : 0;
          var markTime = Math.round(m.startTime - tZero);
          if (markTime < 0) {
            // Exclude marks that were taken before the current SPA page view
            return;
          }
          if (typeof hUT[name] === "undefined") {
            hUT[name] = markTime;
          } else {
            hUT[name] = Math.max(markTime, hUT[name]);
          }
        });
      }
      // measures
      var aMeasures = _getMeasures();
      if (aMeasures) {
        aMeasures.forEach(function (m) {
          if (startMark && m.startTime < startMark.startTime) {
            // Exclude measures that were taken before the current SPA page view
            return;
          }
          var name = m.name;
          var measureTime = Math.round(m.duration);
          if (typeof hUT[name] === "undefined") {
            hUT[name] = measureTime;
          } else {
            hUT[name] = Math.max(measureTime, hUT[name]);
          }
        });
      }
      // OK. hUT is now a hash (associative array) whose keys are the names of the
      // marks & measures, and the value is the max value. Here we create a tuple
      // for each name|value pair and then join them.
      var aUT = [];
      var aNames = Object.keys(hUT);
      aNames.forEach(function (name) {
        aUT.push(name + "|" + hUT[name]);
      });
      return aUT.join(",");
    }
    // Return a string of Element Timing Metrics formatted for beacon querystring.
    function elementTimingValues() {
      var aET = [];
      if (gaPerfEntries.length) {
        for (var i = 0; i < gaPerfEntries.length; i++) {
          var pe = gaPerfEntries[i];
          if ("element" === pe.entryType && pe.identifier && pe.startTime) {
            logger.logEvent(LogEvent.PerformanceEntryProcessed, [pe]);
            aET.push(pe.identifier + "|" + Math.round(pe.startTime));
          }
        }
      }
      return aET.join(",");
    }
    // Return a string of CPU times formatted for beacon querystring.
    function cpuTimes() {
      if (typeof PerformanceLongTaskTiming !== "function") {
        // Do not return any CPU metrics if Long Tasks API is not supported.
        return "";
      }
      var sCPU = "";
      var hCPU = {};
      var hCPUDetails = {}; // TODO - Could remove this later after large totals go away.
      // Add up totals for each "type" of long task
      if (gaPerfEntries.length) {
        // Long Task start times are relative to NavigationStart which is "0".
        // But if it is a SPA then the relative start time is gStartMark.
        var startMark = _getMark(gStartMark);
        var tZero = startMark ? startMark.startTime : 0;
        // Do not include Long Tasks that start after the page is done.
        // For full page loads, "done" is loadEventEnd.
        var tEnd = timing.loadEventEnd - timing.navigationStart;
        if (startMark) {
          // For SPA page loads (determined by the presence of a start mark), "done" is gEndMark.
          var endMark = _getMark(gEndMark);
          if (endMark) {
            tEnd = endMark.startTime;
          }
        }
        for (var i = 0; i < gaPerfEntries.length; i++) {
          var p = gaPerfEntries[i];
          if ("longtask" !== p.entryType) {
            continue;
          }
          var dur = Math.round(p.duration);
          if (p.startTime < tZero) {
            // In a SPA it is possible that we were in the middle of a Long Task when
            // LUX.init() was called. If so, only include the duration after tZero.
            dur -= tZero - p.startTime;
          } else if (p.startTime >= tEnd) {
            // In a SPA it is possible that a Long Task started after loadEventEnd but before our
            // callback from setTimeout(200) happened. Do not include anything that started after tEnd.
            continue;
          }
          logger.logEvent(LogEvent.PerformanceEntryProcessed, [p]);
          var type = p.attribution[0].name; // TODO - is there ever more than 1 attribution???
          if (!hCPU[type]) {
            // initialize this category
            hCPU[type] = 0;
            hCPUDetails[type] = "";
          }
          hCPU[type] += dur;
          // Send back the raw startTime and duration, as well as the adjusted duration.
          hCPUDetails[type] += "," + Math.round(p.startTime) + "|" + dur;
        }
      }
      // TODO - Add more types if/when they become available.
      var jsType = typeof hCPU["script"] !== "undefined" ? "script" : "unknown"; // spec changed from "script" to "unknown" Nov 2018
      if (typeof hCPU[jsType] === "undefined") {
        // Initialize default values for pages that have *no Long Tasks*.
        hCPU[jsType] = 0;
        hCPUDetails[jsType] = "";
      }
      var hStats = cpuStats(hCPUDetails[jsType]);
      var sStats =
        ",n|" +
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
      var fci = getFcp(); // FCI is beginning of 5 second window of no Long Tasks _after_ first contentful paint
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
            } else {
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
    function calculateDCLS() {
      if (typeof LayoutShift !== "function") {
        return false;
      }
      var DCLS = 0;
      for (var i = 0; i < gaPerfEntries.length; i++) {
        var p = gaPerfEntries[i];
        if ("layout-shift" !== p.entryType || p.hadRecentInput) {
          continue;
        }
        logger.logEvent(LogEvent.PerformanceEntryProcessed, [p]);
        DCLS += p.value;
      }
      // The DCL column in Redshift is REAL (FLOAT4) which stores a maximum
      // of 6 significant digits.
      return DCLS.toFixed(6);
    }
    // Return the median value from an array of integers.
    function arrayMedian(aValues) {
      if (0 === aValues.length) {
        return 0;
      }
      var half = Math.floor(aValues.length / 2);
      aValues.sort(function (a, b) {
        return a - b;
      });
      if (aValues.length % 2) {
        // Return the middle value.
        return aValues[half];
      } else {
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
            var dns = Math.round(r.domainLookupEnd - r.domainLookupStart);
            var tcp = Math.round(r.connectEnd - r.connectStart); // includes ssl negotiation
            var fb = Math.round(r.responseStart - r.requestStart); // first byte
            var content = Math.round(r.responseEnd - r.responseStart);
            var networkDuration = dns + tcp + fb + content;
            var parseEval = LUX_t_end - LUX_t_start;
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
              userConfig.samplerate + // sample rate
              (transferSize ? "x" + transferSize : "") +
              (gLuxSnippetStart ? "l" + gLuxSnippetStart : "") +
              "s" +
              (LUX_t_start - _navigationStart) + // when lux.js started getting evaluated relative to navigationStart
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
    // _addData()
    function _addData(name, value) {
      logger.logEvent(LogEvent.AddDataCalled, [name, value]);
      var typeN = typeof name;
      var typeV = typeof value;
      if (
        "string" === typeN &&
        ("string" === typeV || "number" === typeV || "boolean" === typeV)
      ) {
        ghData[name] = value;
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
          clearTimeout(gCustomerDataTimeout);
        }
        gCustomerDataTimeout = window.setTimeout(_sendCustomerData, 100);
      }
    }
    // _sample()
    // Return true if beacons for this page should be sampled.
    function _sample() {
      if (
        typeof gUid === "undefined" ||
        typeof userConfig.samplerate === "undefined"
      ) {
        return false; // bail
      }
      var nThis = ("" + gUid).substr(-2); // number for THIS page - from 00 to 99
      return parseInt(nThis) < userConfig.samplerate;
    }
    // Return a string of Customer Data formatted for beacon querystring.
    function customerDataValues() {
      var aData = [];
      for (var key in ghData) {
        var value = "" + ghData[key]; // convert to string (eg for ints and booleans)
        // strip delimiters (instead of escaping)
        key = key.replace(/,/g, "").replace(/\|/g, "");
        value = value.replace(/,/g, "").replace(/\|/g, "");
        aData.push(key + "|" + value);
      }
      return encodeURIComponent(aData.join(","));
    }
    // _init()
    // Use this function in Single Page Apps to reset things.
    // This function should ONLY be called within a SPA!
    // Otherwise, you might clear marks & measures that were set by a shim.
    function _init() {
      // Some customers (incorrectly) call LUX.init on the very first page load of a SPA. This would
      // cause some first-page-only data (like paint metrics) to be lost. To prevent this, we silently
      // bail from this function when we detect an unnecessary LUX.init call.
      var endMark = _getMark(gEndMark);
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
      gaPerfEntries.splice(0); // clear out the array of performance entries (do NOT redefine gaPerfEntries!)
      nErrors = 0;
      // Clear flags then set the flag that init was called (ie, this is a SPA).
      gFlags = 0;
      gFlags = addFlag(gFlags, Flags.InitCalled);
      // Mark the "navigationStart" for this SPA page.
      _mark(gStartMark);
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
        if (
          e.src &&
          !e.async &&
          !e.defer &&
          0 !== (e.compareDocumentPosition(lastViewportElem) & 4)
        ) {
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
            (typeof e.onload === "function" && e.media === "all")
          );
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
        } catch (e) {
          // It seems like IE throws an error when accessing the innerHTML property
          logger.logEvent(LogEvent.InnerHtmlAccessError);
          return -1;
        }
      }
      return size;
    }
    function getNavTiming() {
      var s = "";
      var ns = _navigationStart;
      var startMark = _getMark(gStartMark);
      var endMark = _getMark(gEndMark);
      if (startMark && endMark) {
        // This is a SPA page view, so send the SPA marks & measures instead of Nav Timing.
        var start = Math.round(startMark.startTime); // the start mark is "zero"
        ns += start; // "navigationStart" for a SPA is the real navigationStart plus the start mark
        var end = Math.round(endMark.startTime) - start; // delta from start mark
        s =
          ns +
          "fs" +
          0 + // fetchStart is the same as navigationStart for a SPA
          "ls" +
          end +
          "le" +
          end +
          "";
      } else if (performance.timing) {
        // Return the real Nav Timing metrics because this is the "main" page view (not a SPA)
        var t = timing;
        var startRender = getStartRender(); // first paint
        var fcp = getFcp(); // first contentful paint
        var lcp = getLcp(); // largest contentful paint
        s =
          ns +
          (t.redirectStart ? "rs" + (t.redirectStart - ns) : "") +
          (t.redirectEnd ? "re" + (t.redirectEnd - ns) : "") +
          (t.fetchStart ? "fs" + (t.fetchStart - ns) : "") +
          (t.domainLookupStart ? "ds" + (t.domainLookupStart - ns) : "") +
          (t.domainLookupEnd ? "de" + (t.domainLookupEnd - ns) : "") +
          (t.connectStart ? "cs" + (t.connectStart - ns) : "") +
          (t.secureConnectionStart
            ? "sc" + (t.secureConnectionStart - ns)
            : "") +
          (t.connectEnd ? "ce" + (t.connectEnd - ns) : "") +
          (t.requestStart ? "qs" + (t.requestStart - ns) : "") + // reQuest start
          (t.responseStart ? "bs" + (t.responseStart - ns) : "") + // body start
          (t.responseEnd ? "be" + (t.responseEnd - ns) : "") +
          (t.domLoading ? "ol" + (t.domLoading - ns) : "") +
          (t.domInteractive ? "oi" + (t.domInteractive - ns) : "") +
          (t.domContentLoadedEventStart
            ? "os" + (t.domContentLoadedEventStart - ns)
            : "") +
          (t.domContentLoadedEventEnd
            ? "oe" + (t.domContentLoadedEventEnd - ns)
            : "") +
          (t.domComplete ? "oc" + (t.domComplete - ns) : "") +
          (t.loadEventStart ? "ls" + (t.loadEventStart - ns) : "") +
          (t.loadEventEnd ? "le" + (t.loadEventEnd - ns) : "") +
          (startRender ? "sr" + startRender : "") +
          (fcp ? "fc" + fcp : "") +
          (lcp ? "lc" + lcp : "") +
          "";
      } else if (endMark) {
        // This is a "main" page view that does NOT support Navigation Timing - strange.
        var end = Math.round(endMark.startTime);
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
    // Return First Contentful Paint or zero if not supported.
    function getFcp() {
      var paintEntries = getEntriesByType("paint");
      for (var i = 0; i < paintEntries.length; i++) {
        var entry = paintEntries[i];
        if (entry.name === "first-contentful-paint") {
          return Math.round(entry.startTime);
        }
      }
      return 0;
    }
    // Return Largest Contentful Paint or zero if not supported.
    function getLcp() {
      if (gaPerfEntries.length) {
        // Find the *LAST* LCP per https://web.dev/largest-contentful-paint
        for (var i = gaPerfEntries.length - 1; i >= 0; i--) {
          var pe = gaPerfEntries[i];
          if ("largest-contentful-paint" === pe.entryType) {
            logger.logEvent(LogEvent.PerformanceEntryProcessed, [pe]);
            return Math.round(pe.startTime);
          }
        }
      }
      return 0;
    }
    // Return best guess at Start Render time (in ms).
    // Mostly works on just Chrome and IE.
    // Return null if not supported.
    function getStartRender() {
      if (performance.timing) {
        var t = timing;
        var ns = t.navigationStart;
        var startRender = void 0;
        if (ns) {
          var paintEntries = getEntriesByType("paint");
          if (paintEntries.length) {
            // If Paint Timing API is supported, use it.
            for (var i = 0; i < paintEntries.length; i++) {
              var entry = paintEntries[i];
              if (entry.name === "first-paint") {
                startRender = Math.round(entry.startTime);
                break;
              }
            }
          } else if (
            window.chrome &&
            typeof window.chrome.loadTimes === "function"
          ) {
            // If chrome, get first paint time from `chrome.loadTimes`. Need extra error handling.
            var loadTimes = window.chrome.loadTimes();
            if (loadTimes) {
              startRender = Math.round(loadTimes.firstPaintTime * 1000 - ns);
            }
          } else if (t.msFirstPaint) {
            // If IE/Edge, use the prefixed `msFirstPaint` property (see http://msdn.microsoft.com/ff974719).
            startRender = Math.round(t.msFirstPaint - ns);
          }
        }
        if (startRender) {
          return startRender;
        }
      }
      logger.logEvent(LogEvent.PaintTimingNotSupported);
      return null;
    }
    function getCustomerId() {
      if (typeof LUX.customerid !== "undefined") {
        // Return the id explicitly set in the JavaScript variable.
        return LUX.customerid;
      }
      // Extract the id of the lux.js script element.
      var luxScript = getScriptElement("/js/lux.js");
      if (luxScript) {
        LUX.customerid = getQuerystringParam(luxScript.src, "id");
        return LUX.customerid;
      }
      return "";
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
      return null;
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
      var body = doc.body,
        docelem = doc.documentElement;
      var height = Math.max(
        body ? body.scrollHeight : 0,
        body ? body.offsetHeight : 0,
        docelem ? docelem.clientHeight : 0,
        docelem ? docelem.scrollHeight : 0,
        docelem ? docelem.offsetHeight : 0
      );
      return height;
    }
    function docWidth(doc) {
      var body = doc.body,
        docelem = doc.documentElement;
      var width = Math.max(
        body ? body.scrollWidth : 0,
        body ? body.offsetWidth : 0,
        docelem ? docelem.clientWidth : 0,
        docelem ? docelem.scrollWidth : 0,
        docelem ? docelem.offsetWidth : 0
      );
      return width;
    }
    // Return the main HTML document transfer size (in bytes).
    function docSize() {
      var aEntries = getEntriesByType("navigation");
      if (aEntries.length && aEntries[0]["encodedBodySize"]) {
        return aEntries[0]["encodedBodySize"];
      }
      return 0; // ERROR - NOT FOUND
    }
    // Return the navigation type. 0 = normal, 1 = reload, etc.
    // Return empty string if not available.
    function navigationType() {
      if (
        performance.navigation &&
        typeof performance.navigation.type !== "undefined"
      ) {
        return performance.navigation.type;
      }
      return "";
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
        } else if (
          "2g" === connType ||
          "3g" === connType ||
          "4g" === connType ||
          "5g" === connType
        ) {
          connType = connType.toUpperCase();
        } else {
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
      } else {
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
      return (
        lt[0] >= 0 &&
        lt[1] >= 0 &&
        lt[0] < vw &&
        lt[1] < vh &&
        e.offsetWidth > 0 &&
        e.offsetHeight > 0
      );
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
    function _markLoadTime() {
      _mark(gEndMark);
    }
    function createMaxMeasureTimeout() {
      clearMaxMeasureTimeout();
      gMaxMeasureTimeout = window.setTimeout(function () {
        gFlags = addFlag(gFlags, Flags.BeaconSentAfterTimeout);
        _sendLux();
      }, userConfig.maxMeasureTime - _now());
    }
    function clearMaxMeasureTimeout() {
      if (gMaxMeasureTimeout) {
        clearTimeout(gMaxMeasureTimeout);
      }
    }
    // Beacon back the LUX data.
    function _sendLux() {
      clearMaxMeasureTimeout();
      var customerid = getCustomerId();
      if (
        !customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        gbLuxSent // LUX data already sent
      ) {
        return;
      }
      logger.logEvent(LogEvent.DataCollectionStart);
      var startMark = _getMark(gStartMark);
      var endMark = _getMark(gEndMark);
      if (!startMark || (endMark && endMark.startTime < startMark.startTime)) {
        // Record the synthetic loadEventStart time for this page, unless it was already recorded
        // with LUX.markLoadTime()
        _markLoadTime();
      }
      var sUT = userTimingValues(); // User Timing data
      var sET = elementTimingValues(); // Element Timing data
      var sCustomerData = customerDataValues(); // customer data
      var sIx = ""; // Interaction Metrics
      if (!gbIxSent) {
        // It is possible for the IX beacon to be sent BEFORE the "main" window.onload LUX beacon.
        // Make sure we do not send the IX data twice.
        sIx = ixValues();
      }
      var sCPU = cpuTimes();
      var DCLS = calculateDCLS();
      var sLuxjs = selfLoading();
      if (document.visibilityState && "visible" !== document.visibilityState) {
        gFlags = addFlag(gFlags, Flags.VisibilityStateNotVisible);
      }
      // We want ALL beacons to have ALL the data used for query filters (geo, pagelabel, browser, & customerdata).
      // So we create a base URL that has all the necessary information:
      var baseUrl =
        userConfig.beaconUrl +
        "?v=" +
        SCRIPT_VERSION +
        "&id=" +
        customerid +
        "&sid=" +
        gSyncId +
        "&uid=" +
        gUid +
        (sCustomerData ? "&CD=" + sCustomerData : "") +
        "&l=" +
        encodeURIComponent(_getPageLabel());
      var is = inlineTagSize("script");
      var ic = inlineTagSize("style");
      var querystring =
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
        navigationType() + // reload
        (navigator.deviceMemory
          ? "dm" + Math.round(navigator.deviceMemory)
          : "") + // device memory (GB)
        (sIx ? "&IX=" + sIx : "") +
        (gFirstInputDelay ? "&FID=" + gFirstInputDelay : "") +
        (sCPU ? "&CPU=" + sCPU : "") +
        (gFlags ? "&fl=" + gFlags : "") +
        (sET ? "&ET=" + sET : "") + // element timing
        "&HN=" +
        encodeURIComponent(document.location.hostname) +
        (DCLS !== false ? "&CLS=" + DCLS : "") +
        "&PN=" +
        encodeURIComponent(document.location.pathname);
      // User Timing marks & measures
      var sUT_remainder = "";
      if (sUT) {
        var curLen = baseUrl.length + querystring.length;
        if (curLen + sUT.length <= gMaxQuerystring) {
          // Add all User Timing
          querystring += "&UT=" + sUT;
        } else {
          // Only add a substring of User Timing
          var avail_1 = gMaxQuerystring - curLen; // how much room is left in the querystring
          var iComma = sUT.lastIndexOf(",", avail_1); // as many UT tuples as possible
          querystring += "&UT=" + sUT.substring(0, iComma);
          sUT_remainder = sUT.substring(iComma + 1);
        }
      }
      // Send the MAIN LUX beacon.
      var mainBeaconUrl = baseUrl + querystring;
      logger.logEvent(LogEvent.MainBeaconSent, [mainBeaconUrl]);
      _sendBeacon(mainBeaconUrl);
      // Set some states.
      gbLuxSent = 1;
      gbNavSent = 1;
      gbIxSent = sIx ? 1 : 0;
      // Send other beacons for JUST User Timing.
      var avail = gMaxQuerystring - baseUrl.length;
      while (sUT_remainder) {
        var sUT_cur = "";
        if (sUT_remainder.length <= avail) {
          // We can fit ALL the remaining UT params.
          sUT_cur = sUT_remainder;
          sUT_remainder = "";
        } else {
          // We have to take a subset of the remaining UT params.
          var iComma = sUT_remainder.lastIndexOf(",", avail); // as many UT tuples as possible
          if (-1 === iComma) {
            // Trouble: we have SO LITTLE available space we can not fit the first UT tuple.
            // Try it anyway but find it by searching from the front.
            iComma = sUT_remainder.indexOf(",");
          }
          if (-1 === iComma) {
            // The is only one UT tuple left, but it is bigger than the available space.
            // Take the whole tuple even tho it is too big.
            sUT_cur = sUT_remainder;
            sUT_remainder = "";
          } else {
            sUT_cur = sUT_remainder.substring(0, iComma);
            sUT_remainder = sUT_remainder.substring(iComma + 1);
          }
        }
        var utBeaconUrl = baseUrl + "&UT=" + sUT_cur;
        logger.logEvent(LogEvent.UserTimingBeaconSent, [utBeaconUrl]);
        _sendBeacon(utBeaconUrl);
      }
    }
    // Beacon back the IX data separately (need to sync with LUX beacon on the backend).
    function _sendIx() {
      var customerid = getCustomerId();
      if (
        !customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        gbIxSent || // IX data already sent
        !gbLuxSent // LUX has NOT been sent yet, so wait to include it there
      ) {
        return;
      }
      var sIx = ixValues(); // Interaction Metrics
      if (sIx) {
        var sCustomerData = customerDataValues(); // customer data
        var querystring =
          "?v=" +
          SCRIPT_VERSION +
          "&id=" +
          customerid +
          "&sid=" +
          gSyncId +
          "&uid=" +
          gUid +
          (sCustomerData ? "&CD=" + sCustomerData : "") +
          "&l=" +
          encodeURIComponent(_getPageLabel()) +
          "&IX=" +
          sIx +
          (gFirstInputDelay ? "&FID=" + gFirstInputDelay : "") +
          "&HN=" +
          encodeURIComponent(document.location.hostname) +
          "&PN=" +
          encodeURIComponent(document.location.pathname);
        var beaconUrl = userConfig.beaconUrl + querystring;
        logger.logEvent(LogEvent.InteractionBeaconSent, [beaconUrl]);
        _sendBeacon(beaconUrl);
        gbIxSent = 1;
      }
    }
    // Beacon back customer data that is recorded _after_ the main beacon was sent
    // (i.e., customer data after window.onload).
    function _sendCustomerData() {
      var customerid = getCustomerId();
      if (
        !customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        !gbLuxSent // LUX has NOT been sent yet, so wait to include it there
      ) {
        return;
      }
      var sCustomerData = customerDataValues(); // customer data
      if (sCustomerData) {
        var querystring =
          "?v=" +
          SCRIPT_VERSION +
          "&id=" +
          customerid +
          "&sid=" +
          gSyncId +
          "&uid=" +
          gUid +
          "&CD=" +
          sCustomerData +
          "&l=" +
          encodeURIComponent(_getPageLabel()) +
          "&HN=" +
          encodeURIComponent(document.location.hostname) +
          "&PN=" +
          encodeURIComponent(document.location.pathname);
        var beaconUrl = userConfig.beaconUrl + querystring;
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
    /**
     * Get the interaction attribution name for an element
     *
     * @param {HTMLElement} el
     * @returns string
     */
    function interactionAttributionForElement(el) {
      // Default to using the element's own ID if it has one
      if (el.id) {
        return el.id;
      }
      // The next preference is to find an ancestor with the "data-sctrack" attribute
      var ancestor = el;
      // We also store the first ancestor ID that we find, so we can use it as
      // a fallback later.
      var ancestorId;
      while (ancestor.parentNode && ancestor.parentNode.tagName) {
        ancestor = ancestor.parentNode;
        if (ancestor.hasAttribute("data-sctrack")) {
          return ancestor.getAttribute("data-sctrack");
        }
        if (ancestor.id && !ancestorId) {
          ancestorId = ancestor.id;
        }
      }
      // The next preference is to use the text content of a button or link
      var isSubmitInput = el.tagName === "INPUT" && el.type === "submit";
      var isButton = el.tagName === "BUTTON";
      var isLink = el.tagName === "A";
      if (isSubmitInput && el.value) {
        return el.value;
      }
      if ((isButton || isLink) && el.innerText) {
        return el.innerText;
      }
      // The next preference is to use the first ancestor ID
      if (ancestorId) {
        return ancestorId;
      }
      // No suitable attribute was found
      return "";
    }
    function _scrollHandler() {
      // Leave handlers IN PLACE so we can track which ID is clicked/keyed.
      // _removeIxHandlers();
      if (typeof ghIx["s"] === "undefined") {
        ghIx["s"] = Math.round(_now());
        // _sendIx(); // wait for key or click to send the IX beacon
      }
    }
    function _keyHandler(e) {
      _removeIxHandlers();
      if (typeof ghIx["k"] === "undefined") {
        ghIx["k"] = Math.round(_now());
        if (e && e.target) {
          var trackId = interactionAttributionForElement(e.target);
          if (trackId) {
            ghIx["ki"] = trackId;
          }
        }
        _sendIx();
      }
    }
    function _clickHandler(e) {
      _removeIxHandlers();
      if (typeof ghIx["c"] === "undefined") {
        ghIx["c"] = Math.round(_now());
        var target = null;
        try {
          // Seeing "Permission denied" errors, so do a simple try-catch.
          if (e && e.target) {
            target = e.target;
          }
        } catch (e) {
          logger.logEvent(LogEvent.EventTargetAccessError);
          target = null;
        }
        if (target) {
          if (e.clientX) {
            // Save the x&y of the mouse click.
            ghIx["cx"] = e.clientX;
            ghIx["cy"] = e.clientY;
          }
          var trackId = interactionAttributionForElement(e.target);
          if (trackId) {
            ghIx["ci"] = trackId;
          }
        }
        _sendIx();
      }
    }
    // Wrapper to support older browsers (<= IE8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function addListener(type, callback, useCapture) {
      if (useCapture === void 0) {
        useCapture = false;
      }
      if (window.addEventListener) {
        window.addEventListener(type, callback, useCapture);
      } else if (window.attachEvent) {
        window.attachEvent("on" + type, callback);
      }
    }
    // Wrapper to support older browsers (<= IE8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function removeListener(type, callback, useCapture) {
      if (useCapture === void 0) {
        useCapture = false;
      }
      if (window.removeEventListener) {
        window.removeEventListener(type, callback, useCapture);
      } else if (window.detachEvent) {
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
      } else {
        addListener("unload", onunload, true);
        addListener("beforeunload", onunload, true);
      }
      addListener(
        "visibilitychange",
        function () {
          if (document.visibilityState === "hidden") {
            onunload();
          }
        },
        true
      );
    }
    function _addIxHandlers() {
      addListener("scroll", _scrollHandler);
      addListener("keypress", _keyHandler);
      addListener("mousedown", _clickHandler);
    }
    function _removeIxHandlers() {
      removeListener("scroll", _scrollHandler);
      removeListener("keypress", _keyHandler);
      removeListener("mousedown", _clickHandler);
    }
    // This is a big number (epoch ms . random) that is used to matchup a LUX beacon with a separate IX beacon
    // (because they get sent at different times). Each "page view" (including SPA) should have a
    // unique gSyncId.
    function createSyncId(inSampleBucket) {
      if (inSampleBucket === void 0) {
        inSampleBucket = false;
      }
      if (inSampleBucket) {
        // "00" matches all sample rates
        return "".concat(Number(new Date()), "00000");
      }
      return ""
        .concat(Number(new Date()))
        .concat(_padLeft(String(Math.round(100000 * Math.random())), "00000"));
    }
    // Unique ID (also known as Session ID)
    // We use this to track all the page views in a single user session.
    // If there is NOT a UID then set it to the new value (which is the same as the "sync ID" for this page).
    // Refresh its expiration date and return its value.
    function refreshUniqueId(newValue) {
      var uid = _getCookie("lux_uid");
      if (!uid || uid.length < 11) {
        uid = newValue;
      } else {
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
      if (typeof LUX.label !== "undefined") {
        gFlags = addFlag(gFlags, Flags.PageLabelFromLabelProp);
        return LUX.label;
      } else if (typeof LUX.jspagelabel !== "undefined") {
        var evaluateJsPageLabel = Function(
          '"use strict"; return '.concat(LUX.jspagelabel)
        );
        try {
          var label = evaluateJsPageLabel();
          if (label) {
            gFlags = addFlag(gFlags, Flags.PageLabelFromGlobalVariable);
            return label;
          }
        } catch (e) {
          logger.logEvent(LogEvent.PageLabelEvaluationError, [
            LUX.jspagelabel,
            e,
          ]);
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
      } catch (e) {
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
      } catch (e) {
        logger.logEvent(LogEvent.CookieSetError);
      }
    }
    // "padding" MUST be the length of the resulting string, eg, "0000" if you want a result of length 4.
    function _padLeft(str, padding) {
      return (padding + str).slice(-padding.length);
    }
    // Set "LUX.auto=false" to disable send results automatically and
    // instead you must call LUX.send() explicitly.
    if (userConfig.auto) {
      var sendBeaconAfterMinimumMeasureTime_1 = function () {
        var elapsedTime = _now();
        var timeRemaining = userConfig.minMeasureTime - elapsedTime;
        if (timeRemaining <= 0) {
          logger.logEvent(LogEvent.OnloadHandlerTriggered, [
            elapsedTime,
            userConfig.minMeasureTime,
          ]);
          if (document.readyState === "complete") {
            // If onload has already passed, send the beacon now.
            _sendLux();
          } else {
            // Ow, send the beacon slightly after window.onload.
            addListener("load", function () {
              setTimeout(_sendLux, 200);
            });
          }
        } else {
          // Try again after the minimum measurement time has elapsed
          setTimeout(sendBeaconAfterMinimumMeasureTime_1, timeRemaining);
        }
      };
      sendBeaconAfterMinimumMeasureTime_1();
    }
    // Add the unload handlers for auto mode, or when LUX.measureUntil is "pagehidden"
    if (userConfig.sendBeaconOnPageHidden) {
      _addUnloadHandlers();
    }
    // Regardless of userConfig.auto, we need to register the IX handlers immediately.
    _addIxHandlers();
    // Set the maximum measurement timer
    createMaxMeasureTimeout();
    // This is the public API.
    var _LUX = userConfig;
    // Functions
    _LUX.mark = _mark;
    _LUX.measure = _measure;
    _LUX.init = _init;
    _LUX.markLoadTime = _markLoadTime;
    _LUX.send = function () {
      logger.logEvent(LogEvent.SendCalled);
      _sendLux();
    };
    _LUX.addData = _addData;
    _LUX.getSessionId = _getUniqueId; // so customers can do their own sampling
    _LUX.getDebug = function () {
      return logger.getEvents();
    };
    _LUX.forceSample = function () {
      logger.logEvent(LogEvent.ForceSampleCalled);
      setUniqueId(createSyncId(true));
    };
    _LUX.doUpdate = function () {
      // Deprecated, intentionally empty.
    };
    _LUX.cmd = _runCommand;
    // Public properties
    _LUX.version = SCRIPT_VERSION;
    // "Private" properties
    _LUX.ae = []; // array for error handler (ignored)
    _LUX.al = []; // array for Long Tasks (ignored)
    /**
     * Run a command from the command queue
     */
    function _runCommand(_a) {
      var fn = _a[0],
        args = _a.slice(1);
      if (typeof _LUX[fn] === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _LUX[fn].apply(_LUX, args);
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
    return _LUX;
  })();
  window.LUX = LUX;
  LUX_t_end = now();

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
