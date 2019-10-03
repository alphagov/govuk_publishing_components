window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ContextualGuidance () { }

  ContextualGuidance.prototype.start = function ($module) {
    this.$module = $module[0]

    var fields = document.querySelectorAll(
      '[data-contextual-guidance="' + this.$module.id + '"]'
    )

    fields.forEach(function (field) {
      field.addEventListener('focus', this.handleFocus.bind(this))
    }, this)
  }

  ContextualGuidance.prototype.handleFocus = function (event) {
    this.hideAllGuidance()
    if (!event.target.dataset.contextualGuidanceHideOnly) {
      this.$module.style.display = 'block'
    }
  }

  ContextualGuidance.prototype.hideAllGuidance = function () {
    var guidances = document.querySelectorAll('[data-module="contextual-guidance"]')

    guidances.forEach(function (guidance) {
      guidance.style.display = 'none'
    })
  }

  Modules.ContextualGuidance = ContextualGuidance
})(window.GOVUK.Modules)
