/* eslint-env jasmine, jquery */

beforeAll(function () {
  window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}
  window.GOVUK.analyticsVars.gaProperty = "UA-11111111-11"
  window.GOVUK.analyticsVars.gaPropertyCrossDomain = "UA-222222222-2"
  window.GOVUK.analyticsVars.linkedDomains = ['www.gov.uk']

  window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
  window.GOVUK.analyticsGa4.vars.id = 'GTM-test'
  window.GOVUK.analyticsGa4.vars.auth = 'test'
  window.GOVUK.analyticsGa4.vars.preview = 'env-test'

  delete ga
  window.GOVUK.analyticsInit()
})

var resetCookies = function () {
  document.cookie.split(';').forEach(function (c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/') })
}

// external-link-tracker.js adds a click event to the body for matching links
// gets called once in production but multiple times in testing e.g. in static-analytics-spec
// every time it does `new GOVUK.StaticAnalytics()` so need to remove this using .off()
beforeEach(function () {
  $('body').off()
})

afterEach(function () {
  resetCookies()
})
