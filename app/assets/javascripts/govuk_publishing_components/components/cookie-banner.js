window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieBanner ($module) {
    this.$module = $module
    this.$module.cookieBannerConfirmationMessage = this.$module.querySelector('.gem-c-cookie-banner__confirmation')
    this.$module.cookieBannerConfirmationMessageText = this.$module.querySelector('.gem-c-cookie-banner__confirmation-message')
  }

  CookieBanner.prototype.init = function () {
    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$module.showCookieMessage = this.showCookieMessage.bind(this)
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this)
    this.$module.setCookieConsent = this.setCookieConsent.bind(this)
    this.$module.rejectCookieConsent = this.rejectCookieConsent.bind(this)
    this.setupCookieMessage()

    if (window.GOVUK.useSingleConsentApi) {
      window.addEventListener('hide-cookie-banner', this.$module.hideCookieMessage)
      window.addEventListener('show-cookie-banner', this.$module.showCookieMessage)
      window.GOVUK.singleConsent.init()
    }
  }

  CookieBanner.prototype.setupCookieMessage = function () {
    this.$hideLinks = this.$module.querySelectorAll('button[data-hide-cookie-banner]')
    if (this.$hideLinks && this.$hideLinks.length) {
      for (var i = 0; i < this.$hideLinks.length; i++) {
        this.$hideLinks[i].addEventListener('click', this.$module.hideCookieMessage)
      }
    }

    this.$acceptCookiesButton = this.$module.querySelector('button[data-accept-cookies]')
    if (this.$acceptCookiesButton) {
      this.$acceptCookiesButton.addEventListener('click', this.$module.setCookieConsent)
    }

    this.$rejectCookiesButton = this.$module.querySelector('button[data-reject-cookies]')
    if (this.$rejectCookiesButton) {
      this.$rejectCookiesButton.addEventListener('click', this.$module.rejectCookieConsent)
    }

    if (!window.GOVUK.useSingleConsentApi) {
      this.showCookieMessage()
    }
  }

  CookieBanner.prototype.showCookieMessage = function () {
    window.removeEventListener('show-cookie-banner', this.$module.showCookieMessage)
    // Show the cookie banner if not in the cookie settings page or in an iframe
    if (!this.isInCookiesPage() && !this.isInIframe()) {
      var shouldHaveCookieMessage = (this.$module && window.GOVUK.cookie('cookies_preferences_set') !== 'true')

      if (shouldHaveCookieMessage) {
        this.$module.removeAttribute('hidden')

        // Set the default consent cookie if it isn't already present
        if (!window.GOVUK.cookie('cookies_policy')) {
          if (!window.GOVUK.useSingleConsentApi) {
            window.GOVUK.setDefaultConsentCookie()
          }
        }

        window.GOVUK.deleteUnconsentedCookies()
      }
    }
  }

  CookieBanner.prototype.hideCookieMessage = function (event) {
    window.removeEventListener('hide-cookie-banner', this.$module.hideCookieMessage)
    if (this.$module) {
      this.$module.hidden = true
      if (!window.GOVUK.useSingleConsentApi) {
        window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
      }
    }

    if (event.target) {
      event.preventDefault()
    }
  }

  CookieBanner.prototype.setCookieConsent = function () {
    if (this.$acceptCookiesButton.getAttribute('data-cookie-types') === 'all') {
      this.$module.querySelector('.gem-c-cookie-banner__confirmation-message--accepted').hidden = false
    }
    if (window.GOVUK.useSingleConsentApi) {
      window.GOVUK.singleConsent.setPreferences('accept')
    } else {
      window.GOVUK.approveAllCookieTypes()
      window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
    }

    this.$module.showConfirmationMessage()
    this.$module.cookieBannerConfirmationMessage.focus()

    if (window.GOVUK.globalBannerInit) {
      window.GOVUK.globalBannerInit.init()
    }
    if (!window.GOVUK.useSingleConsentApi) {
      window.GOVUK.triggerEvent(window, 'cookie-consent')
    }
  }

  CookieBanner.prototype.rejectCookieConsent = function () {
    this.$module.querySelector('.gem-c-cookie-banner__confirmation-message--rejected').hidden = false
    this.$module.showConfirmationMessage()
    this.$module.cookieBannerConfirmationMessage.focus()
    if (window.GOVUK.useSingleConsentApi) {
      window.GOVUK.singleConsent.setPreferences('reject')
    } else {
      window.GOVUK.setDefaultConsentCookie()
      window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
    }
  }

  CookieBanner.prototype.showConfirmationMessage = function () {
    this.$cookieBannerHeader = this.$module.querySelector('.govuk-cookie-banner__heading')
    this.$cookieBannerHeader.hidden = true

    this.$cookieBannerMainContent = this.$module.querySelector('.gem-c-cookie-banner__content')
    this.$cookieBannerMainContent.hidden = true

    this.$cookieBannerConfirmationButtons = this.$module.querySelector('.js-confirmation-buttons')
    this.$cookieBannerConfirmationButtons.hidden = true

    this.$cookieBannerHideButton = this.$module.querySelector('.js-hide-button')
    this.$cookieBannerHideButton.hidden = false
  }

  CookieBanner.prototype.isInCookiesPage = function () {
    return window.location.pathname === '/help/cookies'
  }

  CookieBanner.prototype.isInIframe = function () {
    return window.parent && window.location !== window.parent.location
  }

  Modules.CookieBanner = CookieBanner
})(window.GOVUK.Modules)
