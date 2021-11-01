;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.ExplicitCrossDomainLinks = function () {
    this.start = function ($module) {
      var element = $module[0]

      var cookieBannerEngaged = GOVUK.cookie('cookies_preferences_set')

      // If not engaged, append only ?cookie-consent=not-engaged
      // If engaged and rejected, append only ?cookie-consent=reject
      // If engaged and accepted usage, append ?_ga=clientid if available and cookie-consent=accept

      if (cookieBannerEngaged !== 'true') {
        this.decorate(element, 'cookie_consent=not-engaged')
        return
      }
      var cookieConsent = GOVUK.getConsentCookie()
      if (cookieConsent.usage === false) {
        this.decorate(element, 'cookie_consent=reject')
        return
      }

      this.decorate(element, 'cookie_consent=accept')

      if (!global.ga) { return }

      global.ga(function () {
        var trackers = global.ga.getAll()

        if (!trackers.length) { return }

        var linker = new global.gaplugins.Linker(trackers[0])

        var attrAction = element.getAttribute('action')
        if (attrAction) {
          element.setAttribute('action', linker.decorate(attrAction))
        }

        var attrHref = element.getAttribute('href')
        if (attrHref) {
          element.href = linker.decorate(attrHref)
        }
      })
    }

    this.decorate = function (element, param) {
      var attribute = 'href'
      var attributeValue = element.getAttribute(attribute)

      if (!attributeValue) {
        attribute = 'action'
        attributeValue = element.getAttribute(attribute)
      }

      if (!attributeValue) { return }

      if (attributeValue.includes('?')) {
        attributeValue += '&' + param
        element.setAttribute(attribute, attributeValue)
      } else {
        attributeValue += '?' + param
        element.setAttribute(attribute, attributeValue)
      }
    }
  }

  global.GOVUK = GOVUK
})(window)
