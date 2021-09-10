/* eslint-env jquery */
/* global accessibleAutocomplete */
// = require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.AutoSuggest = function () {
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
      // attach the onConfirm function to data attr, to call it in finder-frontend when clearing facet tags
      $selectElem.data('onconfirm', this.onConfirm)
    }

    this.onConfirm = function (label, value, removeDropDown) {
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
          // if removeDropDown we are clearing the selection from outside the component
          var selectState = typeof removeDropDown === 'undefined'
          $option.prop('selected', selectState)
          $selectElem.change()
        }

        // used to clear the autosuggest when clicking on a facet tag in finder-frontend
        // very brittle but menu visibility is determined by autosuggest after this function is called
        // setting autosuggest val to '' causes menu to appear, we don't want that, this solves it
        // ideally will rewrite autocomplete to have better hooks in future
        if (removeDropDown) {
          $selectElem.closest('.gem-c-accessible-autosuggest').addClass('gem-c-accessible-autosuggest--hide-menu')
          setTimeout(function () {
            $('.autosuggest__menu').remove() // this element is recreated every time the user starts typing
            $selectElem.closest('.gem-c-accessible-autosuggest').removeClass('gem-c-accessible-autosuggest--hide-menu')
          }, 100)
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
