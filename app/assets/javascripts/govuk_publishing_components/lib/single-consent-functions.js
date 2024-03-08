/* global GovSingleConsent */
// = require govuk-single-consent/dist/singleconsent.iife.js

(function (root) {
  'use strict'
  window.GOVUK = window.GOVUK || {}

  window.GOVUK.singleConsent = {
    init: function (callback) {
      if (!window.GOVUK.useSingleConsentApi) {
        return
      }
      callback = callback || this.apiCallback
      // determine where we are and set the consent api URL accordingly
      if (!this.url) {
        this.url = 'staging'
        var environment = window.GOVUK.loadAnalytics.getEnvironment(window.GOVUK.analyticsGa4.core.trackFunctions.getHostname())
        if (environment) {
          this.url = environment.consentApiUrl
        }
      }
      // create the consent API object
      this.consentApiObj = new GovSingleConsent(callback, this.url)
    },

    apiCallback: function (consents, consentsPreferencesSet, error) {
      if (error) {
        console.error('Single consent error: ', error, window.location)
        return
      }
      if (consentsPreferencesSet) {
        if (consents && consents.usage) {
          window.GOVUK.triggerEvent(window, 'cookie-consent')
        }
      } else {
        window.GOVUK.triggerEvent(window, 'show-cookie-banner')
      }
    },

    setPreferences: function (type, options) {
      if (window.GOVUK.useSingleConsentApi) {
        try {
          switch (type) {
            case 'accept':
              this.consentApiObj.setConsents(GovSingleConsent.ACCEPT_ALL)
              break
            case 'reject':
              this.consentApiObj.setConsents(GovSingleConsent.REJECT_ALL)
              break
            default:
              this.consentApiObj.setConsents(options)
          }
        } catch (e) {
          console.error('Single consent ' + type + ' error: ', e, window.location)
        }
      }
    }
  }
}(window))
