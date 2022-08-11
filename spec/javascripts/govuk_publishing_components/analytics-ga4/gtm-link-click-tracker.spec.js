/* eslint-env jasmine */

describe('GOVUK.analyticsGA4.linkClickTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var links
  var expected
  var body = document.querySelector('body')
  var linkClickTracker
  var preventDefault = function (e) {
    e.preventDefault()
  }
  describe('External link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'analytics'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'generic link'
      expected.event_data.link_method = 'primary click'
      expected.event_data.external = 'true'
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
          '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkClickTracker = GOVUK.analyticsGA4.linkClickTracker
      linkClickTracker.trackLinkClicks()
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkClickTracker.stopTracking()
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
      expected.event = 'analytics'
      expected.event_data.event_name = 'navigation'
      expected.event_data.type = 'download'
      expected.event_data.link_method = 'primary click'
      expected.event_data.external = 'false'

      links = document.createElement('div')
      links.innerHTML = '<div class="fully-structured-download-links">' +
          '<a href="https://assets.publishing.service.gov.uk/one.pdf">PDF</a>' +
          '<a href="https://assets.publishing.service.gov.uk/two.xslt">Spreadsheet</a>' +
          '<a href="https://www.gov.uk/government/uploads/system/three.doc">Document</a>' +
        '</div>' +
        '<div class="nested-download-links">' +
          '<a href="https://www.gov.uk/government/uploads/link.png"><img src="/img" /></a>' +
          '<a href="https://assets.publishing.service.gov.uk/two.xslt"><div><img src="/img" /></div></a>' +
        '</div>' +
        '<div class="http-download-links">' +
          '<a href="http://assets.publishing.service.gov.uk/one.pdf">PDF</a>' +
          '<a href="http://assets.publishing.service.gov.uk/two.xslt">Spreadsheet</a>' +
          '<a href="http://www.gov.uk/government/uploads/system/three.doc">Document</a>' +
          '<a href="http://www.gov.uk/government/uploads/link.png">Image</a>' +
        '</div>' +
        '<div class="www-less-download-links">' +
          '<a href="http://gov.uk/government/uploads/system/three.doc">Document</a>' +
          '<a href="https://gov.uk/government/uploads/link.png">Image</a>' +
        '</div>' +
        '<div class="http-less-download-links">' +
          '<a href="gov.uk/government/uploads/system/three.doc">Document</a>' +
          '<a href="www.gov.uk/government/uploads/link.png">Image</a>' +
          '<a href="assets.publishing.service.gov.uk/one.pdf">PDF</a>' +
          '<a href="assets.publishing.service.gov.uk/two.xslt">Spreadsheet</a>' +
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
        '</div>'

      body.appendChild(links)
      body.addEventListener('click', preventDefault)

      linkClickTracker = GOVUK.analyticsGA4.linkClickTracker
      linkClickTracker.trackLinkClicks()
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkClickTracker.stopTracking()
    })

    it('detects download clicks on fully structured gov.uk download links', function () {
      var linksToTest = document.querySelectorAll('.fully-structured-download-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.type = 'download'
        expected.event_data.external = 'false'
        expected.event_data.text = link.innerText.trim()
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
        expected.event_data.type = 'download'
        expected.event_data.external = 'false'
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
        expected.event_data.type = 'download'
        expected.event_data.external = 'false'
        expected.event_data.text = link.innerText.trim()
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
        expected.event_data.type = 'download'
        expected.event_data.external = 'false'
        expected.event_data.text = link.innerText.trim()
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
        expected.event_data.type = 'download'
        expected.event_data.external = 'false'
        expected.event_data.text = link.innerText.trim()
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
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
        expected.event_data.type = 'generic link'
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
        expected.event_data.type = 'download'
        expected.event_data.external = 'false'
        expected.event_data.text = link.innerText.trim()
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })
  })

  describe('Mailto link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = new GOVUK.analyticsGA4.Schemas().eventSchema()
      expected.event = 'analytics'
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

      linkClickTracker = GOVUK.analyticsGA4.linkClickTracker
      linkClickTracker.trackLinkClicks()
    })

    afterEach(function () {
      body.removeEventListener('click', preventDefault)
      links.remove()
      linkClickTracker.stopTracking()
    })

    it('detects email events on mailto links', function () {
      var linksToTest = document.querySelectorAll('.mail-to-links a')

      for (var i = 0; i < linksToTest.length; i++) {
        window.dataLayer = []
        var link = linksToTest[i]
        GOVUK.triggerEvent(link, 'click')
        expected.event_data.url = link.getAttribute('href')
        expected.event_data.text = link.innerText.trim()
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
})
