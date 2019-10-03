window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ContextualGuidance () { }

  ContextualGuidance.prototype.start = function ($module) {
    this.$module = $module[0]

    var fields = document.querySelectorAll(
      '[data-contextual-guidance="' + this.$module.id + '"]'
    )

    for (var i = 0; i < fields.length; i++) {
      fields[i].addEventListener('focus', this.handleFocus.bind(this))
    }
  }

  ContextualGuidance.prototype.handleFocus = function (event) {
    this.hideAllGuidance()
    if (!event.target.dataset.contextualGuidanceHideOnly) {
      this.$module.style.display = 'block'
    }
  }

  ContextualGuidance.prototype.hideAllGuidance = function () {
    var guidances = document.querySelectorAll('[data-module="contextual-guidance"]')

    for (var i = 0; i < guidances.length; i++) {
      guidances[i].style.display = 'none'
    }
  }

  Modules.ContextualGuidance = ContextualGuidance
})(window.GOVUK.Modules)
