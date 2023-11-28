window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {}

(function (Modules) {
  function GemDetails ($module) {
    this.$module = $module
    this.$summary = this.$module.querySelector('.govuk-details__summary')

    this.customTrackLabel = this.$summary.getAttribute('data-track-label')
    this.detailsClick = this.$module.querySelector('[data-details-track-click]')
  }

  GemDetails.prototype.init = function () {
    if (this.customTrackLabel) { // If a custom label has been provided, we can simply call the tracking module
      var trackDetails = new window.GOVUK.Modules.GemTrackClick(this.$summary)
      trackDetails.init()
    } else if (this.detailsClick) { // If no custom label is set, we use the open/close status as the label
      this.detailsClick.addEventListener('click', function (event) {
        this.trackDefault(this.$summary)
      }.bind(this))
    }
  }

  GemDetails.prototype.trackDefault = function (element) {
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      var componentStatus = (this.$module.getAttribute('open') == null) ? 'open' : 'closed'
      var trackCategory = element.getAttribute('data-track-category')
      var trackAction = element.getAttribute('data-track-action')
      var trackOptions = element.getAttribute('data-track-options')

      if (trackOptions) {
        trackOptions = JSON.parse(trackOptions)
      }

      if (typeof trackOptions !== 'object' || trackOptions === null) {
        trackOptions = {}
      }

      trackOptions.label = componentStatus

      if (trackAction && trackCategory) {
        window.GOVUK.analytics.trackEvent(trackCategory, trackAction, trackOptions)
      }
    }
  }

  Modules.GemDetails = GemDetails
})(window.GOVUK.Modules)
