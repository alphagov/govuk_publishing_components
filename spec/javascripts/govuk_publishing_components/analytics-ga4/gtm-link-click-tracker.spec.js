/* eslint-env jasmine, jquery */

describe('GOVUK.analyticsGA4.linkClickTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var $ = window.jQuery
  var $links
  var expected

  describe('External link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = {
        event: 'analytics',
        event_name: 'navigation',
        nav: {
          type: 'generic link',
          text: '',
          index: 'n/a',
          'index-total': 'n/a',
          section: 'n/a',
          url: '',
          external: 'true'
        }
      }

      $links = $(
        '<div class="external-links">' +
            '<a href="http://www.nationalarchives1.gov.uk"> National Archives </a>' +
            '<a href="https://www.nationalarchives2.gov.uk"></a>' +
            '<a href="https://www.nationalarchives3.gov.uk/one.pdf">National Archives PDF</a>' +
            '<a href="https://www.nationalarchives4.gov.uk/an/image/link.png"><img src="/img" /></a>' +
          '</div>' +
          '<div class="internal-links">' +
            '<a href="/some-path">Local link</a>' +
            '<a href="http://www.gov.uk/some-path">Another local link</a>' +
          '</div>'
      )

      $('html').on('click', function (evt) { evt.preventDefault() })
      $('body').append($links)

      $('html').off()
      $('body').off()
      GOVUK.analyticsGA4.linkClickTracker()

      spyOn(GOVUK.analyticsGA4.linkClickTracker, 'getHostname').and.returnValue('www.gov.uk')
    })

    afterEach(function () {
      $links.remove()
      $('html').off()
      $('body').off()
    })

    it('listens to click events on only external links', function () {
      $('.external-links a').each(function () {
        window.dataLayer = []
        var $link = $(this)
        GOVUK.triggerEvent($link[0], 'click')

        expected.nav.url = $link.attr('href')
        expected.nav.text = $link.text().trim()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      $('.internal-links a').each(function () {
        window.dataLayer = []
        GOVUK.triggerEvent($(this)[0], 'click')
        expect(window.dataLayer).toEqual([])
      })
    })

    it('listens to click events on elements within external links', function () {
      var $nestedImage = $('.external-links a img')
      var $parentLink = $nestedImage.closest('a')

      GOVUK.triggerEvent($nestedImage[0], 'click')

      expected.nav.url = $parentLink.attr('href')
      expected.nav.text = $parentLink.text().trim()

      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('tracks an external link\'s href and link text', function () {
      var links = document.querySelectorAll('.external-links a')

      for (var i = 0; i < links.length; i++) {
        window.dataLayer = []
        expected.nav.url = links[i].getAttribute('href')
        expected.nav.text = links[i].textContent.trim()
        GOVUK.triggerEvent(links[i], 'click')
        expect(window.dataLayer[0]).toEqual(expected)
      }
    })
  })

  describe('Download link tracking', function () {
    beforeEach(function () {
      window.dataLayer = []
      expected = {
        event: 'analytics',
        event_name: 'navigation',
        nav: {
          type: 'download',
          text: '',
          index: 'n/a',
          'index-total': 'n/a',
          section: 'n/a',
          url: '',
          external: 'false'
        }
      }

      $links = $(
        '<div class="download-links">' +
          '<a href="http://assets.publishing.service.gov.uk/one.pdf">PDF</a>' +
          '<a href="https://assets.publishing.service.gov.uk/two.xslt">Spreadsheet</a>' +
          '<a href="https://www.gov.uk/government/uploads/system/three.doc">Document</a>' +
          '<a href="https://www.gov.uk/government/uploads/link.png"><img src="/img" /></a>' +
        '</div>' +
        '<div class="normal-links">' +
          '<a href="https://www.gov.uk/normal-link">Normal link</a>' +
          '<a href="https://www.gov.uk/another-link">Another link</a>' +
        '</div>'
      )
      $('html').off()
      $('body').off()

      $('html').on('click', function (evt) { evt.preventDefault() })
      $('body').append($links)

      spyOn(GOVUK.analyticsGA4.linkClickTracker, 'getHostname').and.returnValue('gov.uk')
      GOVUK.analyticsGA4.linkClickTracker()
    })

    afterEach(function () {
      $('html').off()
      $('body').off()
      $links.remove()
    })

    it('listens to clicks on gov.uk download paths', function () {
      $('.download-links a').each(function () {
        var $link = $(this)
        window.dataLayer = []
        GOVUK.triggerEvent($link[0], 'click')
        expected.nav.url = $link.attr('href')
        expected.nav.text = $link.text().trim()
        expect(window.dataLayer[0]).toEqual(expected)
      })

      $('.normal-links a').each(function () {
        var $link = $(this)
        window.dataLayer = []
        GOVUK.triggerEvent($link[0], 'click')
        expect(window.dataLayer).toEqual([])
      })
    })

    it('listens to click events on elements within download links', function () {
      $('.download-links a img').each(function () {
        var $link = $(this)
        window.dataLayer = []
        GOVUK.triggerEvent($link[0], 'click')
        expected.nav.url = $link.closest('a').attr('href')
        expected.nav.text = $link.closest('a').text().trim()
        expect(window.dataLayer[0]).toEqual(expected)
      })
    })
  })
})
