
  var Govspeak = (function () {
  'use strict';

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

})();
//# sourceMappingURL=govspeak.js.map

  document.querySelectorAll('[data-module*="govspeak"]').forEach((el) => {
    var instance = new Govspeak(el);
    instance.init();
  })
