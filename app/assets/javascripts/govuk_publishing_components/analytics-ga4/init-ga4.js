document.addEventListener('DOMContentLoaded', function () {
  if (typeof window.GOVUK.analyticsGa4.init === 'function') {
    window.GOVUK.analyticsGa4.init()
  }
})

var initFunction = function () {
  window.removeEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)

  window.GOVUK.analyticsGa4.checkCookieConsentLinkDecoration = function (location) {
    if (!location || !location.search) return

    var params = new URLSearchParams(location.search)

    var cookieConsent = params.get('cookies[analytics]')

    if (cookieConsent) {
      if (cookieConsent === 'yes') {
        window.GOVUK.setConsentCookie({ usage: true })
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      } else if (cookieConsent === 'no') {
        window.GOVUK.setConsentCookie({ usage: false })
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      }
    }
  }

  window.GOVUK.analyticsGa4.decorateLinks = function (consent) {
    const links = document.querySelectorAll('a[href]')
    const allowedDomains = [
      'end-to-end-journeys-545890405086.europe-west2.run.app',
      'x-domain-prototype-2-545890405086.europe-west2.run.app',
      'x-domain-prototype-3-545890405086.europe-west2.run.app'
    ]

    links.forEach(link => {
      try {
        const url = new URL(link.href, window.location.origin)

        if (allowedDomains.includes(url.hostname)) {
          url.searchParams.set('cookies[analytics]', consent)
          link.href = url.toString()
        }
      } catch (e) {
      }
    })
  }

  window.GOVUK.analyticsGa4.checkCookieConsentLinkDecoration(window.location)

  var consentCookie = window.GOVUK.getConsentCookie()

  if (consentCookie) {
    var consentValue = consentCookie.usage ? 'yes' : 'no'
    window.GOVUK.analyticsGa4.decorateLinks(consentValue)

    if (consentCookie.usage) {
      window.GOVUK.analyticsGa4.vars.internalDomains = []
      window.GOVUK.analyticsGa4.vars.internalDomains.push(window.GOVUK.analyticsGa4.core.trackFunctions.getHostname())
      window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)
      window.GOVUK.analyticsGa4.core.load()

      if (!window.GOVUK.analyticsGa4.analyticsModulesStarted) {
        // Initialise analytics modules that start on page load
        // https://github.com/alphagov/govuk_publishing_components/blob/main/docs/analytics-ga4/analytics.md#code-structure
        var analyticsModules = window.GOVUK.analyticsGa4.analyticsModules
        for (var property in analyticsModules) {
          var module = analyticsModules[property]
          if (typeof module.init === 'function') {
            try {
              module.init()
            } catch (e) {
              // if there's a problem with the module, catch the error to allow other modules to start
              console.warn('Error starting analytics module ' + property + ': ' + e.message, window.location)
            }
          }
        }
        window.GOVUK.analyticsGa4.analyticsModulesStarted = true
      }
    }
  }
  window.addEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
}

window.GOVUK.analyticsGa4.init = initFunction

window.GOVUK.analyticsGa4.init()
