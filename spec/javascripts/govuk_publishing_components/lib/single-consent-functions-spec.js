/* eslint-env jasmine */

describe('The single consent cookie code', function () {
  var acceptAll = {
    essential: true,
    settings: true,
    usage: true,
    campaigns: true
  }
  var rejectAll = {
    essential: true,
    settings: false,
    usage: false,
    campaigns: false
  }
  var mix = {
    essential: true,
    settings: true,
    usage: false,
    campaigns: true
  }

  beforeEach(function () {
    spyOn(window.GOVUK, 'triggerEvent').and.callThrough()
    spyOn(window.GOVUK.singleConsent, 'apiCallBack').and.callThrough()
    jasmine.Ajax.install()
  })

  afterEach(function () {
    jasmine.Ajax.uninstall()
    window.GOVUK.singleConsent.url = false
  })

  it('does nothing if there is no unique user id', function () {
    window.GOVUK.singleConsent.init()
    expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
    expect(jasmine.Ajax.requests.count()).toEqual(0)
    expect(window.GOVUK.singleConsent.apiCallBack).toHaveBeenCalledWith(null, false, null)
    expect(window.GOVUK.triggerEvent).not.toHaveBeenCalled()
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
      window.GOVUK.cookie('gov_singleconsent_uid', '1234')
      window.GOVUK.singleConsent.init()
    })

    afterEach(function () {
      window.GOVUK.cookie('gov_singleconsent_uid', null)
    })

    it('does everything expected when full consent is given', function () {
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: '{ "uuid": "1234", "status": ' + JSON.stringify(acceptAll) + '}'
      })

      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.singleConsent.apiCallBack).toHaveBeenCalledWith(acceptAll, true, null)
      expect(window.GOVUK.triggerEvent).toHaveBeenCalled()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"settings":true,"usage":true,"campaigns":true}')
    })

    it('does everything expected when consent is rejected', function () {
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: '{ "uuid": "1234", "status": ' + JSON.stringify(rejectAll) + '}'
      })

      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.singleConsent.apiCallBack).toHaveBeenCalledWith(rejectAll, true, null)
      expect(window.GOVUK.triggerEvent).not.toHaveBeenCalled()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"settings":false,"usage":false,"campaigns":false}')
    })

    it('allows individual cookies to be set', function () {
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: '{ "uuid": "1234", "status": ' + JSON.stringify(mix) + '}'
      })

      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.singleConsent.apiCallBack).toHaveBeenCalledWith(mix, true, null)
      expect(window.GOVUK.triggerEvent).not.toHaveBeenCalled()
      expect(window.GOVUK.cookie('cookies_policy')).toEqual('{"essential":true,"settings":true,"usage":false,"campaigns":true}')
    })
  })

  xdescribe('when there is a problem', function () {
    beforeEach(function () {
      jasmine.clock().install()
      window.GOVUK.cookie('gov_singleconsent_uid', '1234')
    })

    afterEach(function () {
      jasmine.clock().uninstall()
      window.GOVUK.cookie('gov_singleconsent_uid', null)
    })

    it('handles a timeout gracefully', function () {
      window.GOVUK.singleConsent.init()
      jasmine.Ajax.requests.mostRecent().responseTimeout()
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      expect(window.GOVUK.singleConsent.apiCallBack).not.toHaveBeenCalled()
    })

    it('fails gracefully if pointed at an incorrect endpoint URL', function () {
      window.GOVUK.singleConsent.init()
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 404,
        contentType: 'text/plain',
        responseText: 'error not found'
      })
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      console.log(window.GOVUK.singleConsent.consentApiObj)
    })

    it('fails gracefully when the server errors', function () {
      window.GOVUK.singleConsent.init()
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 500,
        contentType: 'text/plain',
        responseText: 'error not found'
      })
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      console.log(window.GOVUK.singleConsent.consentApiObj)
    })

    it('fails gracefully when the response is not as expected', function () {
      window.GOVUK.singleConsent.init()
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        contentType: 'text/plain',
        responseText: 'surprise!'
      })
      expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
      console.log(window.GOVUK.singleConsent.consentApiObj)
    })
  })
})
