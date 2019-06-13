/* eslint-env jasmine, jquery */
/* global GOVUK */

var container

var GOVUK = window.GOVUK || {};

describe('Cookie helper functions', function () {
  'use strict'

  beforeEach(function () {
    window.GOVUK.cookie('seen_cookie_message', null)
    window.GOVUK.cookie('cookie_policy', null)
  })

  describe('window.GOVUK.cookie', function() {
    it('returns the cookie value if not provided with a value to set', function() {
      window.GOVUK.cookie('seen_cookie_message', 'testing fetching cookie value')

      window.GOVUK.cookie('seen_cookie_message')

      expect(window.GOVUK.cookie('seen_cookie_message')).toBe('testing fetching cookie value')
    })

    it('can create a new cookie', function () {
      expect(window.GOVUK.getCookie('seen_cookie_message')).toBeFalsy()

      window.GOVUK.cookie('seen_cookie_message', 'test')

      expect(window.GOVUK.getCookie('seen_cookie_message')).toBe('test')
    })

    it('can change the value of an existing cookie', function() {
      window.GOVUK.cookie('seen_cookie_message', 'test1')

      expect(window.GOVUK.getCookie('seen_cookie_message')).toBe('test1')

      window.GOVUK.cookie('seen_cookie_message', 'test2')

      expect(window.GOVUK.getCookie('seen_cookie_message')).toBe('test2')
    })

    it('deletes the cookie if value is set to false', function() {
      window.GOVUK.cookie('seen_cookie_message', false)

      expect(window.GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    })

    it('deletes the cookie if value is set to null', function() {
      window.GOVUK.cookie('seen_cookie_message', null)

      expect(window.GOVUK.getCookie('seen_cookie_message')).toBeFalsy()
    })
  })

  describe('consent cookie methods', function() {
    it('can set the consent cookie to default values', function() {
      expect(window.GOVUK.getCookie('cookie_policy')).toBeFalsy()

      window.GOVUK.setDefaultConsentCookie()

      expect(window.GOVUK.getConsentCookie()).toEqual({'essential': true, 'settings': true, 'usage': true, 'campaigns': true})
    })

    it('can set the consent cookie to approve all cookie categories', function() {
      window.GOVUK.setConsentCookie({'usage': false, 'essential': false})

      expect(window.GOVUK.getConsentCookie().essential).toBe(false)
      expect(window.GOVUK.getConsentCookie().usage).toBe(false)

      window.GOVUK.approveAllCookieTypes()

      expect(window.GOVUK.getConsentCookie()).toEqual({'essential': true, 'settings': true, 'usage': true, 'campaigns': true})
    })

    it('returns null if the consent cookie does not exist', function() {
      expect(window.GOVUK.getConsentCookie()).toEqual(null)
    })

    it('returns null if the consent cookie is malformed', function () {
      window.GOVUK.cookie('cookie_policy', "malformed consent cookie")

      expect(window.GOVUK.getConsentCookie()).toBe(null)
    })

    it('deletes relevant cookies in that category if consent is set to false', function() {
      window.GOVUK.setConsentCookie({'essential': true})

      window.GOVUK.setCookie('seen_cookie_message', 'this is an essential cookie')

      expect(window.GOVUK.cookie('seen_cookie_message')).toBe('this is an essential cookie')

      window.GOVUK.setConsentCookie({'essential': false})

      expect(window.GOVUK.getConsentCookie().essential).toBe(false)
      expect(window.GOVUK.cookie('seen_cookie_message')).toBeFalsy()
    })
  })

  describe('check cookie consent', function() {
    it('returns true if trying to set the consent cookie', function() {
      expect(window.GOVUK.checkConsentCookie('cookie_policy', {'essential': true})).toBe(true)
    })

    it('returns true if deleting a cookie', function() {
      expect(window.GOVUK.checkConsentCookie('test_cookie', null)).toBe(true)
      expect(window.GOVUK.checkConsentCookie('test_cookie', false)).toBe(true)
    })

    it('returns true if the consent cookie does not exist and the cookie name is recognised', function() {
      expect(window.GOVUK.getConsentCookie()).toBeFalsy()

      expect(window.GOVUK.checkConsentCookie('seen_cookie_message', true)).toBe(true)
    })

    it('returns false if the consent cookie does not exist and the cookie name is not recognised', function() {
      expect(window.GOVUK.getConsentCookie()).toBeFalsy()

      expect(window.GOVUK.checkConsentCookie('fake_cookie')).toBe(false)
    })

    it('returns the consent for a given cookie', function() {
      window.GOVUK.setConsentCookie({'usage': false})

      expect(window.GOVUK.checkConsentCookie('analytics_next_page_call', 'set a usage cookie')).toBeFalsy()

      window.GOVUK.setConsentCookie({'usage': true})

      expect(window.GOVUK.checkConsentCookie('analytics_next_page_call', 'set a usage cookie')).toBeTruthy()
    })

    it('denies consent for cookies not in our list of cookies', function() {
      expect(window.GOVUK.checkConsentCookie('fake_cookie', 'just for testing')).toBeFalsy()
    })
  })
})
