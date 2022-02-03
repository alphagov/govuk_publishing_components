// = require govuk_publishing_components/lib/govspeak/magna-charta

window.GOVUK = window.GOVUK || {};

(function (GOVUK) {
  'use strict'

  var BarchartEnhancement = function ($element) {
    this.$element = $element
  }

  BarchartEnhancement.prototype.init = function () {
    var $barchartsOriginal = this.$element.querySelectorAll('.js-barchart-table')
    var $barcharts = []

    for (var j = 0; j < $barchartsOriginal.length; j++) {
      // this prevents the code from initialising more than once
      // we'd use :not selectors for $barchartsOriginal but for lack of IE8 support
      var styles = $barchartsOriginal[j].className
      if (styles.indexOf('mc-chart') === -1 && styles.indexOf('js-barchart-table-init') === -1) {
        $barcharts.push($barchartsOriginal[j])
      }
    }

    for (var i = 0; i < $barcharts.length; i++) {
      var $table = $barcharts[i]
      var magna = new GOVUK.Modules.MagnaCharta($table, { toggleText: 'Change between chart and table' })
      magna.init()
      $table.className = $table.className + ' js-barchart-table-init'
    }
  }

  GOVUK.GovspeakBarchartEnhancement = BarchartEnhancement
}(window.GOVUK))
