/* eslint-env jasmine, jquery */
var GOVUK = window.GOVUK || {}

describe('GOVUK.AutoScrollTracker', function () {
  var scrollTracker, scrollTracker2

  beforeEach(function () {
    window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
    jasmine.clock().install()
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    stopComponent(scrollTracker)
    if (scrollTracker2) {
      stopComponent(scrollTracker2)
    }
    jasmine.clock().uninstall()

    window.GOVUK.deleteCookie('cookies_policy')
    window.GOVUK.analyticsVars.scrollTrackerStarted = false

    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  // remove all the event listeners, otherwise conflicts occur
  function stopComponent (tracker) {
    window.removeEventListener('scroll', tracker.scrollEvent)
    window.removeEventListener('resize', tracker.resizeEvent)
    clearInterval(tracker.interval)
  }

  it('should only initialise once on a page', function () {
    spyOn(GOVUK.Modules.AutoScrollTracker.prototype, 'getWindowDetails')

    var el = document.createElement('div')
    scrollTracker = new GOVUK.Modules.AutoScrollTracker(el)

    var el2 = document.createElement('div')
    scrollTracker2 = new GOVUK.Modules.AutoScrollTracker(el2)

    expect(GOVUK.Modules.AutoScrollTracker.prototype.getWindowDetails).toHaveBeenCalledTimes(1)
  })

  describe('with invalid configuration', function () {
    beforeEach(function () {
      var el = document.createElement('div')
      var data = 'invalid-json'
      el.setAttribute('data-track-headings', data)
      scrollTracker = new GOVUK.Modules.AutoScrollTracker(el)
    })

    it('does not start scroll tracking', function () {
      expect(window.GOVUK.analyticsVars.scrollTrackerStarted).toEqual(false)
    })
  })

  describe('tracking specific headings', function () {
    var el

    beforeEach(function () {
      var headings = '<main><h1>First heading</h1><h2>Second heading</h2><h2>Third heading</h2></main>'
      el = document.createElement('div')
      el.innerHTML = headings
      document.body.appendChild(el)
      var data = '["First heading", "Third heading"]'
      el.setAttribute('data-track-headings', data)
      el.setAttribute('data-track-type', 'headings')
      scrollTracker = new GOVUK.Modules.AutoScrollTracker(el)
    })

    afterEach(function () {
      document.body.removeChild(el)
    })

    it('only tracks those headings', function () {
      expect(scrollTracker.trackedNodes.length).toEqual(2)
      expect(scrollTracker.trackedNodes[0].eventData.label).toEqual('First heading')
      expect(scrollTracker.trackedNodes[1].eventData.label).toEqual('Third heading')
    })
  })

  describe('when tracking headings', function () {
    var el

    beforeEach(function () {
      var extremeHeight = window.innerHeight + 1000
      var FIXTURE =
        '<main style="position: absolute; top: 0px;">' +
          '<h1>Heading 1</h1>' +
          '<div style="height:' + extremeHeight + 'px">' +
            '<h2 style="display: none;">Heading 2</h2>' +
            '<h3 style="margin-top: ' + extremeHeight + 'px;">Heading 3</h3>' +
          '</div>' +
        '</main>' +
        '<div>' +
          '<h4 style="display: none;">Never track</h4>' +
        '</div>'
      el = document.createElement('div')
      el.setAttribute('data-track-type', 'headings')
      el.innerHTML = FIXTURE
      document.body.appendChild(el)
      scrollTracker = new GOVUK.Modules.AutoScrollTracker(el)
    })

    afterEach(function () {
      document.body.removeChild(el)
    })

    it('should send a tracking event on initialisation for headings that are already visible', function () {
      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Heading', { label: 'Heading 1', nonInteraction: true }])
    })

    it('should not track a heading more than once', function () {
      GOVUK.analytics.trackEvent.calls.reset()
      GOVUK.triggerEvent(document.body, 'scroll')
      jasmine.clock().tick(200)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(0)
    })

    it('should track headings on scroll and ignore already tracked headings', function () {
      GOVUK.analytics.trackEvent.calls.reset()

      el.querySelector('h3').style.marginTop = '0px'
      GOVUK.triggerEvent(document.body, 'resize')
      GOVUK.triggerEvent(document.body, 'scroll')
      jasmine.clock().tick(200)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Heading', { label: 'Heading 3', nonInteraction: true }])
    })

    it('should track newly visible headings on scroll and ignore already tracked headings', function () {
      GOVUK.analytics.trackEvent.calls.reset()

      el.querySelector('h2').style.display = 'block'
      // call resize to trigger the tracker to re-assess the headings
      GOVUK.triggerEvent(document.body, 'resize')
      jasmine.clock().tick(200)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Heading', { label: 'Heading 2', nonInteraction: true }])
    })

    it('should track when the body height changes', function () {
      GOVUK.analytics.trackEvent.calls.reset()
      var pageHeight = document.querySelector('body').clientHeight
      el.querySelector('h3').style.marginTop = '0px'
      document.querySelector('body').style.height = (pageHeight + 1) + 'px'
      jasmine.clock().tick(600)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Heading', { label: 'Heading 3', nonInteraction: true }])

      document.querySelector('body').removeAttribute('style')
    })

    it('should not track headings wrapped in ignored elements', function () {
      GOVUK.analytics.trackEvent.calls.reset()
      el.querySelector('h4').style.display = 'block'
      GOVUK.triggerEvent(document.body, 'resize')
      jasmine.clock().tick(200)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(0)
    })
  })

  describe('when tracking by percentage scrolled', function () {
    var el

    beforeEach(function () {
      // set the page height so that no track events get fired initially
      var height = window.innerHeight * 6
      setPageHeight(height)
      el = document.createElement('div')
      document.body.appendChild(el)
      scrollTracker = new GOVUK.Modules.AutoScrollTracker(el)
    })

    afterEach(function () {
      document.body.removeChild(el)
      resetPageHeight()
    })

    it('should send a tracking event on page load for positions that are already visible', function () {
      setPageHeight(10)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(5)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Percent', { label: '20', nonInteraction: true }])
      expect(GOVUK.analytics.trackEvent.calls.argsFor(1)).toEqual(['ScrollTo', 'Percent', { label: '40', nonInteraction: true }])
      expect(GOVUK.analytics.trackEvent.calls.argsFor(2)).toEqual(['ScrollTo', 'Percent', { label: '60', nonInteraction: true }])
      expect(GOVUK.analytics.trackEvent.calls.argsFor(3)).toEqual(['ScrollTo', 'Percent', { label: '80', nonInteraction: true }])
      expect(GOVUK.analytics.trackEvent.calls.argsFor(4)).toEqual(['ScrollTo', 'Percent', { label: '100', nonInteraction: true }])
    })

    it('should track new positions on scroll and ignore already tracked positions', function () {
      var height = window.innerHeight
      setPageHeight(height * 4)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Percent', { label: '20', nonInteraction: true }])

      GOVUK.analytics.trackEvent.calls.reset()
      setPageHeight(10)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(4)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Percent', { label: '40', nonInteraction: true }])
      expect(GOVUK.analytics.trackEvent.calls.argsFor(1)).toEqual(['ScrollTo', 'Percent', { label: '60', nonInteraction: true }])
      expect(GOVUK.analytics.trackEvent.calls.argsFor(2)).toEqual(['ScrollTo', 'Percent', { label: '80', nonInteraction: true }])
      expect(GOVUK.analytics.trackEvent.calls.argsFor(3)).toEqual(['ScrollTo', 'Percent', { label: '100', nonInteraction: true }])
    })

    function setPageHeight (height) {
      var html = document.documentElement
      html.style.overflow = 'auto'
      var body = document.querySelector('body')
      body.style.height = height + 'px'
      body.style.overflow = 'hidden'
      jasmine.clock().tick(600)
    }

    function resetPageHeight () {
      var html = document.documentElement
      html.removeAttribute('style')
      var body = document.querySelector('body')
      body.removeAttribute('style')
    }
  })

  describe('when the URL includes a hash', function () {
    var el

    beforeEach(function () {
      var h2pos = window.innerHeight + 1000
      var FIXTURE =
        '<main style="position: absolute; top: 0px;">' +
          '<h1>Heading 1</h1>' +
          '<h2 style="margin-top: ' + h2pos + 'px;" id="testId">Heading 2</h3>' +
        '</main>'
      el = document.createElement('div')
      el.setAttribute('data-track-type', 'headings')
      el.innerHTML = FIXTURE
      document.body.appendChild(el)
    })

    afterEach(function () {
      document.body.removeChild(el)
      window.location.hash = ''
    })

    it('does not track headings on initial page load', function () {
      window.location.hash = 'testId'
      scrollTracker = new GOVUK.Modules.AutoScrollTracker(el)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(0)
    })

    it('does track headings on initial page load if there is a hash but it does not match an ID on the page', function () {
      window.location.hash = 'notAThing'
      scrollTracker = new GOVUK.Modules.AutoScrollTracker(el)

      expect(GOVUK.analytics.trackEvent.calls.count()).toBe(1)
      expect(GOVUK.analytics.trackEvent.calls.argsFor(0)).toEqual(['ScrollTo', 'Heading', { label: 'Heading 1', nonInteraction: true }])
    })
  })
})
