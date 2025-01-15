//= require govuk_publishing_components/lib/cookie-functions

'use strict'
window.GOVUK = window.GOVUK || {}

// Bump this if you are releasing a major change to the banner
// This will reset the view count so all users will see the banner, even if previously seen
var BANNER_VERSION = 8
var GLOBAL_BANNER_SEEN_COOKIE = 'global_banner_seen'

var globalBannerInit = {
  getBannerVersion: function () {
    return BANNER_VERSION
  },

  getLatestCookie: function () {
    var currentCookie = window.GOVUK.getCookie(GLOBAL_BANNER_SEEN_COOKIE)

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
    var cookieCategory = window.GOVUK.getCookieCategory(GLOBAL_BANNER_SEEN_COOKIE)
    var cookieConsent = window.GOVUK.getConsentCookie()
    var value

    if (cookieConsent && cookieConsent[cookieCategory]) {
      // Coronavirus banner - auto hide after user has been on landing page
      if (window.location.pathname === '/coronavirus') {
        value = JSON.stringify({ count: 999, version: globalBannerInit.getBannerVersion() })
      } else {
        value = JSON.stringify({ count: 0, version: globalBannerInit.getBannerVersion() })
      }

      window.GOVUK.setCookie(GLOBAL_BANNER_SEEN_COOKIE, value, { days: 84 })
    }
  },

  makeBannerVisible: function () {
    document.documentElement.className = document.documentElement.className.concat(' show-global-banner')
    var globalBannerEl = document.querySelector('#global-banner')
    if (globalBannerEl) {
      globalBannerEl.setAttribute('data-ga4-global-banner', '')
    }
  },

  init: function () {
    var currentCookieVersion

    if (!globalBannerInit.urlBlockList()) {
      if (globalBannerInit.getLatestCookie() === null) {
        globalBannerInit.setBannerCookie()
        globalBannerInit.makeBannerVisible()
      } else {
        currentCookieVersion = window.GOVUK.parseCookie(globalBannerInit.getLatestCookie()).version

        if (currentCookieVersion !== globalBannerInit.getBannerVersion()) {
          globalBannerInit.setBannerCookie()
        }

        var newCookieCount = window.GOVUK.parseCookie(globalBannerInit.getLatestCookie()).count

        // If banner has been manually dismissed, hide the additional info
        if (newCookieCount === 999) {
          var globalBannerAdditional = document.querySelector('.global-banner-additional')
          if (globalBannerAdditional) {
            globalBannerAdditional.classList.remove('global-banner-additional--show')
          }
          var globarBarDismiss = document.querySelector('.global-banner__dismiss')
          if (globarBarDismiss) {
            globarBarDismiss.classList.remove('global-banner__dismiss--show')
          }
        }

        globalBannerInit.makeBannerVisible()
      }
    } else {
      // If on a url in the blocklist, set cookie but don't show the banner
      if (globalBannerInit.getLatestCookie() === null) {
        globalBannerInit.setBannerCookie()
      } else {
        currentCookieVersion = window.GOVUK.parseCookie(globalBannerInit.getLatestCookie()).version

        if (currentCookieVersion !== globalBannerInit.getBannerVersion()) {
          globalBannerInit.setBannerCookie()
        }
      }
    }
  }
}

window.GOVUK.globalBannerInit = globalBannerInit
window.GOVUK.globalBannerInit.init()
