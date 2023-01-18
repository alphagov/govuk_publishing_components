/* eslint-env */

// This adds in javascript that initialises components and dependencies
// that are provided by Slimmer in public frontend applications.
// = require ./modules.js

document.addEventListener('DOMContentLoaded', function () {
  window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
  window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}

  window.GOVUK.modules.start()
})
