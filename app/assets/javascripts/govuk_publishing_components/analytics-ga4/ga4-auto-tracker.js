window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4AutoTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4-auto'
  }

  Ga4AutoTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.settings) {
      this.startModule()
    } else {
      this.startModule = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.startModule)
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

      if (data.index) {
        data.index = window.GOVUK.analyticsGa4.core.trackFunctions.createIndexObject(data.index)
      }
      var schemas = new window.GOVUK.analyticsGa4.Schemas()
      var schema = schemas.mergeProperties(data, 'event_data')

      window.GOVUK.analyticsGa4.core.sendData(schema)
    }
  }

  Modules.Ga4AutoTracker = Ga4AutoTracker
})(window.GOVUK.Modules)
