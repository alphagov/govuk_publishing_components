/* eslint-disable */

/*
 * Part of Speedcurve's LUX script, which allows us to run real user metrics on
 * pages using the public layout template.
 *
 * See docs/real-user-metrics.md for more information.
 */

LUX = (function () {
  'use strict'
  var a =
    "undefined" !== typeof LUX && "undefined" !== typeof LUX.gaMarks
      ? LUX.gaMarks
      : [];
  var d =
    "undefined" !== typeof LUX && "undefined" !== typeof LUX.gaMeasures
      ? LUX.gaMeasures
      : [];
  var j = "LUX_start";
  var k = window.performance;
  var l =
    "undefined" !== typeof LUX && LUX.ns
      ? LUX.ns
      : Date.now
      ? Date.now()
      : +new Date();
  if (k && k.timing && k.timing.navigationStart) {
    l = k.timing.navigationStart;
  }
  function f() {
    if (k && k.now) {
      return k.now();
    }
    var o = Date.now ? Date.now() : +new Date();
    return o - l;
  }
  function b(n) {
    if (k) {
      if (k.mark) {
        return k.mark(n);
      } else {
        if (k.webkitMark) {
          return k.webkitMark(n);
        }
      }
    }
    a.push({ name: n, entryType: "mark", startTime: f(), duration: 0 });
    return;
  }
  function m(p, t, n) {
    if ("undefined" === typeof t && h(j)) {
      t = j;
    }
    if (k) {
      if (k.measure) {
        if (t) {
          if (n) {
            return k.measure(p, t, n);
          } else {
            return k.measure(p, t);
          }
        } else {
          return k.measure(p);
        }
      } else {
        if (k.webkitMeasure) {
          return k.webkitMeasure(p, t, n);
        }
      }
    }
    var r = 0,
      o = f();
    if (t) {
      var s = h(t);
      if (s) {
        r = s.startTime;
      } else {
        if (k && k.timing && k.timing[t]) {
          r = k.timing[t] - k.timing.navigationStart;
        } else {
          return;
        }
      }
    }
    if (n) {
      var q = h(n);
      if (q) {
        o = q.startTime;
      } else {
        if (k && k.timing && k.timing[n]) {
          o = k.timing[n] - k.timing.navigationStart;
        } else {
          return;
        }
      }
    }
    d.push({ name: p, entryType: "measure", startTime: r, duration: o - r });
    return;
  }
  function h(n) {
    return c(n, g());
  }
  function c(p, o) {
    for (i = o.length - 1; i >= 0; i--) {
      var n = o[i];
      if (p === n.name) {
        return n;
      }
    }
    return undefined;
  }
  function g() {
    if (k) {
      if (k.getEntriesByType) {
        return k.getEntriesByType("mark");
      } else {
        if (k.webkitGetEntriesByType) {
          return k.webkitGetEntriesByType("mark");
        }
      }
    }
    return a;
  }
  return { mark: b, measure: m, gaMarks: a, gaMeasures: d };
})();
LUX.ns = Date.now ? Date.now() : +new Date();
LUX.ac = [];
LUX.cmd = function (a) {
  LUX.ac.push(a);
};
LUX.init = function () {
  LUX.cmd(["init"]);
};
LUX.send = function () {
  LUX.cmd(["send"]);
};
LUX.addData = function (a, b) {
  LUX.cmd(["addData", a, b]);
};
LUX_ae = [];
window.addEventListener("error", function (a) {
  LUX_ae.push(a);
});
LUX_al = [];
if (
  "function" === typeof PerformanceObserver &&
  "function" === typeof PerformanceLongTaskTiming
) {
  var LongTaskObserver = new PerformanceObserver(function (c) {
    var b = c.getEntries();
    for (var a = 0; a < b.length; a++) {
      var d = b[a];
      LUX_al.push(d);
    }
  });
  try {
    LongTaskObserver.observe({ type: ["longtask"] });
  } catch (e) {}
}

// As per RFC 147[1], this adds in monitoring of the type of HTTP protocol that
// is used when a browser loads a page.
//
// The User Timing API (aka window.performance) is used to record the data - to
// avoid the use of this from breaking the JavaScript for the small number of
// browsers that don't support it, it's been wrapped in a try/catch block plus a
// couple of checks to prevent "is not defined" errors.
//
// Because the `nextHopProtocol` isn't immediately available - it seems to need
// a request to be made before it's populated - we need to wait for the
// `DOMContentReady` event before we can see what the HTTP version is.
//
// [1]: https://github.com/alphagov/govuk-rfcs/pull/148

var measureHTTPProtocol = function () {
  var getEntriesByType = performance.getEntriesByType('navigation')

  if (typeof getEntriesByType !== 'undefined' && getEntriesByType.length > 0) {
    var httpProtocol = getEntriesByType[0].nextHopProtocol
    LUX.addData("http-protocol", httpProtocol)
  }
}

try {
  if (typeof performance !== 'undefined' && typeof performance.getEntriesByType !== 'undefined') {
    if (document.readyState === 'complete') {
      measureHTTPProtocol()
    } else {
      window.addEventListener('load', function() {
        measureHTTPProtocol()
      })
    }
  }
} catch (e) {
  console.error('Error in LUX reporting the HTTP protocol (' + window.location + '):', e)
}
