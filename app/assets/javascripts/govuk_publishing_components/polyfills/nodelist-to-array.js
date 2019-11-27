// helper to loop over nodes and create an array for cross-browser compatibillity
// if browser support Array.from we'll call that
// else iterate over the array with a good'ol for-loop
window.GOVUK = window.GOVUK || {}
window.GOVUK.Polyfills = window.GOVUK.Polyfills || {};

(function (Polyfills) {
  'use strict'

  Polyfills.NodeListToArray = function (nodes, callback, scope) {
    if (window.NodeList && Array.from) {
      return Array.from(nodes, callback)
    }

    for (var i = 0; i < nodes.length; i++) {
      callback.call(scope, nodes[i], i, nodes)
    }
  }
})(window.GOVUK.Polyfills)
