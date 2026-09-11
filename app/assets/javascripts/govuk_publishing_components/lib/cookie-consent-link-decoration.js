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

  window.GOVUK.decorateLinks = function () {
    var consentCookie = window.GOVUK.getConsentCookie ? window.GOVUK.getConsentCookie() : null
    var consentCount = Object.values(consentCookie || {}).filter(val => val === true).length
    var consentValue = consentCount === 4 ? 'yes' : 'no'
    var links = document.querySelectorAll("[href^='https']")
    var allowedDomains = [
      'end-to-end-journeys-545890405086.europe-west2.run.app',
      'x-domain-prototype-2-545890405086.europe-west2.run.app',
      'x-domain-prototype-3-545890405086.europe-west2.run.app'
    ]

    links.forEach((link) => {
      try {
        var url = new URL(link.href, window.location.origin)

        if (allowedDomains.includes(url.hostname)) {
          url.searchParams.set('cookies', consentValue)
          link.href = url.toString()
        }
      } catch (e) {
        console.error("Couldn't decorate link - " + link.href)
      }
    })
  }
})(window)
