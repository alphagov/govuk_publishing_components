var initFunction = function () {
  window.removeEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)

  window.GOVUK.analyticsGa4.checkCookieConsentLinkDecoration = function (location) {
    if (!location || !location.search) return
    // this checks for the presence of cookie consent query parameter and updates our consent cookie accordingly
    // This is so that users don't see multiple cookie banners when they move between different domains
    var cookieConsent = /([?&]cookie_consent=)(accept|reject)/.exec(location.search)
    if (cookieConsent) {
      if (cookieConsent[2] === 'accept') {
        window.GOVUK.setConsentCookie({ usage: true })
        // set cookies_preferences_set to true to prevent cookie banner showing
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      } else if (cookieConsent[2] === 'reject') {
        window.GOVUK.setConsentCookie({ usage: false })
        window.GOVUK.cookie('cookies_preferences_set', 'true')
      }
    }
  }

  var consentCookie = window.GOVUK.getConsentCookie()
  if (consentCookie && consentCookie.usage) {
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
  } else {
    window.addEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
    window.GOVUK.analyticsGa4.checkCookieConsentLinkDecoration(window.location)
  }
}

window.GOVUK.analyticsGa4.init = initFunction
