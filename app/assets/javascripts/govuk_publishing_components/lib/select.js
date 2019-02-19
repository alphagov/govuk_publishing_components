/* eslint-env jquery */

window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.TrackSelectChange = function () {
    this.start = function (element) {
      element.change(function (e) {
        var selectedOption = $(this).find(':selected')
        var trackable = '[data-track-category][data-track-action]'

        if (selectedOption.is(trackable)) {
          fireTrackingChange(selectedOption)
        }
      })

      function fireTrackingChange (element) {
        var options = { transport: 'beacon' }
        var category = element.attr('data-track-category')
        var action = element.attr('data-track-action')
        var label = element.attr('data-track-label')
        var value = element.attr('data-track-value')
        var dimension = element.attr('data-track-dimension')
        var dimensionIndex = element.attr('data-track-dimension-index')
        var extraOptions = element.attr('data-track-options')

        if (label) {
          options.label = label
        }

        if (value) {
          options.value = value
        }

        if (dimension && dimensionIndex) {
          options['dimension' + dimensionIndex] = dimension
        }

        if (extraOptions) {
          $.extend(options, JSON.parse(extraOptions))
        }

        if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
          window.GOVUK.analytics.trackEvent(category, action, options)
        }
      };
    }
  }
})(window.GOVUK.Modules)
