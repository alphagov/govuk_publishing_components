window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.InitialFocus = function () {
    this.start = function (element) {
      element.focus()
    }
  }
})(window.GOVUK.Modules)
