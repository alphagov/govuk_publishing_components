window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  'use strict'

  Modules.PrintLink = function () {
    this.start = function (element) {
      element[0].addEventListener('click', function () {
        window.print()
      })
    }
  }
})(window.GOVUK.Modules)
