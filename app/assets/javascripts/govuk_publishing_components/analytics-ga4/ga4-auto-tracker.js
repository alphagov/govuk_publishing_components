window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4AutoTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4-auto'
    this.PIIRemover = new window.GOVUK.analyticsGa4.PIIRemover()
  }

  Ga4AutoTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie?.usage === true || consentCookie?.usage === 'aggregate') {
      this.startModule()
    }
  }

  Ga4AutoTracker.prototype.startModule = function () {
    this.sendEvent()
  }

  Ga4AutoTracker.prototype.sendEvent = function () {
    if (window.dataLayer) {
      try {
        var data = this.module.getAttribute(this.trackingTrigger)
        data = JSON.parse(data) || {}
      } catch (e) {
        // if there's a problem with the config, don't start the tracker
        console.error('GA4 configuration error: ' + e.message, window.location)
        return
      }
      data.text = this.PIIRemover.stripPIIWithOverride(data.text, true, true)
      window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
    }
  }

  Modules.Ga4AutoTracker = Ga4AutoTracker
})(window.GOVUK.Modules)
