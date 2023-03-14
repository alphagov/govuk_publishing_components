class ImageCard {
  constructor($module) {
    this.$module = $module;
    this.$module.youtubeLink = this.$module.querySelector('.gem-c-image-card__image-wrapper div');
  }

  init() {
    var ytLink = new window.GOVUK.GovspeakYoutubeLinkEnhancement(
      this.$module.youtubeLink,
      'gem-c-govspeak__youtube-video gem-c-image-card__youtube-video-embed'
    );
    ytLink.init();    
  }
}

export default ImageCard;