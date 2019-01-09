//= require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  "use strict";

  Modules.AccessibleAutocomplete = function () {
    this.start = function ($element) {
      var $selectElem = $element.find('select');

      var configOptions = {
        selectElement: document.getElementById($selectElem.attr('id')),
        showAllValues: true,
        confirmOnBlur: true,
        preserveNullOptions: true, // https://github.com/alphagov/accessible-autocomplete#null-options
        defaultValue: ""
      };

      configOptions.onConfirm = function(label) {
        if ($selectElem.data('track-category') !== undefined && $selectElem.data('track-action') !== undefined) {
          track($selectElem.data('track-category'), $selectElem.data('track-action'), label, $selectElem.data('track-options'));
        }
        // This is to compensate for the fact that the accessible-autocomplete library will not
        // update the hidden select if the onConfirm function is supplied
        // https://github.com/alphagov/accessible-autocomplete/issues/322
        var value = $selectElem.children("option").filter(function () { return $(this).html() == label; }).val();
        if (typeof value !== 'undefined') {
          $selectElem.val(value).change().find('option:first-child').attr('data-selected', value);
        }
      };

      new accessibleAutocomplete.enhanceSelectElement(configOptions);
    };

    function track (category, action, label, options) {
      if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
        options = options || {};
        options.label = label;

        GOVUK.analytics.trackEvent(category, action, options);
      }
    }
  };
})(window.GOVUK.Modules);
