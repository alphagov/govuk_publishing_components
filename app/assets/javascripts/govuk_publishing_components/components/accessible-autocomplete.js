/* eslint-env jquery */
/* global accessibleAutocomplete */
// = require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.AccessibleAutocomplete = function () {
    var $selectElem

    this.start = function ($element) {
      $selectElem = $element.find('select')

      var configOptions = {
        selectElement: document.getElementById($selectElem.attr('id')),
        showAllValues: true,
        confirmOnBlur: true,
        preserveNullOptions: true, // https://github.com/alphagov/accessible-autocomplete#null-options
        defaultValue: ''
      }

      configOptions.onConfirm = this.onConfirm

      new accessibleAutocomplete.enhanceSelectElement(configOptions) // eslint-disable-line no-new, new-cap
    }

    this.onConfirm = function (label) {
      function escapeHTML (str) {
        return new window.Option(str).innerHTML
      }

      if ($selectElem.data('track-category') !== undefined && $selectElem.data('track-action') !== undefined) {
        track($selectElem.data('track-category'), $selectElem.data('track-action'), label, $selectElem.data('track-options'))
      }
      // This is to compensate for the fact that the accessible-autocomplete library will not
      // update the hidden select if the onConfirm function is supplied
      // https://github.com/alphagov/accessible-autocomplete/issues/322
      if (typeof label !== 'undefined') {
        if (typeof value === 'undefined') {
          value = $selectElem.children('option').filter(function () { return $(this).html() === escapeHTML(label) }).val()
        }

        if (typeof value !== 'undefined') {
          var $option = $selectElem.find('option[value=\'' + value + '\']')
        }
      }
    }

    function track (category, action, label, options) {
      if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
        options = options || {}
        options.label = label

        window.GOVUK.analytics.trackEvent(category, action, options)
      }
    }
  }
})(window.GOVUK.Modules)
