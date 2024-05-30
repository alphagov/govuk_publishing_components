'use strict'
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function CopyToClipboard ($module) {
    this.$module = $module
    this.$input = this.$module.querySelector('.gem-c-input')
    this.$copyButton = this.$module.querySelector('.gem-c-button')

    this.init()
  }

  CopyToClipboard.prototype.init = function () {
    if (!this.$input || !this.$copyButton) return

    this.$input.addEventListener('click', function () {
      this.$input.select()
    }.bind(this))

    this.$copyButton.addEventListener('click', function (event) {
      event.preventDefault()
      this.$input.select()
      document.execCommand('copy')
    }.bind(this))
  }

  Modules.CopyToClipboard = CopyToClipboard
})(window.GOVUK.Modules)
