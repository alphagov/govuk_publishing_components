/* eslint-env jasmine */
/* global GOVUK */

describe('The intervention component', function () {
  var FIXTURE = '<section></section>'

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent')
    window.setFixtures(FIXTURE)
    var element = document.querySelector('.gem-c-intervention')
    new GOVUK.Modules.Intervention(element).init()
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  it('triggers a tracking event when the banner is shown', function () {
    expect(GOVUK.analytics.trackEvent)
      .toHaveBeenCalledWith('interventionBanner', 'interventionShown')
  })
})
