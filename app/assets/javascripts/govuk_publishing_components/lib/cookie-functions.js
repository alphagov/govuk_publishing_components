// used by the cookie banner component

(function () {
  'use strict'
  var root = this

  var DEFAULT_COOKIE_CONSENT = {
    'essential': true,
    'settings': true,
    'usage': true,
    'campaigns': true
  }

  var COOKIE_CATEGORIES = {
    'cookie_policy': 'essential',
    'govuk_not_first_visit': 'essential',
    'govuk_browser_upgrade_dismisssed': 'essential',
    'seen_cookie_message': 'essential',
    'govuk_surveySeenUserSatisfactionSurvey': 'essential',
    'govuk_takenUserSatisfactionSurvey': 'essential',
    '_email-alert-frontend_session': 'essential',
    'global_bar_seen': 'essential',
    'licensing_session': 'essential',
    'govuk_contact_referrer': 'essential',
    'JS-Detection': 'usage',
    '_ga': 'usage',
    '_gid': 'usage',
    '_gat': 'usage',
    'analytics_next_page_call': 'usage'
  }

  if (typeof root.GOVUK === 'undefined') { root.GOVUK = {} }

  /*
    Cookie methods
    ==============

    Usage:

      Setting a cookie:
      GOVUK.cookie('hobnob', 'tasty', { days: 30 });

      Reading a cookie:
      GOVUK.cookie('hobnob');

      Deleting a cookie:
      GOVUK.cookie('hobnob', null);
  */
  window.GOVUK.cookie = function (name, value, options) {
    if (typeof value !== 'undefined') {
      if (value === false || value === null) {
        return window.GOVUK.setCookie(name, '', { days: -1 })
      } else {
        return window.GOVUK.setCookie(name, value, options)
      }
    } else {
      return window.GOVUK.getCookie(name)
    }
  }

  window.GOVUK.setDefaultConsentCookie = function () {
    window.GOVUK.setCookie('cookie_policy', JSON.stringify(DEFAULT_COOKIE_CONSENT))
  }

  window.GOVUK.approveAllCookieTypes = function () {
    var approvedConsent = {
      'essential': true,
      'settings': true,
      'usage': true,
      'campaigns': true
    }

    window.GOVUK.setCookie('cookie_policy', JSON.stringify(approvedConsent))
  }

  window.GOVUK.denyAllCookieTypes = function () {
    var deniedConsent = {
      'essential': false,
      'settings': false,
      'usage': false,
      'campaigns': false
    }

    window.GOVUK.setCookie('cookie_policy', JSON.stringify(deniedConsent))
  }

  window.GOVUK.getConsentCookie = function () {
    var consentCookie = window.GOVUK.cookie('cookie_policy')
    var consentCookieObj

    if (consentCookie) {
      consentCookieObj = JSON.parse(consentCookie)

      if (typeof consentCookieObj !== 'object' && consentCookieObj !== null) {
        consentCookieObj = JSON.parse(consentCookieObj)
      }
    } else {
      return null
    }

    return consentCookieObj
  }

  window.GOVUK.setConsentCookie = function (options) {
    var cookieConsent = window.GOVUK.getConsentCookie()

    if (!cookieConsent) {
      cookieConsent = DEFAULT_COOKIE_CONSENT
    }

    for (var cookieType in options) {
      cookieConsent[cookieType] = options[cookieType]
    }

    window.GOVUK.setCookie('cookie_policy', JSON.stringify(cookieConsent))
  }

  window.GOVUK.checkConsentCookie = function (cookieName, cookieValue) {
    var currentConsentCookie = window.GOVUK.getConsentCookie()

    // If we're setting the consent cookie OR deleting a cookie, allow by default
    if (cookieName === 'cookie_policy' || (cookieValue === null || cookieValue === false)) {
      return true
    }

    // If the consent cookie doesn't exist, set the default consent cookie
    if (!currentConsentCookie) {
      window.GOVUK.setDefaultConsentCookie()
    }

    currentConsentCookie = window.GOVUK.getConsentCookie()

    // Survey cookies are dynamically generated, so we need to check for these separately
    if (cookieName.match('^govuk_surveySeen') || cookieName.match('^govuk_taken')) {
      return currentConsentCookie['essential']
    }

    if (COOKIE_CATEGORIES[cookieName]) {
      var cookieCategory = COOKIE_CATEGORIES[cookieName]

      return currentConsentCookie[cookieCategory]
    } else {
      // Deny the cookie if it is not known to us
      return false
    }
  }

  window.GOVUK.setCookie = function (name, value, options) {
    if (window.GOVUK.checkConsentCookie(name, value)) {
      if (typeof options === 'undefined') {
        options = {}
      }
      var cookieString = name + '=' + value + '; path=/'
      if (options.days) {
        var date = new Date()
        date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000))
        cookieString = cookieString + '; expires=' + date.toGMTString()
      }
      if (document.location.protocol === 'https:') {
        cookieString = cookieString + '; Secure'
      }
      document.cookie = cookieString
    }
  }

  window.GOVUK.getCookie = function (name) {
    var nameEQ = name + '='
    var cookies = document.cookie.split(';')
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length)
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }
    return null
  }
}).call(this)
