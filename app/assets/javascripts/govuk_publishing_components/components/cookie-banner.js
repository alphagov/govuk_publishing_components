window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieBanner ($module) {
    this.$module = $module
    this.$module.cookieBanner = document.querySelector('.gem-c-cookie-banner')
    this.$module.cookieBannerConfirmationMessage = this.$module.querySelector('.gem-c-cookie-banner__confirmation')
    this.$module.cookieBannerConfirmationMessageText = this.$module.querySelector('.gem-c-cookie-banner__confirmation-message')
  }

  CookieBanner.prototype.init = function () {
    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this)
    this.$module.setCookieConsent = this.setCookieConsent.bind(this)
    this.$module.rejectCookieConsent = this.rejectCookieConsent.bind(this)
    this.setupCookieMessage()
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
      this.$acceptCookiesButton.style.display = 'block'
      this.$acceptCookiesButton.addEventListener('click', this.$module.setCookieConsent)
    }

    this.$rejectCookiesButton = this.$module.querySelector('button[data-reject-cookies]')
    if (this.$rejectCookiesButton) {
      this.$rejectCookiesButton.style.display = 'block'
      this.$rejectCookiesButton.addEventListener('click', this.$module.rejectCookieConsent)
    }

    this.showCookieMessage()
  }

  CookieBanner.prototype.showCookieMessage = function () {
    // Show the cookie banner if not in the cookie settings page or in an iframe
    if (!this.isInCookiesPage() && !this.isInIframe()) {
      var shouldHaveCookieMessage = (this.$module && window.GOVUK.cookie('cookies_preferences_set') !== 'true')

      if (shouldHaveCookieMessage) {
        this.$module.style.display = 'block'

        // Set the default consent cookie if it isn't already present
        if (!window.GOVUK.cookie('cookies_policy')) {
          window.GOVUK.setDefaultConsentCookie()
        }

        window.GOVUK.deleteUnconsentedCookies()
      } else {
        this.$module.style.display = 'none'
      }
    } else {
      this.$module.style.display = 'none'
    }
  }

  CookieBanner.prototype.hideCookieMessage = function (event) {
    if (this.$module) {
      this.$module.hidden = true
      this.$module.style.display = 'none'
      window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
    }

    if (event.target) {
      event.preventDefault()
    }
  }

  CookieBanner.prototype.setCookieConsent = function () {
    if (this.$acceptCookiesButton.getAttribute('data-cookie-types') === 'all') {
      this.$module.cookieBannerConfirmationMessageText.insertAdjacentHTML('afterbegin', 'You have accepted additional cookies. ')
    }
    window.GOVUK.approveAllCookieTypes()
    this.$module.showConfirmationMessage()
    this.$module.cookieBannerConfirmationMessage.focus()
    window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
    if (window.GOVUK.analyticsInit) {
      window.GOVUK.analyticsInit()
    }
    if (window.GOVUK.globalBarInit) {
      window.GOVUK.globalBarInit.init()
    }
    window.GOVUK.triggerEvent(window, 'cookie-consent')
  }

  CookieBanner.prototype.rejectCookieConsent = function () {
    this.$module.cookieBannerConfirmationMessageText.insertAdjacentHTML('afterbegin', 'You have rejected additional cookies. ')
    this.$module.showConfirmationMessage()
    this.$module.cookieBannerConfirmationMessage.focus()
    window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
  }

  CookieBanner.prototype.showConfirmationMessage = function () {
    this.$cookieBannerMainContent = document.querySelector('.js-banner-wrapper')

    this.$cookieBannerMainContent.hidden = true
    this.$module.cookieBannerConfirmationMessage.style.display = 'block'
    this.$module.cookieBannerConfirmationMessage.hidden = false
  }

  CookieBanner.prototype.isInCookiesPage = function () {
    return window.location.pathname === '/help/cookies'
  }

  CookieBanner.prototype.isInIframe = function () {
    return window.parent && window.location !== window.parent.location
  }

  Modules.CookieBanner = CookieBanner
})(window.GOVUK.Modules)
