describe('A click tracker', function() {
  "use strict";

  var GOVUK = window.GOVUK
  var tracker,
      element;

  beforeEach(function() {
    tracker = new GOVUK.Modules.TrackClick();
  });

  it('tracks click events using "beacon" as transport', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="Foo">\
        Bar!\
      </div>\
    ');

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo', transport: 'beacon'});
  });

  it('tracks clicks with custom dimensions', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="category" \
          data-track-action="1" \
          data-track-label="/" \
          data-track-dimension="dimension-value" \
          data-track-dimension-index="29" \
          href="/">Home</a>'
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category',
      '1',
      { label: '/', dimension29: 'dimension-value', transport: 'beacon' }
    );
  });

  it('does not set dimension if dimension is not present', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="Foo"\
        data-track-dimension-index="29">\
        Bar!\
      </div>\
    ');

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo', transport: 'beacon'});
  });

  it('does not set dimension if dimension index is not present', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div \
        data-track-category="category"\
        data-track-action="action"\
        data-track-label="Foo"\
        data-track-dimension="Home">\
        Bar!\
      </div>\
    ');

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', {label: 'Foo', transport: 'beacon'});
  });

  it('tracks clicks with values', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      '<a data-track-category="category" \
          data-track-action="1" \
          data-track-label="/" \
          data-track-value="9" \
          href="/">Home</a>'
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category',
      '1',
      { label: '/', value: '9', transport: 'beacon' }
    );
  });

  it('tracks clicks with arbitrary JSON', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $(
      "<a data-track-category='category' \
          data-track-action='1' \
          data-track-label='/' \
          data-track-options='{\"dimension28\": \"foo\", \"dimension29\": \"bar\"}' \
          href='/'>Home</a>"
    );

    tracker.start(element);

    element.trigger('click');

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category',
      '1',
      { label: '/', dimension28: 'foo', dimension29: 'bar', transport: 'beacon' }
    );
  });

  it('tracks all trackable links within a container', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div>\
        <a class="first" href="#" \
          data-track-category="cat1"\
          data-track-action="action1"\
          data-track-label="label1">\
          Link 1\
        </a>\
        <a class="second" href="#" \
          data-track-category="cat2"\
          data-track-action="action2"\
          data-track-label="label2">\
          Link 2\
        </a>\
        <span class="nothing"></span>\
      </div>\
    ');

    tracker.start(element);

    element.find('.nothing').trigger('click');
    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled();

    element.find('a.first').trigger('click');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', {label: 'label1', transport: 'beacon'});

    element.find('a.second').trigger('click');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat2', 'action2', {label: 'label2', transport: 'beacon'});
  });

  it('tracks a click correctly when event target is a child element of trackable element', function() {
    GOVUK.analytics = { trackEvent: function () {} }
    spyOn(GOVUK.analytics, 'trackEvent');

    element = $('\
      <div>\
        <a class="first" href="#" \
          data-track-category="parent-category"\
          data-track-action="parent-action"\
          data-track-label="parent-label">\
          <b><span class="child-of-link">I am a child</span></b>\
        </a>\
      </div>\
    ');

    tracker.start(element);

    element.find('.child-of-link').trigger('click');
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('parent-category', 'parent-action', {label: 'parent-label', transport: 'beacon'});
  });
});
