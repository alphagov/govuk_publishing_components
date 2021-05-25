window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ContextualGuidance () { }

  ContextualGuidance.prototype.start = function ($module) {
    this.$module = $module[0]
    this.$guidance = this.$module.querySelector('.gem-c-contextual-guidance__wrapper')
    this.$inputId = this.$guidance.getAttribute('for')
    this.$input = this.$module.querySelector('#' + this.$inputId)
    if (!this.$input) return
    this.$input.addEventListener('focus', this.handleFocus.bind(this))
  }

  ContextualGuidance.prototype.handleFocus = function (event) {
    this.hideAllGuidance()
    if (!event.target.getAttribute('data-contextual-guidance-hide-only')) {
      this.$guidance.style.display = 'block'
    }
  }

  ContextualGuidance.prototype.hideAllGuidance = function () {
    var $guidances = document.querySelectorAll('.gem-c-contextual-guidance__wrapper')

    for (var i = 0; i < $guidances.length; i++) {
      $guidances[i].style.display = 'none'
    }
  }

  Modules.ContextualGuidance = ContextualGuidance
})(window.GOVUK.Modules)
