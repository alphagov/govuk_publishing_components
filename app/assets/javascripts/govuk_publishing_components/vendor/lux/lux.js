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
 *  * `LUX.beaconMode = "simple"` to fire the beacon as an image, which is now
 *    allowed by the content security policy.
 *  * `LUX.debug = false` turns debugging on and off. Left set to false - and
 *    kept in the file so it's easier to remember that this can be turned on.
 *
 * ! And the sample rate needs to be set inside the main function that's
 *   assigned to `LUX`:

*  * `LUX.samplerate = 1` to set sample rate to 1% of users.
 */

var LUX_t_start = Date.now(),
    LUX = window.LUX || {};
LUX = (function () {
    // -------------------------------------------------------------------------
    // Settings
    // -------------------------------------------------------------------------
    // Set the sample rate to 1% to avoid all events being sent.
    LUX.samplerate = 1
    // -------------------------------------------------------------------------
    /// End
    // -------------------------------------------------------------------------

    var e = [];
    pe("lux.js evaluation start.");
    var t = "216",
      n = 0;
    function r(e) {
      n++,
        e &&
          void 0 !== e.filename &&
          void 0 !== e.message &&
          (-1 !== e.filename.indexOf("/lux.js?") ||
            -1 !== e.message.indexOf("LUX") ||
            (n <= 5 && W())) &&
          (new Image().src =
            "https://lux.speedcurve.com/error/?v=216&id=" +
            J() +
            "&fn=" +
            encodeURIComponent(e.filename) +
            "&ln=" +
            e.lineno +
            "&cn=" +
            e.colno +
            "&msg=" +
            encodeURIComponent(e.message) +
            "&l=" +
            encodeURIComponent(ge()) +
            (V() ? "&ct=" + V() : ""));
    }
    window.addEventListener("error", r);
    var i = ("object" == typeof window.LUX_al ? window.LUX_al : []).slice();
    if ("function" == typeof PerformanceObserver) {
      var a = new PerformanceObserver(function (e) {
        e.getEntries().forEach(function (e) {
          ("longtask" === e.entryType && -1 !== i.indexOf(e)) || i.push(e);
        });
      });
      try {
        "function" == typeof PerformanceLongTaskTiming &&
          a.observe({ type: "longtask", buffered: !0 }),
          "function" == typeof LargestContentfulPaint &&
            a.observe({ type: "largest-contentful-paint", buffered: !0 }),
          "function" == typeof PerformanceElementTiming &&
            a.observe({ type: "element", buffered: !0 }),
          "function" == typeof PerformancePaintTiming && a.observe({ type: "paint", buffered: !0 }),
          "function" == typeof LayoutShift && a.observe({ type: "layout-shift", buffered: !0 });
      } catch (e) {
        pe("Long Tasks error.");
      }
    } else pe("Long Tasks not supported.");
    var o,
      s = 0,
      u = void 0 !== LUX.gaMarks ? LUX.gaMarks : [],
      c = void 0 !== LUX.gaMeasures ? LUX.gaMeasures : [],
      d = {},
      f = {},
      m = 0,
      l = 0,
      v = 0,
      g = 0,
      p = 1,
      h = "LUX_start",
      y = "LUX_end",
      E = me(),
      T = le(E),
      L = window.performance,
      b = 2e3,
      w = void 0 !== LUX.beaconMode ? LUX.beaconMode : "autoupdate",
      U = void 0 !== LUX.beaconUrl ? LUX.beaconUrl : "https://lux.speedcurve.com/lux/",
      X = void 0 !== LUX.samplerate ? LUX.samplerate : 100;
    pe(
      "Sample rate = " +
        X +
        "%. " +
        (W()
          ? "This session IS being sampled."
          : "This session is NOT being sampled. The data will NOT show up in your LUX dashboards. Call LUX.forceSample() and try again.")
    );
    var S,
      k = void 0 === LUX.auto || LUX.auto,
      M = LUX.ns ? LUX.ns : Date.now ? Date.now() : +new Date(),
      B = 0;
    L && L.timing && L.timing.navigationStart
      ? ((M = L.timing.navigationStart), (B = LUX.ns ? LUX.ns - M : 0))
      : (pe("Nav Timing is not supported."), (s |= 2));
    var N = ["click", "mousedown", "keydown", "touchstart", "pointerdown"],
      x = { passive: !0, capture: !0 };
    function C(e) {
      S ||
        ((S = Math.round(e)),
        N.forEach(function (e) {
          removeEventListener(e, I, x);
        }));
    }
    function I(e) {
      var t = !1;
      try {
        t = e.cancelable;
      } catch (e) {
        return void pe("Permission error accessing input event.");
      }
      if (t) {
        var n = D(!0),
          r = e.timeStamp;
        if ((r > 152e7 && (n = Number(new Date())), r > n)) return;
        var i = n - r;
        "pointerdown" == e.type
          ? (function (e, t) {
              function n() {
                C(e), i();
              }
              function r() {
                i();
              }
              function i() {
                window.removeEventListener("pointerup", n, x),
                  window.removeEventListener("pointercancel", r, x);
              }
              window.addEventListener("pointerup", n, x),
                window.addEventListener("pointercancel", r, x);
            })(i)
          : C(i);
      }
    }
    function D(e) {
      var t = (Date.now ? Date.now() : +new Date()) - M,
        n = _(h);
      return n && !e ? t - n.startTime : L && L.now ? L.now() : t;
    }
    function j(e) {
      if ((pe("Enter LUX.mark(), name = " + e), L)) {
        if (L.mark) return L.mark(e);
        if (L.webkitMark) return L.webkitMark(e);
      }
      (s |= 4), u.push({ name: e, entryType: "mark", startTime: D(), duration: 0 });
    }
    function _(e) {
      return (function (e, t) {
        if (t)
          for (var n = t.length - 1; n >= 0; n--) {
            var r = t[n];
            if (e === r.name) return r;
          }
        return;
      })(e, P());
    }
    function P() {
      if (L) {
        if (L.getEntriesByType) return L.getEntriesByType("mark");
        if (L.webkitGetEntriesByType) return L.webkitGetEntriesByType("mark");
      }
      return u;
    }
    function O() {
      var e = {},
        t = _(h),
        n = P();
      n &&
        n.forEach(function (n) {
          var r = n.name,
            i = r !== h && t ? t.startTime : 0,
            a = Math.round(n.startTime - i);
          a < 0 || (void 0 === e[r] ? (e[r] = a) : (e[r] = Math.max(a, e[r])));
        });
      var r = (function () {
        if (L) {
          if (L.getEntriesByType) return L.getEntriesByType("measure");
          if (L.webkitGetEntriesByType) return L.webkitGetEntriesByType("measure");
        }
        return c;
      })();
      r &&
        r.forEach(function (n) {
          if (!(t && n.startTime < t.startTime)) {
            var r = n.name,
              i = Math.round(n.duration);
            void 0 === e[r] ? (e[r] = i) : (e[r] = Math.max(i, e[r]));
          }
        });
      var i = [];
      return (
        Object.keys(e).forEach(function (t) {
          i.push(t + "|" + e[t]);
        }),
        i.join(",")
      );
    }
    function H() {
      if ("function" != typeof PerformanceLongTaskTiming) return "";
      var e = "",
        t = {},
        n = {};
      if (i.length)
        for (
          var r = _(h),
            a = r ? r.startTime : 0,
            o = r ? _(y).startTime : L.timing.loadEventEnd - L.timing.navigationStart,
            s = 0;
          s < i.length;
          s++
        ) {
          var u = i[s];
          if ("longtask" === u.entryType) {
            var c = Math.round(u.duration);
            if (u.startTime < a) c -= a - u.startTime;
            else if (u.startTime >= o) continue;
            var d = u.attribution[0].name;
            t[d] || ((t[d] = 0), (n[d] = "")),
              (t[d] += c),
              (n[d] += "," + Math.round(u.startTime) + "|" + c);
          }
        }
      var f = void 0 !== t.script ? "script" : "unknown";
      void 0 === t[f] && ((t[f] = 0), (n[f] = ""));
      var m = (function (e) {
          for (var t = 0, n = A(), r = 0 === n, i = [], a = e.split(","), o = 0; o < a.length; o++) {
            var s = a[o].split("|");
            if (2 === s.length) {
              var u = parseInt(s[0]),
                c = parseInt(s[1]);
              i.push(c), (t = c > t ? c : t), !r && u > n && (u - n > 5e3 ? (r = !0) : (n = u + c));
            }
          }
          var d = i.length,
            f = (function (e) {
              if (0 === e.length) return 0;
              var t = Math.floor(e.length / 2);
              return (
                e.sort(function (e, t) {
                  return e - t;
                }),
                e.length % 2 ? e[t] : Math.round((e[t - 1] + e[t]) / 2)
              );
            })(i);
          return { count: d, median: f, max: t, fci: n };
        })(n[f]),
        l = ",n|" + m.count + ",d|" + m.median + ",x|" + m.max + (0 === m.fci ? "" : ",i|" + m.fci);
      return (e += "s|" + t[f] + l + n[f]);
    }
    function R() {
      var e = [];
      for (var t in d) e.push(t + "|" + d[t]);
      return e.join(",");
    }
    function W() {
      if (void 0 === T || void 0 === X) return !1;
      var e = ("" + T).substr(-2);
      return parseInt(e) < X;
    }
    function F() {
      var e = [];
      for (var t in f) {
        var n = "" + f[t];
        (t = t.replace(/,/g, "").replace(/\|/g, "")),
          (n = n.replace(/,/g, "").replace(/\|/g, "")),
          e.push(t + "|" + n);
      }
      return encodeURIComponent(e.join(","));
    }
    function G() {
      var e = Z();
      if (!e)
        return (function () {
          for (
            var e = document.getElementsByTagName("script"), t = 0, n = 0, r = e.length;
            n < r;
            n++
          ) {
            var i = e[n];
            !i.src || i.async || i.defer || t++;
          }
          return t;
        })();
      for (var t = document.getElementsByTagName("script"), n = 0, r = 0, i = t.length; r < i; r++) {
        var a = t[r];
        !a.src || a.async || a.defer || 0 == (4 & a.compareDocumentPosition(e)) || n++;
      }
      return n;
    }
    function q(e) {
      for (var t = document.getElementsByTagName(e), n = 0, r = 0, i = t.length; r < i; r++) {
        var a = t[r];
        try {
          n += a.innerHTML.length;
        } catch (a) {
          return pe("Error accessing inline element innerHTML."), -1;
        }
      }
      return n;
    }
    function z() {
      var e = "",
        t = M;
      if (_(h) && _(y)) {
        var n = Math.round(_(h).startTime);
        e = (t += n) + "fs0ls" + (u = Math.round(_(y).startTime) - n) + "le" + u;
      } else if (L && L.timing) {
        var r = L.timing,
          a = (function () {
            if (L && L.timing) {
              var e,
                t = L.timing,
                n = t.navigationStart;
              if (n) {
                if (
                  L &&
                  L.getEntriesByType &&
                  L.getEntriesByType("paint") &&
                  L.getEntriesByType("paint").length
                )
                  for (var r = L.getEntriesByType("paint"), i = 0; i < r.length; i++) {
                    var a = r[i];
                    if ("first-paint" === a.name) {
                      e = Math.round(a.startTime);
                      break;
                    }
                  }
                else if (window.chrome && "function" == typeof window.chrome.loadTimes) {
                  var o = window.chrome.loadTimes();
                  o && (e = Math.round(1e3 * o.firstPaintTime - n));
                } else t.msFirstPaint && (e = Math.round(t.msFirstPaint - n));
                if (e > 0) return e;
              }
            }
            return pe("Paint Timing not supported."), null;
          })(),
          o = A(),
          s = (function () {
            if (i.length)
              for (var e = i.length - 1; e >= 0; e--) {
                var t = i[e];
                if ("largest-contentful-paint" === t.entryType) return Math.round(t.startTime);
              }
            return 0;
          })();
        e =
          t +
          (r.redirectStart ? "rs" + (r.redirectStart - t) : "") +
          (r.redirectEnd ? "re" + (r.redirectEnd - t) : "") +
          (r.fetchStart ? "fs" + (r.fetchStart - t) : "") +
          (r.domainLookupStart ? "ds" + (r.domainLookupStart - t) : "") +
          (r.domainLookupEnd ? "de" + (r.domainLookupEnd - t) : "") +
          (r.connectStart ? "cs" + (r.connectStart - t) : "") +
          (r.secureConnectionStart ? "sc" + (r.secureConnectionStart - t) : "") +
          (r.connectEnd ? "ce" + (r.connectEnd - t) : "") +
          (r.requestStart ? "qs" + (r.requestStart - t) : "") +
          (r.responseStart ? "bs" + (r.responseStart - t) : "") +
          (r.responseEnd ? "be" + (r.responseEnd - t) : "") +
          (r.domLoading ? "ol" + (r.domLoading - t) : "") +
          (r.domInteractive ? "oi" + (r.domInteractive - t) : "") +
          (r.domContentLoadedEventStart ? "os" + (r.domContentLoadedEventStart - t) : "") +
          (r.domContentLoadedEventEnd ? "oe" + (r.domContentLoadedEventEnd - t) : "") +
          (r.domComplete ? "oc" + (r.domComplete - t) : "") +
          (r.loadEventStart ? "ls" + (r.loadEventStart - t) : "") +
          (r.loadEventEnd ? "le" + (r.loadEventEnd - t) : "") +
          (a ? "sr" + a : "") +
          (o ? "fc" + o : "") +
          (s ? "lc" + s : "");
      } else if (_(y)) {
        var u;
        e = t + "fs0ls" + (u = Math.round(_(y).startTime)) + "le" + u;
      }
      return e;
    }
    function A() {
      if (L && L.getEntriesByType && L.getEntriesByType("paint"))
        for (var e = L.getEntriesByType("paint"), t = 0; t < e.length; t++) {
          var n = e[t];
          if ("first-contentful-paint" === n.name) return Math.round(n.startTime);
        }
      return 0;
    }
    function J() {
      if (void 0 !== LUX.customerid) return LUX.customerid;
      var e = Y("/js/lux.js");
      return e
        ? ((LUX.customerid = (function (e, t) {
            for (var n = e.split("?")[1].split("&"), r = 0, i = n.length; r < i; r++) {
              var a = n[r].split("=");
              if (t === a[0]) return a[1];
            }
            return;
          })(e.src, "id")),
          LUX.customerid)
        : "";
    }
    function Y(e) {
      for (var t = document.getElementsByTagName("script"), n = 0, r = t.length; n < r; n++) {
        var i = t[n];
        if (i.src && -1 !== i.src.indexOf(e)) return i;
      }
      return null;
    }
    function K(e) {
      var t = 0;
      if (e.parentNode) for (; (e = e.parentNode); ) t++;
      return t;
    }
    function Q() {
      if (L && L.getEntriesByType) {
        var e = performance.getEntriesByType("navigation");
        if (e && e.length > 0 && e[0].encodedBodySize) return e[0].encodedBodySize;
      }
      return 0;
    }
    function V() {
      var e = navigator.connection,
        t = "";
      return (
        e &&
          e.effectiveType &&
          (t =
            "slow-2g" === (t = e.effectiveType)
              ? "Slow 2G"
              : "2g" === t || "3g" === t || "4g" === t || "5g" === t
              ? t.toUpperCase()
              : t.charAt(0).toUpperCase() + t.slice(1)),
        t
      );
    }
    function Z(e) {
      var t;
      if ((e || (e = document.body), e)) {
        var n = e.children;
        if (n)
          for (var r = 0, i = n.length; r < i; r++) {
            var a = n[r];
            $(a) && (t = a);
          }
      }
      return t ? Z(t) : e;
    }
    function $(e) {
      var t = document.documentElement.clientHeight,
        n = document.documentElement.clientWidth,
        r = (function (e) {
          var t = 0,
            n = 0;
          for (; e; ) (t += e.offsetLeft), (n += e.offsetTop), (e = e.offsetParent);
          return [t, n];
        })(e);
      return (
        r[0] >= 0 && r[1] >= 0 && r[0] < n && r[1] < t && e.offsetWidth > 0 && e.offsetHeight > 0
      );
    }
    function ee() {
      pe("Enter LUX.send().");
      var e = J();
      if (e && E && W() && !m) {
        j(y);
        var t = O(),
          r = (function () {
            var e = [];
            if (i.length)
              for (var t = 0; t < i.length; t++) {
                var n = i[t];
                "element" === n.entryType &&
                  n.identifier &&
                  n.startTime &&
                  e.push(n.identifier + "|" + Math.round(n.startTime));
              }
            return e.join(",");
          })(),
          a = F(),
          o = "";
        v || (o = R());
        var u = H(),
          c = (function () {
            if ("function" != typeof LayoutShift) return !1;
            for (var e = 0, t = 0; t < i.length; t++) {
              var n = i[t];
              "layout-shift" !== n.entryType || n.hadRecentInput || (e += n.value);
            }
            return e.toFixed(6);
          })(),
          d = (function () {
            var e = "";
            if (L && L.getEntriesByName) {
              var t = Y("/js/lux.js");
              if (t) {
                var n = L.getEntriesByName(t.src);
                if (n && n.length) {
                  var r = n[0],
                    i = Math.round(r.domainLookupEnd - r.domainLookupStart),
                    a = Math.round(r.connectEnd - r.connectStart),
                    o = Math.round(r.responseStart - r.requestStart),
                    s = Math.round(r.responseEnd - r.responseStart),
                    u = i + a + o + s,
                    c = LUX_t_end - LUX_t_start,
                    d = r.encodedBodySize ? r.encodedBodySize : 0;
                  e =
                    "d" +
                    i +
                    "t" +
                    a +
                    "f" +
                    o +
                    "c" +
                    s +
                    "n" +
                    u +
                    "e" +
                    c +
                    "r" +
                    X +
                    (d ? "x" + d : "") +
                    (B ? "l" + B : "") +
                    "s" +
                    (LUX_t_start - M);
                }
              }
            }
            return e;
          })();
        document.visibilityState && "visible" !== document.visibilityState && (s |= 8);
        var f,
          g,
          h,
          w =
            U +
            "?v=" +
            "216&id=" +
            e +
            "&sid=" +
            E +
            "&uid=" +
            T +
            (a ? "&CD=" + a : "") +
            "&l=" +
            encodeURIComponent(ge()),
          k = q("script"),
          N = q("style"),
          x =
            (l ? "" : "&NT=" + z()) +
            (p ? "&LJS=" + d : "") +
            "&PS=ns" +
            (function () {
              for (
                var e = document.getElementsByTagName("script"), t = 0, n = 0, r = e.length;
                n < r;
                n++
              )
                e[n].src && t++;
              return t;
            })() +
            "bs" +
            G() +
            (k > -1 ? "is" + k : "") +
            "ss" +
            (function () {
              for (
                var e = document.getElementsByTagName("link"), t = 0, n = 0, r = e.length;
                n < r;
                n++
              ) {
                var i = e[n];
                i.href && "stylesheet" == i.rel && t++;
              }
              return t;
            })() +
            "bc" +
            (function () {
              for (
                var e = 0, t = document.getElementsByTagName("link"), n = 0, r = t.length;
                n < r;
                n++
              ) {
                var i = t[n];
                i.href &&
                  "stylesheet" === i.rel &&
                  0 !== i.href.indexOf("data:") &&
                  (i.onloadcssdefined ||
                    "print" === i.media ||
                    "style" === i.as ||
                    ("function" == typeof i.onload && "all" === i.media) ||
                    e++);
              }
              return e;
            })() +
            (N > -1 ? "ic" + N : "") +
            "ia" +
            (function () {
              var e = document.getElementsByTagName("img"),
                t = [];
              if (e)
                for (var n = 0, r = e.length; n < r; n++) {
                  var i = e[n];
                  $(i) && t.push(i);
                }
              return t;
            })().length +
            "it" +
            document.getElementsByTagName("img").length +
            "dd" +
            (function () {
              for (var e = document.getElementsByTagName("*"), t = e.length, n = 0; t--; )
                n += K(e[t]);
              return Math.round(n / e.length);
            })() +
            "nd" +
            document.getElementsByTagName("*").length +
            "vh" +
            document.documentElement.clientHeight +
            "vw" +
            document.documentElement.clientWidth +
            "dh" +
            ((f = document),
            (g = f.body),
            (h = f.documentElement),
            Math.max(
              g ? g.scrollHeight : 0,
              g ? g.offsetHeight : 0,
              h ? h.clientHeight : 0,
              h ? h.scrollHeight : 0,
              h ? h.offsetHeight : 0
            ) + "dw") +
            (function (e) {
              var t = e.body,
                n = e.documentElement;
              return Math.max(
                t ? t.scrollWidth : 0,
                t ? t.offsetWidth : 0,
                n ? n.clientWidth : 0,
                n ? n.scrollWidth : 0,
                n ? n.offsetWidth : 0
              );
            })(document) +
            (Q() ? "ds" + Q() : "") +
            (V() ? "ct" + V() + "_" : "") +
            "er" +
            n +
            "nt" +
            (L && L.navigation && void 0 !== L.navigation.type ? L.navigation.type : "") +
            (navigator.deviceMemory ? "dm" + Math.round(navigator.deviceMemory) : "") +
            (o ? "&IX=" + o : "") +
            (S ? "&FID=" + S : "") +
            (u ? "&CPU=" + u : "") +
            (s ? "&fl=" + s : "") +
            (r ? "&ET=" + r : "") +
            "&HN=" +
            encodeURIComponent(document.location.hostname) +
            (!1 !== c ? "&CLS=" + c : ""),
          C = "";
        if (t) {
          var I = w.length + x.length;
          if (I + t.length <= b) x += "&UT=" + t;
          else {
            var D = b - I,
              _ = t.lastIndexOf(",", D);
            (x += "&UT=" + t.substring(0, _)), (C = t.substring(_ + 1));
          }
        }
        var P = w + x;
        pe("Sending main LUX beacon: " + P), re(P), (m = 1), (l = 1), (v = o ? 1 : 0);
        for (var A = b - w.length; C; ) {
          var Z = "";
          if (C.length <= A) (Z = C), (C = "");
          else {
            var ee = C.lastIndexOf(",", A);
            -1 === ee && (ee = C.indexOf(",")),
              -1 === ee ? ((Z = C), (C = "")) : ((Z = C.substring(0, ee)), (C = C.substring(ee + 1)));
          }
          var te = w + "&UT=" + Z;
          pe("Sending extra User Timing beacon: " + te), re(te);
        }
      }
    }
    function te() {
      var e = J();
      if (e && E && W() && !v && m) {
        var t = R();
        if (t) {
          var n = F(),
            r =
              "?v=216&id=" +
              e +
              "&sid=" +
              E +
              "&uid=" +
              T +
              (n ? "&CD=" + n : "") +
              "&l=" +
              encodeURIComponent(ge()) +
              "&IX=" +
              t +
              (S ? "&FID=" + S : "") +
              "&HN=" +
              encodeURIComponent(document.location.hostname),
            i = U + r;
          pe("Sending Interaction Metrics beacon: " + i), re(i), (v = 1);
        }
      }
    }
    function ne() {
      var e = J();
      if (e && E && W() && m) {
        var t = F();
        if (t) {
          var n =
              "?v=216&id=" +
              e +
              "&sid=" +
              E +
              "&uid=" +
              T +
              "&CD=" +
              t +
              "&l=" +
              encodeURIComponent(ge()) +
              "&HN=" +
              encodeURIComponent(document.location.hostname),
            r = U + n;
          pe("Sending late Customer Data beacon: " + r), re(r);
        }
      }
    }
    function re(e) {
      if ("simple" !== LUX.beaconMode)
        return (function (e) {
          var t = document.createElement("script");
          (t.async = !0), (t.src = e);
          var n = document.getElementsByTagName("script");
          n.length
            ? n[0].parentNode.insertBefore(t, n[0])
            : ((n = document.getElementsByTagName("head")).length ||
                (n = document.getElementsByTagName("body")).length) &&
              n[0].appendChild(t);
        })(e);
        console.log(LUX.samplerate)
      new Image().src = e;
    }
    function ie(e) {
      if (e.id) return e.id;
      for (var t, n = e; n.parentNode && n.parentNode.tagName; ) {
        if ((n = n.parentNode).hasAttribute("data-sctrack")) return n.getAttribute("data-sctrack");
        n.id && !t && (t = n.id);
      }
      var r = "INPUT" === e.tagName && "submit" === e.type,
        i = "BUTTON" === e.tagName,
        a = "A" === e.tagName;
      return r && e.value ? e.value : (i || a) && e.innerText ? e.innerText : t || "";
    }
    function ae() {
      void 0 === d.s && (d.s = Math.round(D()));
    }
    function oe(e) {
      if ((fe(), void 0 === d.k)) {
        if (((d.k = Math.round(D())), e && e.target)) {
          var t = ie(e.target);
          t && (d.ki = t);
        }
        te();
      }
    }
    function se(e) {
      if ((fe(), void 0 === d.c)) {
        d.c = Math.round(D());
        var t = null;
        try {
          e && e.target && (t = e.target);
        } catch (e) {
          pe("Error accessing event target."), (t = null);
        }
        if (t) {
          e.clientX && ((d.cx = e.clientX), (d.cy = e.clientY));
          var n = ie(e.target);
          n && (d.ci = n);
        }
        te();
      }
    }
    function ue(e, t) {
      window.addEventListener
        ? window.addEventListener(e, t, !1)
        : window.attachEvent && window.attachEvent("on" + e, t);
    }
    function ce(e, t) {
      window.removeEventListener
        ? window.removeEventListener(e, t, !1)
        : window.detachEvent && window.detachEvent("on" + e, t);
    }
    function de() {
      ue("scroll", ae), ue("keypress", oe), ue("mousedown", se);
    }
    function fe() {
      ce("scroll", ae), ce("keypress", oe), ce("mousedown", se);
    }
    function me(e) {
      var t, n;
      return e
        ? Number(new Date()) + "00000"
        : Number(new Date()) +
            "" +
            ((t = parseInt(1e5 * Math.random())), ((n = "00000") + t).slice(-n.length));
    }
    function le(e) {
      var t = (function (e) {
        try {
          for (var t = document.cookie.split(";"), n = 0; n < t.length; n++) {
            var r = t[n].split("=");
            if (e === r[0].trim()) return unescape(r[1]);
          }
        } catch (e) {
          pe("Error accessing document.cookie.");
        }
        return;
      })("lux_uid");
      if (!t || t.length < 11) t = e;
      else {
        var n = parseInt(t.substring(0, 10));
        Number(new Date()) / 1e3 - n > 86400 && (t = e);
      }
      return ve(t), t;
    }
    function ve(e) {
      return (
        (function (e, t, n) {
          try {
            document.cookie =
              e + "=" + escape(t) + (n ? "; max-age=" + n : "") + "; path=/; SameSite=Lax";
          } catch (e) {
            pe("Error setting document.cookie.");
          }
        })("lux_uid", e, 1800),
        e
      );
    }
    function ge() {
      if (void 0 !== LUX.label) return LUX.label;
      if (void 0 !== LUX.jspagelabel) {
        var e = Function('"use strict"; return ' + LUX.jspagelabel);
        try {
          var t = e();
          if (t) return t;
        } catch (e) {
          console.log("Error evaluating customer settings LUX page label:", e);
        }
      }
      return document.title;
    }
    function pe(t) {
      e.push(t), LUX.debug && console.log("LUX: " + t);
    }
    N.forEach(function (e) {
      window.addEventListener(e, I, x);
    }),
      k &&
        ("complete" == document.readyState
          ? ee()
          : ue("load", function () {
              setTimeout(ee, 200);
            }),
        ue("beforeunload", ee),
        ue("unload", ee),
        ue("beforeunload", te),
        ue("unload", te)),
      de();
    var he = {
      mark: j,
      measure: function (e, t, n) {
        if ((pe("Enter LUX.measure(), name = " + e), void 0 === t && _(h) && (t = h), L)) {
          if (L.measure) return t ? (n ? L.measure(e, t, n) : L.measure(e, t)) : L.measure(e);
          if (L.webkitMeasure) return L.webkitMeasure(e, t, n);
        }
        var r = 0,
          i = D();
        if (t) {
          var a = _(t);
          if (a) r = a.startTime;
          else {
            if (!(L && L.timing && L.timing[t])) return;
            r = L.timing[t] - L.timing.navigationStart;
          }
        }
        if (n) {
          var o = _(n);
          if (o) i = o.startTime;
          else {
            if (!(L && L.timing && L.timing[n])) return;
            i = L.timing[n] - L.timing.navigationStart;
          }
        }
        c.push({ name: e, entryType: "measure", startTime: r, duration: i - r });
      },
      init: function () {
        pe("Enter LUX.init()."),
          (d = {}),
          fe(),
          de(),
          (l = 0),
          (m = 0),
          (v = 0),
          (p = 0),
          (E = me()),
          (T = le(E)),
          i.splice(0),
          (s = 0),
          (s |= 1),
          j(h);
      },
      send: ee,
      addData: function (e, t) {
        pe("Enter LUX.addData(), name = " + e + ", value = " + t);
        var n = typeof t;
        "string" !== typeof e || ("string" !== n && "number" !== n && "boolean" !== n) || (f[e] = t),
          m && (o && clearTimeout(o), (o = setTimeout(ne, 100)));
      },
      getSessionId: function () {
        return T;
      },
      getDebug: function () {
        return e;
      },
      forceSample: function () {
        ve(me(!0)), console.log("Sampling has been turned on for this session.");
      },
      doUpdate: function (e, n) {
        if (e && t < e && document.body && !g) {
          pe("Updating cached version of lux.js from 216 to " + e + "."), (g = 1);
          var r = Y("/js/lux.js");
          if (r)
            if ("function" == typeof fetch) fetch(r.src, { cache: "reload" });
            else {
              var i = document.createElement("iframe");
              (i.style.display = "none"),
                (i.id = "LUX_update_iframe"),
                (i.src =
                  "//cdn.speedcurve.com/luxupdate.php?src=" +
                  encodeURIComponent(r.src) +
                  (n ? "&tw=" + n : "")),
                document.body.appendChild(i);
            }
        }
      },
      cmd: function (e) {
        var t = e.shift();
        "function" == typeof he[t] && he[t].apply(he, e);
      },
      beaconMode: w,
      beaconUrl: U,
      samplerate: X,
      auto: k,
      label: void 0 !== LUX.label ? LUX.label : void 0,
      jspagelabel: void 0 !== LUX.jspagelabel ? LUX.jspagelabel : void 0,
      version: t,
      ae: [],
      al: [],
      debug: !!LUX.debug,
    };
    return (
      LUX.ac &&
        LUX.ac.length &&
        LUX.ac.forEach(function (e) {
          var t = e.shift();
          "function" == typeof he[t] && he[t].apply(he, e);
        }),
      void 0 !== window.LUX_ae &&
        window.LUX_ae.forEach(function (e) {
          r(e);
        }),
      pe("lux.js evaluation end."),
      he
    );
  })();
  var LUX_t_end = Date.now();

// -----------------------------------------------------------------------------
// More settings
// -----------------------------------------------------------------------------
//
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
LUX.debug = true;

// Forces sampling - useful for when used with `debug = true`
// LUX.forceSample()

// -----------------------------------------------------------------------------
// End of more settings
// -----------------------------------------------------------------------------
