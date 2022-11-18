/* eslint-env jasmine */

describe('A specialist link tracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var links
  var expected
  var body = document.querySelector('body')
  var linkTracker
  var preventDefault = function (e) {
    e.preventDefault()
  }
  var defaultLinkPathParts

  beforeAll(function () {
    spyOn(GOVUK.analyticsGa4.core, 'getGemVersion').and.returnValue('aVersion')
    spyOn(GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker, 'getHostname').and.returnValue('www.gov.uk')
    spyOn(GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker, 'getProtocol').and.returnValue('https:')
  })

  afterAll(function () {
    window.dataLayer = []
  })

  beforeEach(function () {
    defaultLinkPathParts = {
      1: undefined,
      2: undefined,
      3: undefined,
      4: undefined,
      5: undefined
    }
  })

  describe('when tracking external links', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'generic link'
      expected.event_data.method = 'primary click'
      expected.event_data.external = 'true'
      expected.govuk_gem_version = 'aVersion'
      links = document.createElement('div')
      /* The link_domain, external and path attributes exist so we can hardcode what the expected value is for each test.
      The value differs for each link, so we can't hardcode the expected value inside the test itself. */
      links.innerHTML =
          '<div class="fully-structured-external-links">' +
              '<a href="http://www.nationalarchives.gov.uk/1" link_domain="http://www.nationalarchives.gov.uk" path="/1"> National Archives </a>' +
              '<a href="https://www.nationalarchives.gov.uk/2" link_domain="https://www.nationalarchives.gov.uk" path="/2"></a>' +
              '<a href="https://www.nationalarchives.gov.uk/3.pdf" link_domain="https://www.nationalarchives.gov.uk" path="/3.pdf">National Archives PDF</a>' +
            '</div>' +
            '<div class="www-less-external-links">' +
              '<a href="http://nationalarchives.gov.uk/1" path="/1" link_domain="http://nationalarchives.gov.uk"> National Archives </a>' +
              '<a href="https://nationalarchives.gov.uk/2" path="/2" link_domain="https://nationalarchives.gov.uk"></a>' +
              '<a href="https://nationalarchives.gov.uk/one.pdf" link_domain="https://nationalarchives.gov.uk" path="/one.pdf">National Archives PDF</a>' +
            '</div>' +
            '<div class="protocol-relative-external-links">' +
              '<a href="//nationalarchives.gov.uk"> National Archives </a>' +
              '<a href="//nationalarchives.gov.uk"></a>' +
              '<a href="//nationalarchives.gov.uk/one.pdf" path="/one.pdf">National Archives PDF</a>' +
            '</div>' +
            '<div class="nested-link">' +
            '<a href="http://www.nationalarchives.gov.uk"> <img /> </a>' +
            '</div>' +
            '<div class="internal-links">' +
              '<a href="/some-path">Local link</a>' +
              '<a href="http://www.gov.uk/some-path">Another local link</a>' +
              '<a href="https://www.gov.uk/some-path">Another local link</a>' +
              '<a href="https://gov.uk/some-path">Another local link</a>' +
              '<a href="//gov.uk/some-path">Another local link</a>' +
            '</div>' +
            '<div class="anchor-links">' +
              '<a href="#some-id">Anchor link</a>' +
              '<a href="#https://www.gov.uk">Another anchor link</a>' +
              '<a href="#https://www.example.com">Another anchor link</a>' +
            '</div>' +
            '<div data-ga4-link="something">' +
              '<a href="//nationalarchives.gov.uk" class="alreadytracked"> National Archives </a>' +
            '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkTracker = GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker
      // Add gov.uk as an internal domain, as our tests are running from localhost
      linkTracker.init({ internalDomains: ['www.gov.uk'] })
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkTracker.stopTracking()
    })

    it('detects external click events on well structured external links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        var link = linksToTest[i]
        window.dataLayer = []
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects external click events on www. missing external links', function () {
      var linksToTest = document.querySelectorAll('.www-less-external-links a')
      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')

        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        var linkPath = link.getAttribute('path')
        if (linkPath) {
          expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        }
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('listens to external click events on protocol relative links', function () {
      var linksToTest = document.querySelectorAll('.protocol-relative-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')

        expected.event_data.link_domain = '//nationalarchives.gov.uk'
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        var linkPath = link.getAttribute('path')
        if (linkPath) {
          expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        }
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('listens to external click events on elements within external links', function () {
      var nestedImage = document.querySelector('.nested-link a img')
      var parentLink = nestedImage.closest('a')

      GOVUK.triggerEvent(nestedImage, 'click')

      expected.event_data.link_domain = 'http://www.nationalarchives.gov.uk'
      expected.event_data.url = parentLink.getAttribute('href')
      expected.event_data.text = parentLink.innerText.trim()

      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('ignores external click events on internal links', function () {
      var linksToTest = document.querySelectorAll('.internal-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        var link = linksToTest[i]
        window.dataLayer = []
        GOVUK.triggerEvent(link, 'click')
        expect(window.dataLayer).toEqual([])
      }
    })

    it('ignores external click events on anchor links', function () {
      var linksToTest = document.querySelectorAll('.anchor-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        var link = linksToTest[i]
        window.dataLayer = []
        GOVUK.triggerEvent(link, 'click')
        expect(window.dataLayer).toEqual([])
      }
    })

    it('detects control click events on external links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        var clickEvent = new window.CustomEvent('click', { cancelable: true, bubbles: true })
        clickEvent.ctrlKey = true
        link.dispatchEvent(clickEvent)
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.method = 'ctrl click'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects command click events on external links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        var clickEvent = new window.CustomEvent('click', { cancelable: true, bubbles: true })
        clickEvent.metaKey = true
        link.dispatchEvent(clickEvent)
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.method = 'command/win click'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects middle mouse click events on external links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        var clickEvent = new window.CustomEvent('mousedown', { cancelable: true, bubbles: true })
        clickEvent.button = 1
        link.dispatchEvent(clickEvent)
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.method = 'middle click'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects shift click events on external links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        var clickEvent = new window.CustomEvent('click', { cancelable: true, bubbles: true })
        clickEvent.shiftKey = true
        link.dispatchEvent(clickEvent)
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.method = 'shift click'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects right click events on external links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'contextmenu')
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.method = 'secondary click'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('ignores links that are already being tracked by the other link tracker', function () {
      links.querySelector('.alreadytracked').click()
      expect(window.dataLayer).toEqual([])
    })
  })

  describe('when tracking download links', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'file_download'
      expected.event_data.type = 'generic download'
      expected.event_data.method = 'primary click'
      expected.govuk_gem_version = 'aVersion'

      links = document.createElement('div')
      /* The link_domain, external and path attributes exist so we can hardcode what the expected value is for each test.
      The value differs for each link, so we can't hardcode the expected value inside the test itself. */
      links.innerHTML = '<div class="fully-structured-download-links">' +
            '<a href="https://assets.publishing.service.gov.uk/one.pdf" path="/one.pdf" external="true" link_domain="https://assets.publishing.service.gov.uk">PDF</a>' +
            '<a href="https://assets.publishing.service.gov.uk/two.xslt" path="/two.xslt" external="true" link_domain="https://assets.publishing.service.gov.uk">Spreadsheet</a>' +
            '<a href="https://www.gov.uk/government/uploads/system/three.doc" path="/government/uploads/system/three.doc" external="false" link_domain="https://www.gov.uk">Document</a>' +
          '</div>' +
          '<div class="nested-download-links">' +
            '<a href="https://www.gov.uk/government/uploads/link.png" path="/government/uploads/link.png" external="false" link_domain="https://www.gov.uk"><img src="/img" /></a>' +
            '<a href="https://assets.publishing.service.gov.uk/two.xslt" path="/two.xslt" external="true" link_domain="https://assets.publishing.service.gov.uk"><div><img src="/img" /></div></a>' +
          '</div>' +
          '<div class="http-download-links">' +
            '<a href="http://assets.publishing.service.gov.uk/one.pdf" path="/one.pdf" external="true" link_domain="http://assets.publishing.service.gov.uk">PDF</a>' +
            '<a href="http://assets.publishing.service.gov.uk/two.xslt" path="/two.xslt" external="true" link_domain="http://assets.publishing.service.gov.uk">Spreadsheet</a>' +
            '<a href="http://www.gov.uk/government/uploads/system/three.doc" path="/government/uploads/system/three.doc" external="false" link_domain="http://www.gov.uk">Document</a>' +
            '<a href="http://www.gov.uk/government/uploads/link.png" path="/government/uploads/link.png" external="false" link_domain="http://www.gov.uk">Image</a>' +
          '</div>' +
          '<div class="www-less-download-links">' +
            '<a href="http://gov.uk/government/uploads/system/three.doc" link_domain="http://gov.uk" path="/government/uploads/system/three.doc">Document</a>' +
            '<a href="https://gov.uk/government/uploads/link.png" link_domain="https://gov.uk" path="/government/uploads/link.png">Image</a>' +
          '</div>' +
          '<div class="internal-links">' +
            '<a href="https://www.gov.uk/normal-link">Normal link</a>' +
            '<a href="https://www.gov.uk/another-link">Another link</a>' +
          '</div>' +
          '<div class="external-download-links">' +
            '<a href="https://example.com/one.pdf" path="/one.pdf" link_domain="https://example.com">External download link</a>' +
            '<a href="https://www.nationalarchives.gov.uk/government/uploads/logo.png" path="/government/uploads/logo.png" link_domain="https://www.nationalarchives.gov.uk">External download link with false positive path</a>' +
            '<a href="https://www.nationalarchives.gov.uk/download&fileName=assets.publishing.service.gov.uk.pdf" path="/download&fileName=assets.publishing.service.gov.uk.pdf" link_domain="https://www.nationalarchives.gov.uk">External PDF link with false positive name</a>' +
          '</div>' +
          '<div class="relative-download-links">' +
            '<a href="/government/uploads/one.pdf" path="/government/uploads/one.pdf">Relative PDF link</a>' +
            '<a href="/government/uploads/two.xslt" path="/government/uploads/two.xslt">Relative Spreadsheet link</a>' +
          '</div>' +
          '<div class="preview-download-links">' +
            '<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/moj-hq.csv/preview" path="/government/uploads/system/uploads/attachment_data/file/444468/moj-hq.csv/preview" link_domain="https://assets.publishing.service.gov.uk">Preview link</a>' +
            '<a href="http://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/moj-hq.csv/preview" path="/government/uploads/system/uploads/attachment_data/file/444468/moj-hq.csv/preview" link_domain="http://assets.publishing.service.gov.uk">Relative Spreadsheet link</a>' +
          '</div>' +
          '<div class="not-a-preview-link">' +
            '<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/preview.mp4" path="/government/uploads/system/uploads/attachment_data/file/444468/preview.mp4" link_domain="https://assets.publishing.service.gov.uk">Preview link</a>' +
            '<a href="http://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/preview.jpg&preview=false" path="/government/uploads/system/uploads/attachment_data/file/444468/preview.jpg&preview=false" link_domain="http://assets.publishing.service.gov.uk">Relative Spreadsheet link</a>' +
          '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkTracker = GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker
      // Add gov.uk as an internal domain, as our tests are running from localhost
      linkTracker.init({ internalDomains: ['www.gov.uk'] })
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkTracker.stopTracking()
    })

    it('detects download clicks on fully structured gov.uk download links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')

        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = link.getAttribute('external')
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('listens to download clicks on nested elements in download links', function () {
      var linksToTest = document.querySelectorAll('.nested-download-links a img')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.link_domain = link.closest('a').getAttribute('link_domain')
        expected.event_data.url = link.closest('a').getAttribute('href')
        expected.event_data.text = link.closest('a').innerText.trim()
        expected.event_data.type = 'generic download'
        expected.event_data.external = link.closest('a').getAttribute('external')
        var linkPath = link.closest('a').getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects download clicks on download links that have http:// in the href', function () {
      var linksToTest = document.querySelectorAll('.http-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = link.getAttribute('external')
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects download clicks on download links without www. in the href', function () {
      var linksToTest = document.querySelectorAll('.www-less-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'false'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('ignores internal links from being treated as download links', function () {
      var linksToTest = document.querySelectorAll('.internal-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expect(window.dataLayer).toEqual([])
      }
    })

    it('treats external files as external links', function () {
      var linksToTest = document.querySelectorAll('.external-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')

        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.event_name = 'navigation'
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.type = 'generic link'
        expected.govuk_gem_version = 'aVersion'
        expected.event_data.external = 'true'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects download clicks on relative gov.uk download links', function () {
      var linksToTest = document.querySelectorAll('.relative-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.link_domain = 'https://www.gov.uk'
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'false'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects preview clicks on gov.uk download preview links', function () {
      var linksToTest = document.querySelectorAll('.preview-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'preview'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'true'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects files with preview in their filename as download links instead of preview links', function () {
      var linksToTest = document.querySelectorAll('.not-a-preview-link a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.link_domain = link.getAttribute('link_domain')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'true'
        var linkPath = link.getAttribute('path')
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: linkPath })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })
  })

  describe('when tracking mailto links', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'email'
      expected.event_data.method = 'primary click'
      expected.event_data.external = 'true'

      links = document.createElement('div')
      links.innerHTML =
          '<div class="mail-to-links">' +
              '<a href="mailto:example@gov.uk"> National Archives </a>' +
              '<span>This is not a mailto link</span>' +
            '</div>' +
            '<div class="invalid-links">' +
              '<a href="https://gov.uk/mailto:example@gov.uk"> mailto:example@gov.uk </a>' +
            '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkTracker = GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker
      // Add gov.uk as an internal domain, as our tests are running from localhost
      linkTracker.init({ internalDomains: ['www.gov.uk'] })
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkTracker.stopTracking()
    })

    it('detects email events on mailto links', function () {
      var linksToTest = document.querySelectorAll('.mail-to-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.govuk_gem_version = 'aVersion'
        expected.event_data.link_path_parts = window.GOVUK.extendObject(defaultLinkPathParts, { 1: 'mailto:example@gov.uk' })
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('ignores email events on non-mailto links', function () {
      var linksToTest = document.querySelectorAll('.invalid-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expect(window.dataLayer).toEqual([])
      }
    })
  })

  describe('when tracking using helper functions', function () {
    beforeEach(function () {
      window.dataLayer = []
      links = document.createElement('div')
      body.appendChild(links)
      body.addEventListener('click', preventDefault)
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkTracker.stopTracking()
    })

    it('adds "gov.uk" to the internal domain list after "www.gov.uk" was added as an internal domain', function () {
      linkTracker = GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker
      // Add gov.uk as an internal domain, as our tests are running from localhost
      linkTracker.init({ internalDomains: ['www.gov.uk'] })
      expect(linkTracker.internalDomains).toContain('www.gov.uk')
      expect(linkTracker.internalDomains).toContain('gov.uk')
    })

    it('removes _ga and _gl from href query parameters', function () {
      linkTracker = GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker
      linkTracker.init({ internalDomains: ['www.gov.uk'] })

      links.innerHTML = '<div class="query-param-links">' +
      '<a href="https://nationalarchives.gov.uk/test?_ga=2.179870689.471678113.1662373341-1606126050.1639392506">_ga only link</a>' +
      '<a href="https://nationalarchives.gov.uk/test?_gl=2.179870689.471678113.1662373341-1606126050.1639392506">_gl only link</a>' +
      '<a href="https://nationalarchives.gov.uk/test?hello=world&_ga=2.179870689.471678113.1662373341-1606126050.1639392506&_gl=2.179870689.471678113.1662373341-1606126050.1639392506">_ga & _gl link</a>' +
      '<a href="https://nationalarchives.gov.uk/test?hello=world&_ga=example&another=one&_gl=example&goodbye=true">other query params nested around _ga and _gl</a>' +
      '<a href="https://nationalarchives.gov.uk/test?_ga=example&_gl=example&search=%26&order=relevance">keep the search query params that contains a &</a>' +
      '<a href="https://nationalarchives.gov.uk/test?_gaa=example&_gll=example">query params similar to _ga and _gl</a>' +

      '</div>'

      var expectedLinks = [
        'https://nationalarchives.gov.uk/test',
        'https://nationalarchives.gov.uk/test',
        'https://nationalarchives.gov.uk/test?hello=world',
        'https://nationalarchives.gov.uk/test?hello=world&another=one&goodbye=true',
        'https://nationalarchives.gov.uk/test?search=%26&order=relevance',
        'https://nationalarchives.gov.uk/test?_gaa=example&_gll=example']

      var queryParamLinks = document.querySelectorAll('.query-param-links a')
      for (var i = 0; i < queryParamLinks.length; i++) {
        window.dataLayer = []
        var link = queryParamLinks[i]
        GOVUK.triggerEvent(link, 'click')
        expect(window.dataLayer[0].event_data.url).toEqual(expectedLinks[i])
      }
    })

    it('cleans up link text with multiple lines and spaces', function () {
      linkTracker = GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker
      linkTracker.init({ internalDomains: ['www.gov.uk'] })

      links.innerHTML = '<div class="messy-text">' +
      '<a href="https://example.com">\nI \nam \non \nmultiple \n\n\n lines</a>' +
      '<a href="https://www.gov.uk/government/uploads/example.pdf">I     have     lots   of    spaces</a>' +
      '<a href="mailto:hello@example.com">I     have     lots   of    spaces \n and \n\n many \n\n\n lines</a>' +
    '</div>'

      var linksToTest = document.querySelectorAll('.messy-text a')

      var expectedText = [
        'I am on multiple lines',
        'I have lots of spaces',
        'I have lots of spaces and many lines'
      ]
      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expect(window.dataLayer[0].event_data.text).toEqual(expectedText[i])
      }
    })

    it('splits hrefs longer than 100 characters into an object of parts', function () {
      linkTracker = GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker
      linkTracker.init({ internalDomains: ['www.gov.uk'] })

      links.innerHTML = '<div class="long-links">' +
      '<a href="https://example.com/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-">100 char path</a>' +
      '<a href="https://example.com/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragili">200 char path</a>' +
      '<a href="https://example.com/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-so">500 char path</a>' +
      '<a href="https://example.com/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-sound-precocious">Over 500 char path</a>' +
      '<a href="https://example.com/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-qui/https://example.com/test">check regex replace only replaces first domain match</a>' +
      '<a href="https://assets.publishing.service.gov.uk/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-qui">check regex replace works with a long subdomain </a>' +
      '<a href="//assets.publishing.service.gov.uk/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-qui">check regex replace works with protocal relative domain </a>' +
      '</div>'

      var expectedLinkPathParts = [
        {
          1: '/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-'
        },
        {
          1: '/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-',
          2: 'say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragili'
        },
        {
          1: '/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-',
          2: 'say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragili',
          3: 'sticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enoug',
          4: 'h-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragilisticexpialidociou',
          5: 's-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-so'
        },
        {
          1: '/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-',
          2: 'say-it-loud-enough-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragili',
          3: 'sticexpialidocious-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enoug',
          4: 'h-youll-always-sound-precocious-supercalifragilisticexpialidocious-supercalifragilisticexpialidociou',
          5: 's-even-though-the-sound-of-it-is-something-quite-atrocious-if-you-say-it-loud-enough-youll-always-so'
        },
        {
          1: '/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-qui/https://example.com',
          2: '/test'
        },
        {
          1: '/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-qui'
        },
        {
          1: '/supercalifragilisticexpialidocious-even-though-the-sound-of-it-is-something-qui'
        }
      ]

      var linksToTest = document.querySelectorAll('.long-links a')
      for (var i = 0; i < linksToTest.length; i++) {
        defaultLinkPathParts = {
          1: undefined,
          2: undefined,
          3: undefined,
          4: undefined,
          5: undefined
        }
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        var expectedObject = window.GOVUK.extendObject(defaultLinkPathParts, expectedLinkPathParts[i])
        expect(window.dataLayer[0].event_data.link_path_parts).toEqual(expectedObject)
      }
    })
  })
})
