window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}

var initFunction = function () {
  // to be added: digital identity consent mechanism

  var consentCookie = window.GOVUK.getConsentCookie()

  if (consentCookie && consentCookie.usage) {
    window.GOVUK.analyticsGa4.core.load()

    var analyticsModules = window.GOVUK.analyticsGa4.analyticsModules
    for (var property in analyticsModules) {
      var module = analyticsModules[property]
      if (typeof module.init === 'function') {
        module.init()
      }
    }
    // to be added: cross domain tracking code
  } else {
    window.addEventListener('cookie-consent', window.GOVUK.analyticsGa4.init)
  }
}

window.GOVUK.analyticsGa4.init = initFunction
