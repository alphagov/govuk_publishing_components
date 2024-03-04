/* eslint-env jasmine, jquery */

beforeAll(function () {
  window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}
  window.GOVUK.analyticsVars.gaProperty = "UA-11111111-11"
  window.GOVUK.analyticsVars.gaPropertyCrossDomain = "UA-222222222-2"
  window.GOVUK.analyticsVars.linkedDomains = ['www.gov.uk']

  window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
  window.GOVUK.analyticsGa4.vars.id = 'test-id'
  window.GOVUK.analyticsGa4.vars.auth = 'test-auth'
  window.GOVUK.analyticsGa4.vars.preview = 'test-preview'
  window.GOVUK.analyticsGa4.vars.gem_version = 'gem-version'
  window.GOVUK.analyticsGa4.vars.internalDomains = ['www.gov.uk']
  window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)

  delete ga
  window.GOVUK.analyticsInit()
})

var resetCookies = function () {
  document.cookie.split(';').forEach(function (c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/') })
}

var savedUaVars

// external-link-tracker.js adds a click event to the body for matching links
// gets called once in production but multiple times in testing e.g. in static-analytics-spec
// every time it does `new GOVUK.StaticAnalytics()` so need to remove this using .off()
beforeEach(function () {
  $('body').off()

// load-analytics.js modifies the universal analytics vars, so we need to ensure they are reset each time.
  savedUaVars = window.GOVUK.extendObject(window.GOVUK.analyticsVars)
  window.GOVUK.stopSendingAnalytics = false
})

afterEach(function () {
  resetCookies()
  window.GOVUK.analyticsVars = savedUaVars
})
