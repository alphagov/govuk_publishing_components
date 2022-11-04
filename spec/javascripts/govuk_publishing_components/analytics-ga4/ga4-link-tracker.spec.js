/* eslint-env jasmine */

describe('GA4 click tracker', function () {
  var GOVUK = window.GOVUK
  var element
  var expected
  var attributes

  function initModule (element, click) {
    new GOVUK.Modules.Ga4LinkTracker(element).init()
    if (click) {
      GOVUK.triggerEvent(element, 'click')
    }
  }

  function agreeToCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
  }

  function denyCookies () {
    GOVUK.setCookie('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}')
  }

  beforeAll(function () {
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
  })

  beforeEach(function () {
    window.dataLayer = []
    agreeToCookies()
  })

  afterEach(function () {
    window.dataLayer = []
  })

  describe('when the user has a cookie consent choice', function () {
    beforeEach(function () {
      element = document.createElement('a')
    })

    it('starts the module if consent has already been given', function () {
      agreeToCookies()
      document.body.appendChild(element)
      var tracker = new GOVUK.Modules.Ga4LinkTracker(element)
      spyOn(tracker, 'trackClick')
      tracker.init()

      element.click()
      expect(tracker.trackClick).toHaveBeenCalled()
    })

    it('starts the module on the same page as cookie consent is given', function () {
      denyCookies()
      document.body.appendChild(element)
      var tracker = new GOVUK.Modules.Ga4LinkTracker(element)
      spyOn(tracker, 'trackClick')
      tracker.init()

      element.click()
      expect(tracker.trackClick).not.toHaveBeenCalled()

      // page has not been reloaded, user consents to cookies
      window.GOVUK.triggerEvent(window, 'cookie-consent')

      element.click()
      expect(tracker.trackClick).toHaveBeenCalled()
    })

    it('does not do anything if consent is not given', function () {
      denyCookies()
      document.body.appendChild(element)
      var tracker = new GOVUK.Modules.Ga4LinkTracker(element)
      spyOn(tracker, 'trackClick')
      tracker.init()

      element.click()
      expect(tracker.trackClick).not.toHaveBeenCalled()
    })
  })

  describe('basic tracking', function () {
    beforeEach(function () {
      attributes = {
        event_name: 'navigation',
        type: 'a link'
      }
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'a link'
      expected.govuk_gem_version = 'aVersion'
    })

    it('does not track anything without a data-ga4 attribute', function () {
      element = document.createElement('a')
      var linkText = 'Should not track'
      element.textContent = linkText
      expected.event_data.text = linkText

      initModule(element, true)
      expect(window.dataLayer[0]).toEqual(undefined)
    })

    it('tracks clicks on a single link', function () {
      var link = '#aNormalLink'
      element = document.createElement('a')
      element.setAttribute('data-ga4', JSON.stringify(attributes))
      element.setAttribute('href', link)
      var linkText = 'A normal link'
      element.textContent = linkText
      expected.event_data.text = linkText
      expected.event_data.url = link

      initModule(element, true)
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('tracks all links with data-ga4 attributes within a container', function () {
      element = document.createElement('div')
      element.innerHTML =
        '<a class="first" href="#link1">Link 1</a>' +
        '<a href="#link2" class="secondWrapper"><span class="second">Link 2</span></a>' +
        '<a href="#link3"><span class="third">Link 3</span></a>' +
        '<span class="nothing"></span>'

      element.querySelector('.first').setAttribute('data-ga4', JSON.stringify(attributes))
      element.querySelector('.secondWrapper').setAttribute('data-ga4', JSON.stringify(attributes))
      initModule(element, false)

      expected.event_data.text = 'Link 1'
      expected.event_data.url = '#link1'
      element.querySelector('.first').click()
      expect(window.dataLayer[0]).toEqual(expected)

      expected.event_data.text = 'Link 2'
      expected.event_data.url = '#link2'
      element.querySelector('.second').click()
      expect(window.dataLayer[1]).toEqual(expected)

      element.querySelector('.third').click()
      expect(window.dataLayer[2]).toEqual(undefined)

      element.querySelector('.nothing').click()
      expect(window.dataLayer[2]).toEqual(undefined)
    })
  })

  describe('when the track links only feature is enabled', function () {
    beforeEach(function () {
      attributes = {
        event_name: 'navigation',
        type: 'a link'
      }
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'a link'
      expected.govuk_gem_version = 'aVersion'
    })

    it('tracks only links within a container', function () {
      element = document.createElement('div')
      element.innerHTML =
        '<a class="first" href="#link1">Link 1</a>' +
        '<a class="second" href="#link2">Link 2</a>' +
        '<a href="#link3"><span class="third">Link 3</span></a>' +
        '<span class="nothing"></span>'

      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4', JSON.stringify(attributes))
      initModule(element, false)

      expected.event_data.text = 'Link 1'
      expected.event_data.url = '#link1'
      element.querySelector('.first').click()
      expect(window.dataLayer[0]).toEqual(expected)

      expected.event_data.text = 'Link 2'
      expected.event_data.url = '#link2'
      element.querySelector('.second').click()
      expect(window.dataLayer[1]).toEqual(expected)

      expected.event_data.text = 'Link 3'
      expected.event_data.url = '#link3'
      element.querySelector('.third').click()
      expect(window.dataLayer[2]).toEqual(expected)

      element.querySelector('.nothing').click()
      expect(window.dataLayer[3]).toEqual(undefined)
    })
  })

  describe('when the limit to element class feature is enabled', function () {
    beforeEach(function () {
      attributes = {
        event_name: 'navigation',
        type: 'a link'
      }
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'a link'
      expected.govuk_gem_version = 'aVersion'
    })

    it('tracks only links within the given class', function () {
      element = document.createElement('div')
      element.innerHTML =
        '<a class="first" href="#link1">Link 1</a>' +
        '<div class="trackme">' +
          '<a class="second" href="#link2">Link 2</a>' +
          '<a href="#link3"><span class="third">Link 3</span></a>' +
          '<span class="nothing"></span>' +
        '</div>'

      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-limit-to-element-class', 'trackme')
      element.setAttribute('data-ga4', JSON.stringify(attributes))
      initModule(element, false)

      expected.event_data.text = 'Link 1'
      expected.event_data.url = '#link1'
      element.querySelector('.first').click()
      expect(window.dataLayer[0]).toEqual(undefined)

      expected.event_data.text = 'Link 2'
      expected.event_data.url = '#link2'
      element.querySelector('.second').click()
      expect(window.dataLayer[0]).toEqual(expected)

      expected.event_data.text = 'Link 3'
      expected.event_data.url = '#link3'
      element.querySelector('.third').click()
      expect(window.dataLayer[1]).toEqual(expected)

      element.querySelector('.nothing').click()
      expect(window.dataLayer[2]).toEqual(undefined)
    })
  })
})
