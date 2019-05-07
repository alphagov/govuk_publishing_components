window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieBanner () { }

  CookieBanner.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this)

    this.$hideLink = this.$module.querySelector('a[data-hide-cookie-banner], button[data-hide-cookie-banner]')
    if (this.$hideLink) {
      this.$hideLink.addEventListener('click', this.$module.hideCookieMessage)
    }

    this.$acceptCookiesLink = this.$module.querySelector('button[data-accept-cookies]')
    if (this.$acceptCookiesLink) {
      this.$acceptCookiesLink.addEventListener('click', this.$module.showConfirmationMessage)
    }

    this.showCookieMessage()
  }

  CookieBanner.prototype.showCookieMessage = function () {
    var hasCookieMessage = (this.$module && window.GOVUK.cookie('seen_cookie_message') !== 'true')
    if (hasCookieMessage) {
      this.$module.style.display = 'block'
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

  CookieBanner.prototype.showConfirmationMessage = function (event) {
    this.$cookieBannerMainContent = document.querySelector('.gem-c-cookie-banner__wrapper')
    this.$cookieBannerConfirmationMessage = document.querySelector('.gem-c-cookie-banner__confirmation')

    this.$cookieBannerMainContent.style.display = 'none'
    this.$cookieBannerConfirmationMessage.style.display = 'block'
  }

  Modules.CookieBanner = CookieBanner
})(window.GOVUK.Modules)
