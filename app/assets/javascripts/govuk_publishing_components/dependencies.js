/* eslint-env */

// This adds in javascript that initialises components and dependencies
// that are provided by Slimmer in public frontend applications.
// = require ./modules.js

document.addEventListener('DOMContentLoaded', function () {
  window.GOVUK.modules.start()

  // if statements ensure these functions don't execute during testing
  if (typeof window.GOVUK.analyticsGa4.vars === 'undefined') {
    window.GOVUK.loadAnalytics.loadGa4()
  }

  if (typeof window.GOVUK.analyticsInit === 'undefined') {
    window.GOVUK.loadAnalytics.loadUa()
  }
})
