var initFunction = function () {
  window.removeEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
  // Set the default consent cookie if it isn't already present
  if (!window.GOVUK.cookie('cookies_policy')) {
    window.GOVUK.setDefaultConsentCookie()
  }

  var consentCookie = window.GOVUK.getConsentCookie()

  if (consentCookie && (consentCookie.usage || consentCookie.aggregate)) {
    window.GOVUK.analyticsGa4.vars.internalDomains = []
    window.GOVUK.analyticsGa4.vars.internalDomains.push(window.GOVUK.analyticsGa4.core.trackFunctions.getHostname())
    window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)
    window.GOVUK.analyticsGa4.core.load()

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
  } else {
    window.addEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
  }
}

window.GOVUK.analyticsGa4.init = initFunction
