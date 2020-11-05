/* global describe it expect beforeEach afterEach spyOn */

var $ = window.jQuery

describe('An auto event tracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var tracker,
    element

  beforeEach(function () {
    tracker = new GOVUK.Modules.AutoTrackEvent()
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  it('tracks non-interactive events on start', function () {
    element = $(
      '<div ' +
        'data-track-category="category"' +
        'data-track-action="action">' +
        'Some content' +
      '</div>'
    )

    tracker.start(element)
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category', 'action', { nonInteraction: 1 })
  })

  it('can track non-interactive events with optional label and value', function () {
    element = $(
      '<div ' +
        'data-track-category="category"' +
        'data-track-action="action"' +
        'data-track-label="label"' +
        'data-track-value="10">' +
        'Some content' +
      '</div>'
    )

    tracker.start(element)
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category', 'action', { label: 'label', value: 10, nonInteraction: 1 })
  })
})
