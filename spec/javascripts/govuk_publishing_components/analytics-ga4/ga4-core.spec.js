/* eslint-env jasmine */

describe('GA4 core', function () {
  var GOVUK = window.GOVUK

  beforeEach(function () {
    window.GOVUK.analyticsGa4.vars = {}
    window.dataLayer = []
  })

  afterEach(function () {
    window.GOVUK.analyticsGa4.vars = null
    window.dataLayer = []
  })

  it('loads the GTM snippet', function () {
    GOVUK.analyticsGa4.core.load()

    expect(window.dataLayer.length).toEqual(2)
    expect(Object.keys(window.dataLayer[0])).toContain('gtm.start')
    expect(Object.keys(window.dataLayer[0])).toContain('event')
    expect(Object.keys(window.dataLayer[1])).toContain('gtm.blocklist')
    expect(window.dataLayer[1]['gtm.blocklist']).toEqual(['customPixels', 'customScripts', 'html', 'nonGoogleScripts'])
  })

  describe('calls the right URL from Google', function () {
    it('if all three env vars are present', function () {
      window.GOVUK.analyticsGa4.vars.id = 'myId'
      window.GOVUK.analyticsGa4.vars.auth = 'myAuth'
      window.GOVUK.analyticsGa4.vars.preview = 'myPreview'
      GOVUK.analyticsGa4.core.load()

      expect(GOVUK.analyticsGa4.core.googleSrc).toEqual('https://www.googletagmanager.com/gtm.js?id=myId&gtm_auth=myAuth&gtm_preview=myPreview&gtm_cookies_win=x')
    })

    it('if only id is present', function () {
      window.GOVUK.analyticsGa4.vars.id = 'myId'
      GOVUK.analyticsGa4.core.load()

      expect(GOVUK.analyticsGa4.core.googleSrc).toEqual('https://www.googletagmanager.com/gtm.js?id=myId')
    })
  })

  it('loads the GTAG snippet', function () {
    window.GOVUK.analyticsGa4.vars.gtag_id = 'fake'
    GOVUK.analyticsGa4.core.load()

    expect(window.dataLayer.length).toEqual(2)
    expect(window.dataLayer[0]).toContain('js')
    expect(window.dataLayer[1]).toContain('config')
  })

  it('pushes data to the dataLayer', function () {
    var data = {
      hello: 'I must be going'
    }
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
    GOVUK.analyticsGa4.core.sendData(data)
    expect(window.dataLayer[0]).toEqual({
      hello: 'I must be going',
      govuk_gem_version: 'aVersion'
    })
  })
})
