/* eslint-env jasmine, jquery */

beforeAll(function () {
  window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
  window.GOVUK.analyticsGa4.vars.id = 'test-id'
  window.GOVUK.analyticsGa4.vars.auth = 'test-auth'
  window.GOVUK.analyticsGa4.vars.preview = 'test-preview'
  window.GOVUK.analyticsGa4.vars.gem_version = 'gem-version'
  window.GOVUK.analyticsGa4.vars.internalDomains = ['www.gov.uk']
  window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)

  delete ga
})

var resetCookies = function () {
  document.cookie.split(';').forEach(function (c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/') })
}

// external-link-tracker.js adds a click event to the body for matching links
// gets called once in production but multiple times in testing e.g. in static-analytics-spec
// every time it does `new GOVUK.StaticAnalytics()` so need to remove this using .off()
beforeEach(function () {
  $('body').off()

  window.GOVUK.stopSendingAnalytics = false
})

afterEach(function () {
  GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker.stopTracking()
  resetCookies()
})
