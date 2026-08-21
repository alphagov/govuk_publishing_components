/* eslint-env jasmine */

describe('Initialising GA4', function () {
  var GOVUK = window.GOVUK

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
      GOVUK.analyticsGa4.analyticsModulesStarted = false
    })

    it('calls analytics modules successfully', function () {
      spyOn(GOVUK.analyticsGa4.analyticsModules.Test, 'init').and.callThrough()
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
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

    it('does not call analytics modules if the modules have already started', function () {
      spyOn(GOVUK.analyticsGa4.analyticsModules.Test, 'init').and.callThrough()
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()
      expect(test.functionThatMightBeCalled).toHaveBeenCalled()

      GOVUK.analyticsGa4.init()
      expect(test.functionThatMightBeCalled.calls.count()).toBe(1)
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

  describe('cookie consent query strings', function () {
    it('sets usage consent cookie to false when cookies[analytics] query string parameter has a value of "no"', function () {
      var location = {
        protocol: 'https:',
        hostname: 'end-to-end-journeys-545890405086.europe-west2.run.app',
        href: 'https://end-to-end-journeys-545890405086.europe-west2.run.app/a/path?cookies%5Banalytics%5D=no',
        search: '?cookies%5Banalytics%5D=no',
        origin: 'https://end-to-end-journeys-545890405086.europe-west2.run.app'
      }

      GOVUK.analyticsGa4.checkCookieConsentLinkDecoration(location)

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(false)
    })

    it('sets usage consent cookie to true when cookies[analytics] query string parameter has a value of "yes"', function () {
      var location = {
        protocol: 'https:',
        hostname: 'end-to-end-journeys-545890405086.europe-west2.run.app',
        href: 'https://end-to-end-journeys-545890405086.europe-west2.run.app/a/path?cookies%5Banalytics%5D=yes',
        search: '?cookies%5Banalytics%5D=yes',
        origin: 'https://end-to-end-journeys-545890405086.europe-west2.run.app'
      }

      GOVUK.analyticsGa4.checkCookieConsentLinkDecoration(location)

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(true)
    })
  })

  describe('Link decoration on the DOM', function () {
    var link1, link2

    beforeEach(function () {
      link1 = document.createElement('a')
      link1.id = 'link_1'
      link1.href = 'https://end-to-end-journeys-545890405086.europe-west2.run.app'
      document.body.appendChild(link1)

      link2 = document.createElement('a')
      link2.id = 'link_2'
      link2.href = 'https://www.example.gov.uk'
      document.body.appendChild(link2)
    })

    afterEach(function () {
      document.body.removeChild(link1)
      document.body.removeChild(link2)

      GOVUK.setCookie('cookies_policy', null)
    })

    it('appends negative cookie decoration to relevant links before cookies are accepted', function () {
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":false,"usage":false,"campaigns":false}')
      GOVUK.analyticsGa4.init()

      expect(link1.href).toContain('cookies%5Banalytics%5D=no')
      expect(link2.href).toEqual('https://www.example.gov.uk/')
    })

    it('appends positive cookie decoration to relevant links after cookies are accepted', function () {
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()

      expect(link1.href).toContain('cookies%5Banalytics%5D=yes')
      expect(link2.href).toEqual('https://www.example.gov.uk/')
    })
  })
})
