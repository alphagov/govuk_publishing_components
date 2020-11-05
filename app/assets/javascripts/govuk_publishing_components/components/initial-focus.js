window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function InitialFocus () { }

  InitialFocus.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$module.focus()
  }

  Modules.InitialFocus = InitialFocus
})(window.GOVUK.Modules)
