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
        confirmOnBlur: false
      };

      if ($selectElem.data('track-category') !== undefined && $selectElem.data('track-action') !== undefined) {
        configOptions.onConfirm = function(val) {
          track($selectElem.data('track-category'), $selectElem.data('track-action'), val, $selectElem.data('track-options'));
        };
      }

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
