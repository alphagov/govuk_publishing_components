//= require_tree ./lib
//= require_tree ./components
//= require govuk-frontend/all.js
//= require ./analytics

// Initialise all GOVUKFrontend components
window.GOVUKFrontend.initAll()

if (GOVUK.analytics && GOVUK.analytics.trackEvent) {
  console.log('ga')
}
else {
  console.log('no ga')
}
