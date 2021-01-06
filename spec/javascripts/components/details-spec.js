/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('Details component', function () {
  var FIXTURE

  var callback = jasmine.createSpy()
  GOVUK.Modules.TrackClick = function () {
    this.start = function () {
      callback()
    }
  }

  function loadDetailsComponent () {
    var details = new GOVUK.Modules.GovukDetails()
    details.start($('.gem-c-details'))
  }

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent')

    FIXTURE =
      '<details class="gem-c-details govuk-details govuk-!-margin-bottom-3" data-track-category="track-category" data-track-action="track-action" data-track-label="track-label" data-module="govuk-details">' +
        '<summary class="govuk-details__summary" data-details-track-click="">' +
        '<span>Toggle text</span>' +
        '</summary>' +
      '</details>'

    window.setFixtures(FIXTURE)
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  it('uses built in tracking module when provided with a track-label', function () {
    loadDetailsComponent()

    $('.govuk-details__summary').click()

    expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(0)
    expect(callback).toHaveBeenCalled()
  })

  it('does not fire an event if track category and track action are not present', function () {
    $('.gem-c-details').attr('data-track-action', null)
    $('.gem-c-details').attr('data-track-category', null)
    $('.gem-c-details').attr('data-track-label', null)

    loadDetailsComponent()

    $('.govuk-details__summary').click()

    expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(0)
  })

  it('tracks open state by default if no track label provided', function () {
    $('.gem-c-details').attr('data-track-label', null)
    loadDetailsComponent()

    $('.govuk-details__summary').click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('track-category', 'track-action', { label: 'open' })
  })

  it('tracks closed state by default if no track label provided', function () {
    $('.gem-c-details').attr('data-track-label', null)
    $('.gem-c-details').attr('open', true)
    loadDetailsComponent()

    $('.govuk-details__summary').click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('track-category', 'track-action', { label: 'closed' })
  })

  it('allows custom track options', function () {
    $('.gem-c-details').attr('data-track-action', 'track-action')
    $('.gem-c-details').attr('data-track-category', 'track-category')
    $('.gem-c-details').attr('data-track-options', '{"value":"track-value"}')
    $('.gem-c-details').attr('data-track-label', null)

    loadDetailsComponent()

    $('.govuk-details__summary').click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('track-category', 'track-action', { label: 'open', value: 'track-value' })
  })
})
