(function (root) {
  'use strict'

  window.GOVUK.checkCookieConsentLinkDecoration = function (location) {
    if (!location || !location.search) return

    var params = new URLSearchParams(location.search)
    var cookieConsent = params.get('cookies')

    if (cookieConsent) {
      if (cookieConsent === 'yes') {
        window.GOVUK.approveAllCookieTypes()
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      } else if (cookieConsent === 'no') {
        window.GOVUK.declineNonEssentialCookieTypes()
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      }
    }
  }
})(window)
