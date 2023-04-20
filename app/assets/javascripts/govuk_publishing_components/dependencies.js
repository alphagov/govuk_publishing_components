/* eslint-env */

// = require @alphagov/consent-api/client/src/consent.js

// This adds in javascript that initialises components and dependencies
// that are provided by Slimmer in public frontend applications.
// = require ./modules.js

document.addEventListener('DOMContentLoaded', function () {
  window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
  window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}

  // if statements ensure these functions don't execute during testing
  if (typeof window.GOVUK.loadAnalytics !== 'undefined') {
    if (typeof window.GOVUK.analyticsGa4.vars === 'undefined') {
      window.GOVUK.loadAnalytics.loadGa4()
    }
    if (typeof window.GOVUK.analyticsVars.gaProperty === 'undefined') {
      window.GOVUK.loadAnalytics.loadUa()
    }
  }

  window.GOVUK.modules.start()
})
