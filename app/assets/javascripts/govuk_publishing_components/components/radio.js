// This component relies on JavaScript from GOV.UK Frontend
//= require components/radios/radios.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.FrontendModules = window.GOVUK.FrontendModules || {};

(function (global, GOVUK) {
  'use strict'

  /**
   * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
   *
   * See: https://github.com/imagitama/nodelist-foreach-polyfill
   * but the polyfill doesn't work in IE8 and needs more investigation
   */
  function nodeListForEach (nodes, callback) {
    if (window.NodeList.prototype.forEach) {
      return nodes.forEach(callback)
    }
    for (var i = 0; i < nodes.length; i++) {
      callback.call(window, nodes[i], i, nodes)
    }
  }

  GOVUK.FrontendModules.Radios = window.GOVUKFrontend

  var $radios = document.querySelectorAll('[data-module="radios"]')

  nodeListForEach($radios, function ($radio) {
    new GOVUK.FrontendModules.Radios($radio).init()
  })
})(window, window.GOVUK)
