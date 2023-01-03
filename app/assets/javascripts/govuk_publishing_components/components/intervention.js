window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Intervention ($module) {
    this.$module = $module
    this.$banner = this.$module.querySelector('.gem-c-intervention')
    this.$closeLink = this.$module.querySelector('.gem-c-intervention__dismiss-link')
  }

  Intervention.prototype.init = function () {
    this.$module.close = this.handleClose.bind(this)

    if (this.$closeLink) {
      this.$closeLink.addEventListener('click', this.$module.close)
    }
  }

  Intervention.prototype.handleClose = function (event) {
    if (event) {
      event.preventDefault()
    }

    this.$module.style.display = 'none'
  }

  Modules.Intervention = Intervention
})(window.GOVUK.Modules)
