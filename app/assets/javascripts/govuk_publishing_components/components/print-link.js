window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function PrintLink () { }

  PrintLink.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$module.addEventListener('click', function () {
      window.print()
    })
  }

  Modules.PrintLink = PrintLink
})(window.GOVUK.Modules)
