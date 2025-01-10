//= require libs/GlobalBarHelper.js
//= require govuk_publishing_components/lib/cookie-functions

/* global parseCookie */

'use strict'
window.GOVUK = window.GOVUK || {}

// Bump this if you are releasing a major change to the banner
// This will reset the view count so all users will see the banner, even if previously seen
var BANNER_VERSION = 8
var GLOBAL_BAR_SEEN_COOKIE = 'global_bar_seen'

var globalBarInit = {
  getBannerVersion: function () {
    return BANNER_VERSION
  },

  getLatestCookie: function () {
    var currentCookie = window.GOVUK.getCookie(GLOBAL_BAR_SEEN_COOKIE)

    return currentCookie
  },

  urlBlockList: function () {
    var paths = [
      '^/coronavirus/.*$',
      '^/brexit(.cy)?$',
      '^/transition-check/.*$',
      '^/eubusiness(\\..*)?$',
      '^/account/.*$'
    ]

    var ctaLink = document.querySelector('.js-call-to-action')
    if (ctaLink) {
      var ctaPath = '^' + ctaLink.getAttribute('href') + '$'
      paths.push(ctaPath)
    }

    return new RegExp(paths.join('|')).test(window.location.pathname)
  },

  setBannerCookie: function () {
    var cookieCategory = window.GOVUK.getCookieCategory(GLOBAL_BAR_SEEN_COOKIE)
    var cookieConsent = GOVUK.getConsentCookie()
    var value

    if (cookieConsent && cookieConsent[cookieCategory]) {
      // Coronavirus banner - auto hide after user has been on landing page
      if (window.location.pathname === '/coronavirus') {
        value = JSON.stringify({ count: 999, version: globalBarInit.getBannerVersion() })
      } else {
        value = JSON.stringify({ count: 0, version: globalBarInit.getBannerVersion() })
      }

      window.GOVUK.setCookie(GLOBAL_BAR_SEEN_COOKIE, value, { days: 84 })
    }
  },

  makeBannerVisible: function () {
    document.documentElement.className = document.documentElement.className.concat(' show-global-bar')
    var globalBarEl = document.querySelector('#global-bar')
    if (globalBarEl) {
      globalBarEl.setAttribute('data-ga4-global-bar', '')
    }
  },

  init: function () {
    var currentCookieVersion

    if (!globalBarInit.urlBlockList()) {
      if (globalBarInit.getLatestCookie() === null) {
        globalBarInit.setBannerCookie()
        globalBarInit.makeBannerVisible()
      } else {
        currentCookieVersion = parseCookie(globalBarInit.getLatestCookie()).version

        if (currentCookieVersion !== globalBarInit.getBannerVersion()) {
          globalBarInit.setBannerCookie()
        }

        var newCookieCount = parseCookie(globalBarInit.getLatestCookie()).count

        // If banner has been manually dismissed, hide the additional info
        if (newCookieCount === 999) {
          var globalBarAdditional = document.querySelector('.global-bar-additional')
          if (globalBarAdditional) {
            globalBarAdditional.classList.remove('global-bar-additional--show')
          }
          var globarBarDismiss = document.querySelector('.global-bar__dismiss')
          if (globarBarDismiss) {
            globarBarDismiss.classList.remove('global-bar__dismiss--show')
          }
        }

        globalBarInit.makeBannerVisible()
      }
    } else {
      // If on a url in the blocklist, set cookie but don't show the banner
      if (globalBarInit.getLatestCookie() === null) {
        globalBarInit.setBannerCookie()
      } else {
        currentCookieVersion = parseCookie(globalBarInit.getLatestCookie()).version

        if (currentCookieVersion !== globalBarInit.getBannerVersion()) {
          globalBarInit.setBannerCookie()
        }
      }
    }
  }
}

window.GOVUK.globalBarInit = globalBarInit
window.GOVUK.globalBarInit.init()
