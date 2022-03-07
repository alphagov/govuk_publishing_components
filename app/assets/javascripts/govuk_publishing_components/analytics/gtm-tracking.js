window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GtmTracking ($module) {
    this.$module = $module
  }

  GtmTracking.prototype.init = function () {
    this.$module.addEventListener('click', this.handleClick.bind(this))
  }

  GtmTracking.prototype.handleClick = function (event) {
    var element = event.target
    try {
      var gtmData = JSON.parse(element.getAttribute('data-gtm-attributes'))
      gtmData.event = 'analytics'
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(gtmData)
    } catch (e) {
      console.error('GTM configuration error: ' + e.message, window.location)
    }
  }

  Modules.GtmTracking = GtmTracking
})(window.GOVUK.Modules)
