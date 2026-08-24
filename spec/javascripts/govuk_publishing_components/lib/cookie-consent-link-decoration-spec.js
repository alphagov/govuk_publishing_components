/* eslint-env jasmine */

var GOVUK = window.GOVUK || {}

describe('Decorating links', function () {
  'use strict'

  describe('cookie consent query strings', function () {
    var originalUrl

    beforeEach(function () {
      originalUrl = window.location.href
    })

    afterEach(function () {
      window.history.replaceState(null, null, originalUrl)
    })

    it('sets usage consent cookie to false when cookies query string parameter has a value of "no"', function () {
      expect(GOVUK.getConsentCookie()).toBe(null)
      window.history.replaceState(null, null, '?cookies=no')

      window.GOVUK.checkCookieConsentLinkDecoration(window.location)

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(false)
    })

    it('sets usage consent cookie to true when cookies query string parameter has a value of "yes"', function () {
      expect(GOVUK.getConsentCookie()).toBe(null)
      window.history.replaceState(null, null, '?cookies=yes')

      window.GOVUK.checkCookieConsentLinkDecoration(window.location)

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(true)
    })
  })
})
