//= require accessible-autocomplete/dist/accessible-autocomplete.min.js

window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  "use strict";

  var TRACK_QUERIES_WAIT_TIME = 500

  function sourceForResults(select, trackQuery) {
    var options = $.map(select.options, function (option) {
      return option.textContent || option.innerText
    })

    var inputDebounceTimer = null

    return function (query, populateResults) {
      var results = options.filter(function (option) {
        return option.toLowerCase().indexOf(query.toLowerCase()) !== -1
      })

      populateResults(results)

      if (trackQuery) {
        clearTimeout(inputDebounceTimer)
        inputDebounceTimer = setTimeout(
          function () {
            trackQuery(query, results)
          },
          TRACK_QUERIES_WAIT_TIME
        )
      }
    }
  }

  function trackQueriesWithGoogleTagManager (query, results) {
    dataLayer.push({
      event: 'accessible-autocomplete-query',
      eventDetails: {
        query: query,
        results: results
      }
    });
  }

  function getTrackQueryFunction ($selectElem) {
    var trackQueries = $selectElem.data('track-queries')
    if (typeof trackQueries === 'function') {
      return trackQueries
    } else if (trackQueries === 'all') {
      return trackQueriesWithGoogleTagManager
    } else if (trackQueries === 'with-no-results') {
      return function (query, results) {
        if (results.length === 0) {
          trackQueriesWithGoogleTagManager(query, results)
        }
      }
    }
  }

  Modules.AccessibleAutocomplete = function () {
    var $selectElem;

    this.start = function ($element) {
      $selectElem = $element.find('select');

      var configOptions = {
        selectElement: document.getElementById($selectElem.attr('id')),
        source: sourceForResults($selectElem[0], getTrackQueryFunction($selectElem)),
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

    function track (category, action, label, options) {
      if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
        options = options || {};
        options.label = label;

        GOVUK.analytics.trackEvent(category, action, options);
      }
    }
  };
})(window.GOVUK.Modules);
