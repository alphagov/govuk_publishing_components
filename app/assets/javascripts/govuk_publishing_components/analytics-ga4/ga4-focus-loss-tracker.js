window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  function Ga4FocusLossTracker (module) {
    this.module = module
    this.trackingTrigger = 'data-ga4-focus-loss' // elements with this attribute get tracked
  }

  Ga4FocusLossTracker.prototype.init = function () {
    var consentCookie = window.GOVUK.getConsentCookie()

    if (consentCookie && consentCookie.usage) {
      this.startModule()
    } else {
      this.start = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.start)
    }
  }

  // triggered by cookie-consent event, which happens when users consent to cookies
  Ga4FocusLossTracker.prototype.startModule = function () {
    if (window.dataLayer) {
      window.removeEventListener('cookie-consent', this.start)
      this.module.addEventListener('blur', this.trackFocusLoss.bind(this))
      this.module.piiRemover = new window.GOVUK.analyticsGa4.PIIRemover()
    }
  }

  Ga4FocusLossTracker.prototype.trackFocusLoss = function (event) {
    var data = event.target.getAttribute(this.trackingTrigger)
    if (!data) {
      return
    }

    try {
      data = JSON.parse(data)
    } catch (e) {
      // if there's a problem with the config, don't start the tracker
      console.warn('GA4 configuration error: ' + e.message, window.location)
      return
    }

    var tagName = event.target.tagName
    var inputType = event.target.getAttribute('type')

    if (data.text) {
      data.text = this.module.piiRemover.stripPIIWithOverride(data.text, true, true)
    } else {
      if (tagName === 'INPUT' && (inputType === 'search' || inputType === 'text')) {
        data.text = window.GOVUK.analyticsGa4.core.trackFunctions.standardiseSearchTerm(this.module.value)
      }
    }

    window.GOVUK.analyticsGa4.core.applySchemaAndSendData(data, 'event_data')
  }

  Modules.Ga4FocusLossTracker = Ga4FocusLossTracker
})(window.GOVUK.Modules)
