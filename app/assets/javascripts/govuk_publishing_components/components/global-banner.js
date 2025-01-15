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
  }

  GlobalBanner.prototype.init = function () {
    var GLOBAL_BANNER_SEEN_COOKIE = 'global_banner_seen'
    var alwaysOn = this.$module.getAttribute('data-global-banner-permanent')
    if (alwaysOn === 'false') {
      alwaysOn = false // in this situation we need to convert string to boolean
    }
    var cookieCategory = window.GOVUK.getCookieCategory(GLOBAL_BANNER_SEEN_COOKIE)
    var cookieConsent = window.GOVUK.getConsentCookie()[cookieCategory]

    if (cookieConsent) {
      // If the cookie is not set, let's set a basic one
      if (window.GOVUK.getCookie(GLOBAL_BANNER_SEEN_COOKIE) === null || window.GOVUK.parseCookie(window.GOVUK.getCookie(GLOBAL_BANNER_SEEN_COOKIE)).count === undefined) {
        window.GOVUK.setCookie('global_banner_seen', JSON.stringify({ count: 0, version: 0 }), { days: 84 })
      }

      var currentCookie = window.GOVUK.parseCookie(window.GOVUK.getCookie(GLOBAL_BANNER_SEEN_COOKIE))
      var currentCookieVersion = currentCookie.version
      var count = viewCount()
    }

    this.$module.addEventListener('click', function (e) {
      var target = e.target
      if (target.classList.contains('dismiss')) {
        hide(e)
      }
    })

    // if the element is visible
    if (this.$module.offsetParent !== null && !alwaysOn) {
      incrementViewCount(count)
    }

    function hide (event) {
      var currentCookie = window.GOVUK.parseCookie(window.GOVUK.getCookie(GLOBAL_BANNER_SEEN_COOKIE))
      var cookieVersion = currentCookieVersion

      if (currentCookie) {
        cookieVersion = currentCookie.version
      }

      var cookieValue = JSON.stringify({ count: 999, version: cookieVersion })
      window.GOVUK.setCookie(GLOBAL_BANNER_SEEN_COOKIE, cookieValue, { days: 84 })
      var additional = document.querySelector('.global-banner-additional')
      if (additional) {
        additional.classList.remove('global-banner-additional--show')
      }
      var dismiss = document.querySelector('.global-banner__dismiss')
      if (dismiss) {
        dismiss.classList.remove('global-banner__dismiss--show')
      }
      event.preventDefault()
    }

    function incrementViewCount (count) {
      count = count + 1
      var cookieValue = JSON.stringify({ count: count, version: currentCookieVersion })
      window.GOVUK.setCookie(GLOBAL_BANNER_SEEN_COOKIE, cookieValue, { days: 84 })
    }

    function viewCount () {
      var viewCountCookie = window.GOVUK.getCookie(GLOBAL_BANNER_SEEN_COOKIE)
      var viewCount = parseInt(window.GOVUK.parseCookie(viewCountCookie).count, 10)

      if (isNaN(viewCount)) {
        viewCount = 0
      }

      return viewCount
    }
  }

  Modules.GlobalBanner = GlobalBanner
})(window.GOVUK.Modules)
