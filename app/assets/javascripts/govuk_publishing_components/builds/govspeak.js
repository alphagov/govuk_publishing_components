(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUK = global.GOVUK || {}, global.GOVUK.Modules = global.GOVUK.Modules || {}, global.GOVUK.Modules.Govspeak = factory()));
})(this, (function () { 'use strict';

  var Govspeak = function Govspeak($module, YoutubeLinkEnhancement) {
    this.$module = $module;
    this.youtubeLinkEnhancement = YoutubeLinkEnhancement;
  };

  Govspeak.prototype.init = function init () {
    if (this.$module.className.indexOf('disable-youtube') === -1) {
      this.embedYoutube();
    }

    // this.createBarcharts()    
  };

  Govspeak.prototype.embedYoutube = function embedYoutube () {
    var enhancement = new this.youtubeLinkEnhancement(this.$module);
    enhancement.init();
  };

  return Govspeak;

}));
//# sourceMappingURL=govspeak.js.map
