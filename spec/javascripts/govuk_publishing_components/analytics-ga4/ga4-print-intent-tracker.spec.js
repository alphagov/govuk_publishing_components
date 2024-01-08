/* eslint-env jasmine */

describe('Google Analytics 4 print intent tracker', function () {
  var GOVUK = window.GOVUK
  var expected

  beforeAll(function () {
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
    window.GOVUK.analyticsGa4.vars.gem_version = 'aVersion'
  })

  beforeEach(function () {
    window.dataLayer = []
    expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
    expected.event = 'event_data'
    expected.event_data.event_name = 'print_page'
    expected.event_data.type = 'print page'
    expected.event_data.method = 'browser print'
    expected.govuk_gem_version = 'aVersion'
    expected.timestamp = '123456'
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
  })

  it('triggers a GA4 event when the \'beforeprint\' event is fired', function () {
    GOVUK.analyticsGa4.analyticsModules.Ga4PrintIntentTracker.init()
    window.GOVUK.triggerEvent(window, 'beforeprint')

    expect(window.dataLayer[0]).toEqual(expected)
  })
})
