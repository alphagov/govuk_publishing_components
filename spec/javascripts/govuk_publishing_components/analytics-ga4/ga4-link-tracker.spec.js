/* eslint-env jasmine */

describe('GA4 link tracker', function () {
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
    spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getHostname').and.returnValue('www.gov.uk')
    spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'getProtocol').and.returnValue('https:')
  })

  afterAll(function () {
    window.history.replaceState(null, null, '#')
  })

  beforeEach(function () {
    window.dataLayer = []
    expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
    expected.event_data.event_name = 'navigation'
    expected.govuk_gem_version = 'aVersion'
    expected.event_data.link_domain = 'https://www.gov.uk'
    expected.event_data.link_path_parts = {
      1: undefined,
      2: undefined,
      3: undefined,
      4: undefined,
      5: undefined
    }
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
        type: 'a link',
        index: {
          index_link: 1
        }
      }
      expected.event = 'event_data'
      expected.event_data.type = 'a link'
      expected.event_data.method = 'primary click'
      expected.event_data.external = 'false'
      expected.event_data.index = {
        index_link: 1,
        index_section: undefined,
        index_section_count: undefined
      }
    })

    it('does not track anything without a data-ga4-link attribute', function () {
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
      element.setAttribute('data-ga4-link', JSON.stringify(attributes))
      element.setAttribute('href', link)
      var linkText = 'A normal link'
      element.textContent = linkText
      expected.event_data.text = linkText
      expected.event_data.url = link
      expected.event_data.link_path_parts['1'] = link

      initModule(element, true)
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('records the text of the link unless an override value is provided in the data attribute', function () {
      var link = '#aNormalLink'
      element = document.createElement('a')
      var linkText = 'A normal link'
      var recordText = 'this text should be recorded'
      element.textContent = linkText
      attributes.text = recordText
      element.setAttribute('data-ga4-link', JSON.stringify(attributes))
      element.setAttribute('href', link)
      expected.event_data.text = recordText
      expected.event_data.url = link
      expected.event_data.link_path_parts['1'] = link

      initModule(element, true)
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('records the href of the link unless an override value is provided in the data attribute', function () {
      var link = '#randomLink'
      element = document.createElement('a')
      element.setAttribute('href', link)
      var linkOverride = 'https://nationalarchives.gov.uk/test123'
      attributes.url = linkOverride
      element.setAttribute('data-ga4-link', JSON.stringify(attributes))

      expected.event_data.url = linkOverride
      expected.event_data.link_domain = 'https://nationalarchives.gov.uk'
      expected.event_data.link_path_parts['1'] = '/test123'
      expected.event_data.external = 'true'
      expected.event_data.text = ''

      initModule(element, true)
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('tracks all links with data-ga4 attributes within a container', function () {
      var longLink = '#link1-that-is-deliberately-really-long-to-test-the-url-being-split-into-parts-is-this-a-hundred-characters-yet'
      element = document.createElement('div')
      element.innerHTML =
        '<a class="first" href="' + longLink + '">Link 1</a>' +
        '<a href="#link2" class="secondWrapper"><span class="second">Link 2</span></a>' +
        '<a href="#link3"><span class="third">Link 3</span></a>' +
        '<span class="nothing"></span>'

      element.querySelector('.first').setAttribute('data-ga4-link', JSON.stringify(attributes))
      element.querySelector('.secondWrapper').setAttribute('data-ga4-link', JSON.stringify(attributes))
      initModule(element, false)

      expected.event_data.text = 'Link 1'
      expected.event_data.url = longLink
      expected.event_data.link_path_parts['1'] = '#link1-that-is-deliberately-really-long-to-test-the-url-being-split-into-parts-is-this-a-hundred-cha'
      expected.event_data.link_path_parts['2'] = 'racters-yet'
      element.querySelector('.first').click()
      expect(window.dataLayer[0]).toEqual(expected)

      expected.event_data.text = 'Link 2'
      expected.event_data.url = '#link2'
      expected.event_data.link_path_parts['1'] = '#link2'
      expected.event_data.link_path_parts['2'] = undefined
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
      expected.event = 'event_data'
      expected.event_data.type = 'a link'
      expected.event_data.method = 'primary click'
      expected.event_data.external = 'false'
    })

    it('tracks only links within a container', function () {
      element = document.createElement('div')
      element.innerHTML =
        '<a class="first" href="#link1">Link 1</a>' +
        '<a class="second" href="#link2">Link 2</a>' +
        '<a href="#link3"><span class="third">Link 3</span></a>' +
        '<span class="nothing"></span>'

      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', JSON.stringify(attributes))
      initModule(element, false)

      expected.event_data.text = 'Link 1'
      expected.event_data.url = '#link1'
      expected.event_data.link_path_parts['1'] = '#link1'
      element.querySelector('.first').click()
      expect(window.dataLayer[0]).toEqual(expected)

      expected.event_data.text = 'Link 2'
      expected.event_data.url = '#link2'
      expected.event_data.link_path_parts['1'] = '#link2'
      element.querySelector('.second').click()
      expect(window.dataLayer[1]).toEqual(expected)

      expected.event_data.text = 'Link 3'
      expected.event_data.url = '#link3'
      expected.event_data.link_path_parts['1'] = '#link3'
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
      expected.event = 'event_data'
      expected.event_data.type = 'a link'
      expected.event_data.method = 'primary click'
      expected.event_data.external = 'false'
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
      element.setAttribute('data-ga4-link', JSON.stringify(attributes))
      initModule(element, false)

      expected.event_data.text = 'Link 1'
      expected.event_data.url = '#link1'
      expected.event_data.link_path_parts['1'] = '#link1'
      element.querySelector('.first').click()
      expect(window.dataLayer[0]).toEqual(undefined)

      expected.event_data.text = 'Link 2'
      expected.event_data.url = '#link2'
      expected.event_data.link_path_parts['1'] = '#link2'
      element.querySelector('.second').click()
      expect(window.dataLayer[0]).toEqual(expected)

      expected.event_data.text = 'Link 3'
      expected.event_data.url = '#link3'
      expected.event_data.link_path_parts['1'] = '#link3'
      element.querySelector('.third').click()
      expect(window.dataLayer[1]).toEqual(expected)

      element.querySelector('.nothing').click()
      expect(window.dataLayer[2]).toEqual(undefined)
    })
  })

  describe('when the data-ga4-set-indexes property exists on the module', function () {
    it('calls the setIndexes function', function () {
      element = document.createElement('div')
      element.innerHTML =
        '<a href="#link1">Link 1</a>' +
        '<a href="#link2">Link 2</a>' +
        '<a href="#link3">Link 3</a>'

      element.setAttribute('data-ga4-set-indexes', '')

      var tracker = new GOVUK.Modules.Ga4LinkTracker(element)
      spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'setIndexes')
      tracker.init()

      expect(GOVUK.analyticsGa4.core.trackFunctions.setIndexes).toHaveBeenCalled()
    })
  })

  describe('when the data-ga4-set-indexes property does not exist on the module', function () {
    it('does not call the setIndexes function', function () {
      element = document.createElement('div')
      element.innerHTML =
        '<a href="#link1">Link 1</a>' +
        '<a href="#link2">Link 2</a>' +
        '<a href="#link3">Link 3</a>'

      var tracker = new GOVUK.Modules.Ga4LinkTracker(element)
      spyOn(GOVUK.analyticsGa4.core.trackFunctions, 'setIndexes')
      tracker.init()

      expect(GOVUK.analyticsGa4.core.trackFunctions.setIndexes).not.toHaveBeenCalled()
    })
  })

  describe('when data-ga4-index exists on a link', function () {
    it('will be used to set the index property', function () {
      element = document.createElement('a')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.setAttribute('data-ga4-index', '{"index_link": 123}')
      element.setAttribute('href', '/')

      initModule(element, true)

      expect(window.dataLayer[0].event_data.index).toEqual({ index_link: 123, index_section: undefined, index_section_count: undefined })
    })
  })

  describe('when data-ga4-index exists on the target element', function () {
    it('sets the index object to contain index_link only', function () {
      element = document.createElement('a')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.setAttribute('data-ga4-index', '{"index_link": 123}')
      element.setAttribute('href', '#link1')

      initModule(element, true)

      expect(window.dataLayer[0].event_data.index).toEqual({ index_link: 123, index_section: undefined, index_section_count: undefined })
    })
  })

  describe('when data-ga4-index exists on the target element and index exists on the parent', function () {
    it('combines both (when index is an object) into a single index object', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"index":{"index_section": 1, "index_section_count": 2}}')
      element.innerHTML = '<a class="link" href="#link1">Link 1</a>'

      var link = element.querySelector('.link')
      link.setAttribute('data-ga4-index', '{"index_link": ' + 3 + '}')

      initModule(element, false)
      link.click()

      expect(window.dataLayer[0].event_data.index).toEqual({ index_link: 3, index_section: 1, index_section_count: 2 })
    })
  })

  describe('when data-ga4-index does not exist on the target element but index exists on the parent', function () {
    it('does not modify the index object', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"index":{"index_section": 1, "index_section_count": 2}}')
      element.innerHTML = '<a class="link" href="#link1">Link 1</a>'

      var link = element.querySelector('.link')

      initModule(element, false)
      link.click()

      expect(window.dataLayer[0].event_data.index).toEqual({ index_section: 1, index_section_count: 2, index_link: undefined })
    })
  })

  describe('if neither data-ga4-index or index exist', function () {
    it('sets the index property to undefined', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.innerHTML = '<a class="link" href="#link1">Link 1</a>'

      var link = element.querySelector('.link')

      initModule(element, false)
      link.click()
      var expected = {
        index_link: undefined,
        index_section: undefined,
        index_section_count: undefined
      }

      expect(window.dataLayer[0].event_data.index).toEqual(expected)
    })
  })

  describe('PII removal', function () {
    it('redacts dates, postcodes and emails', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.innerHTML = '<a class="link" href="#/2022-02-02/SW10AA/email@example.com">2022-02-02 SW1 0AA email@example.com</a>'

      var link = element.querySelector('.link')

      initModule(element, false)
      link.click()

      expect(window.dataLayer[0].event_data.url).toEqual('#/[date]/[postcode]/[email]')
      expect(window.dataLayer[0].event_data.link_path_parts[1]).toEqual('#/[date]/[postcode]/[email]')
      expect(window.dataLayer[0].event_data.text).toEqual('[date] [postcode] [email]')
    })

    it('does not redact information when the \'data-ga4-do-not-redact\' attribute exists on a link', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.innerHTML = '<a class="link" href="#/2022-02-02/SW10AA/email@example.com">2022-02-02 SW1 0AA email@example.com</a>'

      var link = element.querySelector('.link')
      link.setAttribute('data-ga4-do-not-redact', '')

      initModule(element, false)
      link.click()

      expect(window.dataLayer[0].event_data.url).toEqual('#/2022-02-02/SW10AA/email@example.com')
      expect(window.dataLayer[0].event_data.link_path_parts[1]).toEqual('#/2022-02-02/SW10AA/email@example.com')
      expect(window.dataLayer[0].event_data.text).toEqual('2022-02-02 SW1 0AA email@example.com')
    })

    it('does not redact information when the \'data-ga4-do-not-redact\' attribute exists on a parent element', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.setAttribute('data-ga4-do-not-redact', '')
      element.innerHTML = '<a class="link" href="#/2022-02-02/SW10AA/email@example.com">2022-02-02 SW1 0AA email@example.com</a>'

      var link = element.querySelector('.link')

      initModule(element, false)
      link.click()

      expect(window.dataLayer[0].event_data.url).toEqual('#/2022-02-02/SW10AA/email@example.com')
      expect(window.dataLayer[0].event_data.link_path_parts[1]).toEqual('#/2022-02-02/SW10AA/email@example.com')
      expect(window.dataLayer[0].event_data.text).toEqual('2022-02-02 SW1 0AA email@example.com')
    })
  })

  describe('if the link is an on an image with no inner text', function () {
    it('sets the text property to image', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.innerHTML = '<a class="link" href="#link1"><img src=""/></a>' +
      '<a class="link" href="#link1"><svg></svg></a>'

      var links = element.querySelectorAll('.link')

      for (var i = 0; i < links.length; i++) {
        window.dataLayer = []
        initModule(element, false)
        links[i].click()
        expect(window.dataLayer[0].event_data.text).toEqual('image')
      }
    })

    it('sets the text property to image when the nested elements are clicked', function () {
      element = document.createElement('div')
      element.setAttribute('data-ga4-track-links-only', '')
      element.setAttribute('data-ga4-link', '{"someData": "blah"}')
      element.innerHTML = '<a href="#link1"><img class="link" src=""/></a>' +
      '<a href="#link1"><svg class="link"></svg></a>' +
      '<a href="#link1"><svg><path class="link"></path></svg></a>'

      var links = element.querySelectorAll('.link')

      for (var i = 0; i < links.length; i++) {
        window.dataLayer = []
        initModule(element, false)
        window.GOVUK.triggerEvent(links[i], 'click')
        expect(window.dataLayer[0].event_data.text).toEqual('image')
      }
    })
  })
})
