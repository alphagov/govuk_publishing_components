/* eslint-env jasmine */

describe('GA4 core', function () {
  var GOVUK = window.GOVUK

  beforeEach(function () {
    window.dataLayer = []
  })

  afterEach(function () {
    window.dataLayer = []
  })

  it('loads the GTM snippet', function () {
    GOVUK.analyticsGA4.core.load()

    expect(window.dataLayer.length).toEqual(1)
    expect(Object.keys(window.dataLayer[0])).toContain('gtm.start')
    expect(Object.keys(window.dataLayer[0])).toContain('event')
  })

  it('pushes data to the dataLayer', function () {
    var data = {
      hello: 'I must be going'
    }
    GOVUK.analyticsGA4.core.sendData(data)
    expect(window.dataLayer[0]).toEqual(data)
  })
})
