/* eslint-env jquery */

// This adds in javascript that initialises components and dependencies
// that are provided by Slimmer in public frontend applications.
// = require jquery.js
// = require ./modules.js

$(document).ready(function () {
  'use strict'

  window.GOVUK.modules.start()

  // Static has a Toggle module in here we have a GemToggle module, we can't
  // easily change govspeak to use GemToggle but we can use the GemToggle module
  var gemToggle = new window.GOVUK.Modules.GemToggle()
  gemToggle.start($('[data-module=toggle]'))
})
