/* eslint-env jasmine, jquery */

describe('GOVUK.analyticsGA4.externalLinkTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var $ = window.jQuery
  var $links
  var expected
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
          '<a href="http://fake-hostname.com/some-path">Another local link</a>' +
        '</div>'
    )

    $('html').on('click', function (evt) { evt.preventDefault() })
    $('body').append($links)

    spyOn(GOVUK.analyticsGA4.externalLinkTracker, 'getHostname').and.returnValue('fake-hostname.com')
  })

  afterEach(function () {
    $('html').off()
    $('body').off()
    $links.remove()
  })

  it('listens to click events on only external links', function () {
    GOVUK.analyticsGA4.externalLinkTracker()

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
    GOVUK.analyticsGA4.externalLinkTracker()
    GOVUK.triggerEvent($nestedImage[0], 'click')

    expected.nav.url = $parentLink.attr('href')
    expected.nav.text = $parentLink.text().trim()

    expect(window.dataLayer[0]).toEqual(expected)
  })

  it('tracks an external link\'s href and link text', function () {
    GOVUK.analyticsGA4.externalLinkTracker()
    var links = document.querySelectorAll('.external-links a')

    for (var i = 0; i < links.length; i++) {
      window.dataLayer = []
      console.log(links[i].textContent.trim(), i)
      expected.nav.url = links[i].getAttribute('href')
      expected.nav.text = links[i].textContent.trim()
      GOVUK.triggerEvent(links[i], 'click')
      expect(window.dataLayer[0]).toEqual(expected)
    }
  })
})
