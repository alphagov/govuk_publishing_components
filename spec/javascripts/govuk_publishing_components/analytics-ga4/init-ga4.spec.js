/* eslint-env jasmine */

describe('Initialising GA4', function () {
  var GOVUK = window.GOVUK
  // default cookie consent to use as basis of comparison
  var DEFAULT_COOKIE_CONSENT = '{"essential":true,"settings":false,"usage":false,"campaigns":false,"aggregate":true}'
  // all consent cookie to use as a basis of comparison
  var ALL_COOKIE_CONSENT = '{"essential":true,"settings":true,"usage":true,"campaigns":true,"aggregate":false}'

  afterEach(function () {
    window.dataLayer = []
    window.removeEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
  })

  describe('when consent is given', function () {
    var test = {
      functionThatMightBeCalled: function () {},
      functionThatShouldNotBeCalled: function () {}
    }

    beforeEach(function () {
      spyOn(test, 'functionThatMightBeCalled')
      spyOn(test, 'functionThatShouldNotBeCalled')
      GOVUK.analyticsGa4.analyticsModules.Test = function () {}
      GOVUK.analyticsGa4.analyticsModules.Test.init = function () { test.functionThatMightBeCalled() }
    })

    afterEach(function () {
      GOVUK.deleteCookie('cookies_policy')
    })

    it('sets a default `cookie_policy` consent cookie if not previously set', function () {
      GOVUK.cookie('cookies_policy', null)
      spyOn(window.GOVUK, 'setDefaultConsentCookie').and.callThrough()

      GOVUK.analyticsGa4.init()

      expect(window.GOVUK.setDefaultConsentCookie).toHaveBeenCalled()
      expect(GOVUK.getCookie('cookies_policy')).toEqual(DEFAULT_COOKIE_CONSENT)
    })

    it('does not update the `cookie_policy` cookie to the default values if previously set', function () {
      GOVUK.cookie('cookies_policy', ALL_COOKIE_CONSENT)
      spyOn(window.GOVUK, 'setDefaultConsentCookie').and.callThrough()

      GOVUK.analyticsGa4.init()

      expect(window.GOVUK.setDefaultConsentCookie).not.toHaveBeenCalled()
      expect(GOVUK.getCookie('cookies_policy')).not.toEqual(DEFAULT_COOKIE_CONSENT)
      expect(GOVUK.getCookie('cookies_policy')).toEqual(ALL_COOKIE_CONSENT)
    })

    it('calls analytics modules that run on page load successfully when usage consent is true', function () {
      spyOn(GOVUK.analyticsGa4.analyticsModules.Test, 'init').and.callThrough()
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()

      expect(test.functionThatMightBeCalled).toHaveBeenCalled()
    })

    it('calls analytics modules that run on page load successfully when aggregate consent is true', function () {
      spyOn(GOVUK.analyticsGa4.analyticsModules.Test, 'init').and.callThrough()
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":false,"campaigns":true,"aggregate":true}')
      GOVUK.analyticsGa4.init()

      expect(test.functionThatMightBeCalled).toHaveBeenCalled()
    })

    it('does not call analytics modules without a valid init function', function () {
      GOVUK.analyticsGa4.analyticsModules.Test.init = false
      spyOn(GOVUK.analyticsGa4.analyticsModules.Test, 'init').and.callThrough()

      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()

      expect(test.functionThatMightBeCalled).not.toHaveBeenCalled()
    })

    it('does not error if no init is found at all', function () {
      GOVUK.analyticsGa4.analyticsModules.Test = false

      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()

      expect(GOVUK.analyticsGa4).not.toEqual({})
    })

    it('initialises following modules even if this one errors', function () {
      // module with a deliberate error in it
      GOVUK.analyticsGa4.analyticsModules.TestError = function () {}
      GOVUK.analyticsGa4.analyticsModules.TestError.init = function () {
        throw new Error('This is a deliberate error')
        test.functionThatShouldNotBeCalled() // eslint-disable-line no-unreachable
      }

      GOVUK.analyticsGa4.analyticsModules.TestNotError = function () {}
      GOVUK.analyticsGa4.analyticsModules.TestNotError.init = function () { test.functionThatMightBeCalled() }

      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()

      expect(test.functionThatShouldNotBeCalled.calls.count()).toEqual(0)
      expect(test.functionThatMightBeCalled.calls.count()).toEqual(2)

      delete GOVUK.analyticsGa4.analyticsModules.TestError
      delete GOVUK.analyticsGa4.analyticsModules.TestNotError
    })
  })
})
