window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (GOVUK) {
  'use strict'

  GOVUK.Modules.InitialFocus = function () {
    this.start = function (element) {
      element.focus()
    }
  }
})(window.GOVUK)
