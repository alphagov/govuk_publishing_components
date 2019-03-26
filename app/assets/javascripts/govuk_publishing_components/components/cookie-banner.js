window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CookieBanner () { }

  CookieBanner.prototype.start = function ($module) {
    this.$module = $module[0]

    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this)
    this.$hideLink = this.$module.querySelector('a[data-hide-cookie-banner]')
    if (this.$hideLink) {
      this.$hideLink.addEventListener('click', this.$module.hideCookieMessage)
    }

    this.showCookieMessage()
  }

  CookieBanner.prototype.showCookieMessage = function () {
    var hasCookieMessage = (this.$module && window.GOVUK.cookie('seen_cookie_message') !== 'true')

    if (hasCookieMessage) {
      this.$module.style.display = 'block'
      document.addEventListener('DOMContentLoaded', function (event) {
        if (window.GOVUK.analytics && typeof window.GOVUK.analytics.trackEvent === 'function') {
          window.GOVUK.analytics.trackEvent('cookieBanner', 'Cookie banner shown', {
            value: 1,
            nonInteraction: true
          })
        }
      })
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

  Modules.CookieBanner = CookieBanner
})(window.GOVUK.Modules)
