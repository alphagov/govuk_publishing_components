/* eslint-env jasmine */

describe('Initialising GA4', function () {
  var GOVUK = window.GOVUK

  afterEach(function () {
    GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker.stopTracking()
    window.dataLayer = []
    window.removeEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
  })

  describe('when consent is given', function () {
    var test = {
      functionThatMightBeCalled: function () {}
    }

    beforeEach(function () {
      spyOn(test, 'functionThatMightBeCalled')
      GOVUK.analyticsGa4.analyticsModules.Test = function () {}
      GOVUK.analyticsGa4.analyticsModules.Test.init = function () { test.functionThatMightBeCalled() }
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

    it('does not error if no init is found at all', function () {
      GOVUK.analyticsGa4.analyticsModules.Test = false

      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()

      expect(GOVUK.analyticsGa4).not.toEqual({})
    })
  })

  describe('Modules depending on cookie consent to run', function () {
    var testModule
    var testObject = {
      testFunction: function () {}
    }

    beforeEach(function () {
      function TestModule () {}

      TestModule.prototype.init = function () {
        var consentCookie = window.GOVUK.getConsentCookie()

        if (consentCookie && consentCookie.settings) {
          this.startModule()
        } else {
          this.startModule = this.startModule.bind(this)
          window.addEventListener('cookie-consent', this.startModule)
        }
      }
      TestModule.prototype.startModule = function () {
        testObject.testFunction()
      }

      testModule = new TestModule()
      spyOn(testObject, 'testFunction')
    })

    it('do not run if consent is not given', function () {
      GOVUK.setCookie('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}')
      GOVUK.analyticsGa4.init()

      testModule.init()
      expect(testObject.testFunction).not.toHaveBeenCalled()
    })

    it('run if consent is given', function () {
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.analyticsGa4.init()

      testModule.init()
      expect(testObject.testFunction).toHaveBeenCalled()
    })
  })
})
