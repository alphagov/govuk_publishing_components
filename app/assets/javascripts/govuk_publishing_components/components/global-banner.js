//= require govuk_publishing_components/lib/cookie-functions
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
    // if no cookie consent just show the banner
    // if there is cookie consent...
    //   if there's no global banner cookie or the banner should always be shown, set the cookie and show the banner
    //   if there is a global banner cookie, check to see if the version number matches
    //     if it doesn't, set the global banner cookie and count to zero, show the banner
    //     if it does, check the count, if less than 3 increment, show the banner
    var cookieCategory = window.GOVUK.getCookieCategory(this.GLOBAL_BANNER_SEEN_COOKIE)
    var cookieConsent = window.GOVUK.getConsentCookie()

    if (cookieConsent && cookieConsent[cookieCategory]) {
      var currentCookie = window.GOVUK.getCookie(this.GLOBAL_BANNER_SEEN_COOKIE)

      if (currentCookie === null) {
        this.setBannerCookie(0)
        this.makeBannerVisible()
      } else {
        var currentCookieContents = JSON.parse(currentCookie)
        var currentCookieVersion = currentCookieContents.version

        if (currentCookieVersion !== this.bannerVersion) {
          this.setBannerCookie(0)
          this.makeBannerVisible()
        } else {
          var count = currentCookieContents.count
          if (this.alwaysOn) {
            this.makeBannerVisible()
          } else if (count < 3) {
            this.setBannerCookie(count + 1)
            this.makeBannerVisible()
          }
        }
      }
    } else {
      this.makeBannerVisible()
    }
  }

  GlobalBanner.prototype.setBannerCookie = function (count) {
    var value = JSON.stringify({ count: count, version: this.bannerVersion })
    window.GOVUK.setCookie(this.GLOBAL_BANNER_SEEN_COOKIE, value, { days: 84 })
  }

  GlobalBanner.prototype.makeBannerVisible = function () {
    this.$module.classList.add('gem-c-global-banner--visible')
    this.$module.setAttribute('data-ga4-global-banner', '')
  }

  Modules.GlobalBanner = GlobalBanner
})(window.GOVUK.Modules)
