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
        copyToClipboard(input.value)
      })
    }

    function copyToClipboard (text) {
      var temp = document.createElement('input')
      temp.value = text
      document.body.appendChild(temp)
      temp.select()
      document.execCommand('copy')
      document.body.removeChild(temp)
    }
  }
})(window, window.GOVUK)
