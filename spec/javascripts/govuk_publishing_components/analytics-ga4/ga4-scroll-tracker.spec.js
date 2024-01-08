/* eslint-env jasmine, jquery */
var GOVUK = window.GOVUK || {}

describe('GA4 scroll tracker', function () {
  var scrollTracker, scrollTracker2, expected

  beforeEach(function () {
    window.dataLayer = []
    window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
    jasmine.clock().install()

    expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
    expected.event = 'event_data'
    expected.event_data.action = 'scroll'
    expected.event_data.event_name = 'scroll'
    expected.govuk_gem_version = 'gem-version'
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('gem-version')
  })

  afterEach(function () {
    window.dataLayer = []
    stopComponent(scrollTracker)
    if (scrollTracker2) {
      stopComponent(scrollTracker2)
    }
    jasmine.clock().uninstall()

    window.GOVUK.deleteCookie('cookies_policy')
    window.GOVUK.analyticsGa4.vars.scrollTrackerStarted = false
  })

  // remove all the event listeners, otherwise conflicts occur
  function stopComponent (tracker) {
    window.removeEventListener('scroll', tracker.scrollEvent)
    window.removeEventListener('resize', tracker.resizeEvent)
    window.removeEventListener('dynamic-page-update', tracker.resetEvent)
    clearInterval(tracker.interval)
  }

  it('should only initialise once on a page', function () {
    var el = document.createElement('div')
    scrollTracker = new GOVUK.Modules.Ga4ScrollTracker(el)
    spyOn(scrollTracker, 'getWindowDetails')
    scrollTracker.init()

    var el2 = document.createElement('div')
    scrollTracker2 = new GOVUK.Modules.Ga4ScrollTracker(el2)
    spyOn(scrollTracker2, 'getWindowDetails')
    scrollTracker2.init()

    expect(scrollTracker.getWindowDetails).toHaveBeenCalled()
    expect(scrollTracker2.getWindowDetails).not.toHaveBeenCalled()
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
      el.setAttribute('data-ga4-track-type', 'headings')
      el.innerHTML = FIXTURE
      document.body.appendChild(el)
      scrollTracker = new GOVUK.Modules.Ga4ScrollTracker(el)
      scrollTracker.init()
      expected.event_data.type = 'heading'
      expected.event_data.index.index_section_count = '3'
    })

    afterEach(function () {
      document.body.removeChild(el)
    })

    it('should send a tracking event on initialisation for headings that are already visible', function () {
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('should not track a heading more than once', function () {
      GOVUK.triggerEvent(document.body, 'scroll')
      jasmine.clock().tick(200)
      expect(window.dataLayer.length).toEqual(1)
    })

    it('should track headings on scroll and ignore already tracked headings', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      el.querySelector('h3').style.marginTop = '0px'
      GOVUK.triggerEvent(document.body, 'resize')
      GOVUK.triggerEvent(document.body, 'scroll')
      jasmine.clock().tick(200)

      expect(window.dataLayer.length).toEqual(2)
      expected.event_data.text = 'Heading 3'
      expected.event_data.section = 'Heading 3'
      expected.event_data.index.index_section = '3'
      expect(window.dataLayer[1]).toEqual(expected)
    })

    it('should track newly visible headings on scroll and ignore already tracked headings', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      el.querySelector('h2').style.display = 'block'
      // call resize to trigger the tracker to re-assess the headings
      GOVUK.triggerEvent(document.body, 'resize')
      jasmine.clock().tick(200)

      expected.event_data.text = 'Heading 2'
      expected.event_data.section = 'Heading 2'
      expected.event_data.index.index_section = '2'
      expect(window.dataLayer[1]).toEqual(expected)
      expect(window.dataLayer.length).toEqual(2)
    })

    it('should track when the body height changes', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      var pageHeight = document.querySelector('body').clientHeight
      el.querySelector('h3').style.marginTop = '0px'
      document.querySelector('body').style.height = (pageHeight + 1) + 'px'
      jasmine.clock().tick(600)

      expect(window.dataLayer.length).toEqual(2)
      expected.event_data.text = 'Heading 3'
      expected.event_data.section = 'Heading 3'
      expected.event_data.index.index_section = '3'
      expect(window.dataLayer[1]).toEqual(expected)

      document.querySelector('body').removeAttribute('style')
    })

    it('should not track headings wrapped in ignored elements', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      el.querySelector('h4').style.display = 'block'
      GOVUK.triggerEvent(document.body, 'resize')
      jasmine.clock().tick(200)

      expect(window.dataLayer.length).toEqual(1)
    })

    it('should reset alreadyFound nodes when a dynamic page update event occurs', function () {
      expect(scrollTracker.trackedNodes[0].alreadySeen).toEqual(true)
      GOVUK.triggerEvent(document.body, 'dynamic-page-update')
      for (var i = 0; i < scrollTracker.trackedNodes.length; i++) {
        expect(scrollTracker.trackedNodes[i].alreadySeen).toEqual(false)
      }
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
      scrollTracker = new GOVUK.Modules.Ga4ScrollTracker(el)
      scrollTracker.init()
      expected.event_data.type = 'percent'
    })

    afterEach(function () {
      document.body.removeChild(el)
      resetPageHeight()
    })

    it('should send a tracking event on page load for positions that are already visible', function () {
      setPageHeight(10)

      expect(window.dataLayer.length).toEqual(5)

      expected.event_data.percent_scrolled = '20'
      expect(window.dataLayer[0]).toEqual(expected)
      expected.event_data.percent_scrolled = '40'
      expect(window.dataLayer[1]).toEqual(expected)
      expected.event_data.percent_scrolled = '60'
      expect(window.dataLayer[2]).toEqual(expected)
      expected.event_data.percent_scrolled = '80'
      expect(window.dataLayer[3]).toEqual(expected)
      expected.event_data.percent_scrolled = '100'
      expect(window.dataLayer[4]).toEqual(expected)
    })

    it('should track new positions on scroll and ignore already tracked positions', function () {
      var height = window.innerHeight
      setPageHeight(height * 4)

      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.percent_scrolled = '20'
      expect(window.dataLayer[0]).toEqual(expected)

      setPageHeight(10)

      expect(window.dataLayer.length).toEqual(5)
      expected.event_data.percent_scrolled = '40'
      expect(window.dataLayer[1]).toEqual(expected)
      expected.event_data.percent_scrolled = '60'
      expect(window.dataLayer[2]).toEqual(expected)
      expected.event_data.percent_scrolled = '80'
      expect(window.dataLayer[3]).toEqual(expected)
      expected.event_data.percent_scrolled = '100'
      expect(window.dataLayer[4]).toEqual(expected)
    })

    it('should reset alreadyFound nodes when a dynamic page update event occurs', function () {
      // change the page height to begin with to set some nodes to alreadySeen true
      setPageHeight(10)
      var height = window.innerHeight
      setPageHeight(height * 4)
      expect(scrollTracker.trackedNodes[0].alreadySeen).toEqual(true)
      GOVUK.triggerEvent(document.body, 'dynamic-page-update')
      for (var i = 0; i < scrollTracker.trackedNodes.length; i++) {
        expect(scrollTracker.trackedNodes[i].alreadySeen).toEqual(false)
      }
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

  describe('when tracking markers', function () {
    var el

    beforeEach(function () {
      var extremeHeight = window.innerHeight + 1000
      var FIXTURE =
        '<main style="position: absolute; top: 0px;">' +
          '<h1 data-ga4-scroll-marker>Heading 1</h1>' +
          '<div style="height:' + extremeHeight + 'px">' +
            '<h2 data-ga4-scroll-marker style="display: none;">Heading 2</h2>' +
            '<h3 data-ga4-scroll-marker style="margin-top: ' + extremeHeight + 'px;">Heading 3</h3>' +
          '</div>' +
        '</main>' +
        '<div>' +
          '<h4 data-ga4-scroll-marker style="display: none;">Never track</h4>' +
        '</div>'
      el = document.createElement('div')
      el.setAttribute('data-ga4-track-type', 'markers')
      el.innerHTML = FIXTURE
      document.body.appendChild(el)
      scrollTracker = new GOVUK.Modules.Ga4ScrollTracker(el)
      scrollTracker.init()
      expected.event_data.type = 'marker'
      expected.event_data.index.index_section_count = '3'
    })

    afterEach(function () {
      document.body.removeChild(el)
    })

    it('should send a tracking event on initialisation for headings that are already visible', function () {
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('should not track a heading more than once', function () {
      GOVUK.triggerEvent(document.body, 'scroll')
      jasmine.clock().tick(200)
      expect(window.dataLayer.length).toEqual(1)
    })

    it('should track headings on scroll and ignore already tracked headings', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      el.querySelector('h3').style.marginTop = '0px'
      GOVUK.triggerEvent(document.body, 'resize')
      GOVUK.triggerEvent(document.body, 'scroll')
      jasmine.clock().tick(200)

      expect(window.dataLayer.length).toEqual(2)
      expected.event_data.text = 'Heading 3'
      expected.event_data.section = 'Heading 3'
      expected.event_data.index.index_section = '3'
      expect(window.dataLayer[1]).toEqual(expected)
    })

    it('should track newly visible headings on scroll and ignore already tracked headings', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      el.querySelector('h2').style.display = 'block'
      // call resize to trigger the tracker to re-assess the headings
      GOVUK.triggerEvent(document.body, 'resize')
      jasmine.clock().tick(200)

      expected.event_data.text = 'Heading 2'
      expected.event_data.section = 'Heading 2'
      expected.event_data.index.index_section = '2'
      expect(window.dataLayer[1]).toEqual(expected)
      expect(window.dataLayer.length).toEqual(2)
    })

    it('should track when the body height changes', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      var pageHeight = document.querySelector('body').clientHeight
      el.querySelector('h3').style.marginTop = '0px'
      document.querySelector('body').style.height = (pageHeight + 1) + 'px'
      jasmine.clock().tick(600)

      expect(window.dataLayer.length).toEqual(2)
      expected.event_data.text = 'Heading 3'
      expected.event_data.section = 'Heading 3'
      expected.event_data.index.index_section = '3'
      expect(window.dataLayer[1]).toEqual(expected)

      document.querySelector('body').removeAttribute('style')
    })

    it('should not track headings wrapped in ignored elements', function () {
      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.index.index_section = '1'
      expect(window.dataLayer[0]).toEqual(expected)

      el.querySelector('h4').style.display = 'block'
      GOVUK.triggerEvent(document.body, 'resize')
      jasmine.clock().tick(200)

      expect(window.dataLayer.length).toEqual(1)
    })
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
      el.setAttribute('data-ga4-track-type', 'headings')
      el.innerHTML = FIXTURE
      document.body.appendChild(el)
    })

    afterEach(function () {
      document.body.removeChild(el)
      window.location.hash = ''
    })

    it('does not track headings on initial page load', function () {
      window.location.hash = 'testId'
      scrollTracker = new GOVUK.Modules.Ga4ScrollTracker(el)
      scrollTracker.init()

      expect(window.dataLayer.length).toEqual(0)
    })

    it('does track headings on initial page load if there is a hash but it does not match an ID on the page', function () {
      window.location.hash = 'notAThing'
      scrollTracker = new GOVUK.Modules.Ga4ScrollTracker(el)
      scrollTracker.init()

      expect(window.dataLayer.length).toEqual(1)
      expected.event_data.text = 'Heading 1'
      expected.event_data.section = 'Heading 1'
      expected.event_data.type = 'heading'
      expected.event_data.index.index_section = '1'
      expected.event_data.index.index_section_count = '2'
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })
})
