window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (global, GOVUK) {
  'use strict'

  GOVUK.Modules.ErrorSummary = function () {
    this.start = function (element) {
      element.focus()
    }
  }
})(window, window.GOVUK)
