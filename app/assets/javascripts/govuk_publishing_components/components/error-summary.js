window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (global, GOVUK) {
  'use strict'

  var $ = global.jQuery

  GOVUK.Modules.ErrorSummary = function () {
    this.start = function (element) {
      element.focus()
      // Focus on inputs with errors, so they're easier to discover
      element.on('click', '.js-error-summary__link', function (event) {
        event.preventDefault()
        var href = $(this).attr('href')
        $(href).focus()
      })
    }
  }
})(window, window.GOVUK)
