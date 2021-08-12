/* eslint-env jasmine, jquery */

describe('A click tracker', function () {
  var GOVUK = window.GOVUK
  var element

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
    element.remove()
  })

  it('tracks click events using "beacon" as transport', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="category" data-track-action="action" data-track-label="Foo">Bar</div>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)
    element[0].click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', { label: 'Foo', transport: 'beacon' })
  })

  it('tracks clicks with custom dimensions', function () {
    element = $(
      '<a data-module="gem-track-click" data-track-category="category" data-track-action="1" data-track-label="/" data-track-dimension="dimension-value" data-track-dimension-index="29" href="#">Home</a>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)
    element[0].click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category',
      '1',
      { label: '/', dimension29: 'dimension-value', transport: 'beacon' }
    )
  })

  it('does not set dimension if dimension is not present', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="category" data-track-action="action" data-track-label="Foo" data-track-dimension-index="29">Bar</div>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)
    element[0].click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', { label: 'Foo', transport: 'beacon' })
  })

  it('does not set dimension if dimension index is not present', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="category" data-track-action="action" data-track-label="Foo" data-track-dimension="Home">Bar!</div>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)
    element[0].click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', { label: 'Foo', transport: 'beacon' })
  })

  it('tracks clicks with values', function () {
    element = $(
      '<a data-module="gem-track-click" data-track-category="category" data-track-action="1" data-track-label="/" data-track-value="9" href="#">Home</a>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)
    element[0].click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category',
      '1',
      { label: '/', value: '9', transport: 'beacon' }
    )
  })

  it('tracks clicks with arbitrary JSON', function () {
    element = $(
      "<a data-module='gem-track-click' data-track-category='category' data-track-action='1' data-track-label='/' data-track-options='{\"dimension28\": \"foo\", \"dimension29\": \"bar\"}' href='#'>Home</a>"
    )

    new GOVUK.Modules.GemTrackClick().start(element)
    element[0].click()

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'category',
      '1',
      { label: '/', dimension28: 'foo', dimension29: 'bar', transport: 'beacon' }
    )
  })

  it('tracks all trackable links within a container', function () {
    element = $(
      '<div data-module="gem-track-click">' +
        '<a class="first" href="#" ' +
          'data-track-category="cat1"' +
          'data-track-action="action1"' +
          'data-track-label="label1">' +
          'Link 1' +
        '</a>' +
        '<a class="second" href="#" ' +
          'data-track-category="cat2"' +
          'data-track-action="action2"' +
          'data-track-label="label2">' +
          'Link 2' +
        '</a>' +
        '<span class="nothing"></span>' +
      '</div>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)

    element.find('.nothing')[0].click()
    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()

    element.find('a.first')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', { label: 'label1', transport: 'beacon' })

    element.find('a.second')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat2', 'action2', { label: 'label2', transport: 'beacon' })
  })

  it('tracks all links in a trackable container and uses the link URL as the label if no label is specified', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="cat1" data-track-action="action1">' +
        '<a class="first" href="#link1">Link 1</a>' +
        '<a class="second" href="#link2" ' +
          'data-track-category="cat2"' +
          'data-track-action="action2"' +
          'data-track-label="label2">' +
          'Link 2' +
        '</a>' +
      '</div>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)

    element.find('a.first')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', { label: '#link1', transport: 'beacon' })

    element.find('a.second')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat2', 'action2', { label: 'label2', transport: 'beacon' })
  })

  it('tracks only clicks on links when configured', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="cat1" data-track-action="action1" data-track-links-only>' +
        '<a class="first" href="#link1">Link 1</a>' +
        '<a class="second" href="#link2" ' +
          'data-track-category="cat2"' +
          'data-track-action="action2"' +
          'data-track-label="label2">' +
          'Link 2' +
        '</a>' +
        '<span class="nothing"></span>' +
      '</div>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)

    element.find('.nothing')[0].click()
    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()

    element.find('a.first')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', { label: '#link1', transport: 'beacon' })

    element.find('a.second')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat2', 'action2', { label: 'label2', transport: 'beacon' })
  })

  it('tracks a click correctly when event target is a child element of trackable element', function () {
    element = $(
      '<div data-module="gem-track-click">' +
        '<a class="first" href="#" ' +
          'data-track-category="parent-category"' +
          'data-track-action="parent-action"' +
          'data-track-label="parent-label">' +
          '<b><span class="child-of-link">I am a child</span></b>' +
        '</a>' +
      '</div>'
    )

    new GOVUK.Modules.GemTrackClick().start(element)

    element.find('.child-of-link')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('parent-category', 'parent-action', { label: 'parent-label', transport: 'beacon' })
  })
})
