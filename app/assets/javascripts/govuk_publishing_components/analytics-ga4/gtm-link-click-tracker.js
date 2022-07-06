;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.linkClickTracker = function () {
    document.querySelector('body').addEventListener('click', GOVUK.analyticsGA4.linkClickTracker.handleClick)
  }

  GOVUK.analyticsGA4.linkClickTracker.removeTracker = function () {
    document.querySelector('body').removeEventListener('click', GOVUK.analyticsGA4.linkClickTracker.handleClick)
  }

  GOVUK.analyticsGA4.linkClickTracker.handleClick = function (event) {
    var element = event.target

    if (element.tagName !== 'A') {
      element = element.closest('a')
    }

    if (!element) {
      return
    }

    var DEFAULT_ATTRIBUTES = {
      event: 'analytics',
      event_name: 'navigation',
      nav: {
        type: '',
        text: element.textContent.trim(),
        index: 'n/a',
        'index-total': 'n/a',
        section: 'n/a',
        url: element.getAttribute('href'),
        external: ''
      }
    }
    var attributes
    var href = element.getAttribute('href')

    if (GOVUK.analyticsGA4.linkClickTracker.isMailToLink(href)) {
      attributes = Object.assign({}, DEFAULT_ATTRIBUTES)
      attributes.nav.type = 'mailto'
      attributes.nav.external = 'true'
    } else if (GOVUK.analyticsGA4.linkClickTracker.isDownloadLink(href)) {
      attributes = Object.assign({}, DEFAULT_ATTRIBUTES)
      attributes.nav.type = 'download'
      attributes.nav.external = 'false'
    } else if (GOVUK.analyticsGA4.linkClickTracker.isExternalLink(href)) {
      attributes = Object.assign({}, DEFAULT_ATTRIBUTES)
      attributes.nav.type = 'generic link'
      attributes.nav.external = 'true'
    }

    if (attributes) {
      GOVUK.analyticsGA4.linkClickTracker.trackClickEvent(attributes)
    }
  }

  GOVUK.analyticsGA4.linkClickTracker.isMailToLink = function (href) {
    if (!href) {
      return false
    }

    if (href.length < 7) {
      return false
    }
    return href.substring(0, 7) === 'mailto:'
  }

  GOVUK.analyticsGA4.linkClickTracker.isDownloadLink = function (href) {
    var assetsDomain = 'assets.publishing.service.gov.uk'
    var uploadsPath = '/government/uploads/'
    if (!href) {
      return false
    }

    if (href.substring(0, 4) === 'http' && href.indexOf(assetsDomain) !== -1) {
      return true
    }

    var currentHost = GOVUK.analyticsGA4.linkClickTracker.getHostname()
    if (href.indexOf(currentHost) !== -1 && href.indexOf(uploadsPath) !== -1) {
      return true
    }
  }

  GOVUK.analyticsGA4.linkClickTracker.isExternalLink = function (href) {
    if (!href) {
      return false
    }

    var currentHost = GOVUK.analyticsGA4.linkClickTracker.getHostname()
    if (href.substring(0, 4) === 'http' && href.indexOf(currentHost) === -1) {
      return true
    }
  }

  GOVUK.analyticsGA4.linkClickTracker.trackClickEvent = function (attributes) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(attributes)
  }

  GOVUK.analyticsGA4.linkClickTracker.getHostname = function () {
    return global.location.hostname
  }

  global.GOVUK = GOVUK
})(window)
