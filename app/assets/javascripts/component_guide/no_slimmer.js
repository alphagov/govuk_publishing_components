// This adds in javascript that initialiases components and dependencies
// that would normally be provided by slimmer
//= require jquery/dist/jquery
//= require govuk/modules

$(document).ready(function () {
  'use strict'

  GOVUK.modules.start()

  // Static has a Toggle module in here we have a GemToggle module, we can't
  // easily change govspeak to use GemToggle but we can use the GemToggle module
  var gemToggle = new GOVUK.Modules.GemToggle();
  gemToggle.start($("[data-module=toggle]"));
})
