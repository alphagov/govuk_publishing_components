window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (global, GOVUK) {
  'use strict'

  GOVUK.Modules.CopyToClipboard = function () {
    this.start = function (element) {
      var copyButton = element[0].querySelector('.gem-c-button')

      copyButton.addEventListener('click', function (event) {
        event.preventDefault()
        var input = element[0].querySelector('.gem-c-input')
        input.select()
        document.execCommand('copy')
      })
    }
  }
})(window, window.GOVUK)
