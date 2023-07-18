(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUK = global.GOVUK || {}, global.GOVUK.Modules = global.GOVUK.Modules || {}, global.GOVUK.Modules.Metadata = factory()));
})(this, (function () { 'use strict';

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

}));
//# sourceMappingURL=metadata.js.map
