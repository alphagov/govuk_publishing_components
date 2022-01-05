;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {}
  GOVUK.analyticsPlugins.downloadLinkTracker = function (options) {
    options = options || {}
    var downloadLinkSelector = options.selector
    var selectors = downloadLinkSelector.split(',')

    if (downloadLinkSelector) {
      document.querySelector('body').addEventListener('click', function (event) {
        var element = event.target
        if (element.tagName !== 'A') {
          element = element.closest('a')
        }

        if (!element) {
          return
        }

        for (var i = 0; i < selectors.length; i++) {
          if (element.matches(selectors[i].trim())) {
            trackDownload(element)
            break
          }
        }
      })
    }

    function trackDownload (element) {
      var href = element.getAttribute('href')
      var evtOptions = { transport: 'beacon' }
      var linkText = element.textContent.trim()

      if (linkText) {
        evtOptions.label = linkText
      }

      GOVUK.analytics.trackEvent('Download Link Clicked', href, evtOptions)
    }
  }

  global.GOVUK = GOVUK
})(window)
