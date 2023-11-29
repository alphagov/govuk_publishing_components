window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function AutoTrackEvent ($module) {
    this.$module = $module

    this.init()
  }

  AutoTrackEvent.prototype.init = function () {
    var options = { nonInteraction: 1 } // automatic events shouldn't affect bounce rate
    var category = this.$module.getAttribute('data-track-category')
    var action = this.$module.getAttribute('data-track-action')
    var label = this.$module.getAttribute('data-track-label')
    var value = parseInt(this.$module.getAttribute('data-track-value'))

    if (typeof label === 'string') {
      options.label = label
    }

    if (value || value === 0) {
      options.value = value
    }

    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      window.GOVUK.analytics.trackEvent(category, action, options)
    }
  }

  Modules.AutoTrackEvent = AutoTrackEvent
})(window.GOVUK.Modules)
