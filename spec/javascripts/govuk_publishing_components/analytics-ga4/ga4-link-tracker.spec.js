/* eslint-env jasmine */

describe('GOVUK.analyticsGA4.linkTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var links
  var expected
  var body = document.querySelector('body')
  var linkTracker
  var preventDefault = function (e) {
    e.preventDefault()
  }

  beforeAll(function () {
    spyOn(GOVUK.analyticsGA4.core, 'getGemVersion').and.returnValue('aVersion')
  })

  afterAll(function () {
    window.dataLayer = []
  })

  describe('External link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'generic link'
      expected.event_data.link_method = 'primary click'
      expected.event_data.external = 'true'
      expected.govuk_gem_version = 'aVersion'
      links = document.createElement('div')
      links.innerHTML =
          '<div class="fully-structured-external-links">' +
              '<a href="http://www.nationalarchives1.gov.uk"> National Archives </a>' +
              '<a href="https://www.nationalarchives2.gov.uk"></a>' +
              '<a href="https://www.nationalarchives3.gov.uk/one.pdf">National Archives PDF</a>' +
            '</div>' +
            '<div class="www-less-external-links">' +
              '<a href="http://nationalarchives1.gov.uk"> National Archives </a>' +
              '<a href="https://nationalarchives2.gov.uk"></a>' +
              '<a href="https://nationalarchives3.gov.uk/one.pdf">National Archives PDF</a>' +
            '</div>' +
            '<div class="http-less-external-links">' +
              '<a href="nationalarchives1.gov.uk"> National Archives </a>' +
              '<a href="nationalarchives2.gov.uk"></a>' +
              '<a href="nationalarchives3.gov.uk/one.pdf">National Archives PDF</a>' +
            '</div>' +
            '<div class="protocol-relative-external-links">' +
              '<a href="//nationalarchives1.gov.uk"> National Archives </a>' +
              '<a href="//nationalarchives2.gov.uk"></a>' +
              '<a href="//nationalarchives3.gov.uk/one.pdf">National Archives PDF</a>' +
            '</div>' +
            '<div class="nested-link">' +
            '<a href="http://www.nationalarchives1.gov.uk"> <img /> </a>' +
            '</div>' +
            '<div class="internal-links">' +
              '<a href="/some-path">Local link</a>' +
              '<a href="http://www.gov.uk/some-path">Another local link</a>' +
              '<a href="https://www.gov.uk/some-path">Another local link</a>' +
              '<a href="https://gov.uk/some-path">Another local link</a>' +
              '<a href="gov.uk/some-path">Another local link</a>' +
              '<a href="//gov.uk/some-path">Another local link</a>' +
            '</div>' +
            '<div class="anchor-links">' +
              '<a href="#some-id">Anchor link</a>' +
              '<a href="#https://www.gov.uk">Another anchor link</a>' +
              '<a href="#https://www.example.com">Another anchor link</a>' +
            '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkTracker = GOVUK.analyticsGA4.analyticsModules.Ga4LinkTracker
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

        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects external click events on www. missing external links', function () {
      var linksToTest = document.querySelectorAll('.www-less-external-links a')
      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')

        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects external click events on missing http/https external links', function () {
      var linksToTest = document.querySelectorAll('.http-less-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')

        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('listens to external click events on protocol relative links', function () {
      var linksToTest = document.querySelectorAll('.protocol-relative-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')

        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('listens to external click events on elements within external links', function () {
      var nestedImage = document.querySelector('.nested-link a img')
      var parentLink = nestedImage.closest('a')

      GOVUK.triggerEvent(nestedImage, 'click')

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
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.link_method = 'ctrl click'
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
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.link_method = 'command/win click'
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
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.link_method = 'middle click'
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
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.link_method = 'shift click'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects right click events on external links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-external-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'contextmenu')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.link_method = 'secondary click'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })
  })

  describe('Download link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []

      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'file_download'
      expected.event_data.type = 'generic download'
      expected.event_data.link_method = 'primary click'
      expected.govuk_gem_version = 'aVersion'

      links = document.createElement('div')
      links.innerHTML = '<div class="fully-structured-download-links">' +
            '<a href="https://assets.publishing.service.gov.uk/one.pdf" external="true">PDF</a>' +
            '<a href="https://assets.publishing.service.gov.uk/two.xslt" external="true">Spreadsheet</a>' +
            '<a href="https://www.gov.uk/government/uploads/system/three.doc" external="false">Document</a>' +
          '</div>' +
          '<div class="nested-download-links">' +
            '<a href="https://www.gov.uk/government/uploads/link.png" external="false"><img src="/img" /></a>' +
            '<a href="https://assets.publishing.service.gov.uk/two.xslt" external="true"><div><img src="/img" /></div></a>' +
          '</div>' +
          '<div class="http-download-links">' +
            '<a href="http://assets.publishing.service.gov.uk/one.pdf" external="true">PDF</a>' +
            '<a href="http://assets.publishing.service.gov.uk/two.xslt" external="true">Spreadsheet</a>' +
            '<a href="http://www.gov.uk/government/uploads/system/three.doc" external="false">Document</a>' +
            '<a href="http://www.gov.uk/government/uploads/link.png" external="false">Image</a>' +
          '</div>' +
          '<div class="www-less-download-links">' +
            '<a href="http://gov.uk/government/uploads/system/three.doc">Document</a>' +
            '<a href="https://gov.uk/government/uploads/link.png">Image</a>' +
          '</div>' +
          '<div class="http-less-download-links">' +
            '<a href="gov.uk/government/uploads/system/three.doc" external="false">Document</a>' +
            '<a href="www.gov.uk/government/uploads/link.png" external="false">Image</a>' +
            '<a href="assets.publishing.service.gov.uk/one.pdf" external="true">PDF</a>' +
            '<a href="assets.publishing.service.gov.uk/two.xslt" external="true">Spreadsheet</a>' +
          '</div>' +
          '<div class="internal-links">' +
            '<a href="https://www.gov.uk/normal-link">Normal link</a>' +
            '<a href="https://www.gov.uk/another-link">Another link</a>' +
          '</div>' +
          '<div class="external-download-links">' +
            '<a href="https://example.com/one.pdf">External download link</a>' +
            '<a href="example.com/one.pdf">External download link</a>' +
            '<a href="example.com/one.pdf">External download link</a>' +
            '<a href="https://www.nationalarchives.gov.uk/government/uploads/logo.png">External download link with false positive path</a>' +
            '<a href="https://www.nationalarchives.gov.uk/download&fileName=assets.publishing.service.gov.uk.pdf">External PDF link with false positive name</a>' +
            '<a href="nationalarchives.gov.uk/government/uploads/logo.png">External download link with false positive path</a>' +
            '<a href="www.nationalarchives.gov.uk/government/uploads/logo.png">External download link with false positive path</a>' +
          '</div>' +
          '<div class="relative-download-links">' +
            '<a href="/government/uploads/one.pdf">Relative PDF link</a>' +
            '<a href="/government/uploads/two.xslt">Relative Spreadsheet link</a>' +
          '</div>' +
          '<div class="preview-download-links">' +
            '<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/moj-hq.csv/preview">Preview link</a>' +
            '<a href="http://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/moj-hq.csv/preview">Relative Spreadsheet link</a>' +
            '<a href="assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/moj-hq.csv/preview">Relative Spreadsheet link</a>' +
          '</div>' +
          '<div class="not-a-preview-link">' +
            '<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/preview.mp4">Preview link</a>' +
            '<a href="http://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/preview.jpg&preview=false">Relative Spreadsheet link</a>' +
            '<a href="assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/444468/preview.csv">Relative Spreadsheet link</a>' +
          '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkTracker = GOVUK.analyticsGA4.analyticsModules.Ga4LinkTracker
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
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = link.getAttribute('external')
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('listens to download clicks on nested elements in download links', function () {
      var linksToTest = document.querySelectorAll('.nested-download-links a img')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.closest('a').getAttribute('href')
        expected.event_data.text = link.closest('a').innerText.trim()
        expected.event_data.type = 'generic download'
        expected.event_data.external = link.closest('a').getAttribute('external')
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects download clicks on download links that have http:// in the href', function () {
      var linksToTest = document.querySelectorAll('.http-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = link.getAttribute('external')
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects download clicks on download links without www. in the href', function () {
      var linksToTest = document.querySelectorAll('.www-less-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'false'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects download clicks on download links without http:// or https:// in the href', function () {
      var linksToTest = document.querySelectorAll('.http-less-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = link.getAttribute('external')
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
        expected.event_data.event_name = 'navigation'
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.type = 'generic link'
        expected.govuk_gem_version = 'aVersion'
        expected.event_data.external = 'true'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects download clicks on relative gov.uk download links', function () {
      var linksToTest = document.querySelectorAll('.relative-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'false'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects preview clicks on gov.uk download preview links', function () {
      var linksToTest = document.querySelectorAll('.preview-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'preview'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'true'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects files with preview in their filename as download links instead of preview links', function () {
      var linksToTest = document.querySelectorAll('.not-a-preview-link a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'generic download'
        expected.event_data.text = link.innerText.trim()
        expected.event_data.external = 'true'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })
  })

  describe('Mailto link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'email'
      expected.event_data.link_method = 'primary click'
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

      linkTracker = GOVUK.analyticsGA4.analyticsModules.Ga4LinkTracker
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

  describe('Share and follow link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.govuk_gem_version = 'aVersion'

      links = document.createElement('div')
      links.innerHTML =
          '<div class="share-links">' +
              '<a href="example.com" data-ga4-link=\'' + JSON.stringify({ event_name: 'share', type: 'share this page', index: '1', index_total: '1', text: 'myspace', link_method: '[populated-via-js]' }) + '\'>Share</a>' +
          '</div>' +
          '<div class="follow-links">' +
              '<a href="https://example.com" external="true" data-ga4-link=\'' + JSON.stringify({ event_name: 'navigation', type: 'follow us', index: '1', index_total: '2', text: 'Follow us', url: 'https://example.com', external: '[populated-via-js]', link_method: '[populated-via-js]' }) + '\'>Follow us</a>' +
              '<a href="https://www.gov.uk" external="false" data-ga4-link=\'' + JSON.stringify({ event_name: 'navigation', type: 'follow us', index: '2', index_total: '2', text: 'Follow me', url: 'https://www.gov.uk', external: '[populated-via-js]', link_method: '[populated-via-js]' }) + '\'>Follow me</a>' +
          '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkTracker = GOVUK.analyticsGA4.analyticsModules.Ga4LinkTracker
      // Add gov.uk as an internal domain, as our tests are running from localhost
      linkTracker.init({ internalDomains: ['www.gov.uk'] })
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkTracker.stopTracking()
    })

    it('detects clicks on share links', function () {
      var linksToTest = document.querySelectorAll('.share-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        var shareLinkAttributes = link.getAttribute('data-ga4-link')
        shareLinkAttributes = JSON.parse(shareLinkAttributes)
        expected.event_data.event_name = shareLinkAttributes.event_name
        expected.event_data.type = shareLinkAttributes.type
        expected.event_data.text = shareLinkAttributes.text
        expected.event_data.index = parseInt(shareLinkAttributes.index)
        expected.event_data.index_total = parseInt(shareLinkAttributes.index_total)
        expected.event_data.link_method = 'primary click'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })

    it('detects clicks on follow links', function () {
      var linksToTest = document.querySelectorAll('.follow-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        var shareLinkAttributes = link.getAttribute('data-ga4-link')
        shareLinkAttributes = JSON.parse(shareLinkAttributes)
        expected.event_data.event_name = shareLinkAttributes.event_name
        expected.event_data.type = shareLinkAttributes.type
        expected.event_data.text = link.textContent.trim()
        expected.event_data.index = parseInt(shareLinkAttributes.index)
        expected.event_data.index_total = parseInt(shareLinkAttributes.index_total)
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.external = link.getAttribute('external')
        expected.event_data.link_method = 'primary click'
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })
  })
  describe('Helper function tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      links = document.createElement('div')
      links.innerHTML = '<a href="http://www.nationalarchives1.gov.uk" id="clickme"> National Archives </a>'
      body.appendChild(links)
      body.addEventListener('click', preventDefault)
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkTracker.stopTracking()
    })

    it('adds "gov.uk" to the internal domain list after "www.gov.uk" was added as an internal domain', function () {
      linkTracker = GOVUK.analyticsGA4.analyticsModules.Ga4LinkTracker
      // Add gov.uk as an internal domain, as our tests are running from localhost
      linkTracker.init({ internalDomains: ['www.gov.uk'] })
      expect(linkTracker.internalDomains).toContain('www.gov.uk')
      expect(linkTracker.internalDomains).toContain('gov.uk')
    })

    it('does not detect clicks when disableListeners is true', function () {
      linkTracker = GOVUK.analyticsGA4.analyticsModules.Ga4LinkTracker
      // Add gov.uk as an internal domain, as our tests are running from localhost
      linkTracker.init({ internalDomains: ['www.gov.uk'], disableListeners: true })
      var link = links.querySelector('#clickme')
      link.click()
      expect(window.dataLayer).toEqual([])
    })
  })
})
