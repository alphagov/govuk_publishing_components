(function (Modules) {
  var ALLOWED_DOMAINS = [
    'end-to-end-journeys-545890405086.europe-west2.run.app',
    'x-domain-prototype-2-545890405086.europe-west2.run.app',
    'x-domain-prototype-3-545890405086.europe-west2.run.app'
  ]
  function CookieConsentLinkDecoration ($module) {
    this.$module = $module
  }

  CookieConsentLinkDecoration.prototype.init = function () {
    this.checkCookieConsentLinkDecoration(window.location)
    this.decorateLinks()
  }

  CookieConsentLinkDecoration.prototype.checkCookieConsentLinkDecoration = function (location) {
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

  CookieConsentLinkDecoration.prototype.decorateLinks = function () {
    var consentCookie = window.GOVUK.getConsentCookie ? window.GOVUK.getConsentCookie() : null
    var consentCount = Object.values(consentCookie || {}).filter(val => val === true).length
    var consentValue = consentCount === 4 ? 'yes' : 'no'
    var links = document.querySelectorAll('a[href]')
    if ([1, 4].includes(consentCount)) {
      for (var i = 0; i < links.length; i++) {
        var link = links[i]
        try {
          var url = new URL(link.href, window.location.origin)

          if (ALLOWED_DOMAINS.includes(url.hostname)) {
            url.searchParams.set('cookies', consentValue)
            link.href = url.toString()
          }
        } catch (e) {
        }
      }
    } else {
      this.decorateLinksComplicatedly(links, consentCookie)
    }
  }

  CookieConsentLinkDecoration.prototype.decorateLinksComplicatedly = function (links, consentCookie) {
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      try {
        var url = new URL(link.href, window.location.origin)

        if (ALLOWED_DOMAINS.includes(url.hostname)) {
          for (var key in consentCookie) {
            url.searchParams.set(key, consentCookie[key])
          }
          link.href = url.toString()
        }
      } catch (e) {
      }
    }
  }

  Modules.CookieConsentLinkDecoration = CookieConsentLinkDecoration
})(window.GOVUK.Modules)

document.addEventListener('DOMContentLoaded', function () {
  if (window.GOVUK && window.GOVUK.Modules && window.GOVUK.Modules.CookieConsentLinkDecoration) {
    var linkDecoration = new window.GOVUK.Modules.CookieConsentLinkDecoration(document)
    linkDecoration.init()
  }
})
