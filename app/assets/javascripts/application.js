// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//= require govuk_publishing_components/lib
//= require govuk_publishing_components/components/checkboxes
//= require govuk_publishing_components/components/error-summary
//= require govuk_publishing_components/components/govspeak
//= require govuk_publishing_components/components/metadata
//= require govuk_publishing_components/components/radio
//= require govuk_publishing_components/analytics/explicit-cross-domain-links
//
//= require support
//
//= require_tree ./analytics-ga4
//= require live_search
//= require search-analytics
//= require taxonomy-select
//= require_tree ./modules
//= require_tree ./components

var $elementsRequiringJavascript = document.querySelectorAll('.js-required')

for (var i = 0; i < $elementsRequiringJavascript.length; i++) {
  $elementsRequiringJavascript[i].style.display = 'block'
}

var $form = document.querySelector('.js-live-search-form')
var $results = document.querySelector('.js-live-search-results-block')
var $atomAutodiscoveryLink = document.querySelector("link[type='application/atom+xml']")

if ($form && $results && $atomAutodiscoveryLink) {
  // eslint-disable-next-line no-new
  new GOVUK.LiveSearch({
    $form: $form,
    $results: $results,
    $atomAutodiscoveryLink: $atomAutodiscoveryLink
  })
}
