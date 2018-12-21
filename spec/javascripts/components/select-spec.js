describe('Track select change', function () {

  var GOVUK = window.GOVUK || {};
  var tracker;
  var $element;

  GOVUK.analytics = {
    trackEvent: function () {}
  };

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent');

    $element = $(
      '<select id="taxon-list" name="taxon-list" data-module="track-select-change"' +
        '<option value="">All topics</option>' +
        '<option data-track-category="filterClicked" data-track-action="taxon-list" data-track-label="Social care" value="7d67047c-bf22-4c34-b566-b46d6973f961">Social care</option>' +
        '<option data-track-label="Social care" value="no-data-attributes">No data attributes</option>' +
      '</select>'
    );

    tracker = new GOVUK.Modules.TrackSelectChange();
    tracker.start($element);
  });

  afterEach(function () {
    GOVUK.analytics.trackEvent.calls.reset();
  });

  it('tracks when the selected value is changed', function () {
    $element.val("7d67047c-bf22-4c34-b566-b46d6973f961").change();

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'filterClicked', 'taxon-list', { transport: 'beacon', label: "Social care" }
    )
  });

  it('does not fire an event if track category and track action are not present', function() {
    $element.val("no-data-attributes").change();

    expect(GOVUK.analytics.trackEvent.calls.count()).toEqual(0)
  });
})
