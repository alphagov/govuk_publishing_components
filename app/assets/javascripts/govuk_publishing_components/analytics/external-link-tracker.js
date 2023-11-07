;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {}
  GOVUK.analyticsPlugins.externalLinkTracker = function (options) {
    options = options || {}
    GOVUK.analyticsPlugins.externalLinkTracker.options = options
    document.querySelector('body').addEventListener('click', GOVUK.analyticsPlugins.externalLinkTracker.handleClick)
  }

  GOVUK.analyticsPlugins.externalLinkTracker.handleClick = function (event) {
    var element = event.target
    if (element.tagName !== 'A') {
      element = element.closest('a')
    }

    if (!element) {
      return
    }

    if (GOVUK.analyticsPlugins.externalLinkTracker.isExternalLink(element.getAttribute('href'))) {
      GOVUK.analyticsPlugins.externalLinkTracker.trackClickEvent(element)
    }
  }

  GOVUK.analyticsPlugins.externalLinkTracker.isExternalLink = function (href) {
    if (!href) {
      return false
    }

    var currentHost = GOVUK.analyticsPlugins.externalLinkTracker.getHostname()
    if (href.substring(0, 4) === 'http' && href.indexOf(currentHost) === -1) {
      return true
    }
  }

  GOVUK.analyticsPlugins.externalLinkTracker.trackClickEvent = function (element) {
    var options = { transport: 'beacon' }
    var href = element.getAttribute('href')
    var linkText = element.textContent.trim()

    if (linkText) {
      options.label = linkText
    }

    var externalLinkUploadCustomDimension = GOVUK.analyticsPlugins.externalLinkTracker.options.externalLinkUploadCustomDimension
    if (externalLinkUploadCustomDimension !== undefined) {
      // This custom dimension will be used to duplicate the url information
      // that we normally send in an "event action". This will be used to join
      // up with a scheduled custom upload called "External Link Status".
      // We can only join uploads on custom dimensions, not on `event actions`
      // where we normally add the url info.
      var externalLinkToJoinUploadOn = href

      GOVUK.analytics.setDimension(externalLinkUploadCustomDimension, externalLinkToJoinUploadOn)
    }
    GOVUK.analytics.trackEvent('External Link Clicked', href, options)
  }

  GOVUK.analyticsPlugins.externalLinkTracker.getHostname = function () {
    return global.location.hostname
  }

  global.GOVUK = GOVUK
})(window)
