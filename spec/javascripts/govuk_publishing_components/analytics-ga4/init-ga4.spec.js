/* eslint-env jasmine */

describe('Initialising GA4', function () {
  var GOVUK = window.GOVUK
  var save

  beforeEach(function () {
    save = GOVUK.analyticsGA4
  })

  afterEach(function () {
    GOVUK.analyticsGA4 = save
  })

  it('creates the GA4 code when cookie consent is given', function () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
    GOVUK.analyticsGa4Init()

    expect(GOVUK.analyticsGA4).not.toEqual({})
  })

  it('clears the GA4 code when cookie consent is not given', function () {
    GOVUK.setCookie('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}')
    GOVUK.analyticsGa4Init()

    expect(GOVUK.analyticsGA4).toEqual({})
  })
})
