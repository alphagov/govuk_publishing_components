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
