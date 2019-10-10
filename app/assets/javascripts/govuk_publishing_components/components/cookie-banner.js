window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieBanner () { }

  CookieBanner.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this)
    this.$module.setCookieConsent = this.setCookieConsent.bind(this)

    this.$module.cookieBanner = document.querySelector('.gem-c-cookie-banner')
    this.$module.cookieBannerConfirmationMessage = this.$module.querySelector('.gem-c-cookie-banner__confirmation')

    this.setupCookieMessage()
  }

  CookieBanner.prototype.setupCookieMessage = function () {
    this.$hideLink = this.$module.querySelector('button[data-hide-cookie-banner]')
    if (this.$hideLink) {
      this.$hideLink.addEventListener('click', this.$module.hideCookieMessage)
    }

    this.$acceptCookiesLink = this.$module.querySelector('button[data-accept-cookies]')
    if (this.$acceptCookiesLink) {
      this.$acceptCookiesLink.addEventListener('click', this.$module.setCookieConsent)
    }

    // Force the new cookie banner to show if we don't think the user has seen it before
    // This involves resetting the seen_cookie_message cookie, which may be set to true if they've seen the old cookie banner
    if (!window.GOVUK.cookie('cookie_policy')) {
      if (window.GOVUK.cookie('seen_cookie_message') === 'true') {
        window.GOVUK.cookie('seen_cookie_message', false, { days: 365 })
      }
    }

    this.showCookieMessage()
  }

  CookieBanner.prototype.showCookieMessage = function () {
    // Show the cookie banner if not in the cookie settings page or in an iframe
    if (!this.isInCookiesPage() && !this.isInIframe()) {
      var shouldHaveCookieMessage = (this.$module && window.GOVUK.cookie('seen_cookie_message') !== 'true')

      if (shouldHaveCookieMessage) {
        this.$module.style.display = 'block'

        // Set the default consent cookie if it isn't already present
        if (!window.GOVUK.cookie('cookie_policy')) {
          window.GOVUK.setDefaultConsentCookie()
        }
      } else {
        this.$module.style.display = 'none'
      }
    } else {
      this.$module.style.display = 'none'
    }
  }

  CookieBanner.prototype.hideCookieMessage = function (event) {
    if (this.$module) {
      this.$module.style.display = 'none'
      window.GOVUK.cookie('seen_cookie_message', 'true', { days: 365 })
    }

    if (event.target) {
      event.preventDefault()
    }
  }

  CookieBanner.prototype.setCookieConsent = function () {
    window.GOVUK.approveAllCookieTypes()
    this.$module.showConfirmationMessage()
    this.$module.cookieBannerConfirmationMessage.focus()
    window.GOVUK.cookie('seen_cookie_message', 'true', { days: 365 })
  }

  CookieBanner.prototype.showConfirmationMessage = function () {
    this.$cookieBannerMainContent = document.querySelector('.gem-c-cookie-banner__wrapper')

    this.$cookieBannerMainContent.style.display = 'none'
    this.$module.cookieBannerConfirmationMessage.style.display = 'block'
  }

  CookieBanner.prototype.listenForCrossOriginMessages = function () {
    window.addEventListener('message', this.receiveMessage.bind(this), false)
  }

  CookieBanner.prototype.isInCookiesPage = function () {
    return window.location.pathname === '/help/cookies'
  }

  CookieBanner.prototype.isInIframe = function () {
    return window.parent && window.location !== window.parent.location
  }

  Modules.CookieBanner = CookieBanner
})(window.GOVUK.Modules)
