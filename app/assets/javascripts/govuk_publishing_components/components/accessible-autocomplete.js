//= require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  "use strict";

  Modules.AccessibleAutocomplete = function () {
    var $selectElem;

    this.start = function ($element) {
      $selectElem = $element.find('select');

      var configOptions = {
        selectElement: document.getElementById($selectElem.attr('id')),
        showAllValues: true,
        confirmOnBlur: true,
        preserveNullOptions: true, // https://github.com/alphagov/accessible-autocomplete#null-options
        defaultValue: ""
      };

      configOptions.onConfirm = this.onConfirm;

      new accessibleAutocomplete.enhanceSelectElement(configOptions);
      //attach the onConfirm function to data attr, to call it in finder-frontend when clearing facet tags
      $selectElem.data('onconfirm', this.onConfirm);
    };

    this.onConfirm = function(label, removeDropDown) {
      if ($selectElem.data('track-category') !== undefined && $selectElem.data('track-action') !== undefined) {
        track($selectElem.data('track-category'), $selectElem.data('track-action'), label, $selectElem.data('track-options'));
      }
      // This is to compensate for the fact that the accessible-autocomplete library will not
      // update the hidden select if the onConfirm function is supplied
      // https://github.com/alphagov/accessible-autocomplete/issues/322
      var value = $selectElem.children("option").filter(function () { return $(this).html() == label; }).val();
      if (typeof value !== 'undefined') {
        $selectElem.val(value).trigger( "change" );
      }

      // used to clear the autocomplete when clicking on a facet tag in finder-frontend
      // very brittle but menu visibility is determined by autocomplete after this function is called
      // setting autocomplete val to '' causes menu to appear, we don't want that, this solves it
      // ideally will rewrite autocomplete to have better hooks in future
      if (removeDropDown) {
        $selectElem.closest('.gem-c-accessible-autocomplete').addClass('gem-c-accessible-autocomplete--hide-menu');
        setTimeout(function() {
          $('.autocomplete__menu').remove(); // this element is recreated every time the user starts typing
          $selectElem.closest('.gem-c-accessible-autocomplete').removeClass('gem-c-accessible-autocomplete--hide-menu');
        }, 100);
      }
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
