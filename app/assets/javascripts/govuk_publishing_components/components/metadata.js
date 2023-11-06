window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function Metadata ($module) {
    this.$module = $module

    this.init()
  }

  Metadata.prototype.init = function () {
    var seeAllUpdates = this.$module.querySelector('.js-see-all-updates-link')

    if (seeAllUpdates) {
      var target = document.querySelector(seeAllUpdates.getAttribute('href'))

      if (target) {
        seeAllUpdates.addEventListener('click', function () {
          var targetToggleTrigger = target.querySelector('[aria-expanded]')
          if (targetToggleTrigger && targetToggleTrigger.getAttribute('aria-expanded') !== 'true') {
            targetToggleTrigger.click()
          }
        })
      }
    }
  }

  Modules.Metadata = Metadata
})(window.GOVUK.Modules)
