;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.ExplicitCrossDomainLinks = function () {
    this.start = function ($module) {
      this.element = $module[0]
      this.attribute = 'href'
      this.attributeValue = this.element.getAttribute(this.attribute)
      this.eventType = 'click'
      if (!this.attributeValue) {
        this.attribute = 'action'
        this.attributeValue = this.element.getAttribute(this.attribute)
        this.eventType = 'submit'
      }

      this.handleEvent = this.handleEvent.bind(this)
      this.handleCookiesAccepted = this.handleCookiesAccepted.bind(this)
      // Listens for the 'submit' event if the element is a form, and the 'click' event if it is a link
      this.element.addEventListener(this.eventType, this.handleEvent)
    }

    this.handleEvent = function (e) {
      //  prevent default: we want the link href and/or form action to be decorated before we navigate away
      e.preventDefault()
      var cookieBannerEngaged = GOVUK.cookie('cookies_preferences_set')
      var cookieConsent = GOVUK.getConsentCookie()

      if (cookieBannerEngaged !== 'true') {
        // If not engaged, append only ?cookie_consent=not-engaged
        this.decorate(this.element, 'cookie_consent=not-engaged', this.attribute)
      } else if (cookieConsent && cookieConsent.usage === true) {
        this.handleCookiesAccepted()
      } else {
        this.decorate(this.element, 'cookie_consent=reject', this.attribute)
      }

      // remove the event listener to avoid an infinite loop
      this.element.removeEventListener(this.eventType, this.handleEvent)

      // if the element is a form, submit it. If it is a link, click it
      if (this.eventType === 'submit') {
        this.element.submit()
      } else {
        this.element.click()
      }
    }

    this.handleCookiesAccepted = function () {
      // If the cookie banner was engaged and usage cookie accepted, append ?_ga=clientid if available and cookie_consent=accept
      var element = this.element
      var attribute = this.attribute
      this.decorate(element, 'cookie_consent=accept', attribute)

      if (!global.ga) {
        return
      }

      global.ga(function () {
        var trackers = global.ga.getAll()

        if (!trackers.length) { return }

        var linker = new global.gaplugins.Linker(trackers[0])
        var attrValue = element.getAttribute(attribute)

        element.setAttribute(attribute, linker.decorate(attrValue))
      })
    }

    this.decorate = function (element, param, attribute) {
      var attributeValue = element.getAttribute(attribute)

      if (!attributeValue) { return }

      if (attributeValue.indexOf('?') !== -1) {
        attributeValue += '&' + param
      } else {
        attributeValue += '?' + param
      }

      element.setAttribute(attribute, attributeValue)
    }
  }

  global.GOVUK = GOVUK
})(window)
