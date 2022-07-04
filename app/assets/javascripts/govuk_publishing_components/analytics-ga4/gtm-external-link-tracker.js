;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.externalLinkTracker = function () {
    document.querySelector('body').addEventListener('click', GOVUK.analyticsGA4.externalLinkTracker.handleClick)
  }

  GOVUK.analyticsGA4.externalLinkTracker.handleClick = function (event) {
    var element = event.target
    if (element.tagName !== 'A') {
      element = element.closest('a')
    }

    if (!element) {
      return
    }

    if (GOVUK.analyticsGA4.externalLinkTracker.isExternalLink(element.getAttribute('href'))) {
      GOVUK.analyticsGA4.externalLinkTracker.trackClickEvent(element)
    }
  }

  GOVUK.analyticsGA4.externalLinkTracker.isExternalLink = function (href) {
    if (!href) {
      return false
    }

    var currentHost = GOVUK.analyticsGA4.externalLinkTracker.getHostname()
    if (href.substring(0, 4) === 'http' && href.indexOf(currentHost) === -1) {
      return true
    }
  }

  GOVUK.analyticsGA4.externalLinkTracker.trackClickEvent = function (element) {
    var href = element.getAttribute('href')
    var linkText = element.textContent.trim()

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'analytics',
      event_name: 'navigation',
      nav: {
        type: 'generic link',
        text: linkText,
        index: 'n/a',
        'index-total': 'n/a',
        section: 'n/a',
        url: href,
        external: 'true'
      }
    })
  }

  GOVUK.analyticsGA4.externalLinkTracker.getHostname = function () {
    return global.location.hostname
  }

  global.GOVUK = GOVUK
})(window)
