/* eslint-env jasmine, jquery */
var GOVUK = window.GOVUK || {}

describe('Google Tag Manager tracking', function () {
  var el
  var attributesFromComponent = {
    event_name: 'this component',
    component: {
      main_type: 'example',
      url: 'https://www.gov.uk'
    }
  }
  var allAttributes = JSON.parse(JSON.stringify(attributesFromComponent))
  // attributes set either by the GTM script or the component itself
  allAttributes.event = 'analytics'

  beforeEach(function () {
    el = document.createElement('div')
    el.setAttribute('data-gtm-attributes', JSON.stringify(attributesFromComponent))
    document.body.appendChild(el)
  })

  afterEach(function () {
    window.dataLayer = []
    document.body.removeChild(el)
  })

  it('tracks clicks', function () {
    var gtmTracking = new GOVUK.Modules.GtmTracking(el)
    gtmTracking.init()

    el.click()
    expect(window.dataLayer[0]).toEqual(allAttributes)
  })
})
