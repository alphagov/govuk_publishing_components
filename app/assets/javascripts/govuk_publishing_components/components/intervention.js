window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Intervention ($module) {
    this.$module = $module
  }

  Intervention.prototype.init = function () {
    if (window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
      window.GOVUK.analytics.trackEvent('interventionBanner', 'interventionShown')
    }
  }

  Modules.Intervention = Intervention
})(window.GOVUK.Modules)
