
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

var Metadata = (function () {
  'use strict';

  var Metadata = function Metadata($module) {
    this.$module = $module;
  };

  Metadata.prototype.init = function init () {
    var seeAllUpdates = this.$module.querySelector('.js-see-all-updates-link');

    if (seeAllUpdates) {
      var target = document.querySelector(seeAllUpdates.getAttribute('href'));

      if (target) {
        seeAllUpdates.addEventListener('click', function () {
          var targetToggleTrigger = target.querySelector('[aria-expanded]');
          if (targetToggleTrigger && targetToggleTrigger.getAttribute('aria-expanded') !== 'true') {
            targetToggleTrigger.click();
          }
        });
      }
    }    
  };

  return Metadata;

})();
//# sourceMappingURL=metadata.js.map


window.GOVUK.Modules.Metadata = Metadata
