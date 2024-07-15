;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  GOVUK.analyticsPlugins = GOVUK.analyticsPlugins || {}
  GOVUK.analyticsPlugins.mailtoLinkTracker = function () {
    document.querySelector('body').addEventListener('click', function (event) {
      var element = event.target
      if (element.tagName !== 'A') {
        element = element.closest('a')
      }

      if (!element) {
        return
      }

      var href = element.getAttribute('href')

      if (!href) {
        return
      }

      if (href.substring(0, 7) === 'mailto:') {
        trackClickEvent(element, href)
      }
    })

    function trackClickEvent (element, href) {
      var options = { transport: 'beacon' }
      var linkText = element.textContent

      if (linkText) {
        options.label = linkText.trim()
      }

      GOVUK.analytics.trackEvent('Mailto Link Clicked', href, options)
    }
  }

  global.GOVUK = GOVUK
})(window)
