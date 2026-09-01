(function (Modules) {
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
    var cookieConsent = params.get('cookies[analytics]')

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

  CookieConsentLinkDecoration.prototype.decorateLinks = function () {
    var consentCookie = window.GOVUK.getConsentCookie ? window.GOVUK.getConsentCookie() : null
    var consentCount = Object.values(consentCookie || {}).filter(val => val === true).length
    var consentValue = consentCount === 4 ? 'yes' : 'no'
    var links = document.querySelectorAll('a[href]')
    var allowedDomains = [
      'end-to-end-journeys-545890405086.europe-west2.run.app',
      'x-domain-prototype-2-545890405086.europe-west2.run.app',
      'x-domain-prototype-3-545890405086.europe-west2.run.app'
    ]

    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      try {
        var url = new URL(link.href, window.location.origin)

        if (allowedDomains.includes(url.hostname)) {
          url.searchParams.set('cookies[analytics]', consentValue)
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
