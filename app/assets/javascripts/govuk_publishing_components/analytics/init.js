var analyticsInit = function(gaProperty, gaPropertyCrossDomain, linkedDomains) {
  "use strict";

  var consentCookie = window.GOVUK.getConsentCookie();

  var dummyAnalytics = {
    addLinkedTrackerDomain: function(){},
    setDimension: function(){},
    setOptionsForNextPageView: function(){},
    trackEvent: function(){},
    trackPageview: function(){},
    trackShare: function(){},
  };

  // Disable analytics by default
  // This will be reversed below, if the consent cookie says usage cookies are allowed
  var disabler = 'ga-disable-' + gaProperty
  window[disabler] = true;

  if (consentCookie && consentCookie["usage"]) {
    window[disabler] = false;

    // Load Google Analytics libraries
    GOVUK.StaticAnalytics.load();

    // Use document.domain in dev, preview and staging so that tracking works
    // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
    var cookieDomain = (document.domain == 'www.gov.uk') ? '.www.gov.uk' : document.domain;

    // Configure profiles, setup custom vars, track initial pageview
    var analytics = new GOVUK.StaticAnalytics({
      universalId: gaProperty,
      cookieDomain: cookieDomain,
      allowLinker: true
    });

    // Make interface public for virtual pageviews and events
    GOVUK.analytics = analytics;

    if (linkedDomains && linkedDomains.length > 0) {
      GOVUK.analytics.addLinkedTrackerDomain(gaPropertyCrossDomain, 'govuk', linkedDomains);
    }
  } else {
    GOVUK.analytics = dummyAnalytics
  }
}

window.GOVUK.analyticsInit = analyticsInit
