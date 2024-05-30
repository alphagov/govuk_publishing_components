'use strict'
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function TrackSelectChange ($module) {
    this.$module = $module

    this.init()
  }

  TrackSelectChange.prototype.init = function ($module) {
    this.$module.trackChange = this.trackChange.bind(this)
    this.$module.fireTrackingChange = this.fireTrackingChange.bind(this)
    this.$module.addEventListener('change', this.trackChange)
  }

  TrackSelectChange.prototype.trackChange = function () {
    var selectedOption = this.options[this.selectedIndex]

    if (selectedOption.hasAttribute('data-track-category') && selectedOption.hasAttribute('data-track-action')) {
      this.fireTrackingChange(selectedOption)
    }
  }

  TrackSelectChange.prototype.fireTrackingChange = function (selectedOption) {
    var options = { transport: 'beacon' }
    var category = selectedOption.getAttribute('data-track-category')
    var action = selectedOption.getAttribute('data-track-action')
    var label = selectedOption.getAttribute('data-track-label')
    var value = selectedOption.getAttribute('data-track-value')
    var dimension = selectedOption.getAttribute('data-track-dimension')
    var dimensionIndex = selectedOption.getAttribute('data-track-dimension-index')
    var extraOptions = selectedOption.getAttribute('data-track-options')

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
      extraOptions = JSON.parse(extraOptions)
      for (var k in extraOptions) options[k] = extraOptions[k]
    }

    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      window.GOVUK.analytics.trackEvent(category, action, options)
    }
  }

  Modules.TrackSelectChange = TrackSelectChange
})(window.GOVUK.Modules)
