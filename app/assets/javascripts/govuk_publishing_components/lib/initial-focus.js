(function (Modules) {
  function InitialFocus ($module) {
    this.$module = $module
  }

  InitialFocus.prototype.init = function () {
    this.$module.focus()
  }

  Modules.InitialFocus = InitialFocus
})(window.GOVUK.Modules)
