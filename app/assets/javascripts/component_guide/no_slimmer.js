// This adds in javascript that should only be included if slimmer middleware
// is not running
//= require jquery/dist/jquery

$(document).ready(function () {
  'use strict'

  GOVUK.modules.start()

  // Static has a Toggle module in here we have a GemToggle module, we can't
  // easily change govspeak to use GemToggle but we can use the GemToggle module
  var gemToggle = new GOVUK.Modules.GemToggle();
  gemToggle.start($("[data-module=toggle]"));
})
