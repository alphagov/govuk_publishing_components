//= require libs/GlobalBarHelper.js

/* global parseCookie */

/*
  Global bar

  Manages count of how many times a global bar has been seen
  using cookies.
*/
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function GlobalBar ($module) {
    this.$module = $module
  }

  GlobalBar.prototype.init = function () {
    var GLOBAL_BAR_SEEN_COOKIE = 'global_bar_seen'
    var alwaysOn = this.$module.getAttribute('data-global-bar-permanent')
    if (alwaysOn === 'false') {
      alwaysOn = false // in this situation we need to convert string to boolean
    }
    var cookieCategory = GOVUK.getCookieCategory(GLOBAL_BAR_SEEN_COOKIE)
    var cookieConsent = GOVUK.getConsentCookie()[cookieCategory]

    if (cookieConsent) {
      // If the cookie is not set, let's set a basic one
      if (GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE) === null || parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)).count === undefined) {
        GOVUK.setCookie('global_bar_seen', JSON.stringify({ count: 0, version: 0 }), { days: 84 })
      }

      var currentCookie = parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE))
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
      var currentCookie = parseCookie(GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE))
      var cookieVersion = currentCookieVersion

      if (currentCookie) {
        cookieVersion = currentCookie.version
      }

      var cookieValue = JSON.stringify({ count: 999, version: cookieVersion })
      GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookieValue, { days: 84 })
      var additional = document.querySelector('.global-bar-additional')
      if (additional) {
        additional.classList.remove('global-bar-additional--show')
      }
      var dismiss = document.querySelector('.global-bar__dismiss')
      if (dismiss) {
        dismiss.classList.remove('global-bar__dismiss--show')
      }
      event.preventDefault()
    }

    function incrementViewCount (count) {
      count = count + 1
      var cookieValue = JSON.stringify({ count: count, version: currentCookieVersion })
      GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, cookieValue, { days: 84 })
    }

    function viewCount () {
      var viewCountCookie = GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)
      var viewCount = parseInt(parseCookie(viewCountCookie).count, 10)

      if (isNaN(viewCount)) {
        viewCount = 0
      }

      return viewCount
    }
  }

  Modules.GlobalBar = GlobalBar
})(window.GOVUK.Modules)
