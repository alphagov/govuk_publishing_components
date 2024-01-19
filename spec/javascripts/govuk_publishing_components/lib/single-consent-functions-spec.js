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

  beforeEach(function () {
    spyOn(window.GOVUK, 'triggerEvent').and.callThrough()
    spyOn(window.GOVUK.singleConsent, 'apiCallBack').and.callThrough()
    jasmine.Ajax.install()
  })

  afterEach(function () {
    jasmine.Ajax.uninstall()
  })

  it('does nothing if there is no unique user id', function () {
    window.GOVUK.singleConsent.init()
    expect(window.GOVUK.singleConsent.consentApiObj).toBeDefined()
    expect(jasmine.Ajax.requests.count()).toEqual(0)
    expect(window.GOVUK.singleConsent.apiCallBack).toHaveBeenCalledWith(null, false, null)
    expect(window.GOVUK.triggerEvent).not.toHaveBeenCalled()
  })

  describe('when there is a user id', function () {
    beforeEach(function () {
      window.GOVUK.cookie('gov_singleconsent_uid', '1234')
      window.GOVUK.singleConsent.init()
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
  })
})
