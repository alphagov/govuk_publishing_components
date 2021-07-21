/* eslint-env jasmine */
/* global GOVUK */

describe('The intervention component', function () {
  var FIXTURE = "<section class='gem-c-intervention' data-module='intervention'></section>"

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent')
    window.setFixtures(FIXTURE)
    var element = document.querySelector('[data-module="gem-intervention"]')
    new GOVUK.Modules.Intervention(element).init()
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  it('triggers a tracking event when the component is displayed', function () {
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('interventionBanner', 'interventionShown')
  })
})
