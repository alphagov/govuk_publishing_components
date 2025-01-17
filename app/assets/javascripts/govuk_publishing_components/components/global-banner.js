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
    this.bannerVersion = parseInt(this.$module.getAttribute('data-banner-version'))
  }

  GlobalBanner.prototype.init = function () {
    var currentCookieVersion

    if (this.getLatestCookie() === null) {
      this.setBannerCookie()
      this.makeBannerVisible()
    } else {
      currentCookieVersion = window.GOVUK.parseCookie(this.getLatestCookie()).version

      if (currentCookieVersion !== this.bannerVersion) {
        this.setBannerCookie()
      }
      this.makeBannerVisible()
    }

    var cookieCategory = window.GOVUK.getCookieCategory(this.GLOBAL_BANNER_SEEN_COOKIE)
    var cookieConsent = window.GOVUK.getConsentCookie()[cookieCategory]

    if (cookieConsent) {
      // If the cookie is not set, let's set a basic one
      if (window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE) === null || window.GOVUK.parseCookie(window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE)).count === undefined) {
        window.GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 0, version: 0 }), { days: 84 })
      }

      var currentCookie = window.GOVUK.parseCookie(window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE))
      currentCookieVersion = currentCookie.version
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

  GlobalBanner.prototype.getLatestCookie = function () {
    var currentCookie = window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE)

    return currentCookie
  }

  GlobalBanner.prototype.setBannerCookie = function () {
    var cookieCategory = window.GOVUK.getCookieCategory(this.GLOBAL_BANNER_SEEN_COOKIE)
    var cookieConsent = window.GOVUK.getConsentCookie()
    var value

    if (cookieConsent && cookieConsent[cookieCategory]) {
      value = JSON.stringify({ count: 0, version: this.bannerVersion })
      window.GOVUK.setCookie(this.GLOBAL_BANNER_SEEN_COOKIE, value, { days: 84 })
    }
  }

  GlobalBanner.prototype.makeBannerVisible = function () {
    document.documentElement.className = document.documentElement.className.concat(' show-global-banner')
    this.$module.setAttribute('data-ga4-global-banner', '')
  }

  Modules.GlobalBanner = GlobalBanner
})(window.GOVUK.Modules)
