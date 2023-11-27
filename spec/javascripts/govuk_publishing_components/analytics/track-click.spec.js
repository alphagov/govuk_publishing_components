/* eslint-env jasmine, jquery */

describe('A click tracker', function () {
  var GOVUK = window.GOVUK
  var element

  function initModule (element, click) {
    /* eslint-disable no-new */
    new GOVUK.Modules.GemTrackClick(element)
    if (click) {
      GOVUK.triggerEvent(element, 'click')
    }
  }

  function resetGaCalls () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  }

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    resetGaCalls()
    element.remove()
  })

  it('tracks click events using "beacon" as transport', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="category" data-track-action="action" data-track-label="Foo">Bar</div>'
    )

    initModule(element[0], true)
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', { label: 'Foo', transport: 'beacon' })
  })

  it('tracks clicks with custom dimensions', function () {
    element = $(
      '<a data-module="gem-track-click" data-track-category="category" data-track-action="1" data-track-label="/" data-track-dimension="dimension-value" data-track-dimension-index="29" href="#">Home</a>'
    )

    initModule(element[0], true)
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

    initModule(element[0], true)
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', { label: 'Foo', transport: 'beacon' })
  })

  it('does not set dimension if dimension index is not present', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="category" data-track-action="action" data-track-label="Foo" data-track-dimension="Home">Bar!</div>'
    )

    initModule(element[0], true)
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('category', 'action', { label: 'Foo', transport: 'beacon' })
  })

  it('tracks clicks with values', function () {
    element = $(
      '<a data-module="gem-track-click" data-track-category="category" data-track-action="1" data-track-label="/" data-track-value="9" href="#">Home</a>'
    )

    initModule(element[0], true)
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

    initModule(element[0], true)
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

    initModule(element[0], false)

    element.find('.nothing')[0].click()
    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
    resetGaCalls()

    element.find('a.first')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', { label: 'label1', transport: 'beacon' })
    resetGaCalls()

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

    initModule(element[0], false)

    element.find('a.first')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', { label: '#link1', transport: 'beacon' })
    resetGaCalls()

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
        '<a class="third" href="#link3" ' +
          'data-track-category="cat3"' +
          'data-track-action="action3"' +
          'data-track-label="label3">' +
          '<span class="third-link-child">Link 2</span>' +
        '</a>' +
        '<span class="nothing"></span>' +
      '</div>'
    )

    initModule(element[0], false)

    element.find('.nothing')[0].click()
    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
    resetGaCalls()

    element.find('a.first')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', { label: '#link1', transport: 'beacon' })
    resetGaCalls()

    element.find('a.second')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat2', 'action2', { label: 'label2', transport: 'beacon' })
    resetGaCalls()

    element.find('a.third .third-link-child')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat3', 'action3', { label: 'label3', transport: 'beacon' })
  })

  it('tracks only clicks on links within a given element when configured', function () {
    element = $(
      '<div data-module="gem-track-click" data-track-category="cat1" data-track-action="action1" data-track-links-only data-limit-to-element-class="testBox">' +
        '<div class="testBox">' +
          '<a class="first" href="#link1">Link 1</a>' +
          '<a class="second" href="#link2" ' +
            'data-track-category="cat2"' +
            'data-track-action="action2"' +
            'data-track-label="label2">' +
            'Link 2' +
          '</a>' +
        '</div>' +
        '<a class="third" href="#link3">Link 3</a>' +
        '<span class="nothing"></span>' +
      '</div>'
    )

    initModule(element[0], false)

    element.find('.nothing')[0].click()
    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
    resetGaCalls()

    element.find('a.third')[0].click()
    expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
    resetGaCalls()

    element.find('a.first')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('cat1', 'action1', { label: '#link1', transport: 'beacon' })
    resetGaCalls()

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

    initModule(element[0], false)

    element.find('.child-of-link')[0].click()
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('parent-category', 'parent-action', { label: 'parent-label', transport: 'beacon' })
  })
})
