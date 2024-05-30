'use strict'
window.GOVUK = window.GOVUK || {}
window.GOVUK.Modules = window.GOVUK.Modules || {};

(function (Modules) {
  function ImageCard ($module) {
    this.$module = $module
    this.$module.youtubeLink = this.$module.querySelector('.gem-c-image-card__image-wrapper div')

    this.init()
  }

  ImageCard.prototype.init = function () {
    var ytLink = new window.GOVUK.GovspeakYoutubeLinkEnhancement(
      this.$module.youtubeLink,
      'gem-c-govspeak__youtube-video gem-c-image-card__youtube-video-embed'
    )
    ytLink.init()
  }

  Modules.ImageCard = ImageCard
})(window.GOVUK.Modules)
