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

    rejectAll: function () {
      try {
        window.GOVUK.singleConsent.consentApiObj.setConsents(GovSingleConsent.REJECT_ALL)
      } catch (e) {
        console.error('Single consent rejectAll error: ' + e.message, window.location)
      }
    },

    acceptAll: function () {
      try {
        window.GOVUK.singleConsent.consentApiObj.setConsents(GovSingleConsent.ACCEPT_ALL)
      } catch (e) {
        console.error('Single consent acceptAll error: ' + e.message, window.location)
      }
    },

    setPreferences: function (options) {
      try {
        window.GOVUK.singleConsent.consentApiObj.setConsents(options)
      } catch (e) {
        console.error('Single consent setPreferences error: ' + e.message, window.location)
      }
    }
  }
}(window))
