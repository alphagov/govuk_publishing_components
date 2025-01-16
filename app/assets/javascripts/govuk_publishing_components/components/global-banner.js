//= require govuk_publishing_components/lib/cookie-functions
/*
  Global banner

  Manages count of how many times a global banner has been seen
  using cookies.
*/
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GlobalBanner ($module) {
    this.$module = $module
    this.GLOBAL_BANNER_SEEN_COOKIE = 'global_banner_seen'
    this.alwaysOn = this.$module.getAttribute('data-global-banner-permanent') === 'true'
  }

  GlobalBanner.prototype.init = function () {
    var cookieCategory = window.GOVUK.getCookieCategory(this.GLOBAL_BANNER_SEEN_COOKIE)
    var cookieConsent = window.GOVUK.getConsentCookie()[cookieCategory]

    if (cookieConsent) {
      // If the cookie is not set, let's set a basic one
      if (window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE) === null || window.GOVUK.parseCookie(window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE)).count === undefined) {
        window.GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 0, version: 0 }), { days: 84 })
      }

      var currentCookie = window.GOVUK.parseCookie(window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE))
      var currentCookieVersion = currentCookie.version
      var count = this.viewCount()
    }

    // if the element is visible
    if (this.$module.offsetParent !== null && !this.alwaysOn) {
      this.incrementViewCount(count, currentCookieVersion)
    }
  }

  GlobalBanner.prototype.incrementViewCount = function (count, currentCookieVersion) {
    count = count + 1
    var cookieValue = JSON.stringify({ count: count, version: currentCookieVersion })
    window.GOVUK.setCookie(this.GLOBAL_BANNER_SEEN_COOKIE, cookieValue, { days: 84 })
  }

  GlobalBanner.prototype.viewCount = function () {
    var viewCountCookie = window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE)
    var viewCount = parseInt(window.GOVUK.parseCookie(viewCountCookie).count, 10)

    if (isNaN(viewCount)) {
      viewCount = 0
    }
    return viewCount
  }

  Modules.GlobalBanner = GlobalBanner
})(window.GOVUK.Modules)
