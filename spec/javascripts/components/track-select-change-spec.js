/* eslint-env jasmine, jquery */
/* global GOVUK, Event */

describe('Track select change', function () {
  var tracker
  var $element

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  describe('by default', function () {
    beforeEach(function () {
      spyOn(GOVUK.analytics, 'trackEvent')

      $element = $(
        '<select id="taxon-list" name="taxon-list" data-module="track-select-change">' +
          '<option value="">All topics</option>' +
          '<option data-track-category="filterClicked" data-track-action="taxon-list" data-track-label="Social care" value="7d67047c-bf22-4c34-b566-b46d6973f961">Social care</option>' +
          '<option data-track-label="Social care" value="no-data-attributes">No data attributes</option>' +
        '</select>'
      )

      tracker = new GOVUK.Modules.TrackSelectChange($element[0])
      tracker.init()
    })

    it('tracks when the selected value is changed', function () {
      $element.val('7d67047c-bf22-4c34-b566-b46d6973f961')
      var jsSelect = $element[0]
      var event = new Event('change')
      jsSelect.dispatchEvent(event)

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'filterClicked', 'taxon-list', { transport: 'beacon', label: 'Social care' }
      )
    })

    it('does not fire an event if track category and track action are not present', function () {
      $element.val('no-data-attributes')
      var jsSelect = $element[0]
      var event = new Event('change')
      jsSelect.dispatchEvent(event)

      expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(0)
    })
  })

  describe('with options', function () {
    beforeEach(function () {
      spyOn(GOVUK.analytics, 'trackEvent')

      $element = $(
        '<select id="taxon-list" name="taxon-list" data-module="track-select-change">' +
          '<option value="">All topics</option>' +
          '<option data-track-category="filterClicked" data-track-action="taxon-list" data-track-label="Social care" value="7d67047c-bf22-4c34-b566-b46d6973f961" data-track-options=\'{"dimension28": "2x1 plates","dimension29": "1x1 tiles"}\'>Social care</option>' +
          '<option data-track-label="Social care" value="no-data-attributes">No data attributes</option>' +
        '</select>'
      )

      tracker = new GOVUK.Modules.TrackSelectChange($element[0])
      tracker.init()
    })

    it('includes extra options when present on the select', function () {
      $element.val('7d67047c-bf22-4c34-b566-b46d6973f961')
      var jsSelect = $element[0]
      var event = new Event('change')
      jsSelect.dispatchEvent(event)

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'filterClicked', 'taxon-list', { transport: 'beacon', label: 'Social care', dimension28: '2x1 plates', dimension29: '1x1 tiles' }
      )
    })
  })
})
