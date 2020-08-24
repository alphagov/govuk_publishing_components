/* eslint-env jquery */

// This adds in javascript that initialises components and dependencies
// that are provided by Slimmer in public frontend applications.
// = require jquery/dist/jquery
// = require ./modules.js

$(document).ready(function () {
  'use strict'

  window.GOVUK.modules.start()
})
