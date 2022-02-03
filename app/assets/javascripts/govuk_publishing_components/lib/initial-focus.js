window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function InitialFocus ($module) {
    this.$module = $module
  }

  InitialFocus.prototype.init = function () {
    this.$module.focus()
  }

  Modules.InitialFocus = InitialFocus
})(window.GOVUK.Modules)
