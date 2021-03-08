/* eslint-env jquery */
// = require govuk/components/details/details.js
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GovukDetails () { }

  GovukDetails.prototype.start = function ($module) {
    this.$module = $module[0]

    var customTrackLabel = this.$module.getAttribute('data-track-label')

    // If a custom label has been provided, we can simply call the tracking module
    if (customTrackLabel) {
      var trackDetails = new window.GOVUK.Modules.GemTrackClick()
      trackDetails.start($module)
    } else {
      // If no custom label is set, we use the open/close status as the label
      var detailsClick = this.$module.querySelector('[data-details-track-click]')

      if (detailsClick) {
        detailsClick.addEventListener('click', function (event) {
          this.trackDefault(this.$module)
        }.bind(this))
      }
    }
  }

  GovukDetails.prototype.trackDefault = function (element) {
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      var componentStatus = (element.getAttribute('open') == null) ? 'open' : 'closed'
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

  Modules.GovukDetails = GovukDetails
})(window.GOVUK.Modules)
