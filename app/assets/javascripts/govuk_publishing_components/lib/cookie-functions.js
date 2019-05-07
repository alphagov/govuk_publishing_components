// used by the cookie banner component

(function () {
  'use strict'
  var root = this
  var defaultCookieConsent = {
    'essential': true,
    'settings': false,
    'usage': false,
    'campaigns': false
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
    window.GOVUK.setCookie('cookie_policy', JSON.stringify(defaultCookieConsent))
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

  window.GOVUK.setConsentCookie = function (options) {
    var currentConsentCookie = window.GOVUK.getCookie('cookie_policy')
    var cookieConsentJSON

    if (currentConsentCookie) {
      cookieConsentJSON = JSON.parse(currentConsentCookie)
    } else {
      cookieConsentJSON = defaultCookieConsent
    }

    for (var cookieType in options) {
      cookieConsentJSON[cookieType] = options[cookieType]
    }

    window.GOVUK.setCookie('cookie_policy', JSON.stringify(cookieConsentJSON))
  }

  window.GOVUK.setCookie = function (name, value, options) {
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
