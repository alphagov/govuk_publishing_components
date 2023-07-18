(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUK = global.GOVUK || {}, global.GOVUK.Modules = global.GOVUK.Modules || {}, global.GOVUK.Modules.ImageCard = factory()));
})(this, (function () { 'use strict';

  var ImageCard = function ImageCard($module) {
    this.$module = $module;
    this.$module.youtubeLink = this.$module.querySelector('.gem-c-image-card__image-wrapper div');
  };

  ImageCard.prototype.init = function init () {
    var ytLink = new window.GOVUK.GovspeakYoutubeLinkEnhancement(
      this.$module.youtubeLink,
      'gem-c-govspeak__youtube-video gem-c-image-card__youtube-video-embed'
    );
    ytLink.init();    
  };

  return ImageCard;

}));
//# sourceMappingURL=image-card.js.map
