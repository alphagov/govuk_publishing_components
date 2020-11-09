window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CopyToClipboard () { }

  CopyToClipboard.prototype.start = function ($module) {
    this.$module = $module[0]

    var input = this.$module.querySelector('.gem-c-input')
    var copyButton = this.$module.querySelector('.gem-c-button')

    input.addEventListener('click', function () {
      input.select()
    })

    copyButton.addEventListener('click', function (event) {
      event.preventDefault()
      input.select()
      document.execCommand('copy')
    })
  }

  Modules.CopyToClipboard = CopyToClipboard
})(window.GOVUK.Modules)
