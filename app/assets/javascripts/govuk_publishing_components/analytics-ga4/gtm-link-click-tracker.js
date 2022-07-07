;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.analyticsGA4 = GOVUK.analyticsGA4 || {}

  GOVUK.analyticsGA4.linkClickTracker = function () {
    document.querySelector('body').addEventListener('click', GOVUK.analyticsGA4.linkClickTracker.handleClick)
  }

  GOVUK.analyticsGA4.linkClickTracker.internalLinksDomain = 'gov.uk/'

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
    var assetsDomain = 'assets.publishing.service.gov.uk/'
    var uploadsPath = '/government/uploads/'
    if (!href) {
      return false
    }

    if (this.hrefPointsToDomain(href, assetsDomain)) {
      return true
    }

    if (this.hrefPointsToDomain(href, this.internalLinksDomain) && href.indexOf(uploadsPath) !== -1) {
      return true
    }

    // Checks relative links to the uploadsPath
    if (this.stringStartsWith(href, uploadsPath)) {
      return true
    }
  }

  GOVUK.analyticsGA4.linkClickTracker.isExternalLink = function (href) {
    if (!href) {
      return false
    }

    if (!this.hrefPointsToDomain(href, this.internalLinksDomain) && !this.hrefIsRelative(href)) {
      return true
    }
  }

  GOVUK.analyticsGA4.linkClickTracker.trackClickEvent = function (attributes) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(attributes)
  }

  GOVUK.analyticsGA4.linkClickTracker.hrefPointsToDomain = function (href, domain) {
    // If href contains www. remove it so we can compare the href's root domain against the parameter domain, which is a root domain
    if (href.indexOf('www.' + domain) !== -1) {
      href = href.replace('www.' + domain, domain)
    }

    var httpDomain = 'http://' + domain
    var httpsDomain = 'https://' + domain
    var schemaRelativeDomain = '//' + domain
    return this.stringStartsWith(href, domain) ||
    this.stringStartsWith(href, httpDomain) ||
    this.stringStartsWith(href, httpsDomain) ||
    this.stringStartsWith(href, schemaRelativeDomain)
  }

  GOVUK.analyticsGA4.linkClickTracker.stringStartsWith = function (string, stringToFind) {
    return string.substring(0, stringToFind.length) === stringToFind
  }

  GOVUK.analyticsGA4.linkClickTracker.hrefIsRelative = function (href) {
    // Checks that a link is relative, but is not a schema relative url
    return this.stringStartsWith(href, '/') && !this.stringStartsWith(href, '//')
  }

  global.GOVUK = GOVUK
})(window)
