window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGA4 = window.GOVUK.analyticsGA4 || {}

var initFunction = function () {
  // to be added: digital identity consent mechanism

  var consentCookie = window.GOVUK.getConsentCookie()

  if (consentCookie && consentCookie.usage) {
    window.GOVUK.analyticsGA4.core.load()

    var analyticsModules = window.GOVUK.analyticsGA4.analyticsModules
    for (var property in analyticsModules) {
      var module = analyticsModules[property]
      if (typeof module.init === 'function') {
        module.init()
      }
    }
    // to be added: cross domain tracking code
  } else {
    window.addEventListener('cookie-consent', function () {
      window.GOVUK.analyticsGA4.init()
    })
  }
}

window.GOVUK.analyticsGA4.init = initFunction
