/* eslint-env jasmine */

describe('The single consent cookie code', function () {
  var acceptAll = {
    essential: true,
    usage: true,
    campaigns: true,
    settings: true
  }
  var rejectAll = {
    essential: true,
    usage: false,
    campaigns: false,
    settings: false
  }
  var mix = {
    essential: true,
    usage: false,
    campaigns: true,
    settings: true
  }

  beforeEach(function () {
    delete window.GOVUK.singleConsent.consentApiObj
    delete window.GOVUK.singleConsent.url
    delete window.GOVUK.useSingleConsentApi
    spyOn(window.GOVUK, 'triggerEvent').and.callThrough()
    spyOn(window.GOVUK.singleConsent, 'apiCallback').and.callThrough()
    jasmine.Ajax.install()
  })

  afterEach(function () {
    jasmine.Ajax.uninstall()
    delete window.GOVUK.singleConsent.consentApiObj
    delete window.GOVUK.singleConsent.url
    delete window.GOVUK.useSingleConsentApi
  })

  describe('if the single consent API should not be used', function () {
    beforeEach(function () {
      delete window.GOVUK.useSingleConsentApi
    })

    it('will not initialise', function () {
      window.GOVUK.singleConsent.init()
      expect(window.GOVUK.singleConsent.consentApiObj).not.toBeDefined()
    })
  })

  describe('if the single consent API should be used', function () {
    beforeEach(function () {
      window.GOVUK.useSingleConsentApi = true
    })

    afterEach(function () {
      delete window.GOVUK.useSingleConsentApi
    })

    it('does nothing if there is no unique user id', function () {
      window.GOVUK.singleConsent.init()
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(jasmine.Ajax.requests.count()).toEqual(0)
      expect(window.GOVUK.singleConsent.apiCallback).toHaveBeenCalledWith(null, false, null)
    })

    it('accepts a function for the callback', function () {
      var test = {
        testFunction: function () {}
      }
      spyOn(test, 'testFunction')
      window.GOVUK.singleConsent.init(test.testFunction)
      expect(test.testFunction).toHaveBeenCalled()
    })

    describe('when determining the environment', function () {
      it('starts without a URL for the consent API', function () {
        expect(window.GOVUK.singleConsent.url).toBeFalsy()
      })

      it('defaults to staging if the environment is not recognised', function () {
        spyOn(window.GOVUK.analyticsGa4.core.trackFunctions, 'getHostname').and.returnValue('moo')
        window.GOVUK.singleConsent.init()
        expect(window.GOVUK.singleConsent.url).toEqual('staging')
      })

      it('switches to production when on production', function () {
        spyOn(window.GOVUK.analyticsGa4.core.trackFunctions, 'getHostname').and.returnValue('www.gov.uk')
        window.GOVUK.singleConsent.init()
        expect(window.GOVUK.singleConsent.url).toEqual('production')
      })
    })

    describe('when there is a user id', function () {
      beforeEach(function () {
        spyOn(window.GOVUK, 'checkConsentCookie').and.returnValue(true)
        window.GOVUK.cookie('gov_singleconsent_uid', '1234')
        window.GOVUK.singleConsent.init()
      })

      afterEach(function () {
        window.GOVUK.cookie('gov_singleconsent_uid', null)
      })

      it('does everything expected when full consent is given', function () {
        window.GOVUK.singleConsent.setPreferences('accept')
        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "uid": "1234", "status": ' + JSON.stringify(acceptAll) + '}'
        })

        expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
        expect(window.GOVUK.singleConsent.apiCallback).toHaveBeenCalledWith(acceptAll, true, null)
        expect(window.GOVUK.triggerEvent).toHaveBeenCalledWith(window, 'cookie-consent')
        expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":true,"campaigns":true,"settings":true}')
      })

      it('does everything expected when consent is rejected', function () {
        window.GOVUK.singleConsent.setPreferences('reject')
        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "uid": "1234", "status": ' + JSON.stringify(rejectAll) + '}'
        })

        expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
        expect(window.GOVUK.singleConsent.apiCallback).toHaveBeenCalledWith(rejectAll, true, null)
        expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":false,"campaigns":false,"settings":false}')
      })

      it('does everything expected when partial consent is given', function () {
        window.GOVUK.singleConsent.setPreferences(false, mix)
        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200,
          contentType: 'text/plain',
          responseText: '{ "uid": "1234", "status": ' + JSON.stringify(mix) + '}'
        })

        expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
        expect(window.GOVUK.singleConsent.apiCallback).toHaveBeenCalledWith(mix, true, null)
        expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":false,"campaigns":true,"settings":true}')
      })
    })
  })

  describe('when there is a problem with the consent api', function () {
    beforeEach(function () {
      spyOn(window.GOVUK, 'checkConsentCookie').and.returnValue(true)
      window.GOVUK.cookie('gov_singleconsent_uid', '1234')
      window.GOVUK.useSingleConsentApi = true
      jasmine.clock().install()
    })

    afterEach(function () {
      delete window.GOVUK.useSingleConsentApi
      jasmine.clock().uninstall()
      window.GOVUK.cookie('gov_singleconsent_uid', null)
    })

    it('handles a timeout gracefully', function () {
      window.GOVUK.singleConsent.init()
      window.GOVUK.singleConsent.setPreferences('accept')
      jasmine.Ajax.requests.mostRecent().responseTimeout()
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":false,"campaigns":false,"settings":false}')
    })

    it('fails gracefully if pointed at an incorrect endpoint URL', function () {
      window.GOVUK.singleConsent.init()
      window.GOVUK.singleConsent.setPreferences('accept')
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 404,
        contentType: 'text/plain',
        responseText: 'error not found'
      })
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":false,"campaigns":false,"settings":false}')
    })

    it('fails gracefully when the server errors', function () {
      window.GOVUK.singleConsent.init()
      window.GOVUK.singleConsent.setPreferences('accept')
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 500,
        contentType: 'text/plain',
        responseText: 'error not found'
      })
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":false,"campaigns":false,"settings":false}')
    })

    it('fails gracefully when the response is invalid', function () {
      window.GOVUK.singleConsent.init()
      window.GOVUK.singleConsent.setPreferences('accept')
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: 'not valid json'
      })
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":false,"campaigns":false,"settings":false}')
    })

    it('fails gracefully when the response is not as expected', function () {
      window.GOVUK.singleConsent.init()
      window.GOVUK.singleConsent.setPreferences('accept')
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: '{"valid json but not":"what should be returned by the api"}'
      })
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":false,"campaigns":false,"settings":false}')
    })

    it('restores correct cookie consent', function () {
      window.GOVUK.cookie('cookies_policy', '{"essential":true,"usage":false,"campaigns":false,"settings":false}')
      window.GOVUK.singleConsent.init()
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: '{ "uid": "1234", "status": ' + JSON.stringify(acceptAll) + '}'
      })
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"usage":true,"campaigns":true,"settings":true}')
    })
  })
})
