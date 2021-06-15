/* eslint-disable */

// ! Remember to keep the settings at the end of this file when updating LUX.
//
// The settings are:
//  * `LUX.customerid = 47044334` to let LUX know who this is
//  * `LUX.beaconMode = "simple"` to fire the beacon as an image, which is now
//    allowed by the content security policy.
//  * `LUX.debug = false` turns debugging on and off. Left set to false - and
//    kept in the file so it's easier to remember that this can be turned on.

var LUX_t_start = Date.now(),
    LUX = window.LUX || {};
LUX = function() {
    var gaLog = [];
    dlog("lux.js evaluation start.");
    var version = "214",
        _errorUrl = "https://lux.speedcurve.com/error/",
        nErrors = 0,
        maxErrors = 5;

    function errorHandler(e) {
        nErrors++, e && void 0 !== e.filename && void 0 !== e.message && (-1 !== e.filename.indexOf("/lux.js?") || -1 !== e.message.indexOf("LUX") || nErrors <= maxErrors && "function" == typeof _sample && _sample()) && ((new Image).src = _errorUrl + "?v=" + version + "&id=" + getCustomerId() + "&fn=" + encodeURIComponent(e.filename) + "&ln=" + e.lineno + "&cn=" + e.colno + "&msg=" + encodeURIComponent(e.message) + "&l=" + encodeURIComponent(_getPageLabel()) + (connectionType() ? "&ct=" + connectionType() : ""))
    }
    window.addEventListener("error", errorHandler);
    var gaPerfEntries = "object" == typeof window.LUX_al ? window.LUX_al.slice() : [];
    if ("function" == typeof PerformanceObserver) {
        var perfObserver = new PerformanceObserver((function(e) {
            e.getEntries().forEach((function(e) {
                gaPerfEntries.push(e)
            }))
        }));
        try {
            "function" == typeof PerformanceLongTaskTiming && perfObserver.observe({
                type: "longtask"
            }), "function" == typeof LargestContentfulPaint && perfObserver.observe({
                type: "largest-contentful-paint",
                buffered: !0
            }), "function" == typeof PerformanceElementTiming && perfObserver.observe({
                type: "element",
                buffered: !0
            }), "function" == typeof PerformancePaintTiming && perfObserver.observe({
                type: "paint",
                buffered: !0
            }), "function" == typeof LayoutShift && perfObserver.observe({
                type: "layout-shift",
                buffered: !0
            })
        } catch (e) {
            dlog("Long Tasks error.")
        }
    } else dlog("Long Tasks not supported.");
    var gFlags = 0,
        gFlag_InitCalled = 1,
        gFlag_NoNavTiming = 2,
        gFlag_NoUserTiming = 4,
        gFlag_NotVisible = 8,
        gaMarks = void 0 !== LUX.gaMarks ? LUX.gaMarks : [],
        gaMeasures = void 0 !== LUX.gaMeasures ? LUX.gaMeasures : [],
        ghIx = {},
        ghData = {},
        gbLuxSent = 0,
        gbNavSent = 0,
        gbIxSent = 0,
        gbUpdated = 0,
        gbFirstPV = 1,
        gStartMark = "LUX_start",
        gEndMark = "LUX_end",
        gSessionTimeout = 1800,
        gSyncId = createSyncId(),
        gUid = refreshUniqueId(gSyncId),
        gCustomerDataTimeout, perf = window.performance,
        gMaxQuerystring = 2e3,
        _beaconUrl = void 0 !== LUX.beaconUrl ? LUX.beaconUrl : "https://lux.speedcurve.com/lux/",
        _samplerate = void 0 !== LUX.samplerate ? LUX.samplerate : 100;
    dlog("Sample rate = " + _samplerate + "%. " + (_sample() ? "This session IS being sampled." : "This session is NOT being sampled. The data will NOT show up in your LUX dashboards. Call LUX.forceSample() and try again."));
    var _auto = void 0 === LUX.auto || LUX.auto,
        _navigationStart = LUX.ns ? LUX.ns : Date.now ? Date.now() : +new Date,
        gLuxSnippetStart = 0,
        gFirstInputDelay;
    perf && perf.timing && perf.timing.navigationStart ? (_navigationStart = perf.timing.navigationStart, gLuxSnippetStart = LUX.ns ? LUX.ns - _navigationStart : 0) : (dlog("Nav Timing is not supported."), gFlags |= gFlag_NoNavTiming);
    var gaEventTypes = ["click", "mousedown", "keydown", "touchstart", "pointerdown"],
        ghListenerOptions = {
            passive: !0,
            capture: !0
        };

    function recordDelay(e) {
        gFirstInputDelay || (gFirstInputDelay = Math.round(e), gaEventTypes.forEach((function(e) {
            removeEventListener(e, onInput, ghListenerOptions)
        })))
    }

    function onPointerDown(e, t) {
        function n() {
            recordDelay(e, t), a()
        }

        function r() {
            a()
        }

        function a() {
            window.removeEventListener("pointerup", n, ghListenerOptions), window.removeEventListener("pointercancel", r, ghListenerOptions)
        }
        window.addEventListener("pointerup", n, ghListenerOptions), window.addEventListener("pointercancel", r, ghListenerOptions)
    }

    function onInput(e) {
        var t = !1;
        try {
            t = e.cancelable
        } catch (e) {
            return void dlog("Permission error accessing input event.")
        }
        if (t) {
            var n = _now(!0),
                r = e.timeStamp;
            if (r > 152e7 && (n = Number(new Date)), r > n) return;
            var a = n - r;
            "pointerdown" == e.type ? onPointerDown(a, e) : recordDelay(a, e)
        }
    }

    function _now(e) {
        var t = (Date.now ? Date.now() : +new Date) - _navigationStart,
            n = _getMark(gStartMark);
        return n && !e ? t - n.startTime : perf && perf.now ? perf.now() : t
    }

    function _mark(e) {
        if (dlog("Enter LUX.mark(), name = " + e), perf) {
            if (perf.mark) return perf.mark(e);
            if (perf.webkitMark) return perf.webkitMark(e)
        }
        gFlags |= gFlag_NoUserTiming, gaMarks.push({
            name: e,
            entryType: "mark",
            startTime: _now(),
            duration: 0
        })
    }

    function _measure(e, t, n) {
        if (dlog("Enter LUX.measure(), name = " + e), void 0 === t && _getMark(gStartMark) && (t = gStartMark), perf) {
            if (perf.measure) return t ? n ? perf.measure(e, t, n) : perf.measure(e, t) : perf.measure(e);
            if (perf.webkitMeasure) return perf.webkitMeasure(e, t, n)
        }
        var r = 0,
            a = _now();
        if (t) {
            var i = _getMark(t);
            if (i) r = i.startTime;
            else {
                if (!(perf && perf.timing && perf.timing[t])) return;
                r = perf.timing[t] - perf.timing.navigationStart
            }
        }
        if (n) {
            var o = _getMark(n);
            if (o) a = o.startTime;
            else {
                if (!(perf && perf.timing && perf.timing[n])) return;
                a = perf.timing[n] - perf.timing.navigationStart
            }
        }
        gaMeasures.push({
            name: e,
            entryType: "measure",
            startTime: r,
            duration: a - r
        })
    }

    function _getMark(e) {
        return _getM(e, _getMarks())
    }

    function _getM(e, t) {
        if (t)
            for (var n = t.length - 1; n >= 0; n--) {
                var r = t[n];
                if (e === r.name) return r
            }
    }

    function _getMarks() {
        if (perf) {
            if (perf.getEntriesByType) return perf.getEntriesByType("mark");
            if (perf.webkitGetEntriesByType) return perf.webkitGetEntriesByType("mark")
        }
        return gaMarks
    }

    function _getMeasures() {
        if (perf) {
            if (perf.getEntriesByType) return perf.getEntriesByType("measure");
            if (perf.webkitGetEntriesByType) return perf.webkitGetEntriesByType("measure")
        }
        return gaMeasures
    }

    function userTimingValues() {
        var e = {},
            t = _getMark(gStartMark),
            n = _getMarks();
        n && n.forEach((function(n) {
            var r = n.name,
                a = r !== gStartMark && t ? t.startTime : 0,
                i = Math.round(n.startTime - a);
            i < 0 || (void 0 === e[r] ? e[r] = i : e[r] = Math.max(i, e[r]))
        }));
        var r = _getMeasures();
        r && r.forEach((function(n) {
            if (!(t && n.startTime < t.startTime)) {
                var r = n.name,
                    a = Math.round(n.duration);
                void 0 === e[r] ? e[r] = a : e[r] = Math.max(a, e[r])
            }
        }));
        var a = [];
        return Object.keys(e).forEach((function(t) {
            a.push(t + "|" + e[t])
        })), a.join(",")
    }

    function elementTimingValues() {
        var e = [];
        if (gaPerfEntries.length)
            for (var t = 0; t < gaPerfEntries.length; t++) {
                var n = gaPerfEntries[t];
                "element" === n.entryType && n.identifier && n.startTime && e.push(n.identifier + "|" + Math.round(n.startTime))
            }
        return e.join(",")
    }

    function cpuTimes() {
        if ("function" != typeof PerformanceLongTaskTiming) return "";
        var e = "",
            t = {},
            n = {};
        if (gaPerfEntries.length)
            for (var r = _getMark(gStartMark), a = r ? r.startTime : 0, i = r ? _getMark(gEndMark).startTime : perf.timing.loadEventEnd - perf.timing.navigationStart, o = 0; o < gaPerfEntries.length; o++) {
                var s = gaPerfEntries[o];
                if ("longtask" === s.entryType) {
                    var d = Math.round(s.duration);
                    if (s.startTime < a) d -= a - s.startTime;
                    else if (s.startTime >= i) continue;
                    var g = s.attribution[0].name;
                    t[g] || (t[g] = 0, n[g] = ""), t[g] += d, n[g] += "," + Math.round(s.startTime) + "|" + d
                }
            }
        var u = void 0 !== t.script ? "script" : "unknown";
        void 0 === t[u] && (t[u] = 0, n[u] = "");
        var c = cpuStats(n[u]),
            l = ",n|" + c.count + ",d|" + c.median + ",x|" + c.max + (0 === c.fci ? "" : ",i|" + c.fci);
        return e += "s|" + t[u] + l + n[u]
    }

    function cpuStats(e) {
        for (var t = 0, n = getFcp(), r = 0 === n, a = [], i = e.split(","), o = 0; o < i.length; o++) {
            var s = i[o].split("|");
            if (2 === s.length) {
                var d = parseInt(s[0]),
                    g = parseInt(s[1]);
                a.push(g), t = g > t ? g : t, !r && d > n && (d - n > 5e3 ? r = !0 : n = d + g)
            }
        }
        return {
            count: a.length,
            median: arrayMedian(a),
            max: t,
            fci: n
        }
    }

    function calculateDCLS() {
        if ("function" != typeof LayoutShift) return !1;
        for (var e = 0, t = 0; t < gaPerfEntries.length; t++) {
            var n = gaPerfEntries[t];
            "layout-shift" !== n.entryType || n.hadRecentInput || (e += n.value)
        }
        return e.toFixed(6)
    }

    function arrayMedian(e) {
        if (0 === e.length) return 0;
        var t = Math.floor(e.length / 2);
        return e.sort((function(e, t) {
            return e - t
        })), e.length % 2 ? e[t] : Math.round((e[t - 1] + e[t]) / 2)
    }

    function selfLoading() {
        var e = "";
        if (perf && perf.getEntriesByName) {
            var t = getScriptElement("/js/lux.js");
            if (t) {
                var n = perf.getEntriesByName(t.src);
                if (n && n.length) {
                    var r = n[0],
                        a = Math.round(r.domainLookupEnd - r.domainLookupStart),
                        i = Math.round(r.connectEnd - r.connectStart),
                        o = Math.round(r.responseStart - r.requestStart),
                        s = Math.round(r.responseEnd - r.responseStart),
                        d = a + i + o + s,
                        g = LUX_t_end - LUX_t_start,
                        u = r.encodedBodySize ? r.encodedBodySize : 0;
                    e = "d" + a + "t" + i + "f" + o + "c" + s + "n" + d + "e" + g + "r" + _samplerate + (u ? "x" + u : "") + (gLuxSnippetStart ? "l" + gLuxSnippetStart : "") + "s" + (LUX_t_start - _navigationStart)
                }
            }
        }
        return e
    }

    function _clearIx() {
        ghIx = {}
    }

    function ixValues() {
        var e = [];
        for (var t in ghIx) e.push(t + "|" + ghIx[t]);
        return e.join(",")
    }

    function _addData(e, t) {
        dlog("Enter LUX.addData(), name = " + e + ", value = " + t);
        var n = typeof t;
        "string" !== typeof e || "string" !== n && "number" !== n && "boolean" !== n || (ghData[e] = t), gbLuxSent && (gCustomerDataTimeout && clearTimeout(gCustomerDataTimeout), gCustomerDataTimeout = setTimeout(_sendCustomerData, 100))
    }

    function _sample() {
        if (void 0 === gUid || void 0 === _samplerate) return !1;
        var e = ("" + gUid).substr(-2);
        return parseInt(e) < _samplerate
    }

    function customerDataValues() {
        var e = [];
        for (var t in ghData) {
            var n = "" + ghData[t];
            t = t.replace(/,/g, "").replace(/\|/g, ""), n = n.replace(/,/g, "").replace(/\|/g, ""), e.push(t + "|" + n)
        }
        return encodeURIComponent(e.join(","))
    }

    function _init() {
        dlog("Enter LUX.init()."), _clearIx(), _removeIxHandlers(), _addIxHandlers(), gbNavSent = 0, gbLuxSent = 0, gbIxSent = 0, gbFirstPV = 0, gSyncId = createSyncId(), gUid = refreshUniqueId(gSyncId), gaPerfEntries.splice(0), gFlags = 0, gFlags |= gFlag_InitCalled, _mark(gStartMark)
    }

    function blockingScripts() {
        var e = lastViewportElement();
        if (!e) return syncScripts();
        for (var t = document.getElementsByTagName("script"), n = 0, r = 0, a = t.length; r < a; r++) {
            var i = t[r];
            !i.src || i.async || i.defer || 0 == (4 & i.compareDocumentPosition(e)) || n++
        }
        return n
    }

    function blockingStylesheets() {
        for (var e = 0, t = document.getElementsByTagName("link"), n = 0, r = t.length; n < r; n++) {
            var a = t[n];
            a.href && "stylesheet" === a.rel && 0 !== a.href.indexOf("data:") && (a.onloadcssdefined || "print" === a.media || "style" === a.as || "function" == typeof a.onload && "all" === a.media || e++)
        }
        return e
    }

    function syncScripts() {
        for (var e = document.getElementsByTagName("script"), t = 0, n = 0, r = e.length; n < r; n++) {
            var a = e[n];
            !a.src || a.async || a.defer || t++
        }
        return t
    }

    function numScripts() {
        for (var e = document.getElementsByTagName("script"), t = 0, n = 0, r = e.length; n < r; n++) {
            e[n].src && t++
        }
        return t
    }

    function numStylesheets() {
        for (var e = document.getElementsByTagName("link"), t = 0, n = 0, r = e.length; n < r; n++) {
            var a = e[n];
            a.href && "stylesheet" == a.rel && t++
        }
        return t
    }

    function inlineTagSize(e) {
        for (var t = document.getElementsByTagName(e), n = 0, r = 0, a = t.length; r < a; r++) {
            var i = t[r];
            try {
                n += i.innerHTML.length
            } catch (i) {
                return dlog("Error accessing inline element innerHTML."), -1
            }
        }
        return n
    }

    function getNavTiming() {
        var e = "",
            t = _navigationStart;
        if (_getMark(gStartMark) && _getMark(gEndMark)) {
            var n = Math.round(_getMark(gStartMark).startTime);
            e = (t += n) + "fs0ls" + (s = Math.round(_getMark(gEndMark).startTime) - n) + "le" + s
        } else if (perf && perf.timing) {
            var r = perf.timing,
                a = getStartRender(),
                i = getFcp(),
                o = getLcp();
            e = t + (r.redirectStart ? "rs" + (r.redirectStart - t) : "") + (r.redirectEnd ? "re" + (r.redirectEnd - t) : "") + (r.fetchStart ? "fs" + (r.fetchStart - t) : "") + (r.domainLookupStart ? "ds" + (r.domainLookupStart - t) : "") + (r.domainLookupEnd ? "de" + (r.domainLookupEnd - t) : "") + (r.connectStart ? "cs" + (r.connectStart - t) : "") + (r.secureConnectionStart ? "sc" + (r.secureConnectionStart - t) : "") + (r.connectEnd ? "ce" + (r.connectEnd - t) : "") + (r.requestStart ? "qs" + (r.requestStart - t) : "") + (r.responseStart ? "bs" + (r.responseStart - t) : "") + (r.responseEnd ? "be" + (r.responseEnd - t) : "") + (r.domLoading ? "ol" + (r.domLoading - t) : "") + (r.domInteractive ? "oi" + (r.domInteractive - t) : "") + (r.domContentLoadedEventStart ? "os" + (r.domContentLoadedEventStart - t) : "") + (r.domContentLoadedEventEnd ? "oe" + (r.domContentLoadedEventEnd - t) : "") + (r.domComplete ? "oc" + (r.domComplete - t) : "") + (r.loadEventStart ? "ls" + (r.loadEventStart - t) : "") + (r.loadEventEnd ? "le" + (r.loadEventEnd - t) : "") + (a ? "sr" + a : "") + (i ? "fc" + i : "") + (o ? "lc" + o : "")
        } else if (_getMark(gEndMark)) {
            var s;
            e = t + "fs0ls" + (s = Math.round(_getMark(gEndMark).startTime)) + "le" + s
        }
        return e
    }

    function getFcp() {
        if (perf && perf.getEntriesByType && perf.getEntriesByType("paint"))
            for (var e = perf.getEntriesByType("paint"), t = 0; t < e.length; t++) {
                var n = e[t];
                if ("first-contentful-paint" === n.name) return Math.round(n.startTime)
            }
        return 0
    }

    function getLcp() {
        if (gaPerfEntries.length)
            for (var e = gaPerfEntries.length - 1; e >= 0; e--) {
                var t = gaPerfEntries[e];
                if ("largest-contentful-paint" === t.entryType) return Math.round(t.startTime)
            }
        return 0
    }

    function getStartRender() {
        if (perf && perf.timing) {
            var e, t = perf.timing,
                n = t.navigationStart;
            if (n) {
                if (perf && perf.getEntriesByType && perf.getEntriesByType("paint") && perf.getEntriesByType("paint").length)
                    for (var r = perf.getEntriesByType("paint"), a = 0; a < r.length; a++) {
                        var i = r[a];
                        if ("first-paint" === i.name) {
                            e = Math.round(i.startTime);
                            break
                        }
                    } else if (window.chrome && "function" == typeof window.chrome.loadTimes) {
                        var o = window.chrome.loadTimes();
                        o && (e = Math.round(1e3 * o.firstPaintTime - n))
                    } else t.msFirstPaint && (e = Math.round(t.msFirstPaint - n));
                if (e > 0) return e
            }
        }
        return dlog("Paint Timing not supported."), null
    }

    function getCustomerId() {
        if (void 0 !== LUX.customerid) return LUX.customerid;
        var e = getScriptElement("/js/lux.js");
        return e ? (LUX.customerid = getQuerystringParam(e.src, "id"), LUX.customerid) : ""
    }

    function getScriptElement(e) {
        for (var t = document.getElementsByTagName("script"), n = 0, r = t.length; n < r; n++) {
            var a = t[n];
            if (a.src && -1 !== a.src.indexOf(e)) return a
        }
        return null
    }

    function getQuerystringParam(e, t) {
        for (var n = e.split("?")[1].split("&"), r = 0, a = n.length; r < a; r++) {
            var i = n[r].split("=");
            if (t === i[0]) return i[1]
        }
    }

    function avgDomDepth() {
        for (var e = document.getElementsByTagName("*"), t = e.length, n = 0; t--;) n += numParents(e[t]);
        return Math.round(n / e.length)
    }

    function numParents(e) {
        var t = 0;
        if (e.parentNode)
            for (; e = e.parentNode;) t++;
        return t
    }

    function docHeight(e) {
        var t = e.body,
            n = e.documentElement;
        return Math.max(t ? t.scrollHeight : 0, t ? t.offsetHeight : 0, n ? n.clientHeight : 0, n ? n.scrollHeight : 0, n ? n.offsetHeight : 0)
    }

    function docWidth(e) {
        var t = e.body,
            n = e.documentElement;
        return Math.max(t ? t.scrollWidth : 0, t ? t.offsetWidth : 0, n ? n.clientWidth : 0, n ? n.scrollWidth : 0, n ? n.offsetWidth : 0)
    }

    function docSize() {
        if (perf && perf.getEntriesByType) {
            var e = performance.getEntriesByType("navigation");
            if (e && e.length > 0 && e[0].encodedBodySize) return e[0].encodedBodySize
        }
        return 0
    }

    function navigationType() {
        return perf && perf.navigation && void 0 !== perf.navigation.type ? perf.navigation.type : ""
    }

    function connectionType() {
        var e = navigator.connection,
            t = "";
        return e && e.effectiveType && (t = "slow-2g" === (t = e.effectiveType) ? "Slow 2G" : "2g" === t || "3g" === t || "4g" === t || "5g" === t ? t.toUpperCase() : t.charAt(0).toUpperCase() + t.slice(1)), t
    }

    function imagesATF() {
        var e = document.getElementsByTagName("img"),
            t = [];
        if (e)
            for (var n = 0, r = e.length; n < r; n++) {
                var a = e[n];
                inViewport(a) && t.push(a)
            }
        return t
    }

    function lastViewportElement(e) {
        var t;
        if (e || (e = document.body), e) {
            var n = e.children;
            if (n)
                for (var r = 0, a = n.length; r < a; r++) {
                    var i = n[r];
                    inViewport(i) && (t = i)
                }
        }
        return t ? lastViewportElement(t) : e
    }

    function inViewport(e) {
        var t = document.documentElement.clientHeight,
            n = document.documentElement.clientWidth,
            r = findPos(e);
        return r[0] >= 0 && r[1] >= 0 && r[0] < n && r[1] < t && e.offsetWidth > 0 && e.offsetHeight > 0
    }

    function findPos(e) {
        for (var t = 0, n = 0; e;) t += e.offsetLeft, n += e.offsetTop, e = e.offsetParent;
        return [t, n]
    }

    function _sendLux() {
        dlog("Enter LUX.send().");
        var e = getCustomerId();
        if (e && gSyncId && validDomain() && _sample() && !gbLuxSent) {
            _mark(gEndMark);
            var t = userTimingValues(),
                n = elementTimingValues(),
                r = customerDataValues(),
                a = "";
            gbIxSent || (a = ixValues());
            var i = cpuTimes(),
                o = calculateDCLS(),
                s = selfLoading();
            document.visibilityState && "visible" !== document.visibilityState && (gFlags |= gFlag_NotVisible);
            var d = _beaconUrl + "?v=" + version + "&id=" + e + "&sid=" + gSyncId + "&uid=" + gUid + (r ? "&CD=" + r : "") + "&l=" + encodeURIComponent(_getPageLabel()),
                g = inlineTagSize("script"),
                u = inlineTagSize("style"),
                c = (gbNavSent ? "" : "&NT=" + getNavTiming()) + (gbFirstPV ? "&LJS=" + s : "") + "&PS=ns" + numScripts() + "bs" + blockingScripts() + (g > -1 ? "is" + g : "") + "ss" + numStylesheets() + "bc" + blockingStylesheets() + (u > -1 ? "ic" + u : "") + "ia" + imagesATF().length + "it" + document.getElementsByTagName("img").length + "dd" + avgDomDepth() + "nd" + document.getElementsByTagName("*").length + "vh" + document.documentElement.clientHeight + "vw" + document.documentElement.clientWidth + "dh" + docHeight(document) + "dw" + docWidth(document) + (docSize() ? "ds" + docSize() : "") + (connectionType() ? "ct" + connectionType() + "_" : "") + "er" + nErrors + "nt" + navigationType() + (navigator.deviceMemory ? "dm" + Math.round(navigator.deviceMemory) : "") + (a ? "&IX=" + a : "") + (gFirstInputDelay ? "&FID=" + gFirstInputDelay : "") + (i ? "&CPU=" + i : "") + (gFlags ? "&fl=" + gFlags : "") + (n ? "&ET=" + n : "") + "&HN=" + encodeURIComponent(document.location.hostname) + (!1 !== o ? "&CLS=" + o : ""),
                l = "";
            if (t) {
                var f = d.length + c.length;
                if (f + t.length <= gMaxQuerystring) c += "&UT=" + t;
                else {
                    var m = gMaxQuerystring - f,
                        p = t.lastIndexOf(",", m);
                    c += "&UT=" + t.substring(0, p), l = t.substring(p + 1)
                }
            }
            var v = d + c;
            dlog("Sending main LUX beacon: " + v), _sendBeacon(v), gbLuxSent = 1, gbNavSent = 1, gbIxSent = a ? 1 : 0;
            for (var h = gMaxQuerystring - d.length; l;) {
                var y = "";
                if (l.length <= h) y = l, l = "";
                else {
                    var _ = l.lastIndexOf(",", h); - 1 === _ && (_ = l.indexOf(",")), -1 === _ ? (y = l, l = "") : (y = l.substring(0, _), l = l.substring(_ + 1))
                }
                var L = d + "&UT=" + y;
                dlog("Sending extra User Timing beacon: " + L), _sendBeacon(L)
            }
        }
    }

    function _sendIx() {
        var e = getCustomerId();
        if (e && gSyncId && validDomain() && _sample() && !gbIxSent && gbLuxSent) {
            var t = ixValues();
            if (t) {
                var n = customerDataValues(),
                    r = "?v=" + version + "&id=" + e + "&sid=" + gSyncId + "&uid=" + gUid + (n ? "&CD=" + n : "") + "&l=" + encodeURIComponent(_getPageLabel()) + "&IX=" + t + (gFirstInputDelay ? "&FID=" + gFirstInputDelay : "") + "&HN=" + encodeURIComponent(document.location.hostname),
                    a = _beaconUrl + r;
                dlog("Sending Interaction Metrics beacon: " + a), _sendBeacon(a), gbIxSent = 1
            }
        }
    }

    function _sendCustomerData() {
        var e = getCustomerId();
        if (e && gSyncId && validDomain() && _sample() && gbLuxSent) {
            var t = customerDataValues();
            if (t) {
                var n = "?v=" + version + "&id=" + e + "&sid=" + gSyncId + "&uid=" + gUid + "&CD=" + t + "&l=" + encodeURIComponent(_getPageLabel()) + "&HN=" + encodeURIComponent(document.location.hostname),
                    r = _beaconUrl + n;
                dlog("Sending late Customer Data beacon: " + r), _sendBeacon(r)
            }
        }
    }

    function _sendBeacon(e) {
        if ("simple" !== LUX.beaconMode) return _sendBeaconAutoUpdate(e);
        (new Image).src = e
    }

    function _sendBeaconAutoUpdate(e) {
        var t = document.createElement("script");
        t.async = !0, t.src = e;
        var n = document.getElementsByTagName("script");
        n.length ? n[0].parentNode.insertBefore(t, n[0]) : ((n = document.getElementsByTagName("head")).length || (n = document.getElementsByTagName("body")).length) && n[0].appendChild(t)
    }

    function interactionAttributionForElement(e) {
        if (e.id) return e.id;
        for (var t, n = e; n.parentNode && n.parentNode.tagName;) {
            if ((n = n.parentNode).hasAttribute("data-sctrack")) return n.getAttribute("data-sctrack");
            n.id && !t && (t = n.id)
        }
        var r = "INPUT" === e.tagName && "submit" === e.type,
            a = "BUTTON" === e.tagName,
            i = "A" === e.tagName;
        return r && e.value ? e.value : (a || i) && e.innerText ? e.innerText : t || ""
    }

    function _scrollHandler() {
        void 0 === ghIx.s && (ghIx.s = Math.round(_now()))
    }

    function _keyHandler(e) {
        if (_removeIxHandlers(), void 0 === ghIx.k) {
            if (ghIx.k = Math.round(_now()), e && e.target) {
                var t = interactionAttributionForElement(e.target);
                t && (ghIx.ki = t)
            }
            _sendIx()
        }
    }

    function _clickHandler(e) {
        if (_removeIxHandlers(), void 0 === ghIx.c) {
            ghIx.c = Math.round(_now());
            var t = null;
            try {
                e && e.target && (t = e.target)
            } catch (e) {
                dlog("Error accessing event target."), t = null
            }
            if (t) {
                e.clientX && (ghIx.cx = e.clientX, ghIx.cy = e.clientY);
                var n = interactionAttributionForElement(e.target);
                n && (ghIx.ci = n)
            }
            _sendIx()
        }
    }

    function _doUpdate(e, t) {
        if (e && version < e && document.body && !gbUpdated) {
            dlog("Updating cached version of lux.js from " + version + " to " + e + "."), gbUpdated = 1;
            var n = getScriptElement("/js/lux.js");
            if (n)
                if ("function" == typeof fetch) fetch(n.src, {
                    cache: "reload"
                });
                else {
                    var r = document.createElement("iframe");
                    r.style.display = "none", r.id = "LUX_update_iframe", r.src = "//cdn.speedcurve.com/luxupdate.php?src=" + encodeURIComponent(n.src) + (t ? "&tw=" + t : ""), document.body.appendChild(r)
                }
        }
    }

    function addListener(e, t) {
        window.addEventListener ? window.addEventListener(e, t, !1) : window.attachEvent && window.attachEvent("on" + e, t)
    }

    function removeListener(e, t) {
        window.removeEventListener ? window.removeEventListener(e, t, !1) : window.detachEvent && window.detachEvent("on" + e, t)
    }

    function _addIxHandlers() {
        addListener("scroll", _scrollHandler), addListener("keypress", _keyHandler), addListener("mousedown", _clickHandler)
    }

    function _removeIxHandlers() {
        removeListener("scroll", _scrollHandler), removeListener("keypress", _keyHandler), removeListener("mousedown", _clickHandler)
    }

    function createSyncId(e) {
        return e ? Number(new Date) + "00000" : Number(new Date) + "" + _padLeft(parseInt(1e5 * Math.random()), "00000")
    }

    function refreshUniqueId(e) {
        var t = _getCookie("lux_uid");
        if (!t || t.length < 11) t = e;
        else {
            var n = parseInt(t.substring(0, 10));
            Number(new Date) / 1e3 - n > 86400 && (t = e)
        }
        return setUniqueId(t), t
    }

    function setUniqueId(e) {
        return _setCookie("lux_uid", e, gSessionTimeout), e
    }

    function _getUniqueId() {
        return gUid
    }

    function _getPageLabel() {
        if (void 0 !== LUX.label) return LUX.label;
        if (void 0 !== LUX.jspagelabel) {
            try {
                var label = eval(LUX.jspagelabel)
            } catch (e) {
                console.log("Error evaluating customer settings LUX page label:", e)
            }
            if (label) return label
        }
        return document.title
    }

    function validDomain() {
        return !0
    }

    function _getCookie(e) {
        try {
            for (var t = document.cookie.split(";"), n = 0; n < t.length; n++) {
                var r = t[n].split("=");
                if (e === r[0].trim()) return unescape(r[1])
            }
        } catch (e) {
            dlog("Error accessing document.cookie.")
        }
    }

    function _setCookie(e, t, n) {
        try {
            document.cookie = e + "=" + escape(t) + (n ? "; max-age=" + n : "") + "; path=/; SameSite=Lax"
        } catch (e) {
            dlog("Error setting document.cookie.")
        }
    }

    function _padLeft(e, t) {
        return (t + e).slice(-t.length)
    }

    function dlog(e) {
        gaLog.push(e), LUX.debug && console.log("LUX: " + e)
    }
    gaEventTypes.forEach((function(e) {
        window.addEventListener(e, onInput, ghListenerOptions)
    })), _auto && ("complete" == document.readyState ? _sendLux() : addListener("load", (function() {
        setTimeout(_sendLux, 200)
    })), addListener("beforeunload", _sendLux), addListener("unload", _sendLux), addListener("beforeunload", _sendIx), addListener("unload", _sendIx)), _addIxHandlers();
    var _LUX = {
        mark: _mark,
        measure: _measure,
        init: _init,
        send: _sendLux,
        addData: _addData,
        getSessionId: _getUniqueId,
        getDebug: function() {
            return gaLog
        },
        forceSample: function() {
            setUniqueId(createSyncId(!0)), console.log("Sampling has been turned on for this session.")
        },
        doUpdate: _doUpdate,
        cmd: function(e) {
            var t = e.shift();
            "function" == typeof _LUX[t] && _LUX[t].apply(_LUX, e)
        },
        beaconUrl: _beaconUrl,
        samplerate: _samplerate,
        auto: _auto,
        label: void 0 !== LUX.label ? LUX.label : void 0,
        jspagelabel: void 0 !== LUX.jspagelabel ? LUX.jspagelabel : void 0,
        version: version,
        ae: [],
        al: [],
        debug: !!LUX.debug
    };
    return LUX.ac && LUX.ac.length && LUX.ac.forEach((function(e) {
        var t = e.shift();
        "function" == typeof _LUX[t] && _LUX[t].apply(_LUX, e)
    })), void 0 !== window.LUX_ae && window.LUX_ae.forEach((function(e) {
        errorHandler(e)
    })), dlog("lux.js evaluation end."), _LUX
}();
var LUX_t_end = Date.now();

// This ID usually appended to the end of the lux.js as a query string when
// using the SpeedCurve hosted version - but we have to include it here as this
// is self hosted.
LUX.customerid = 47044334;

// Turn on the image-based beacon, rather than have a remote JavaScript file
// fetched and executed.
LUX.beaconMode = "simple";

// Setting debug to `true` shows what happening as it happens. Running
// `LUX.getDebug()` in the browser's console will show the history of what's
// happened.
LUX.debug = false;
