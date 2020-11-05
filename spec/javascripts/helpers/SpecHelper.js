/* eslint-env jasmine, jquery */

beforeAll(function () {
  window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}
  window.GOVUK.analyticsVars.gaProperty = "UA-11111111-11"
  window.GOVUK.analyticsVars.gaPropertyCrossDomain = "UA-222222222-2"
  window.GOVUK.analyticsVars.linkedDomains = ['www.gov.uk']
  delete ga
  window.GOVUK.analyticsInit()
})

var resetCookies = function () {
  document.cookie.split(';').forEach(function (c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/') })
}

afterEach(function () {
  resetCookies()
})
