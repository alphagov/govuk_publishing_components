(function (root) {
  'use strict'
  var ALLOWED_DOMAINS = [
    'end-to-end-journeys-545890405086.europe-west2.run.app',
    'x-domain-prototype-2-545890405086.europe-west2.run.app',
    'x-domain-prototype-3-545890405086.europe-west2.run.app'
  ]

  window.GOVUK.checkCookieConsentLinkDecoration = function (location) {
    if (!location || !location.search) return

    var params = new URLSearchParams(location.search)
    var cookieConsent = params.get('cookies')
    var complicatedCookieConsent = params.get('essential')

    if (cookieConsent) {
      if (cookieConsent === 'yes') {
        window.GOVUK.approveAllCookieTypes()
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      } else if (cookieConsent === 'no') {
        window.GOVUK.declineNonEssentialCookieTypes()
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      }
    } else if (complicatedCookieConsent) {
      var consentObj = {
        essential: true,
        settings: params.get('settings') === 'true',
        usage: params.get('usage') === 'true',
        campaigns: params.get('campaigns') === 'true'
      }

      window.GOVUK.setCookie('cookies_policy', JSON.stringify(consentObj), { days: 365 })
      window.GOVUK.cookie('cookies_preferences_set', 'true')
    }
  }

  window.GOVUK.decorateLinks = function () {
    var consentCookie = window.GOVUK.getConsentCookie ? window.GOVUK.getConsentCookie() : null
    var consentCount = Object.values(consentCookie || {}).filter(val => val === true).length
    var consentValue = consentCount === 4 ? 'yes' : 'no'
    var links = document.querySelectorAll("[href^='https']")

    if ([1, 4].includes(consentCount)) {
      links.forEach((link) => {
        try {
          var url = new URL(link.href, window.location.origin)

          if (ALLOWED_DOMAINS.includes(url.hostname)) {
            url.searchParams.set('cookies', consentValue)
            link.href = url.toString()
          }
        } catch (e) {
          console.error("Couldn't decorate link - " + link.href)
        }
      })
    } else {
      this.decorateLinksComplicatedly(links, consentCookie)
    }
  }

  this.decorateLinksComplicatedly = function (links, consentCookie) {
    links.forEach((link) => {
      try {
        var url = new URL(link.href, window.location.origin)

        if (ALLOWED_DOMAINS.includes(url.hostname)) {
          for (var key in consentCookie) {
            url.searchParams.set(key, consentCookie[key])
          }
          link.href = url.toString()
        }
      } catch (e) {
        console.error("Couldn't decorate link - " + link.href)
      }
    })
  }
})(window)
