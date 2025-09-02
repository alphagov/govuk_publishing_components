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

  const max = Math.max;
  const floor = Math.floor;
  const round = Math.round;
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

  // If the various performance APIs aren't available, we export an empty object to
  // prevent having to make regular typeof checks.
  const performance = window.performance || {};
  const timing = performance.timing || {
    activationStart: 0,
    // If performance.timing isn't available, we attempt to polyfill the navigationStart value.
    // Our first attempt is from LUX.ns, which is the time that the snippet execution began. If this
    // is not available, we fall back to the time that the current script execution began.
    navigationStart: window.LUX?.ns || scriptStartTime,
  };
  function navigationType() {
    if (performance.navigation && typeof performance.navigation.type !== "undefined") {
      return performance.navigation.type;
    }
    return "";
  }
  /**
  * Returns the delivery type for the current document. To differentiate between the valid empty
  * string value and browsers that don't support PerformanceResourceTiming.deliveryType, we convert
  * the empty string value to "(empty string)". Browsers that don't support deliveryType will return
  * null. Despite straying from the spec, this allows us to differentiate between the two cases.
  *
  * @see https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-deliverytype
  */
  function deliveryType() {
    const navEntry = getNavigationEntry();
    if ("deliveryType" in navEntry) {
      return navEntry.deliveryType || "(empty string)";
    }
    return undefined;
  }
  function getNavigationEntry() {
    const navEntries = getEntriesByType("navigation");
    if (navEntries.length) {
      const nativeEntry = navEntries[0];
      const entry = {
        navigationStart: 0,
        activationStart: 0,
      };
      for (const key in nativeEntry) {
        entry[key] = nativeEntry[key];
      }
      return entry;
    }
    const navType = navigationType();
    const entry = {
      navigationStart: 0,
      activationStart: 0,
      startTime: 0,
      type: navType == 2 ? "back_forward" : navType === 1 ? "reload" : "navigate",
    };
    if (true) {
      for (const key in timing) {
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
      const entries = performance.getEntriesByType(type);
      if (entries && entries.length) {
        return entries;
      }
    }
    return [];
  }
  /**
  * Simple wrapper around performance.getEntriesByName to provide fallbacks for
  * legacy browsers, and work around edge cases where undefined is returned instead
  * of an empty PerformanceEntryList.
  */
  function getEntriesByName(type) {
    if (typeof performance.getEntriesByName === "function") {
      const entries = performance.getEntriesByName(type);
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
    afterPrerender(() => {
      if (isVisible()) {
        cb();
      }
      else {
        const onVisibleCallback = () => {
          if (isVisible()) {
            cb();
            removeEventListener("visibilitychange", onVisibleCallback);
          }
        };
        addEventListener("visibilitychange", onVisibleCallback, true);
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

  function addFlag(flags, flag) {
    return flags | flag;
  }

  // Wrapper to support older browsers (<= IE8)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addListener(type, callback, useCapture = false) {
    if (addEventListener) {
      addEventListener(type, callback, useCapture);
    }
    else if (window.attachEvent && true) {
      window.attachEvent("on" + type, callback);
    }
  }
  // Wrapper to support older browsers (<= IE8)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function removeListener(type, callback, useCapture = false) {
    if (removeEventListener) {
      removeEventListener(type, callback, useCapture);
    }
    else if (window.detachEvent && true) {
      window.detachEvent("on" + type, callback);
    }
  }

  const START_MARK = "LUX_start";
  const END_MARK = "LUX_end";
  const BOOLEAN_TRUE = "true";

  /**
  * Milliseconds since navigationStart representing when the page was restored from the bfcache
  */
  let pageRestoreTime;
  function setPageRestoreTime(time) {
    pageRestoreTime = time;
  }
  function getPageRestoreTime() {
    return pageRestoreTime;
  }
  /**
  * To measure the way a user experienced a metric, we measure metrics relative to the time the user
  * started viewing the page. On prerendered pages, this is activationStart. On bfcache restores, this
  * is the page restore time. On all other pages this value will be zero.
  */
  function getZeroTime() {
    return max(getPageRestoreTime() || 0, getNavigationEntry().activationStart, getEntriesByName(START_MARK).pop()?.startTime || 0);
  }
  /**
  * Most time-based metrics that LUX reports should be relative to the "zero" marker, rounded down
  * to the nearest unit so as not to report times in the future, and clamped to zero.
  */
  function processTimeMetric(value) {
    return clamp(floor(value - getZeroTime()));
  }
  /**
  * Returns the number of milliseconds since navigationStart.
  */
  function msSinceNavigationStart() {
    if (performance.now) {
      return floor(performance.now());
    }
    return now() - timing.navigationStart;
  }
  /**
  * Returns the number of milliseconds since the current page was initialized. For SPAs, this is the
  * time since the last LUX.init() call.
  */
  function msSincePageInit() {
    const sinceNavigationStart = msSinceNavigationStart();
    const startMark = getEntriesByName(START_MARK).pop();
    if (startMark) {
      return floor(sinceNavigationStart - startMark.startTime);
    }
    return sinceNavigationStart;
  }

  function padStart(str, length, char) {
    while (str.length < length) {
      str = char + str;
    }
    return str;
  }

  const VERSION = "4.2.1";
  /**
  * Returns the version of the script as a float to be stored in legacy systems that do not support
  * string versions.
  */
  function versionAsFloat(ver = VERSION) {
    const parts = ver.split(".");
    return parseFloat(parts[0] + "." + padStart(parts[1], 2, "0") + padStart(parts[2], 2, "0"));
  }

  const sendBeaconFallback = (url, data) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(String(data));
    return true;
  };
  const sendBeacon = "sendBeacon" in navigator ? navigator.sendBeacon.bind(navigator) : sendBeaconFallback;
  /**
  * Some values should only be reported if they are non-zero. The exception to this is when the page
  * was prerendered or restored from BF cache
  */
  function shouldReportValue(value) {
    if (getPageRestoreTime() || wasPrerendered()) {
      return value >= 0;
    }
    return value > 0;
  }
  /**
  * Fit an array of user timing delimited strings into a URL and return both the entries that fit and
  * the remaining entries that didn't fit.
  */
  function fitUserTimingEntries(utValues, config, url) {
    // Start with the maximum allowed UT entries per beacon
    const beaconUtValues = utValues.slice(0, config.maxBeaconUTEntries);
    const remainingUtValues = utValues.slice(config.maxBeaconUTEntries);
    // Trim UT entries until they fit within the maximum URL length, ensuring at least one UT entry
    // is included.
    while ((url + "&UT=" + beaconUtValues.join(",")).length > config.maxBeaconUrlLength &&
    beaconUtValues.length > 1) {
      remainingUtValues.unshift(beaconUtValues.pop());
    }
    return [beaconUtValues, remainingUtValues];
  }
  class Beacon {
    config;
    logger;
    isRecording = true;
    isSent = false;
    sendRetries = 0;
    maxMeasureTimeout = 0;
    customerId;
    pageId;
    sessionId;
    flags = 0;
    startTime;
    metricCollectors = {};
    onBeforeSendCbs = [];
    constructor(opts) {
      this.startTime = opts.startTime || getZeroTime();
      this.config = opts.config;
      this.logger = opts.logger;
      this.customerId = opts.customerId;
      this.sessionId = opts.sessionId;
      this.pageId = opts.pageId;
      this.maxMeasureTimeout = window.setTimeout(() => {
        this.logger.logEvent(82 /* LogEvent.PostBeaconTimeoutReached */);
        this.stopRecording();
        this.send();
      }, this.config.maxMeasureTime - msSincePageInit());
      addListener("securitypolicyviolation", (e) => {
        if (e.disposition !== "report" && e.blockedURI === this.config.beaconUrlV2 && "URL" in self) {
          // Some websites might have CSP rules that allow the GET beacon, but not the POST beacon.
          // We can detect this here and attempt to send the beacon to a fallback endpoint.
          //
          // If the fallback endpoint has not been provided in the config, we will fall back to using
          // the POST beacon pathname on the GET beacon origin.
          if (!this.config.beaconUrlFallback) {
            const getOrigin = new URL(this.config.beaconUrl).origin;
            const postPathname = new URL(this.config.beaconUrlV2).pathname;
            this.config.beaconUrlFallback = getOrigin + postPathname;
          }
          // Update the V2 beacon URL
          this.config.beaconUrlV2 = this.config.beaconUrlFallback;
          this.logger.logEvent(90 /* LogEvent.PostBeaconCSPViolation */, [this.config.beaconUrlV2]);
          this.addFlag(4096 /* Flags.BeaconBlockedByCsp */);
          // Not all browsers return false if sendBeacon fails. In this case, `this.isSent` will be
          // true, even though the beacon wasn't sent. We need to reset this flag to ensure we can
          // retry sending the beacon.
          this.isSent = false;
          // Try to send the beacon again
          if (this.sendRetries < 1) {
            this.sendRetries++;
            this.send();
          }
        }
      });
      this.logger.logEvent(80 /* LogEvent.PostBeaconInitialised */);
    }
    isBeingSampled() {
      const bucket = parseInt(String(this.sessionId).slice(-2));
      return bucket < this.config.samplerate;
    }
    stopRecording() {
      this.isRecording = false;
      this.logger.logEvent(86 /* LogEvent.PostBeaconStopRecording */);
    }
    addCollector(metric, collector) {
      this.metricCollectors[metric] = collector;
    }
    addFlag(flag) {
      this.flags = addFlag(this.flags, flag);
    }
    beaconUrl() {
      return this.config.beaconUrlV2;
    }
    onBeforeSend(cb) {
      this.onBeforeSendCbs.push(cb);
    }
    send() {
      this.logger.logEvent(81 /* LogEvent.PostBeaconSendCalled */);
      for (const cb of this.onBeforeSendCbs) {
        cb();
      }
      if (!this.isBeingSampled()) {
        return;
      }
      const collectionStart = now();
      const metricData = {};
      for (const metric in this.metricCollectors) {
        const data = this.metricCollectors[metric](this.config);
        this.logger.logEvent(91 /* LogEvent.PostBeaconCollector */, [metric, !!data]);
        if (data) {
          metricData[metric] = data;
        }
      }
      if (!Object.keys(metricData).length && !this.config.allowEmptyPostBeacon) {
        // TODO: This is only required while the new beacon is supplementary. Once it's the primary
        // beacon, we should send it regardless of how much metric data it has.
        this.logger.logEvent(85 /* LogEvent.PostBeaconCancelled */);
        return;
      }
      if (this.isSent) {
        this.logger.logEvent(84 /* LogEvent.PostBeaconAlreadySent */);
        return;
      }
      // Only clear the max measure timeout if there's data to send.
      clearTimeout(this.maxMeasureTimeout);
      const beaconUrl = this.beaconUrl();
      const payload = Object.assign({
        customerId: this.customerId,
        flags: this.flags,
        measureDuration: msSincePageInit(),
        collectionDuration: now() - collectionStart,
        pageId: this.pageId,
        scriptVersion: VERSION,
        sessionId: this.sessionId,
        startTime: this.startTime,
      }, metricData);
      try {
        if (sendBeacon(beaconUrl, JSON.stringify(payload))) {
          this.isSent = true;
          this.logger.logEvent(83 /* LogEvent.PostBeaconSent */, [beaconUrl, payload]);
        }
      }
      catch (e) {
        // Intentionally empty; handled below
      }
      if (!this.isSent) {
        this.logger.logEvent(89 /* LogEvent.PostBeaconSendFailed */, [beaconUrl, payload]);
      }
    }
  }
  var BeaconMetricKey;
  (function (BeaconMetricKey) {
    BeaconMetricKey["CLS"] = "cls";
    BeaconMetricKey["INP"] = "inp";
    BeaconMetricKey["LCP"] = "lcp";
    BeaconMetricKey["LoAF"] = "loaf";
    BeaconMetricKey["NavigationTiming"] = "navigationTiming";
  })(BeaconMetricKey || (BeaconMetricKey = {}));

  function onPageLoad(callback) {
    if (document.readyState === "complete") {
      // The onload event has already fired
      callback();
    }
    else {
      // Listen for the onload event and run the callback after a short delay
      addListener("load", () => {
        setTimeout(callback, 200);
      });
    }
  }

  const luxOrigin = "https://lux.speedcurve.com";
  function fromObject(obj) {
    const autoMode = getProperty(obj, "auto", true);
    return {
      allowEmptyPostBeacon: getProperty(obj, "allowEmptyPostBeacon", false),
      auto: autoMode,
      beaconUrl: getProperty(obj, "beaconUrl", luxOrigin + "/lux/"),
      beaconUrlFallback: getProperty(obj, "beaconUrlFallback"),
      beaconUrlV2: getProperty(obj, "beaconUrlV2", "https://beacon.speedcurve.com/store"),
      conversions: getProperty(obj, "conversions"),
      cookieDomain: getProperty(obj, "cookieDomain"),
      customerid: getProperty(obj, "customerid"),
      errorBeaconUrl: getProperty(obj, "errorBeaconUrl", luxOrigin + "/error/"),
      interactionBeaconDelay: getProperty(obj, "interactionBeaconDelay", 200),
      jspagelabel: getProperty(obj, "jspagelabel"),
      label: getProperty(obj, "label"),
      maxAttributionEntries: getProperty(obj, "maxAttributionEntries", 25),
      maxBeaconUrlLength: getProperty(obj, "maxBeaconUrlLength", 8190),
      maxBeaconUTEntries: getProperty(obj, "maxBeaconUTEntries", 20),
      maxErrors: getProperty(obj, "maxErrors", 5),
      maxMeasureTime: getProperty(obj, "maxMeasureTime", 60_000),
      measureUntil: getProperty(obj, "measureUntil", "onload"),
      minMeasureTime: getProperty(obj, "minMeasureTime", 0),
      newBeaconOnPageShow: getProperty(obj, "newBeaconOnPageShow", false),
      pagegroups: getProperty(obj, "pagegroups"),
      samplerate: getProperty(obj, "samplerate", 100),
      sendBeaconOnPageHidden: getProperty(obj, "sendBeaconOnPageHidden", autoMode),
      serverTiming: getProperty(obj, "serverTiming"),
      trackErrors: getProperty(obj, "trackErrors", true),
      trackHiddenPages: getProperty(obj, "trackHiddenPages", false),
    };
  }
  function getProperty(obj, key, defaultValue) {
    if (typeof obj[key] !== "undefined") {
      return obj[key];
    }
    return defaultValue;
  }

  const SESSION_COOKIE_NAME = "lux_uid";

  const customDataValues = {};
  let updatedCustomData = {};
  function addCustomDataValue(name, value) {
    const typeV = typeof value;
    const valueIsEmpty = typeV === "undefined" || value === null;
    if (!valueIsEmpty && customDataValues[name] !== value) {
      // If the value is new or different to the previous value, record it so that later we can send
      // only the values that have changed.
      updatedCustomData[name] = value;
    }
    if (typeV === "string" || typeV === "number" || typeV === "boolean") {
      customDataValues[name] = value;
    }
    if (valueIsEmpty) {
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
    const strings = [];
    for (let key in values) {
      // Convert all values to strings
      let value = "" + values[key];
      // Strip out reserved characters (, and | are used as delimiters)
      key = key.replace(/,/g, "").replace(/\|/g, "");
      value = value.replace(/,/g, "").replace(/\|/g, "");
      strings.push(key + "|" + value);
    }
    return encodeURIComponent(strings.join(","));
  }

  function getClosestScTrackAttribute(el) {
    if (el.hasAttribute("data-sctrack")) {
      const trackId = el.getAttribute("data-sctrack")?.trim();
      if (trackId) {
        return trackId;
      }
    }
    if (hasParentNode(el)) {
      return getClosestScTrackAttribute(el.parentNode);
    }
    return null;
  }

  function hasParentNode(el) {
    if (el.parentNode && el.parentNode.tagName) {
      return true;
    }
    return false;
  }
  const MAX_SELECTOR_LENGTH = 100;
  function getNodeSelector(node, selector = "") {
    return _getNodeSelector(node, selector).slice(0, MAX_SELECTOR_LENGTH);
  }
  function _getNodeSelector(node, selector = "") {
    try {
      if (selector &&
        (node.nodeType === 9 || selector.length > MAX_SELECTOR_LENGTH || !node.parentNode)) {
        // Final selector.
        return selector;
      }
      const el = node;
      // Our first preference is to use the data-sctrack attribute from anywhere in the tree
      const trackId = getClosestScTrackAttribute(el);
      if (trackId) {
        return trackId;
      }
      if (el.id) {
        // Once we've found an element with ID we return the selector.
        return "#" + el.id + (selector ? ">" + selector : "");
      }
      else if (el) {
        // Otherwise attempt to get parent elements recursively
        const name = el.nodeType === 1 ? el.nodeName.toLowerCase() : el.nodeName.toUpperCase();
        let classes = el.className ? "." + el.className.replace(/\s+/g, ".") : "";
        // Remove classes until the selector is short enough
        while ((name + classes).length > MAX_SELECTOR_LENGTH) {
          classes = classes.split(".").slice(0, -1).join(".");
        }
        const currentSelector = name + classes + (selector ? ">" + selector : "");
        if (el.parentNode) {
          const selectorWithParent = getNodeSelector(el.parentNode, currentSelector);
          if (selectorWithParent.length < MAX_SELECTOR_LENGTH) {
            return selectorWithParent;
          }
        }
        return currentSelector;
      }
    }
    catch (error) {
      // Do nothing.
    }
    return selector;
  }

  const subscribers = {};
  const eventData = {};
  function subscribe(event, callback) {
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    subscribers[event].push(callback);
    // Ensure previous event data is available to new subscribers
    if (eventData[event] !== undefined) {
      callback(eventData[event]);
    }
  }
  function emit(event, data) {
    eventData[event] = data;
    if (!subscribers[event]) {
      return;
    }
    subscribers[event].forEach((callback) => callback(data));
  }

  const KNOWN_TRACKING_PARAMS = [
    "utm_source",
    "utm_campaign",
    "utm_medium",
    "utm_term",
    "utm_content",
  ];
  /**
  * Add known tracking parameters to the custom data storage.
  */
  function getTrackingParams() {
    const trackingParams = {};
    if (location.search && typeof URLSearchParams === "function") {
      const p = new URLSearchParams(location.search);
      for (const key of KNOWN_TRACKING_PARAMS) {
        const value = p.get(key);
        if (value) {
          trackingParams[key] = value;
        }
      }
    }
    return trackingParams;
  }

  class Logger {
    events = [];
    logEvent(event, args = []) {
      this.events.push([now(), event, args]);
    }
    getEvents() {
      return this.events;
    }
  }

  let sessionValue = 0;
  let sessionEntries = [];
  let sessionAttributions = [];
  let largestEntry;
  let maximumSessionValue = 0;
  function processEntry$3(entry) {
    if (!entry.hadRecentInput) {
      const firstEntry = sessionEntries[0];
      const latestEntry = sessionEntries[sessionEntries.length - 1];
      const sources = entry.sources
      ? entry.sources
      .filter((source) => source.node)
      .map((source) => ({
        value: entry.value,
        startTime: processTimeMetric(entry.startTime),
        elementSelector: getNodeSelector(source.node),
        elementType: source.node.nodeName,
      }))
      : [];
      if (sessionEntries.length &&
        (entry.startTime - latestEntry.startTime >= 1000 ||
          entry.startTime - firstEntry.startTime >= 5000)) {
        sessionValue = entry.value;
        sessionEntries = [entry];
        sessionAttributions = sources;
        largestEntry = entry;
      }
      else {
        sessionValue += entry.value;
        sessionEntries.push(entry);
        sessionAttributions = sessionAttributions.concat(sources);
        if (!largestEntry || entry.value > largestEntry.value) {
          largestEntry = entry;
        }
      }
      maximumSessionValue = max(maximumSessionValue, sessionValue);
    }
  }
  function reset$3() {
    sessionValue = 0;
    sessionEntries = [];
    maximumSessionValue = 0;
    largestEntry = undefined;
  }
  function getData$3(config) {
    if (!("LayoutShift" in self)) {
      return undefined;
    }
    return {
      value: maximumSessionValue,
      startTime: sessionEntries[0] ? processTimeMetric(sessionEntries[0].startTime) : null,
      largestEntry: largestEntry
      ? {
        value: largestEntry.value,
        startTime: processTimeMetric(largestEntry.startTime),
      }
      : null,
      sources: sessionAttributions.length
      ? sessionAttributions.slice(0, config.maxAttributionEntries)
      : null,
    };
  }

  let entries = [];
  function processEntry$2(entry) {
    entries.push(entry);
  }
  function reset$2() {
    entries = [];
  }
  function getEntries$1() {
    return entries;
  }
  function getData$2(config) {
    const summarizedEntries = [];
    let totalDuration = 0;
    let totalBlockingDuration = 0;
    let totalStyleAndLayoutDuration = 0;
    let totalWorkDuration = 0;
    entries.forEach((entry) => {
      const { startTime, blockingDuration, duration, renderStart, styleAndLayoutStart } = entry;
      totalDuration += duration;
      totalBlockingDuration += blockingDuration;
      totalStyleAndLayoutDuration += styleAndLayoutStart
      ? clamp(startTime + duration - styleAndLayoutStart)
      : 0;
      totalWorkDuration += renderStart ? renderStart - startTime : duration;
      summarizedEntries.push({
        startTime: floor(startTime),
        duration: floor(duration),
        renderStart: floor(renderStart),
        styleAndLayoutStart: floor(styleAndLayoutStart),
        blockingDuration: floor(blockingDuration),
      });
    });
    return {
      totalBlockingDuration: floor(totalBlockingDuration),
      totalDuration: floor(totalDuration),
      totalEntries: entries.length,
      totalStyleAndLayoutDuration: floor(totalStyleAndLayoutDuration),
      totalWorkDuration: floor(totalWorkDuration),
      scripts: summarizeLoAFScripts(entries.flatMap((entry) => entry.scripts), config),
      // Only keep the slowest LoAF entries
      entries: summarizedEntries
      .sort((a, b) => b.duration - a.duration)
      .slice(0, config.maxAttributionEntries)
      .sort((a, b) => a.startTime - b.startTime),
    };
  }
  function summarizeLoAFScripts(scripts, config) {
    const summary = {};
    scripts.forEach((script) => {
      const key = script.sourceURL;
      if (!summary[key]) {
        summary[key] = {
          sourceUrl: script.sourceURL,
          sourceFunctionName: "",
          timings: [],
          totalEntries: 0,
          totalDuration: 0,
          totalBlockingDuration: 0,
          totalPauseDuration: 0,
          totalForcedStyleAndLayoutDuration: 0,
          invoker: "",
          inpPhase: script.inpPhase,
        };
      }
      summary[key].totalEntries++;
      summary[key].totalDuration += script.duration;
      summary[key].totalBlockingDuration += max(0, script.duration - 50);
      summary[key].totalPauseDuration += script.pauseDuration;
      summary[key].totalForcedStyleAndLayoutDuration += script.forcedStyleAndLayoutDuration;
      summary[key].timings.push([floor(script.startTime), floor(script.duration)]);
    });
    return Object.values(summary)
    .map((script) => ({
      ...script,
      totalDuration: floor(script.totalDuration),
      totalPauseDuration: floor(script.totalPauseDuration),
      totalForcedStyleAndLayoutDuration: floor(script.totalForcedStyleAndLayoutDuration),
    }))
    .sort((a, b) => b.totalDuration - a.totalDuration)
    .slice(0, config.maxAttributionEntries);
  }

  /**
  * This implementation is based on the web-vitals implementation, however it is stripped back to the
  * bare minimum required to measure just the INP value and does not store the actual event entries.
  */
  // The maximum number of interactions to store
  const MAX_INTERACTIONS = 10;
  var INPPhase;
  (function (INPPhase) {
    INPPhase["InputDelay"] = "ID";
    INPPhase["ProcessingTime"] = "PT";
    INPPhase["PresentationDelay"] = "PD";
  })(INPPhase || (INPPhase = {}));
  // A list of the slowest interactions
  let slowestEntries = [];
  // A map of the slowest interactions by ID
  let slowestEntriesMap = {};
  // The total number of interactions recorded on the page
  let interactionCountEstimate = 0;
  function reset$1() {
    interactionCountEstimate = 0;
    slowestEntries = [];
    slowestEntriesMap = {};
  }
  function processEntry$1(entry) {
    if (entry.interactionId || (entry.entryType === "first-input" && !entryExists(entry))) {
      const { duration, startTime, interactionId, name, processingStart, processingEnd, target } = entry;
      if (duration < 0) {
        return;
      }
      const processingTime = processingEnd - processingStart;
      const existingEntry = slowestEntriesMap[interactionId];
      const selector = target ? getNodeSelector(target) : null;
      if (existingEntry) {
        const longerDuration = duration > existingEntry.duration;
        const sameWithLongerProcessingTime = duration === existingEntry.duration && processingTime > existingEntry.processingTime;
        if (longerDuration || sameWithLongerProcessingTime) {
          // Only replace an existing interation if the duration is longer, or if the duration is the
          // same but the processing time is longer. The logic around this is that the interaction with
          // longer processing time is likely to be the event that actually had a handler.
          existingEntry.duration = duration;
          existingEntry.name = name;
          existingEntry.processingEnd = processingEnd;
          existingEntry.processingStart = processingStart;
          existingEntry.processingTime = processingTime;
          existingEntry.selector = selector;
          existingEntry.startTime = startTime;
          existingEntry.target = target;
        }
      }
      else {
        interactionCountEstimate++;
        slowestEntriesMap[interactionId] = {
          duration,
          interactionId,
          name,
          processingEnd,
          processingStart,
          processingTime,
          selector,
          startTime,
          target,
        };
        slowestEntries.push(slowestEntriesMap[interactionId]);
      }
      // Only store the longest <MAX_INTERACTIONS> interactions
      slowestEntries.sort((a, b) => b.duration - a.duration);
      slowestEntries.splice(MAX_INTERACTIONS).forEach((entry) => {
        delete slowestEntriesMap[entry.interactionId];
      });
    }
  }
  function entryExists(e1) {
    return slowestEntries.some((e2) => e1.startTime === e2.startTime && e1.duration === e2.duration);
  }
  /**
  * Returns an estimated high percentile INP value based on the total number of interactions on the
  * current page.
  */
  function getHighPercentileInteraction() {
    const index = Math.min(slowestEntries.length - 1, Math.floor(getInteractionCount() / 50));
    return slowestEntries[index];
  }
  function getData$1(config) {
    const interaction = getHighPercentileInteraction();
    if (!interaction) {
      return undefined;
    }
    const { duration, startTime, processingStart } = interaction;
    const inpScripts = getEntries$1()
    .flatMap((entry) => entry.scripts)
    // Only include scripts that started during the interaction
    .filter((script) => script.startTime + script.duration >= startTime && script.startTime <= startTime + duration)
    .map((_script) => {
      const script = JSON.parse(JSON.stringify(_script));
      // Clamp the script duration to the time of the interaction
      script.duration = script.startTime + script.duration - max(startTime, script.startTime);
      script.inpPhase = getINPPhase(script, interaction);
      return script;
    });
    const loafScripts = summarizeLoAFScripts(inpScripts, config);
    return {
      value: interaction.duration,
      startTime: processTimeMetric(startTime),
      duration: interaction.duration,
      subParts: {
        inputDelay: clamp(floor(processingStart - startTime)),
        processingStart: processTimeMetric(processingStart),
        processingEnd: processTimeMetric(interaction.processingEnd),
        processingTime: clamp(floor(interaction.processingTime)),
        presentationDelay: clamp(floor(startTime + interaction.duration - interaction.processingEnd)),
      },
      attribution: {
        eventType: interaction.name,
        elementSelector: interaction.selector || null,
        elementType: interaction.target?.nodeName || null,
        loafScripts,
      },
    };
  }
  function getINPPhase(script, interaction) {
    const { processingStart, processingTime, startTime } = interaction;
    const inputDelay = processingStart - startTime;
    if (script.startTime < startTime + inputDelay) {
      return INPPhase.InputDelay;
    }
    else if (script.startTime >= startTime + inputDelay + processingTime) {
      return INPPhase.PresentationDelay;
    }
    return INPPhase.ProcessingTime;
  }
  function getInteractionCount() {
    if ("interactionCount" in performance) {
      return performance.interactionCount;
    }
    return interactionCountEstimate;
  }

  let lcpEntry;
  function processEntry(entry) {
    if (!lcpEntry || entry.startTime > lcpEntry.startTime) {
      lcpEntry = entry;
    }
  }
  function reset() {
    lcpEntry = undefined;
  }
  function getData() {
    if (!lcpEntry) {
      return undefined;
    }
    let subParts = null;
    if (lcpEntry.url) {
      const lcpResource = getEntriesByType("resource").find((resource) => resource.name === lcpEntry.url);
      if (lcpResource) {
        const navEntry = getNavigationEntry();
        const responseStart = navEntry.responseStart || timing.responseStart;
        const activationStart = navEntry.activationStart;
        const ttfb = max(0, responseStart - activationStart);
        const lcpStartTime = lcpResource.startTime;
        const lcpRequestStart = (lcpResource.requestStart || lcpStartTime) - activationStart;
        const lcpResponseEnd = max(lcpRequestStart, lcpResource.responseEnd - activationStart);
        const lcpRenderTime = max(lcpResponseEnd, lcpStartTime - activationStart);
        subParts = {
          resourceLoadDelay: clamp(floor(lcpRequestStart - ttfb)),
          resourceLoadTime: clamp(floor(lcpResponseEnd - lcpRequestStart)),
          elementRenderDelay: clamp(floor(lcpRenderTime - lcpResponseEnd)),
        };
      }
    }
    const value = lcpEntry.startTime;
    if (!shouldReportValue(value)) {
      // It's possible the LCP entry we have occurred before the current page was initialised. In
      // this case, we don't want to report the LCP value.
      return undefined;
    }
    return {
      value: processTimeMetric(value),
      subParts,
      attribution: lcpEntry.element
      ? {
        elementSelector: getNodeSelector(lcpEntry.element),
        elementType: lcpEntry.element.nodeName,
      }
      : null,
    };
  }

  const ALL_ENTRIES = [];
  function observe(type, callback, options) {
    if (typeof PerformanceObserver === "function" &&
      PerformanceObserver.supportedEntryTypes.includes(type)) {
      const po = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => callback(entry));
      });
      po.observe(Object.assign({ type, buffered: true }, { options }));
      return po;
    }
    return undefined;
  }
  function getEntries(type) {
    return ALL_ENTRIES.filter((entry) => entry.entryType === type);
  }
  function addEntry(entry) {
    ALL_ENTRIES.push(entry);
  }

  /**
  * A server timing metric that has its value set to the duration field
  */
  const TYPE_DURATION = "r";
  /**
  * When a description metric has no value, we consider it to be a boolean and set it to this value.
  */
  const BOOLEAN_TRUE_VALUE = "true";
  function getKeyValuePairs(config, serverTiming) {
    const pairs = {};
    serverTiming.forEach((stEntry) => {
      const name = stEntry.name;
      const description = stEntry.description;
      if (name in config) {
        const spec = config[name];
        const multiplier = spec[1];
        if (spec[0] === TYPE_DURATION) {
          pairs[name] = stEntry.duration * (multiplier || 1);
        }
        else if (description && multiplier) {
          const numericValue = parseFloat(description);
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
    const matches = [];
    for (const key in patternMap) {
      const patterns = patternMap[key];
      if (Array.isArray(patterns)) {
        for (const i in patterns) {
          const pattern = patterns[i];
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
    const regex = createRegExpFromPattern(pattern);
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

  let LUX = window.LUX || {};
  let scriptEndTime = scriptStartTime;
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
    const logger = new Logger();
    const globalConfig = fromObject(LUX);
    logger.logEvent(1 /* LogEvent.EvaluationStart */, [VERSION, JSON.stringify(globalConfig)]);
    // Variable aliases that allow the minifier to reduce file size.
    const document = window.document;
    const addEventListener = window.addEventListener;
    const removeEventListener = window.removeEventListener;
    const setTimeout = window.setTimeout;
    const clearTimeout = window.clearTimeout;
    const encodeURIComponent = window.encodeURIComponent;
    const thisScript = document.currentScript || {};
    // Log JS errors.
    let nErrors = 0;
    function errorHandler(e) {
      if (!globalConfig.trackErrors) {
        return;
      }
      nErrors++;
      if (e && typeof e.filename !== "undefined" && typeof e.message !== "undefined") {
        // Always send LUX errors
        const isLuxError = e.filename.indexOf("/lux.js?") > -1 || e.message.indexOf("LUX") > -1;
        if (isLuxError || (nErrors <= globalConfig.maxErrors && _sample())) {
          // Sample & limit other errors.
          // Send the error beacon.
          new Image().src =
          globalConfig.errorBeaconUrl +
          "?v=" +
          versionAsFloat() +
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
    // Bitmask of flags for this session & page
    let gFlags = 0;
    const gaMarks = [];
    const gaMeasures = [];
    let ghIx = {}; // hash for Interaction Metrics (scroll, click, keyboard)
    let gbLuxSent = 0; // have we sent the LUX data? (avoid sending twice in unload)
    let gbNavSent = 0; // have we sent the Nav Timing beacon yet? (avoid sending twice for SPA)
    let gbIxSent = 0; // have we sent the IX data? (avoid sending twice for SPA)
    let gbFirstPV = 1; // this is the first page view (vs. a SPA "soft nav")
    const gSessionTimeout = 30 * 60; // number of seconds after which we consider a session to have "timed out" (used for calculating bouncerate)
    let gSyncId = createSyncId(); // if we send multiple beacons, use this to sync them (eg, LUX & IX) (also called "luxid")
    let gUid = refreshUniqueId(gSyncId); // cookie for this session ("Unique ID")
    let gCustomDataTimeout; // setTimeout timer for sending a Custom data beacon after onload
    let gMaxMeasureTimeout; // setTimeout timer for sending the beacon after a maximum measurement time
    // Storing the customer ID in a local variable makes it possible to run multiple instances of lux.js
    // on the same page.
    let _thisCustomerId = LUX.customerid;
    const beaconCollectors = [];
    const logEntry = (entry) => {
      logger.logEvent(42 /* LogEvent.PerformanceEntryReceived */, [entry]);
    };
    // Most PerformanceEntry types we log an event for and add it to the global entry store.
    const processAndLogEntry = (entry) => {
      addEntry(entry);
      logEntry(entry);
    };
    try {
      observe("longtask", processAndLogEntry);
      observe("element", processAndLogEntry);
      observe("paint", processAndLogEntry);
      if (observe("largest-contentful-paint", (entry) => {
        // Process the LCP entry for the legacy beacon
        processAndLogEntry(entry);
        // Process the LCP entry for the new beacon
        processEntry(entry);
      })) {
        beaconCollectors.push([BeaconMetricKey.LCP, getData]);
      }
      if (observe("layout-shift", (entry) => {
        processEntry$3(entry);
        logEntry(entry);
      })) {
        beaconCollectors.push([BeaconMetricKey.CLS, getData$3]);
      }
      if (observe("long-animation-frame", (entry) => {
        processEntry$2(entry);
        logEntry(entry);
      })) {
        beaconCollectors.push([BeaconMetricKey.LoAF, getData$2]);
      }
      const handleINPEntry = (entry) => {
        processEntry$1(entry);
        logEntry(entry);
      };
      observe("first-input", (entry) => {
        logEntry(entry);
        const entryTime = entry.processingStart - entry.startTime;
        if (!gFirstInputDelay || gFirstInputDelay < entryTime) {
          gFirstInputDelay = floor(entryTime);
        }
        // Allow first-input events to be considered for INP
        handleINPEntry(entry);
      });
      // TODO: Set durationThreshold to 40 once performance.interactionCount is widely supported.
      // Right now we have to count every event to get the total interaction count so that we can
      // estimate a high percentile value for INP.
      if (observe("event", (entry) => {
        handleINPEntry(entry);
        // It's useful to log the interactionId, but it is not serialised by default. Annoyingly, we
        // need to manually serialize our own object with the keys we want.
        logEntry({
          interactionId: entry.interactionId,
          name: entry.name,
          entryType: entry.entryType,
          startTime: entry.startTime,
          duration: entry.duration,
          processingStart: entry.processingStart,
          processingEnd: entry.processingEnd,
        });
      }, { durationThreshold: 0 })) {
        beaconCollectors.push([BeaconMetricKey.INP, getData$1]);
      }
    }
    catch (e) {
      logger.logEvent(51 /* LogEvent.PerformanceObserverError */, [e]);
    }
    const initPostBeacon = () => {
      const b = new Beacon({
        config: globalConfig,
        logger,
        customerId: getCustomerId(),
        sessionId: gUid,
        pageId: gSyncId,
      });
      beaconCollectors.forEach(([metric, collector]) => {
        b.addCollector(metric, collector);
      });
      return b;
    };
    let beacon = initPostBeacon();
    if (_sample()) {
      logger.logEvent(21 /* LogEvent.SessionIsSampled */, [globalConfig.samplerate]);
    }
    else {
      logger.logEvent(22 /* LogEvent.SessionIsNotSampled */, [globalConfig.samplerate]);
    }
    const gLuxSnippetStart = LUX.ns ? LUX.ns - timing.navigationStart : 0;
    if (!performance.timing) {
      logger.logEvent(71 /* LogEvent.NavTimingNotSupported */);
      gFlags = addFlag(gFlags, 2 /* Flags.NavTimingNotSupported */);
      beacon.addFlag(2 /* Flags.NavTimingNotSupported */);
    }
    logger.logEvent(41 /* LogEvent.NavigationStart */, [timing.navigationStart]);
    ////////////////////// FID BEGIN
    // FIRST INPUT DELAY (FID)
    // The basic idea behind FID is to attach various input event listeners and measure the time
    // between when the event happens and when the handler executes. That is FID.
    let gFirstInputDelay;
    const gaEventTypes = ["click", "mousedown", "keydown", "touchstart", "pointerdown"]; // NOTE: does NOT include scroll!
    const ghListenerOptions = { passive: true, capture: true };
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
      let bCancelable = false;
      try {
        // Seeing "Permission denied" errors, so do a simple try-catch.
        bCancelable = evt.cancelable;
      }
      catch (e) {
        // bail - no need to return anything
        logger.logEvent(52 /* LogEvent.InputEventPermissionError */);
        return;
      }
      if (bCancelable) {
        let now = msSinceNavigationStart();
        const eventTimeStamp = evt.timeStamp;
        if (eventTimeStamp > 1520000000) {
          // If the event timeStamp is an epoch time instead of a time relative to NavigationStart,
          // then compare it to Date.now() instead of performance.now().
          now = Number(new Date());
        }
        if (eventTimeStamp > now) {
          // If there is a race condition and eventTimeStamp happened after
          // this code was executed, something is wrong. Bail.
          return;
        }
        const delay = now - eventTimeStamp;
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
    // This is a wrapper around performance.mark that falls back to a polyfill when the User Timing
    // API isn't supported.
    function _mark(...args) {
      logger.logEvent(4 /* LogEvent.MarkCalled */, args);
      if (performance.mark) {
        // Use the native performance.mark where possible...
        return performance.mark(...args);
      }
      // ...Otherwise provide a polyfill
      if (true) {
        const name = args[0];
        const detail = args[1]?.detail || null;
        const startTime = args[1]?.startTime || msSincePageInit();
        const entry = {
          entryType: "mark",
          duration: 0,
          name,
          detail,
          startTime,
        };
        gaMarks.push(entry);
        gFlags = addFlag(gFlags, 4 /* Flags.UserTimingNotSupported */);
        beacon.addFlag(4 /* Flags.UserTimingNotSupported */);
        return entry;
      }
    }
    // This is a wrapper around performance.measure that falls back to a polyfill when the User Timing
    // API isn't supported.
    function _measure(...args) {
      logger.logEvent(5 /* LogEvent.MeasureCalled */, args);
      const name = args[0];
      let startMarkName = args[1];
      let endMarkName = args[2];
      let options;
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
        return performance.measure(...args);
      }
      // ...Otherwise provide a polyfill
      if (true) {
        const navEntry = getNavigationEntry();
        let startTime = typeof startMarkName === "number" ? startMarkName : 0;
        let endTime = typeof endMarkName === "number" ? endMarkName : msSincePageInit();
        const throwError = (missingMark) => {
          throw new DOMException("Failed to execute 'measure' on 'Performance': The mark '" +
            missingMark +
            "' does not exist");
        };
        if (typeof startMarkName === "string") {
          const startMark = _getMark(startMarkName);
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
          const endMark = _getMark(endMarkName);
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
        let duration = endTime - startTime;
        let detail = null;
        if (options) {
          if (options.duration) {
            duration = options.duration;
          }
          detail = options.detail;
        }
        const entry = {
          entryType: "measure",
          name,
          detail,
          startTime,
          duration,
        };
        gaMeasures.push(entry);
        gFlags = addFlag(gFlags, 4 /* Flags.UserTimingNotSupported */);
        beacon.addFlag(4 /* Flags.UserTimingNotSupported */);
        return entry;
      }
    }
    // Return THE LAST mark that matches the name.
    function _getMark(name) {
      return _getM(name, _getMarks());
    }
    function _getM(name, aItems) {
      if (aItems) {
        for (let i = aItems.length - 1; i >= 0; i--) {
          const m = aItems[i];
          if (name === m.name) {
            return m;
          }
        }
      }
      return undefined;
    }
    // Return an array of marks.
    function _getMarks() {
      const marks = getEntriesByType("mark");
      if (marks.length) {
        return marks;
      }
      return gaMarks;
    }
    // Return an array of measures.
    function _getMeasures() {
      const measures = getEntriesByType("measure");
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
      const hUT = {};
      const startMark = _getMark(START_MARK);
      // For user timing values taken in a SPA page load, we need to adjust them
      // so that they're zeroed against the last LUX.init() call.
      const tZero = getZeroTime();
      // marks
      _getMarks().forEach((mark) => {
        const name = mark.name;
        if (name === START_MARK || name === END_MARK) {
          // Don't include the internal marks in the beacon
          return;
        }
        const startTime = floor(mark.startTime - tZero);
        if (startTime < 0) {
          // Exclude marks that were taken before the current SPA page view
          return;
        }
        if (typeof hUT[name] === "undefined") {
          hUT[name] = { startTime };
        }
        else {
          hUT[name].startTime = max(startTime, hUT[name].startTime);
        }
      });
      // measures
      _getMeasures().forEach((measure) => {
        if (startMark && measure.startTime < startMark.startTime) {
          // Exclude measures that were taken before the current SPA page view
          return;
        }
        const name = measure.name;
        const startTime = floor(measure.startTime - tZero);
        const duration = floor(measure.duration);
        if (typeof hUT[name] === "undefined" || startTime > hUT[name].startTime) {
          hUT[name] = { startTime, duration };
        }
      });
      // Convert the user timing values into a delimited string. This string takes the format
      // markName|startTime,measureName|startTime|duration,[markName...]
      const aUT = [];
      for (const utName in hUT) {
        const { startTime, duration } = hUT[utName];
        const utParts = [utName, startTime];
        if (typeof duration !== "undefined") {
          utParts.push(duration);
        }
        aUT.push(utParts.join("|"));
      }
      return aUT;
    }
    // Return a string of Element Timing Metrics formatted for beacon querystring.
    function elementTimingValues() {
      const aET = [];
      getEntries("element").forEach((entry) => {
        if (entry.identifier && entry.startTime) {
          const value = processTimeMetric(entry.startTime);
          if (shouldReportValue(value)) {
            logger.logEvent(43 /* LogEvent.PerformanceEntryProcessed */, [entry]);
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
      let sCPU = "";
      const hCPU = {};
      const hCPUDetails = {}; // TODO - Could remove this later after large totals go away.
      const longTaskEntries = getEntries("longtask");
      // Add up totals for each "type" of long task
      if (longTaskEntries.length) {
        const tZero = getZeroTime();
        longTaskEntries.forEach((entry) => {
          let dur = floor(entry.duration);
          if (entry.startTime < tZero) {
            // In a SPA it is possible that we were in the middle of a Long Task when
            // LUX.init() was called. If so, only include the duration after tZero.
            dur -= tZero - entry.startTime;
          }
          // Only process entries that we calculated to have a valid duration
          if (dur > 0) {
            logger.logEvent(43 /* LogEvent.PerformanceEntryProcessed */, [entry]);
            const type = entry.attribution[0].name;
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
      const jsType = typeof hCPU["script"] !== "undefined" ? "script" : "unknown"; // spec changed from "script" to "unknown" Nov 2018
      if (typeof hCPU[jsType] === "undefined") {
        // Initialize default values for pages that have *no Long Tasks*.
        hCPU[jsType] = 0;
        hCPUDetails[jsType] = "";
      }
      const hStats = cpuStats(hCPUDetails[jsType]);
      const sStats = ",n|" +
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
      let max = 0;
      // FCI is beginning of 5 second window of no Long Tasks _after_ first contentful paint
      const fcp = getFcp();
      let fci = fcp || 0;
      // If FCP is not supported, we can't calculate a valid FCI.
      let bFoundFci = typeof fcp === "undefined";
      const aValues = [];
      const aTuples = sDetails.split(",");
      for (let i = 0; i < aTuples.length; i++) {
        const aTuple = aTuples[i].split("|");
        if (aTuple.length === 2) {
          const start = parseInt(aTuple[0]);
          const dur = parseInt(aTuple[1]);
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
              const val = processTimeMetric(start + dur);
              if (shouldReportValue(val)) {
                fci = val; // FCI is now the end of this Long Task
              }
            }
          }
        }
      }
      const count = aValues.length;
      const median = arrayMedian(aValues);
      return { count, median, max, fci };
    }
    // Return the median value from an array of integers.
    function arrayMedian(aValues) {
      if (0 === aValues.length) {
        return 0;
      }
      const half = floor(aValues.length / 2);
      aValues.sort(sortNumeric);
      if (aValues.length % 2) {
        // Return the middle value.
        return aValues[half];
      }
      else {
        // Return the average of the two middle values.
        return round((aValues[half - 1] + aValues[half]) / 2.0);
      }
    }
    // Track how long it took lux.js to load via Resource Timing.
    function selfLoading() {
      let sLuxjs = "";
      if (gbFirstPV && performance.getEntriesByName) {
        // Get the lux script URL (including querystring params).
        const aResources = performance.getEntriesByName(thisScript.src);
        if (aResources && aResources.length) {
          const r = aResources[0];
          // DO NOT USE DURATION!!!!!
          // See https://www.stevesouders.com/blog/2014/11/25/serious-confusion-with-resource-timing/
          const dns = floor(r.domainLookupEnd - r.domainLookupStart);
          const tcp = floor(r.connectEnd - r.connectStart);
          const fb = floor(r.responseStart - r.requestStart);
          const content = floor(r.responseEnd - r.responseStart);
          const networkDuration = dns + tcp + fb + content;
          const parseEval = scriptEndTime - scriptStartTime;
          const transferSize = r.encodedBodySize ? r.encodedBodySize : 0;
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
      // How long data was collected before the beacon was sent
      sLuxjs += "m" + msSincePageInit();
      return sLuxjs;
    }
    // _clearIx
    function _clearIx() {
      ghIx = {};
    }
    // Return a string of Interaction Metrics formatted for beacon querystring.
    function ixValues() {
      const aIx = [];
      for (const key in ghIx) {
        aIx.push(key + "|" + encodeURIComponent(ghIx[key]));
      }
      return aIx.join(",");
    }
    function _addData(name, value) {
      logger.logEvent(6 /* LogEvent.AddDataCalled */, [name, value]);
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
      const nThis = ("" + gUid).substr(-2); // number for THIS page - from 00 to 99
      return parseInt(nThis) < globalConfig.samplerate;
    }
    /**
    * Re-initialize lux.js to start a new "page". This is typically called within a SPA at the
    * beginning of a page transition, but is also called internally when the BF cache is restored.
    */
    function _init(startTime, clearFlags = true) {
      // Some customers (incorrectly) call LUX.init on the very first page load of a SPA. This would
      // cause some first-page-only data (like paint metrics) to be lost. To prevent this, we silently
      // bail from this function when we detect an unnecessary LUX.init call.
      const endMark = _getMark(END_MARK);
      if (!endMark) {
        return;
      }
      // Mark the "navigationStart" for this SPA page. A start time can be passed through, for example
      // to set a page's start time as an event timestamp.
      if (startTime) {
        _mark(START_MARK, { startTime });
      }
      else {
        _mark(START_MARK);
      }
      logger.logEvent(3 /* LogEvent.InitCalled */);
      // This is an edge case where LUX.auto = true but LUX.init() has been called. In this case, the
      // POST beacon will not be sent automatically, so we need to send it here.
      if (globalConfig.auto && !beacon.isSent) {
        beacon.send();
      }
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
      reset();
      reset$3();
      reset$1();
      reset$2();
      nErrors = 0;
      gFirstInputDelay = undefined;
      beacon = initPostBeacon();
      // Clear flags then set the flag that init was called (ie, this is a SPA).
      if (clearFlags) {
        gFlags = 0;
        gFlags = addFlag(gFlags, 1 /* Flags.InitCalled */);
        beacon.addFlag(1 /* Flags.InitCalled */);
      }
      // Reset the maximum measure timeout
      createMaxMeasureTimeout();
    }
    // Return the number of blocking (synchronous) external scripts in the page.
    function blockingScripts() {
      const lastViewportElem = lastViewportElement();
      if (!lastViewportElem) {
        // If we can not find the last DOM element in the viewport,
        // use the old technique of just counting sync scripts.
        return syncScripts();
      }
      // Find all the synchronous scripts that are ABOVE the last DOM element in the
      // viewport. (If they are BELOW then they do not block rendering of initial viewport.)
      const aElems = document.getElementsByTagName("script");
      let num = 0;
      for (let i = 0, len = aElems.length; i < len; i++) {
        const e = aElems[i];
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
      let nBlocking = 0;
      const aElems = document.getElementsByTagName("link");
      for (let i = 0, len = aElems.length; i < len; i++) {
        const e = aElems[i];
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
      const aElems = document.getElementsByTagName("script");
      let num = 0;
      for (let i = 0, len = aElems.length; i < len; i++) {
        const e = aElems[i];
        if (e.src && !e.async && !e.defer) {
          // If the script has a SRC and async is false, then increment the counter.
          num++;
        }
      }
      return num;
    }
    // Return the number of external scripts in the page.
    function numScripts() {
      const aElems = document.getElementsByTagName("script");
      let num = 0;
      for (let i = 0, len = aElems.length; i < len; i++) {
        const e = aElems[i];
        if (e.src) {
          num++;
        }
      }
      return num;
    }
    // Return the number of stylesheets in the page.
    function numStylesheets() {
      const aElems = document.getElementsByTagName("link");
      let num = 0;
      for (let i = 0, len = aElems.length; i < len; i++) {
        const e = aElems[i];
        if (e.href && "stylesheet" == e.rel) {
          num++;
        }
      }
      return num;
    }
    function inlineTagSize(tagName) {
      const aElems = document.getElementsByTagName(tagName);
      let size = 0;
      for (let i = 0, len = aElems.length; i < len; i++) {
        const e = aElems[i];
        try {
          size += e.innerHTML.length;
        }
        catch (e) {
          // It seems like IE throws an error when accessing the innerHTML property
          logger.logEvent(53 /* LogEvent.InnerHtmlAccessError */);
          return -1;
        }
      }
      return size;
    }
    function getNavTiming() {
      let s = "";
      let ns = timing.navigationStart;
      const startMark = _getMark(START_MARK);
      const endMark = _getMark(END_MARK);
      if (startMark && endMark && !getPageRestoreTime()) {
        // This is a SPA page view, so send the SPA marks & measures instead of Nav Timing.
        // Note: getPageRestoreTime() indicates this was a bfcache restore, which we don't want to treat as a SPA.
        const start = floor(startMark.startTime); // the start mark is "zero"
        ns += start; // "navigationStart" for a SPA is the real navigationStart plus the start mark
        const end = floor(endMark.startTime) - start; // delta from start mark
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
        const navEntry = getNavigationEntry();
        const startRender = getStartRender();
        const fcp = getFcp();
        const lcp = getLcp();
        const prefixNTValue = (key, prefix, ignoreZero) => {
          if (typeof navEntry[key] === "number") {
            const value = navEntry[key];
            // We allow zero values for most navigation timing metrics, but for some metrics we want
            // to ignore zeroes. The exceptions are that all metrics can be zero if the page was either
            // prerendered or restored from the BF cache.
            if (shouldReportValue(value) || !ignoreZero) {
              return prefix + processTimeMetric(value);
            }
          }
          return "";
        };
        let loadEventStartStr = prefixNTValue("loadEventStart", "ls", true);
        let loadEventEndStr = prefixNTValue("loadEventEnd", "le", true);
        if (getPageRestoreTime() && startMark && endMark) {
          // For bfcache restores, we set the load time to the time it took for the page to be restored.
          const loadTime = floor(endMark.startTime - startMark.startTime);
          loadEventStartStr = "ls" + loadTime;
          loadEventEndStr = "le" + loadTime;
        }
        const redirect = wasRedirected();
        const isSecure = document.location.protocol === "https:";
        s = [
          ns,
          "as" + clamp(navEntry.activationStart),
          redirect && !getPageRestoreTime() ? prefixNTValue("redirectStart", "rs") : "",
          redirect && !getPageRestoreTime() ? prefixNTValue("redirectEnd", "re") : "",
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
        const end = floor(endMark.startTime);
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
      const paintEntries = getEntriesByType("paint");
      for (let i = 0; i < paintEntries.length; i++) {
        const entry = paintEntries[i];
        if (entry.name === "first-contentful-paint") {
          const value = processTimeMetric(entry.startTime);
          if (shouldReportValue(value)) {
            return value;
          }
        }
      }
      return undefined;
    }
    // Return Largest Contentful Paint or undefined if not supported.
    function getLcp() {
      const lcpEntries = getEntries("largest-contentful-paint");
      if (lcpEntries.length) {
        const lastEntry = lcpEntries[lcpEntries.length - 1];
        const value = processTimeMetric(lastEntry.startTime);
        if (shouldReportValue(value)) {
          logger.logEvent(43 /* LogEvent.PerformanceEntryProcessed */, [lastEntry]);
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
        const paintEntries = getEntriesByType("paint");
        if (paintEntries.length) {
          const paintValues = paintEntries.map((entry) => entry.startTime).sort(sortNumeric);
          // Use the earliest valid paint entry as the start render time.
          for (let i = 0; i < paintValues.length; i++) {
            const value = processTimeMetric(paintValues[i]);
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
      logger.logEvent(72 /* LogEvent.PaintTimingNotSupported */);
      return undefined;
    }
    function getINPDetails() {
      if (!("PerformanceEventTiming" in self)) {
        return undefined;
      }
      return getHighPercentileInteraction();
    }
    /**
    * Build the query string for the INP parameters:
    *
    * - INP: The duration of the P98 interaction
    * - INPs: The selector of the P98 interaction element
    * - INPt: The timestamp of the P98 interaction start time
    * - INPi: The input delay subpart of the P98 interaction
    * - INPp: The processing time subpart of the P98 interaction
    * - INPd: The presentation delay subpart of the P98 interaction
    */
    function getINPString(details) {
      return [
        "&INP=" + details.duration,
        details.selector ? "&INPs=" + encodeURIComponent(details.selector) : "",
        "&INPt=" + floor(details.startTime),
        "&INPi=" + clamp(floor(details.processingStart - details.startTime)),
        "&INPp=" + clamp(floor(details.processingTime)),
        "&INPd=" + clamp(floor(details.startTime + details.duration - details.processingEnd)),
      ].join("");
    }
    function getCustomerId() {
      return String(_thisCustomerId);
    }
    function avgDomDepth() {
      const aElems = document.getElementsByTagName("*");
      let i = aElems.length;
      let totalParents = 0;
      while (i--) {
        totalParents += numParents(aElems[i]);
      }
      const average = round(totalParents / aElems.length);
      return average;
    }
    function numParents(elem) {
      let n = 0;
      if (elem.parentNode) {
        while ((elem = elem.parentNode)) {
          n++;
        }
      }
      return n;
    }
    function docHeight(doc) {
      const body = doc.body, docelem = doc.documentElement;
      const height = max(body ? body.scrollHeight : 0, body ? body.offsetHeight : 0, docelem ? docelem.clientHeight : 0, docelem ? docelem.scrollHeight : 0, docelem ? docelem.offsetHeight : 0);
      return height;
    }
    function docWidth(doc) {
      const body = doc.body, docelem = doc.documentElement;
      const width = max(body ? body.scrollWidth : 0, body ? body.offsetWidth : 0, docelem ? docelem.clientWidth : 0, docelem ? docelem.scrollWidth : 0, docelem ? docelem.offsetWidth : 0);
      return width;
    }
    // Return the main HTML document transfer size (in bytes).
    function docSize() {
      return getNavigationEntry().encodedBodySize || 0;
    }
    // Return the connection type based on Network Information API.
    // Note this API is in flux.
    function connectionType() {
      const c = navigator.connection;
      let connType = "";
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
      const aImages = document.getElementsByTagName("img");
      const aImagesAtf = [];
      if (aImages) {
        for (let i = 0, len = aImages.length; i < len; i++) {
          const image = aImages[i];
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
      let lastChildInViewport;
      if (parent) {
        // Got errors that parent was null so testing again here.
        // Find the last child that is in the viewport.
        // Elements are listed in DOM order.
        const aChildren = parent.children;
        if (aChildren) {
          for (let i = 0, len = aChildren.length; i < len; i++) {
            const child = aChildren[i];
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
      const vh = document.documentElement.clientHeight;
      const vw = document.documentElement.clientWidth;
      // Return true if the top-left corner is in the viewport and it has width & height.
      const lt = findPos(e);
      return (lt[0] >= 0 &&
        lt[1] >= 0 &&
        lt[0] < vw &&
        lt[1] < vh &&
        e.offsetWidth > 0 &&
        e.offsetHeight > 0);
    }
    // Return an array containing the top & left coordinates of the element.
    // from http://www.quirksmode.org/js/findpos.html
    function findPos(el) {
      let curleft = 0;
      let curtop = 0;
      while (el) {
        try {
          curleft += el.offsetLeft;
          curtop += el.offsetTop;
          el = el.offsetParent;
        }
        catch (e) {
          // If we get an exception, just return the current values.
          return [curleft, curtop];
        }
      }
      return [curleft, curtop];
    }
    // Mark the load time of the current page. Intended to be used in SPAs where it is not desirable to
    // send the beacon as soon as the page has finished loading.
    function _markLoadTime(time) {
      logger.logEvent(12 /* LogEvent.MarkLoadTimeCalled */, [time]);
      if (time) {
        _mark(END_MARK, { startTime: time });
      }
      else {
        _mark(END_MARK);
      }
    }
    function createMaxMeasureTimeout() {
      clearMaxMeasureTimeout();
      gMaxMeasureTimeout = setTimeout(() => {
        gFlags = addFlag(gFlags, 32 /* Flags.BeaconSentAfterTimeout */);
        beacon.addFlag(32 /* Flags.BeaconSentAfterTimeout */);
        _sendLux();
      }, globalConfig.maxMeasureTime - msSincePageInit());
    }
    function clearMaxMeasureTimeout() {
      if (gMaxMeasureTimeout) {
        clearTimeout(gMaxMeasureTimeout);
      }
    }
    function _getBeaconUrl(customData) {
      const queryParams = [
        "v=" + versionAsFloat(),
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
      const customDataValues = valuesToString(customData);
      if (customDataValues) {
        queryParams.push("CD=" + customDataValues);
        clearUpdateCustomData();
      }
      return globalConfig.beaconUrl + "?" + queryParams.join("&");
    }
    // Beacon back the LUX data.
    function _sendLux(fromUnload = false) {
      if (!isVisible() && !globalConfig.trackHiddenPages && !fromUnload) {
        logger.logEvent(13 /* LogEvent.SendCancelledPageHidden */);
        return;
      }
      clearMaxMeasureTimeout();
      const customerid = getCustomerId();
      if (!customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        gbLuxSent // LUX data already sent
      ) {
        return;
      }
      logger.logEvent(9 /* LogEvent.DataCollectionStart */);
      const startMark = _getMark(START_MARK);
      const endMark = _getMark(END_MARK);
      if (!startMark || (endMark && endMark.startTime < startMark.startTime)) {
        // Record the synthetic loadEventStart time for this page, unless it was already recorded
        // with LUX.markLoadTime()
        _markLoadTime();
      }
      // Store any tracking parameters as custom data
      const trackingParams = getTrackingParams();
      for (const key in trackingParams) {
        logger.logEvent(44 /* LogEvent.TrackingParamAdded */, [key, trackingParams[key]]);
        addCustomDataValue("_" + key, trackingParams[key]);
      }
      let sIx = "";
      let INP = getINPDetails();
      // If we haven't already sent an interaction beacon, check for interaction metrics and include
      // them in the main beacon.
      if (!gbIxSent) {
        sIx = ixValues();
        if (sIx === "") {
          // If there are no interaction metrics, we wait to send INP with the IX beacon to increase
          // the chance that we capture a valid INP.
          INP = undefined;
        }
      }
      const sET = elementTimingValues(); // Element Timing data
      const sCPU = cpuTimes();
      const clsData = getData$3(globalConfig);
      const sLuxjs = selfLoading();
      if (!isVisible()) {
        gFlags = addFlag(gFlags, 8 /* Flags.VisibilityStateNotVisible */);
        beacon.addFlag(8 /* Flags.VisibilityStateNotVisible */);
      }
      if (wasPrerendered()) {
        gFlags = addFlag(gFlags, 1024 /* Flags.PageWasPrerendered */);
        beacon.addFlag(1024 /* Flags.PageWasPrerendered */);
      }
      if (globalConfig.serverTiming) {
        const navEntry = getNavigationEntry();
        if (navEntry.serverTiming) {
          const stPairs = getKeyValuePairs(globalConfig.serverTiming, navEntry.serverTiming);
          for (const name in stPairs) {
            _addData(name, stPairs[name]);
          }
        }
      }
      if (LUX.conversions) {
        getMatchesFromPatternMap(LUX.conversions, location.hostname, location.pathname).forEach((conversion) => {
          LUX.addData(conversion, BOOLEAN_TRUE);
        });
      }
      // We want ALL beacons to have ALL the data used for query filters (geo, pagelabel, browser, & custom data).
      // So we create a base URL that has all the necessary information:
      const baseUrl = _getBeaconUrl(getAllCustomData());
      const is = inlineTagSize("script");
      const ic = inlineTagSize("style");
      const ds = docSize();
      const ct = connectionType();
      const dt = deliveryType();
      // Note some page stat values (the `PS` query string) are non-numeric. To make extracting these
      // values easier, we append an underscore "_" to the value. Values this is used for include
      // connection type (ct) and delivery type (dt).
      const metricsQueryString =
      // only send Nav Timing and lux.js metrics on initial pageload (not for SPA page views)
      (gbNavSent ? "" : "&NT=" + getNavTiming()) +
      "&LJS=" +
      sLuxjs +
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
      (ds ? "ds" + ds : "") + // document HTTP transfer size (bytes)
      (ct ? "ct" + ct + "_" : "") + // connection type
      (typeof dt !== "undefined" ? "dt" + dt + "_" : "") + // delivery type
      "er" +
      nErrors +
      "nt" +
      navigationType() +
      (navigator.deviceMemory ? "dm" + round(navigator.deviceMemory) : "") + // device memory (GB)
      (sIx ? "&IX=" + sIx : "") +
      (typeof gFirstInputDelay !== "undefined" ? "&FID=" + gFirstInputDelay : "") +
      (sCPU ? "&CPU=" + sCPU : "") +
      (sET ? "&ET=" + sET : "") + // element timing
      (clsData ? "&CLS=" + clsData.value.toFixed(6) : "") +
      // INP and sub-parts
      (INP ? getINPString(INP) : "");
      // We add the user timing entries last so that we can split them to reduce the URL size if necessary.
      const utValues = userTimingValues();
      let [beaconUtValues, remainingUtValues] = fitUserTimingEntries(utValues, globalConfig, baseUrl + metricsQueryString);
      // Send the MAIN LUX beacon.
      const mainBeaconUrl = baseUrl +
      metricsQueryString +
      (beaconUtValues.length > 0 ? "&UT=" + beaconUtValues.join(",") : "");
      logger.logEvent(23 /* LogEvent.MainBeaconSent */, [mainBeaconUrl]);
      _sendBeacon(mainBeaconUrl);
      // Set some states.
      gbLuxSent = 1;
      gbNavSent = 1;
      gbIxSent = sIx ? 1 : 0;
      // Send other beacons for JUST User Timing.
      while (remainingUtValues.length) {
        [beaconUtValues, remainingUtValues] = fitUserTimingEntries(remainingUtValues, globalConfig, baseUrl);
        const utBeaconUrl = baseUrl + "&UT=" + beaconUtValues.join(",");
        logger.logEvent(24 /* LogEvent.UserTimingBeaconSent */, [utBeaconUrl]);
        _sendBeacon(utBeaconUrl);
      }
    }
    let ixTimerId;
    function _sendIxAfterDelay() {
      clearTimeout(ixTimerId);
      ixTimerId = setTimeout(_sendIx, globalConfig.interactionBeaconDelay);
    }
    // Beacon back the IX data separately (need to sync with LUX beacon on the backend).
    function _sendIx() {
      const customerid = getCustomerId();
      if (!customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        gbIxSent || // IX data already sent
        !gbLuxSent // LUX has NOT been sent yet, so wait to include it there
      ) {
        return;
      }
      const sIx = ixValues(); // Interaction Metrics
      const INP = getINPDetails();
      if (sIx) {
        const beaconUrl = _getBeaconUrl(getUpdatedCustomData()) +
        "&IX=" +
        sIx +
        (typeof gFirstInputDelay !== "undefined" ? "&FID=" + gFirstInputDelay : "") +
        (typeof INP !== "undefined" ? getINPString(INP) : "");
        logger.logEvent(25 /* LogEvent.InteractionBeaconSent */, [beaconUrl]);
        _sendBeacon(beaconUrl);
        gbIxSent = 1;
      }
    }
    // Beacon back custom data that is recorded _after_ the main beacon was sent
    // (i.e., custom data after window.onload).
    function _sendCustomData() {
      const customerid = getCustomerId();
      if (!customerid ||
        !gSyncId ||
        !_sample() || // OUTSIDE the sampled range
        !gbLuxSent // LUX has NOT been sent yet, so wait to include it there
      ) {
        return;
      }
      const customDataValues = valuesToString(getUpdatedCustomData());
      if (customDataValues) {
        const beaconUrl = _getBeaconUrl(getUpdatedCustomData());
        logger.logEvent(26 /* LogEvent.CustomDataBeaconSent */, [beaconUrl]);
        _sendBeacon(beaconUrl);
      }
    }
    function _sendBeacon(url) {
      new Image().src = url;
      emit("beacon", url);
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
        ghIx["s"] = msSincePageInit();
      }
    }
    function _keyHandler(e) {
      const { keyCode } = e;
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
      if (typeof ghIx["k"] === "undefined") {
        ghIx["k"] = msSincePageInit();
        if (e && e.target instanceof Element) {
          const trackId = getNodeSelector(e.target);
          if (trackId) {
            ghIx["ki"] = trackId;
          }
        }
        // Only one interaction type is recorded. Scrolls are considered less important, so delete
        // any scroll times if they exist.
        delete ghIx["s"];
        _sendIxAfterDelay();
      }
      _removeIxHandlers();
    }
    function _clickHandler(e) {
      if (typeof ghIx["c"] === "undefined") {
        ghIx["c"] = msSincePageInit();
        // Only one interaction type is recorded. Scrolls are considered less important, so delete
        // any scroll times if they exist.
        delete ghIx["s"];
        let target;
        try {
          // Seeing "Permission denied" errors, so do a simple try-catch.
          if (e && e.target instanceof Element) {
            target = e.target;
          }
        }
        catch (e) {
          logger.logEvent(54 /* LogEvent.EventTargetAccessError */);
        }
        if (target) {
          if (e.clientX) {
            // Save the x&y of the mouse click.
            ghIx["cx"] = e.clientX;
            ghIx["cy"] = e.clientY;
          }
          const trackId = getNodeSelector(target);
          if (trackId) {
            ghIx["ci"] = trackId;
          }
        }
        _sendIxAfterDelay();
      }
      _removeIxHandlers();
    }
    function _addUnloadHandlers() {
      const onunload = () => {
        gFlags = addFlag(gFlags, 16 /* Flags.BeaconSentFromUnloadHandler */);
        beacon.addFlag(16 /* Flags.BeaconSentFromUnloadHandler */);
        logger.logEvent(10 /* LogEvent.UnloadHandlerTriggered */);
        _sendLux(true);
        _sendIx();
        beacon.send();
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
      addListener("visibilitychange", () => {
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
    function createSyncId(inSampleBucket = false) {
      let syncId;
      if (inSampleBucket) {
        // "00" matches all sample rates
        syncId = Number(new Date()) + "00000";
      }
      else {
        syncId = Number(new Date()) + padStart(String(round(100000 * Math.random())), 5, "0");
      }
      emit("new_page_id", syncId);
      return syncId;
    }
    // Unique ID (also known as Session ID)
    // We use this to track all the page views in a single user session.
    // If there is NOT a UID then set it to the new value (which is the same as the "sync ID" for this page).
    // Refresh its expiration date and return its value.
    function refreshUniqueId(newValue) {
      let uid = _getCookie(SESSION_COOKIE_NAME);
      if (!uid || uid.length < 11) {
        uid = newValue;
      }
      else {
        // Prevent sessions lasting more than 24 hours.
        // The first 10 characters of uid is the epoch time when the session started.
        const uidStart = parseInt(uid.substring(0, 10));
        const now = Number(new Date()) / 1000; // in seconds
        if (now - uidStart > 24 * 60 * 60) {
          // older than 24 hours - reset to new value
          uid = newValue;
        }
      }
      setUniqueId(uid);
      return uid;
    }
    function setUniqueId(uid) {
      _setCookie(SESSION_COOKIE_NAME, uid, gSessionTimeout);
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
        gFlags = addFlag(gFlags, 128 /* Flags.PageLabelFromLabelProp */);
        beacon.addFlag(128 /* Flags.PageLabelFromLabelProp */);
        return LUX.label;
      }
      if (typeof LUX.pagegroups !== "undefined") {
        const label = getMatchesFromPatternMap(LUX.pagegroups, location.hostname, location.pathname, true);
        if (label) {
          gFlags = addFlag(gFlags, 512 /* Flags.PageLabelFromUrlPattern */);
          beacon.addFlag(512 /* Flags.PageLabelFromUrlPattern */);
          return label;
        }
      }
      if (typeof LUX.jspagelabel !== "undefined") {
        const evaluateJsPageLabel = Function('"use strict"; return ' + LUX.jspagelabel);
        try {
          const label = evaluateJsPageLabel();
          if (label) {
            gFlags = addFlag(gFlags, 256 /* Flags.PageLabelFromGlobalVariable */);
            beacon.addFlag(256 /* Flags.PageLabelFromGlobalVariable */);
            return label;
          }
        }
        catch (e) {
          logger.logEvent(57 /* LogEvent.PageLabelEvaluationError */, [LUX.jspagelabel, e]);
        }
      }
      // default to document.title
      gFlags = addFlag(gFlags, 64 /* Flags.PageLabelFromDocumentTitle */);
      beacon.addFlag(64 /* Flags.PageLabelFromDocumentTitle */);
      return document.title;
    }
    function _getCookie(name) {
      try {
        // Seeing "Permission denied" errors, so do a simple try-catch.
        const aTuples = document.cookie.split(";");
        for (let i = 0; i < aTuples.length; i++) {
          const aTuple = aTuples[i].split("=");
          if (name === aTuple[0].trim()) {
            // cookie name starts with " " if not first
            return unescape(aTuple[1]);
          }
        }
      }
      catch (e) {
        logger.logEvent(55 /* LogEvent.CookieReadError */);
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
        (globalConfig.cookieDomain ? "; domain=" + globalConfig.cookieDomain : "") +
        "; path=/; SameSite=Lax";
      }
      catch (e) {
        logger.logEvent(56 /* LogEvent.CookieSetError */);
      }
    }
    // Set "LUX.auto=false" to disable send results automatically and
    // instead you must call LUX.send() explicitly.
    if (globalConfig.auto) {
      const sendBeaconWhenVisible = () => {
        if (globalConfig.trackHiddenPages) {
          _sendLux();
        }
        else {
          onVisible(_sendLux);
        }
      };
      const sendBeaconAfterMinimumMeasureTime = () => {
        const elapsedTime = msSincePageInit();
        const timeRemaining = globalConfig.minMeasureTime - elapsedTime;
        if (timeRemaining <= 0) {
          logger.logEvent(11 /* LogEvent.OnloadHandlerTriggered */, [
            elapsedTime,
            globalConfig.minMeasureTime,
          ]);
          if (globalConfig.measureUntil === "onload") {
            onPageLoad(sendBeaconWhenVisible);
          }
        }
        else {
          // Try again after the minimum measurement time has elapsed
          setTimeout(sendBeaconAfterMinimumMeasureTime, timeRemaining);
        }
      };
      sendBeaconAfterMinimumMeasureTime();
    }
    // When newBeaconOnPageShow = true, we initiate a new page view whenever a page is restored from
    // bfcache. Since we have no "onload" event to hook into after a bfcache restore, we rely on the
    // unload and maxMeasureTime handlers to send the beacon.
    if (globalConfig.newBeaconOnPageShow) {
      addEventListener("pageshow", (event) => {
        if (event.persisted) {
          // Record the timestamp of the bfcache restore
          setPageRestoreTime(event.timeStamp);
          // In Chromium, document.visibilityState is still "hidden" when pageshow fires after a bfcache
          // restore. Wrapping this in a setTimeout ensures the browser has enough time to update the
          // visibility.
          // See https://bugs.chromium.org/p/chromium/issues/detail?id=1133363
          setTimeout(() => {
            if (gbLuxSent) {
              // If the beacon was already sent for this page, we start a new page view and mark the
              // load time as the time it took to restore the page.
              _init(getPageRestoreTime(), false);
              _markLoadTime();
            }
            // Flag the current page as a bfcache restore
            gFlags = addFlag(gFlags, 2048 /* Flags.PageWasBfCacheRestored */);
            beacon.addFlag(2048 /* Flags.PageWasBfCacheRestored */);
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
    const globalLux = globalConfig;
    // Functions
    globalLux.mark = _mark;
    globalLux.measure = _measure;
    globalLux.init = _init;
    globalLux.markLoadTime = _markLoadTime;
    globalLux.on = subscribe;
    globalLux.send = () => {
      logger.logEvent(7 /* LogEvent.SendCalled */);
      beacon.send();
      _sendLux();
    };
    globalLux.addData = _addData;
    globalLux.getSessionId = _getUniqueId; // so customers can do their own sampling
    globalLux.getDebug = () => {
      console.log("SpeedCurve RUM debugging documentation: https://support.speedcurve.com/docs/rum-js-api#luxgetdebug");
      return logger.getEvents();
    };
    globalLux.forceSample = () => {
      logger.logEvent(8 /* LogEvent.ForceSampleCalled */);
      setUniqueId(createSyncId(true));
    };
    globalLux.doUpdate = () => {
      // Deprecated, intentionally empty.
    };
    globalLux.cmd = _runCommand;
    // Public properties
    globalLux.version = VERSION;
    /**
    * Run a command from the command queue
    */
    function _runCommand([fn, ...args]) {
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
    logger.logEvent(2 /* LogEvent.EvaluationEnd */);
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
