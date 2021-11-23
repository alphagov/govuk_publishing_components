;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.ExplicitCrossDomainLinks = function () {
    this.start = function ($module) {
      var element = $module[0]

      var cookieBannerEngaged = GOVUK.cookie('cookies_preferences_set')

      // If not engaged, append only ?cookie_consent=not-engaged
      // If engaged and rejected, append only ?cookie_consent=reject
      // If engaged and accepted usage, append ?_ga=clientid if available and cookie_consent=accept

      if (cookieBannerEngaged !== 'true') {
        this.decorate(element, 'cookie_consent=not-engaged')
        this.start = this.start.bind(this, $module)

        // if the user has not engaged with the cookie banner yet, listen for the cookie consent accept/reject events
        // re-start the module if cookies are accepted or rejected on the current page – setting cookie preferences does not reload the page
        window.addEventListener('cookie-consent', this.start)
        window.addEventListener('cookie-reject', this.start)
        return
      }
      var cookieConsent = GOVUK.getConsentCookie()
      if (cookieConsent && cookieConsent.usage === false) {
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
      var cookieConsentParameterPattern = /cookie_consent=[^&]*/
      var paramIsCookieConsent = param.match(cookieConsentParameterPattern)

      if (!attributeValue) {
        attribute = 'action'
        attributeValue = element.getAttribute(attribute)
      }

      if (!attributeValue) { return }

      var attributeHasCookieConsent = attributeValue.match(cookieConsentParameterPattern)

      if (attributeHasCookieConsent && paramIsCookieConsent) {
        // if the decorate function has received a cookie_consent parameter, but the target element already has a cookie_consent parameter, replace the existing parameter with the new value
        attributeValue = attributeValue.replace(cookieConsentParameterPattern, param)
      } else {
        // otherwise, simply append the parameter to the target element href query string
        if (attributeValue.includes('?')) {
          attributeValue += '&' + param
        } else {
          attributeValue += '?' + param
        }
      }

      element.setAttribute(attribute, attributeValue)
    }
  }

  global.GOVUK = GOVUK
})(window)
