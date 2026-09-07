/* eslint-env jasmine */

var GOVUK = window.GOVUK || {}

describe('Decorating links', function () {
  describe('cookie consent query strings', function () {
    var originalUrl

    beforeEach(function () {
      originalUrl = window.location.href
    })

    afterEach(function () {
      window.history.replaceState(null, null, originalUrl)
    })

    it('sets usage consent cookie to false when cookies[analytics] query string parameter has a value of "no"', function () {
      window.history.replaceState(null, null, '?cookies=no')

      var consentModule = new window.GOVUK.Modules.CookieConsentLinkDecoration()
      consentModule.init()

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(false)
    })

    it('sets usage consent cookie to true when cookies[analytics] query string parameter has a value of "yes"', function () {
      window.history.replaceState(null, null, '?cookies=yes')

      var consentModule = new window.GOVUK.Modules.CookieConsentLinkDecoration()
      consentModule.init()

      expect(GOVUK.getCookie('cookies_preferences_set')).toBe('true')
      expect(GOVUK.getConsentCookie().usage).toBe(true)
    })
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

    var consentModule = new window.GOVUK.Modules.CookieConsentLinkDecoration()
    consentModule.decorateLinks()

    expect(link1.href).toContain('cookies=no')
    expect(link2.href).toEqual('https://www.example.gov.uk/')
  })

  it('appends positive cookie decoration to relevant links after cookies are accepted', function () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')

    var consentModule = new window.GOVUK.Modules.CookieConsentLinkDecoration()
    consentModule.decorateLinks()

    expect(link1.href).toContain('cookies=yes')
    expect(link2.href).toEqual('https://www.example.gov.uk/')
  })
})
