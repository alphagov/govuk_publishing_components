var analyticsInit = function () {
  'use strict'

  var analyticsVars = window.GOVUK.analyticsVars || false
  if (analyticsVars) {
    // the property naming convention here isn't consistent, but used in static and
    // govuk-account-manager-prototype, so hard to change
    var primaryGaProperty = window.GOVUK.analyticsVars.gaProperty || false

    var crossDomainGaProperty = window.GOVUK.analyticsVars.gaPropertyCrossDomain || false
    var crossDomainLinkedDomains = window.GOVUK.analyticsVars.linkedDomains || false
  }

  var consentCookie = window.GOVUK.getConsentCookie()
  var dummyAnalytics = {
    addLinkedTrackerDomain: function () {},
    setDimension: function () {},
    setOptionsForNextPageView: function () {},
    trackEvent: function () {},
    trackPageview: function () {},
    trackShare: function () {}
  }

  // Disable analytics by default
  // This will be reversed below, if the consent cookie says usage cookies are allowed
  var disabler = 'ga-disable-' + primaryGaProperty
  window[disabler] = true

  if (consentCookie && consentCookie.usage) {
    window[disabler] = false

    // Load Google Analytics libraries
    window.GOVUK.StaticAnalytics.load()

    if (primaryGaProperty) {
      // Use document.domain in dev, preview and staging so that tracking works
      // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
      var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain

      // Configure profiles, setup custom vars, track initial pageview
      var analytics = new window.GOVUK.StaticAnalytics({
        universalId: primaryGaProperty,
        cookieDomain: cookieDomain,
        allowLinker: true
      })

      // Make interface public for virtual pageviews and events
      window.GOVUK.analytics = analytics

      // set up linking of domains for cross domain ga property
      if (crossDomainLinkedDomains && crossDomainLinkedDomains.length > 0) {
        window.GOVUK.analytics.addLinkedTrackerDomain(crossDomainGaProperty, 'govuk', crossDomainLinkedDomains)
      }
    }
  } else {
    window.GOVUK.analytics = dummyAnalytics
  }
}

window.GOVUK.analyticsInit = analyticsInit
