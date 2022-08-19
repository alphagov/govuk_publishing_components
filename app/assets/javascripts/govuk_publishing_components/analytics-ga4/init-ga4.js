var analyticsGa4Init = function () {
  // to be added: digital identity consent mechanism

  var consentCookie = window.GOVUK.getConsentCookie()
  var dummyAnalytics = {}

  if (consentCookie && consentCookie.usage) {
    window.GOVUK.analyticsGA4.pageViewTracker.sendPageView()
    window.GOVUK.analyticsGA4.linkTracker.trackLinkClicks()

    // to be added: attach JS from Google to the DOM and execute
    // to be added: cross domain tracking code
  } else {
    // clear the analytics object so no code can execute
    window.GOVUK.analyticsGA4 = dummyAnalytics
  }
}

window.GOVUK.analyticsGa4Init = analyticsGa4Init
