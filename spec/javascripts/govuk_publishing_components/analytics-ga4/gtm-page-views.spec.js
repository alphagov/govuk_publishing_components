/* eslint-env jasmine */

describe('Google Tag Manager page view tracking', function () {
  var GOVUK = window.GOVUK
  var saved = {}
  var expected

  beforeEach(function () {
    saved.title = document.title
    document.title = 'This here page'
    expected = {
      event: 'config_ready',
      page: {
        location: document.location.href,
        referrer: document.referrer,
        title: 'This here page',
        status_code: 200
      }
    }
    window.dataLayer = []
  })

  afterEach(function () {
    document.title = saved.title
    window.httpStatusCode = false
  })

  it('returns a standard page view', function () {
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('returns a page view with a specific status code', function () {
    window.httpStatusCode = 404
    expected.page.status_code = 404
    GOVUK.Gtm.sendPageView()
    expect(window.dataLayer[0]).toEqual(expected)
  })
})
