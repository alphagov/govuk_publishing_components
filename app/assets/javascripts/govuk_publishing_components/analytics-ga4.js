// The following modules are imported in a specific order
//= require ./analytics-ga4/gtm-schemas
//= require ./analytics-ga4/pii-remover
//= require ./analytics-ga4/gtm-page-views
//= require ./analytics-ga4/gtm-event-click-tracker

window.GOVUK.Gtm.sendPageView() // this will need integrating with cookie consent before production
