// The following modules are imported in a specific order
//= require ./analytics-ga4/gtm-schemas
//= require ./analytics-ga4/pii-remover
//= require ./analytics-ga4/gtm-page-views
//= require ./analytics-ga4/ga4-link-tracker
//= require ./analytics-ga4/ga4-event-tracker

window.GOVUK.Gtm.sendPageView() // this will need integrating with cookie consent before production
window.GOVUK.analyticsGA4.linkTracker.trackLinkClicks()
