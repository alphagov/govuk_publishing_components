window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieBanner () { }

  CookieBanner.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this)
    this.$module.setCookieConsent = this.setCookieConsent.bind(this)

    this.$module.newCookieBanner = document.querySelector('.gem-c-cookie-banner--new')

    // Temporary check while we have 2 banners co-existing.
    // Once the new banner has been deployed, we will be able to remove code relating to the old banner
    // Separating the code out like this does mean some repetition, but will make it easier to remove later
    if (this.$module.newCookieBanner) {
      this.setupNewCookieMessage()
    } else {
      this.setupCookieMessage()
    }
  }

  CookieBanner.prototype.setupCookieMessage = function () {
    this.$hideLink = this.$module.querySelector('a[data-hide-cookie-banner]')
    if (this.$hideLink) {
      this.$hideLink.addEventListener('click', this.$module.hideCookieMessage)
    }

    this.showCookieMessage()
  }

  CookieBanner.prototype.setupNewCookieMessage = function () {
    this.$hideLink = this.$module.querySelector('button[data-hide-cookie-banner]')
    if (this.$hideLink) {
      this.$hideLink.addEventListener('click', this.$module.hideCookieMessage)
    }

    this.$acceptCookiesLink = this.$module.querySelector('button[data-accept-cookies]')
    if (this.$acceptCookiesLink) {
      this.$acceptCookiesLink.addEventListener('click', this.$module.setCookieConsent)
    }

    this.showNewCookieMessage()
  }

  CookieBanner.prototype.showCookieMessage = function () {
    var shouldHaveCookieMessage = (this.$module && window.GOVUK.cookie('seen_cookie_message') !== 'true')

    if (shouldHaveCookieMessage) {
      this.$module.style.display = 'block'
    }
  }

  CookieBanner.prototype.showNewCookieMessage = function () {
    var newCookieBanner = document.querySelector('.gem-c-cookie-banner--new')

    // Hide the cookie banner on the cookie settings page, to avoid circular journeys
    if (newCookieBanner && window.location.pathname === '/help/cookies') {
      this.$module.style.display = 'none'
    }

    var shouldHaveCookieMessage = (this.$module && window.GOVUK.cookie('seen_cookie_message') !== 'true')

    if (shouldHaveCookieMessage) {
      this.$module.style.display = 'block'

      // Set the default consent cookie if it isn't already present
      if (!window.GOVUK.cookie('cookie_policy')) {
        window.GOVUK.setDefaultConsentCookie()
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
