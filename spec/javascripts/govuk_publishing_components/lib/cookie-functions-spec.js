/* eslint-env jasmine, jquery */

var GOVUK = window.GOVUK || {}

describe('Cookie helper functions', function () {
  'use strict'

  describe('GOVUK.cookie', function () {
    it('returns the cookie value if not provided with a value to set', function () {
      GOVUK.cookie('seen_cookie_message', 'testing fetching cookie value')

      GOVUK.cookie('seen_cookie_message')

      expect(GOVUK.cookie('seen_cookie_message')).toBe('testing fetching cookie value')
    })

    it('can create a new cookie', function () {
      expect(GOVUK.getCookie('seen_cookie_message')).toBeFalsy()

      GOVUK.cookie('seen_cookie_message', 'test')

      expect(GOVUK.getCookie('seen_cookie_message')).toBe('test')
    })

    it('sets a default expiry of 30 days if no options are provided', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      expect(GOVUK.getCookie('seen_cookie_message')).toBeFalsy()

      GOVUK.cookie('seen_cookie_message', 'test')

      expect(GOVUK.setCookie).toHaveBeenCalledWith('seen_cookie_message', 'test', { days: 30 })
    })

    it('sets the expiry if one is provided', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      expect(GOVUK.getCookie('seen_cookie_message')).toBeFalsy()

      GOVUK.cookie('seen_cookie_message', 'test', { days: 100 })

      expect(GOVUK.setCookie).toHaveBeenCalledWith('seen_cookie_message', 'test', { days: 100 })
    })

    it('can change the value of an existing cookie', function () {
      GOVUK.cookie('seen_cookie_message', 'test1')

      expect(GOVUK.getCookie('seen_cookie_message')).toBe('test1')

      GOVUK.cookie('seen_cookie_message', 'test2')

      expect(GOVUK.getCookie('seen_cookie_message')).toBe('test2')
    })

    it('deletes the cookie if value is set to false', function () {
      GOVUK.cookie('seen_cookie_message', false)

      expect(GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    })

    it('deletes the cookie if value is set to null', function () {
      GOVUK.cookie('seen_cookie_message', null)

      expect(GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    })
  })

  describe('consent cookie methods', function () {
    it('can set the consent cookie to default values', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      expect(GOVUK.getCookie('cookies_policy')).toBeFalsy()

      GOVUK.setDefaultConsentCookie()

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_policy', '{"essential":true,"settings":false,"usage":false,"campaigns":false}', Object({ days: 365 }))
      expect(GOVUK.getConsentCookie()).toEqual({ 'essential': true, 'settings': false, 'usage': false, 'campaigns': false })
    })

    it('can set the consent cookie to approve all cookie categories', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      GOVUK.setConsentCookie({ 'usage': false, 'essential': false })

      expect(GOVUK.getConsentCookie().essential).toBe(false)
      expect(GOVUK.getConsentCookie().usage).toBe(false)

      GOVUK.approveAllCookieTypes()

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}', Object({ days: 365 }))
      expect(GOVUK.getConsentCookie()).toEqual({ 'essential': true, 'settings': true, 'usage': true, 'campaigns': true })
    })

    it('returns null if the consent cookie does not exist', function () {
      expect(GOVUK.getConsentCookie()).toEqual(null)
    })

    it('returns null if the consent cookie is malformed', function () {
      GOVUK.cookie('cookies_policy', 'malformed consent cookie')

      expect(GOVUK.getConsentCookie()).toBe(null)
    })

    it('deletes relevant cookies in that category if consent is set to false', function () {
      GOVUK.setConsentCookie({ 'essential': true })

      GOVUK.setCookie('seen_cookie_message', 'this is an essential cookie')

      expect(GOVUK.cookie('seen_cookie_message')).toBe('this is an essential cookie')

      spyOn(GOVUK, 'setCookie').and.callThrough()
      GOVUK.setConsentCookie({ 'essential': false })

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}', Object({ days: 365 }))
      expect(GOVUK.getConsentCookie().essential).toBe(false)
      expect(GOVUK.cookie('seen_cookie_message')).toBeFalsy()
    })
  })

  describe('check cookie consent', function () {
    it('returns true if trying to set the consent cookie', function () {
      expect(GOVUK.checkConsentCookie('cookies_policy', { 'essential': true })).toBe(true)
    })

    it('returns true if deleting a cookie', function () {
      expect(GOVUK.checkConsentCookie('test_cookie', null)).toBe(true)
      expect(GOVUK.checkConsentCookie('test_cookie', false)).toBe(true)
    })

    it('does not set a default consent cookie if one is not present', function () {
      GOVUK.cookie('cookies_policy', null)

      GOVUK.checkConsentCookieCategory('seen_cookie_message', true)

      expect(GOVUK.getConsentCookie()).toBeFalsy()
    })

    it('returns true if the consent cookie does not exist and the cookie name is recognised', function () {
      expect(GOVUK.getConsentCookie()).toBeFalsy()

      expect(GOVUK.checkConsentCookie('seen_cookie_message', true)).toBe(true)
    })

    it('returns false if the consent cookie does not exist and the cookie name is not recognised', function () {
      expect(GOVUK.getConsentCookie()).toBeFalsy()

      expect(GOVUK.checkConsentCookie('fake_cookie')).toBe(false)
    })

    it('returns the consent for a given cookie', function () {
      GOVUK.setConsentCookie({ 'usage': false })

      expect(GOVUK.checkConsentCookie('analytics_next_page_call', 'set a usage cookie')).toBeFalsy()

      GOVUK.setConsentCookie({ 'usage': true })

      expect(GOVUK.checkConsentCookie('analytics_next_page_call', 'set a usage cookie')).toBeTruthy()
    })

    it('denies consent for cookies not in our list of cookies', function () {
      expect(GOVUK.checkConsentCookie('fake_cookie', 'just for testing')).toBeFalsy()
    })
  })
})
