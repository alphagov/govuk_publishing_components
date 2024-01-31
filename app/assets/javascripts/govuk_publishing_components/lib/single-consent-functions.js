/* global GovSingleConsent */
// = require govuk-single-consent/dist/singleconsent.iife.js

(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.singleConsent = {
    url: false,

    init: function (callback) {
      callback = callback || this.apiCallBack
      // determine where we are and set the consent api URL accordingly
      if (!this.url) {
        this.url = 'staging'
        var environment = window.GOVUK.loadAnalytics.getEnvironment(window.GOVUK.analyticsGa4.core.trackFunctions.getHostname())
        if (environment && environment.name === 'production') {
          this.url = 'production'
        }
      }
      // create the consent API object
      window.GOVUK.singleConsent.consentApiObj = new GovSingleConsent(callback, this.url)
    },

    apiCallBack: function (consents, consentsPreferencesSet, error) {
      if (error) {
        console.error('Single consent error: ' + error, window.location)
        return
      }
      if (consentsPreferencesSet) {
        if (consents && consents.usage) {
          window.GOVUK.triggerEvent(window, 'cookie-consent')
        }
      }
    },

    setPreferences: function (type, options) {
      try {
        if (!window.GOVUK.singleConsent.consentApiObj) {
          this.init()
        }
        switch (type) {
          case 'accept':
            window.GOVUK.singleConsent.consentApiObj.setConsents(GovSingleConsent.ACCEPT_ALL)
            break
          case 'reject':
            window.GOVUK.singleConsent.consentApiObj.setConsents(GovSingleConsent.REJECT_ALL)
            break
          default:
            window.GOVUK.singleConsent.consentApiObj.setConsents(options)
        }
      } catch (e) {
        console.error('Single consent ' + type + ' error: ' + e.message, window.location)
      }
    }
  }
}(window))
