/* eslint-env jasmine */

var GOVUK = window.GOVUK || {}

describe('Decorating links', function () {
  describe('cookie consent query strings', function () {
    var originalUrl

    beforeEach(function () {
      originalUrl = window.location.href
    })

    afterEach(function () {
      window.history.replaceState(null, null, originalUrl)
    })

    it('sets usage consent cookie to false when cookies[analytics] query string parameter has a value of "no"', function () {
      window.history.replaceState(null, null, '?cookies%5Banalytics%5D=no')

      var consentModule = new window.GOVUK.Modules.CookieConsentLinkDecoration()
      consentModule.init()

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(false)
    })

    it('sets usage consent cookie to true when cookies[analytics] query string parameter has a value of "yes"', function () {
      window.history.replaceState(null, null, '?cookies%5Banalytics%5D=yes')

      var consentModule = new window.GOVUK.Modules.CookieConsentLinkDecoration()
      consentModule.init()

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(true)
    })
  })
})
