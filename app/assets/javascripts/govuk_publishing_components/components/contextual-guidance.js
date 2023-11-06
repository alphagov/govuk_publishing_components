window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ContextualGuidance ($module) {
    this.$module = $module
    this.$guidance = this.$module.querySelector('.gem-c-contextual-guidance__wrapper')
    this.$inputId = this.$guidance.getAttribute('for')
    this.$input = this.$module.querySelector('#' + this.$inputId)

    this.init()
  }

  ContextualGuidance.prototype.init = function () {
    if (!this.$input) return
    this.$input.addEventListener('focus', this.handleFocus.bind(this))
  }

  ContextualGuidance.prototype.handleFocus = function (event) {
    this.hideAllGuidance()
    this.$guidance.style.display = 'block'
  }

  ContextualGuidance.prototype.hideAllGuidance = function () {
    var $guidances = document.querySelectorAll('.gem-c-contextual-guidance__wrapper')

    for (var i = 0; i < $guidances.length; i++) {
      $guidances[i].style.display = 'none'
    }
  }

  Modules.ContextualGuidance = ContextualGuidance
})(window.GOVUK.Modules)
