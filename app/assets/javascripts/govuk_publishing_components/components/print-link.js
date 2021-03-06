window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function PrintLink ($module) {
    this.$module = $module
  }

  PrintLink.prototype.init = function () {
    this.$module.addEventListener('click', function () {
      window.print()
    })
  }

  Modules.PrintLink = PrintLink
})(window.GOVUK.Modules)
