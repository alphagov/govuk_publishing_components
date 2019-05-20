window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieBanner () { }

  CookieBanner.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this)
    this.$module.setCookieConsent = this.setCookieConsent.bind(this)

    var newCookieBanner = document.querySelector('.gem-c-cookie-banner--new')

    // Hide the cookie banner on the cookie settings page, to avoid circular journeys
    if (newCookieBanner && window.location.pathname === '/help/cookies') {
      this.$module.style.display = 'none'
    } else {
      this.$hideLink = this.$module.querySelector('a[data-hide-cookie-banner], button[data-hide-cookie-banner]')
      if (this.$hideLink) {
        this.$hideLink.addEventListener('click', this.$module.hideCookieMessage)
      }

      this.$acceptCookiesLink = this.$module.querySelector('button[data-accept-cookies]')
      if (this.$acceptCookiesLink) {
        this.$acceptCookiesLink.addEventListener('click', this.$module.setCookieConsent)
      }

      this.showCookieMessage()
    }
  }

  CookieBanner.prototype.showCookieMessage = function () {
    var newCookieBanner = document.querySelector('.gem-c-cookie-banner--new')
    var hasCookieMessage = (this.$module && window.GOVUK.cookie('seen_cookie_message') !== 'true')
    if (hasCookieMessage) {
      this.$module.style.display = 'block'
    }

    if (newCookieBanner && hasCookieMessage) {
      if (!window.GOVUK.cookie('cookie_policy')) {
        window.GOVUK.setDefaultConsentCookie()
      }
    } else if (!newCookieBanner) {
      // Remove the consent cookie if we're using the old cookie banner
      // TODO: this can be removed later when we switch to the new banner
      if (window.GOVUK.cookie('cookie_policy')) {
        window.GOVUK.cookie('cookie_policy', null)
      }
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
    window.GOVUK.setCookie('seen_cookie_message', 'true')
  }

  CookieBanner.prototype.showConfirmationMessage = function () {
    this.$cookieBannerMainContent = document.querySelector('.gem-c-cookie-banner__wrapper')
    this.$cookieBannerConfirmationMessage = document.querySelector('.gem-c-cookie-banner__confirmation')

    this.$cookieBannerMainContent.style.display = 'none'
    this.$cookieBannerConfirmationMessage.style.display = 'block'
  }

  Modules.CookieBanner = CookieBanner
})(window.GOVUK.Modules)
