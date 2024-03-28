window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ExplicitCrossDomainLinks ($module) {
    this.$module = $module

    this.init()
  }

  ExplicitCrossDomainLinks.prototype.init = function () {
    this.attribute = 'href'
    this.attributeValue = this.$module.getAttribute(this.attribute)
    this.eventType = 'click'
    if (!this.attributeValue) {
      this.attribute = 'action'
      this.attributeValue = this.$module.getAttribute(this.attribute)
      this.eventType = 'submit'
    }

    this.handleEvent = this.handleEvent.bind(this)
    this.handleCookiesAccepted = this.handleCookiesAccepted.bind(this)
    // Listens for the 'submit' event if the element is a form, and the 'click' event if it is a link
    this.$module.addEventListener(this.eventType, this.handleEvent)
  }

  ExplicitCrossDomainLinks.prototype.decorate = function (element, param, attribute) {
    var attributeValue = element.getAttribute(attribute)

    if (!attributeValue) { return }

    if (attributeValue.indexOf('?') !== -1) {
      attributeValue += '&' + param
    } else {
      attributeValue += '?' + param
    }

    element.setAttribute(attribute, attributeValue)
  }

  ExplicitCrossDomainLinks.prototype.handleEvent = function (e) {
    //  prevent default: we want the link href and/or form action to be decorated before we navigate away
    e.preventDefault()
    var cookieBannerEngaged = window.GOVUK.cookie('cookies_preferences_set')
    var cookieConsent = window.GOVUK.getConsentCookie()

    if (cookieBannerEngaged !== 'true') {
      // If not engaged, append only ?cookie_consent=not-engaged
      this.decorate(this.$module, 'cookie_consent=not-engaged', this.attribute)
    } else if (cookieConsent && cookieConsent.usage === true) {
      this.handleCookiesAccepted()
    } else {
      this.decorate(this.$module, 'cookie_consent=reject', this.attribute)
    }

    // remove the event listener to avoid an infinite loop
    this.$module.removeEventListener(this.eventType, this.handleEvent)

    // if the element is a form, submit it. If it is a link, click it
    if (this.eventType === 'submit') {
      this.$module.submit()
    } else {
      this.$module.click()
    }
  }

  ExplicitCrossDomainLinks.prototype.handleCookiesAccepted = function () {
    // If the cookie banner was engaged and usage cookie accepted, append ?_ga=clientid if available and cookie_consent=accept
    var element = this.$module
    var attribute = this.attribute
    this.decorate(element, 'cookie_consent=accept', attribute)

    if (!window.ga) {
      return
    }

    window.ga(function () {
      var trackers = window.ga.getAll()

      if (!trackers.length) { return }

      var linker = new window.gaplugins.Linker(trackers[0])
      var attrValue = element.getAttribute(attribute)

      element.setAttribute(attribute, linker.decorate(attrValue))
    })
  }

  Modules.ExplicitCrossDomainLinks = ExplicitCrossDomainLinks
})(window.GOVUK.Modules)
