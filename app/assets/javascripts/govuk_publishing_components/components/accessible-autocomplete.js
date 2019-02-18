//= require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  "use strict";

  Modules.AccessibleAutocomplete = function () {
    var $selectElem;
    var updateCount;
    var updateCountSelected;
    var $updateCountElement;

    this.start = function ($element) {
      $selectElem = $element.find('select');
      updateCount = $element.data('hint');

      if (updateCount) {
        $updateCountElement = $('#' + $element.data('hint'));
        updateCountSelected = $element.data('selected-text');
        updateCountText($selectElem);
      }

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

      // add aria-describedby to link the input to the 'x selected' information for screen readers
      if (updateCount) {
        $element.find('.autocomplete__input').attr('aria-describedby', $element.data('hint'));
      }
    };

    this.onConfirm = function(label, value, removeDropDown) {
      function escapeHTML(str){
        return new Option(str).innerHTML;
      }

      if ($selectElem.data('track-category') !== undefined && $selectElem.data('track-action') !== undefined) {
        track($selectElem.data('track-category'), $selectElem.data('track-action'), label, $selectElem.data('track-options'));
      }
      // This is to compensate for the fact that the accessible-autocomplete library will not
      // update the hidden select if the onConfirm function is supplied
      // https://github.com/alphagov/accessible-autocomplete/issues/322
      if (typeof label !== 'undefined') {
        if (typeof value === 'undefined') {
          value = $selectElem.children("option").filter(function () { return $(this).html() == escapeHTML(label); }).val();
        }

        if (typeof value !== 'undefined') {
          var $option = $selectElem.find('option[value=\'' + value + '\']');
          // if removeDropDown we are clearing the selection from outside the component
          var selectState = typeof removeDropDown === 'undefined' ? true : false;
          $option.prop('selected', selectState);
          $selectElem.change();
        }

        if (updateCount) {
          updateCountText($selectElem);
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
      }
    };

    function updateCountText($selectElem) {
      var countText = $selectElem.val() ? $selectElem.val().length : 0;
      $updateCountElement.html(countText + " " + updateCountSelected);
    }

    function track (category, action, label, options) {
      if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
        options = options || {};
        options.label = label;

        GOVUK.analytics.trackEvent(category, action, options);
      }
    }
  };
})(window.GOVUK.Modules);
