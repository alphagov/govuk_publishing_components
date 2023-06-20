
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

var ImageCard = (function () {
  'use strict';

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

})();
//# sourceMappingURL=image-card.js.map


window.GOVUK.Modules.ImageCard = ImageCard
