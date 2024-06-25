/* eslint-env jasmine, jquery */

var GOVUK = window.GOVUK || {}

describe('Cookie helper functions', function () {
  'use strict'

  beforeEach(function () {
    GOVUK.cookie('cookies_policy', null)
    GOVUK.cookie('cookies_preferences_set', null)
    GOVUK.cookie('_ga_VBLT2V3FZR', null)
    GOVUK.cookie('_ga_P1DGM6TVYF', null)
    GOVUK.cookie('_ga_S5RQ7FTGVR', null)
  })

  afterEach(function () {
    GOVUK.cookie('cookies_policy', null)
    GOVUK.cookie('cookies_preferences_set', null)
    GOVUK.cookie('_ga_VBLT2V3FZR', null)
    GOVUK.cookie('_ga_P1DGM6TVYF', null)
    GOVUK.cookie('_ga_S5RQ7FTGVR', null)
  })

  describe('GOVUK.cookie', function () {
    it('returns the cookie value if not provided with a value to set', function () {
      GOVUK.cookie('cookies_preferences_set', 'testing fetching cookie value')

      GOVUK.cookie('cookies_preferences_set')

      expect(GOVUK.cookie('cookies_preferences_set')).toBe('testing fetching cookie value')
    })

    it('can create a new cookie', function () {
      expect(GOVUK.getCookie('cookies_preferences_set')).toBeFalsy()

      GOVUK.cookie('cookies_preferences_set', 'test')

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('test')
    })

    it('sets a default expiry of 30 days if no options are provided', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      expect(GOVUK.getCookie('cookies_preferences_set')).toBeFalsy()

      GOVUK.cookie('cookies_preferences_set', 'test')

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_preferences_set', 'test', { days: 30 })
    })

    it('sets the expiry if one is provided', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      expect(GOVUK.getCookie('cookies_preferences_set')).toBeFalsy()

      GOVUK.cookie('cookies_preferences_set', 'test', { days: 100 })

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_preferences_set', 'test', { days: 100 })
    })

    it('can change the value of an existing cookie', function () {
      GOVUK.cookie('cookies_preferences_set', 'test1')

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('test1')

      GOVUK.cookie('cookies_preferences_set', 'test2')

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('test2')
    })

    it('deletes the cookie if value is set to false', function () {
      GOVUK.cookie('cookies_preferences_set', false)

      expect(GOVUK.getCookie('cookies_preferences_set')).toBeFalsy()
    })

    it('deletes the cookie if value is set to null', function () {
      GOVUK.cookie('cookies_preferences_set', null)

      expect(GOVUK.getCookie('cookies_preferences_set')).toBeFalsy()
    })
  })

  describe('consent cookie methods', function () {
    it('can set the consent cookie to default values', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      expect(GOVUK.getCookie('cookies_policy')).toBeFalsy()

      GOVUK.setDefaultConsentCookie()

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_policy', '{"essential":true,"settings":false,"usage":false,"campaigns":false}', Object({ days: 365 }))
      expect(GOVUK.getConsentCookie()).toEqual({ essential: true, settings: false, usage: false, campaigns: false })
    })

    it('deletes cookies after default consent cookie set', function () {
      var date = new Date()
      date.setTime(date.valueOf() + (365 * 24 * 60 * 60 * 1000))

      GOVUK.setCookie('JS-Detection', 'test', { expires: date.toUTCString(), domain: window.location.hostname, path: '/' })

      expect(GOVUK.getCookie('JS-Detection')).toBe('test')

      GOVUK.setDefaultConsentCookie()

      expect(GOVUK.getConsentCookie().usage).toBe(false)
      expect(GOVUK.getCookie('JS-Detection')).toBeFalsy()
    })

    it('deletes cookies regardless of subdomains', function () {
      var date = new Date()
      date.setTime(date.valueOf() + (365 * 24 * 60 * 60 * 1000))

      GOVUK.setCookie('_ga_VBLT2V3FZR', 'integration', { expires: date.toUTCString(), domain: 'publishing.service.gov.uk', path: '/' })
      GOVUK.setCookie('_ga_P1DGM6TVYF', 'staging', { expires: date.toUTCString(), domain: 'www.integration.publishing.service.gov.uk', path: '/' })
      GOVUK.setCookie('_ga_S5RQ7FTGVR', 'production', { expires: date.toUTCString(), domain: '.publishing.service.gov.uk', path: '/' })

      expect(GOVUK.getCookie('_ga_VBLT2V3FZR')).toBe('integration')
      expect(GOVUK.getCookie('_ga_P1DGM6TVYF')).toBe('staging')
      expect(GOVUK.getCookie('_ga_S5RQ7FTGVR')).toBe('production')

      GOVUK.setDefaultConsentCookie()

      expect(GOVUK.getConsentCookie().usage).toBe(false)
      expect(GOVUK.getCookie('_ga_VBLT2V3FZR')).toBeFalsy()
      expect(GOVUK.getCookie('_ga_P1DGM6TVYF')).toBeFalsy()
      expect(GOVUK.getCookie('_ga_S5RQ7FTGVR')).toBeFalsy()
    })

    it('can set the consent cookie to approve all cookie categories', function () {
      spyOn(GOVUK, 'setCookie').and.callThrough()

      GOVUK.setConsentCookie({ usage: false, essential: false })

      expect(GOVUK.getConsentCookie().essential).toBe(false)
      expect(GOVUK.getConsentCookie().usage).toBe(false)

      GOVUK.approveAllCookieTypes()

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}', Object({ days: 365 }))
      expect(GOVUK.getConsentCookie()).toEqual({ essential: true, settings: true, usage: true, campaigns: true })
    })

    it('returns null if the consent cookie does not exist', function () {
      expect(GOVUK.getConsentCookie()).toEqual(null)
    })

    it('returns null if the consent cookie is malformed', function () {
      GOVUK.cookie('cookies_policy', 'malformed consent cookie')

      expect(GOVUK.getConsentCookie()).toBe(null)
    })

    it('deletes relevant cookies in that category if consent is set to false', function () {
      GOVUK.setConsentCookie({ usage: true })

      GOVUK.setCookie('JS-Detection', 'this is a usage cookie')

      expect(GOVUK.cookie('JS-Detection')).toBe('this is a usage cookie')

      spyOn(GOVUK, 'setCookie').and.callThrough()
      GOVUK.setConsentCookie({ usage: false })

      expect(GOVUK.setCookie).toHaveBeenCalledWith('cookies_policy', '{"essential":true,"settings":false,"usage":false,"campaigns":false}', Object({ days: 365 }))
      expect(GOVUK.getConsentCookie().usage).toBe(false)
      expect(GOVUK.cookie('JS-Detection')).toBeFalsy()
    })
  })

  describe('check cookie consent', function () {
    it('returns true if trying to set the consent cookie', function () {
      expect(GOVUK.checkConsentCookie('cookies_policy', { essential: true })).toBe(true)
    })

    it('returns true if deleting a cookie', function () {
      expect(GOVUK.checkConsentCookie('test_cookie', null)).toBe(true)
      expect(GOVUK.checkConsentCookie('test_cookie', false)).toBe(true)
    })

    it('does not set a default consent cookie if one is not present', function () {
      GOVUK.cookie('cookies_policy', null)

      GOVUK.checkConsentCookieCategory('cookies_preferences_set', true)

      expect(GOVUK.getConsentCookie()).toBeFalsy()
    })

    it('returns true if the consent cookie does not exist and the cookie name is recognised', function () {
      expect(GOVUK.getConsentCookie()).toBeFalsy()

      expect(GOVUK.checkConsentCookie('cookies_preferences_set', true)).toBe(true)
    })

    it('returns false if the consent cookie does not exist and the cookie name is not recognised', function () {
      expect(GOVUK.getConsentCookie()).toBeFalsy()

      expect(GOVUK.checkConsentCookie('fake_cookie')).toBe(false)
    })

    it('returns the consent for a given cookie', function () {
      GOVUK.setConsentCookie({ usage: false })

      expect(GOVUK.checkConsentCookie('JS-Detection', 'set a usage cookie')).toBeFalsy()

      GOVUK.setConsentCookie({ usage: true })

      expect(GOVUK.checkConsentCookie('JS-Detection', 'set a usage cookie')).toBeTruthy()
    })

    it('denies consent for cookies not in our list of cookies', function () {
      expect(GOVUK.checkConsentCookie('fake_cookie', 'just for testing')).toBeFalsy()
    })
  })
})
