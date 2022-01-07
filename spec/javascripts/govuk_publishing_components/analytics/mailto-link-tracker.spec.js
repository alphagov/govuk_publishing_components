/* global describe it expect afterEach beforeEach spyOn */

var $ = window.jQuery

describe('GOVUK.analyticsPlugins.mailtoLinkTracker', function () {
  'use strict'
  var GOVUK = window.GOVUK
  var $links

  beforeEach(function () {
    $links = $(
      '<div class="mailto-links">' +
        '<a href="mailto:name1@email.com"></a>' +
        '<a href="mailto:name2@email.com">The link for a mailto</a>' +
        '<a href="mailto:name3@email.com"><img src="/img" /></a>' +
        '<a>Link without a href</a>' +
      '</div>'
    )

    $('html').on('click', function (evt) { evt.preventDefault() })
    $('body').append($links)
    GOVUK.analyticsPlugins.mailtoLinkTracker()
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

  it('listens to click events on mailto links', function () {
    var links = document.querySelectorAll('.mailto-links a')
    for (var i = 0; i < links.length; i++) {
      GOVUK.triggerEvent(links[i], 'click')
      if (links[i].getAttribute('href')) {
        expect(GOVUK.analytics.trackEvent).toHaveBeenCalled()
        GOVUK.analytics.trackEvent.calls.reset()
      } else {
        expect(GOVUK.analytics.trackEvent).not.toHaveBeenCalled()
      }
    }
  })

  it('tracks mailto addresses and link text', function () {
    var links = document.querySelectorAll('.mailto-links a')
    for (var i = 0; i < links.length; i++) {
      GOVUK.triggerEvent(links[i], 'click')
    }

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Mailto Link Clicked', 'mailto:name1@email.com', { transport: 'beacon' })

    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Mailto Link Clicked', 'mailto:name2@email.com', { transport: 'beacon', label: 'The link for a mailto' })
  })

  it('listens to click events on elements within mailto links', function () {
    var links = document.querySelectorAll('.mailto-links a img')
    for (var i = 0; i < links.length; i++) {
      GOVUK.triggerEvent(links[i], 'click')
    }
    expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
      'Mailto Link Clicked', 'mailto:name3@email.com', { transport: 'beacon' })
  })
})
