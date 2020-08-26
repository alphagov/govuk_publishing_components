// = require govuk_publishing_components/lib/govspeak/magna-charta

window.GOVUK = window.GOVUK || {};

(function (GOVUK, $) {
  'use strict'

  var BarchartEnhancement = function ($element) {
    this.$element = $element
  }

  BarchartEnhancement.prototype.init = function () {
    // the not selectors are protection against initialising twice since that
    // causes quite a mess. The not .mc-chart is because it creates a second
    // .js-barchart-table element with .mc-chart and then the
    // .js-barchart-table-init is given when we initialise
    var $barcharts = this.$element.querySelectorAll('.js-barchart-table:not(.mc-chart):not(.js-barchart-table-init)')

    for (var i = 0; i < $barcharts.length; i++) {
      var $table = $barcharts[i]
      new GOVUK.Modules.MagnaCharta().start($table, { toggleText: 'Change between chart and table' })
      $table.classList.add('js-barchart-table-init')
    }
  }

  GOVUK.GovspeakBarchartEnhancement = BarchartEnhancement
}(window.GOVUK, window.jQuery))
