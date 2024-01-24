/* global GovSingleConsent */
// = require govuk-single-consent/dist/singleconsent.iife.js

(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.singleConsent = {
    url: 'staging',

    init: function (callback) {
      callback = callback || this.apiCallBack
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
      window.GOVUK.singleConsent.consentApiObj.setConsents(GovSingleConsent.REJECT_ALL)
    },

    acceptAll: function () {
      window.GOVUK.singleConsent.consentApiObj.setConsents(GovSingleConsent.ACCEPT_ALL)
    },

    setPreferences: function (options) {
      window.GOVUK.singleConsent.consentApiObj.setConsents(options)
    }
  }
}(window))
