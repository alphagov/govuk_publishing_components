window.GOVUK = window.GOVUK || {};
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict';

  Modules.TrackSelectChange = function () {
    this.start = function (element) {
      element.change(function(e) {
        var selectedOption = $(this).find(":selected");
        var trackable = '[data-track-category][data-track-action]';

        if (selectedOption.is(trackable)) {
          fireTrackingChange(selectedOption);
        }
      });

      function fireTrackingChange(element) {
        var options = {transport: 'beacon'},
            category = element.attr('data-track-category'),
            action = element.attr('data-track-action'),
            label = element.attr('data-track-label'),
            value = element.attr('data-track-value'),
            dimension = element.attr('data-track-dimension'),
            dimensionIndex = element.attr('data-track-dimension-index'),
            extraOptions = element.attr('data-track-options');

        if (label) {
          options.label = label;
        }

        if (value) {
          options.value = value;
        }

        if (dimension && dimensionIndex) {
          options['dimension' + dimensionIndex] = dimension;
        }

        if (extraOptions) {
          $.extend(options, JSON.parse(extraOptions));
        }

        if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
          GOVUK.analytics.trackEvent(category, action, options);
        }
      };
    };
  };
})(window.GOVUK.Modules);
