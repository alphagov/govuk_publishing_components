class Metadata {
  constructor($module) {
    this.$module = $module
  }

  init() {
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
}

export default Metadata;