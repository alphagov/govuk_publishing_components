// This adds in javascript that should only be included if slimmer middleware
// is not running
//= require jquery/dist/jquery

$(document).ready(function () {
  GOVUK.modules.start()
})
