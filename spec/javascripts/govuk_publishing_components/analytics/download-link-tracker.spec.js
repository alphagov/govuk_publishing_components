/* global describe it expect beforeEach afterEach spyOn */

var $ = window.jQuery

describe('GOVUK.analyticsPlugins.downloadLinkTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var $links

  beforeEach(function () {
    $links = $(
      '<div class="download-links">' +
        '<a href="/one.pdf">PDF</a>' +
        '<a href="/two.xslt">Spreadsheet</a>' +
        '<a href="/something/uploads/system/three.doc">Document</a>' +
        '<a href="/an/image/link.png"><img src="/img" /></a>' +
      '</div>' +
      '<div class="normal-links">' +
        '<a href="/normal-link">Normal link</a>' +
        '<a href="/another-link">Another link</a>' +
      '</div>'
    )

    $('html').on('click', function (evt) { evt.preventDefault() })
    $('body').append($links)
    GOVUK.analyticsPlugins.downloadLinkTracker({ selector: 'a[href$=".pdf"], a[href$=".xslt"], a[href$=".doc"], a[href$=".png"]' })
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    $('html').off()
    $('body').off()
    $links.remove()
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  it('listens to clicks on links that match the selector', function () {
    $('.download-links a').each(function () {
      GOVUK.triggerEvent($(this)[0], 'click')
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalled()
      GOVUK.analytics.trackEvent.calls.reset()
    })

    $('.normal-links a').each(function () {
      GOVUK.triggerEvent($(this)[0], 'click')
      expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
      GOVUK.analytics.trackEvent.calls.reset()
    })
  })

  it('listens to click events on elements within download links', function () {
    var links = document.querySelectorAll('.download-links a img')
    for (var i = 0; i < links.length; i++) {
      GOVUK.triggerEvent(links[i], 'click')
    }
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith('Download Link Clicked', '/an/image/link.png', { transport: 'beacon' })
  })

  it('tracks a download link as an event with link text as the label', function () {
    var links = document.querySelectorAll('.download-links a')
    for (var i = 0; i < links.length; i++) {
      GOVUK.triggerEvent(links[i], 'click')
    }

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Download Link Clicked', '/one.pdf', { label: 'PDF', transport: 'beacon' })
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Download Link Clicked', '/two.xslt', { label: 'Spreadsheet', transport: 'beacon' })
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Download Link Clicked', '/something/uploads/system/three.doc', { label: 'Document', transport: 'beacon' })
  })
})
