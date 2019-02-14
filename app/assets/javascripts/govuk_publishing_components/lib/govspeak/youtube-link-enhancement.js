//= require govuk_publishing_components/vendor/jquery-ui-1.10.2.custom
//= require govuk_publishing_components/vendor/jquery.player.min

window.GOVUK = window.GOVUK || {};

(function (GOVUK, $) {
  'use strict'

  var YoutubeLinkEnhancement = function ($element) {
    this.$element = $element
  }

  YoutubeLinkEnhancement.prototype.init = function () {
    var $youtubeLinks = this.$element.find('a[href*="youtube.com"], a[href*="youtu.be"]')
    var _this = this
    $youtubeLinks.each(function () {
      var $link = $(this)

      if (_this.hasDisabledEmbed($link)) {
        return true
      }

      var videoId = YoutubeLinkEnhancement.parseVideoId($link.attr('href'))
      if (videoId) {
        _this.embedVideo($link, videoId)
      }
    })
  }

  YoutubeLinkEnhancement.prototype.hasDisabledEmbed = function ($link) {
    return $link.attr('data-youtube-player') === 'off'
  }

  YoutubeLinkEnhancement.prototype.embedVideo = function ($link, videoId) {
    var $mediaPlayer = $('<span class="media-player" />')

    $link.parent().replaceWith($mediaPlayer)

    var protocol = this.protocol()

    $mediaPlayer.player({
      id: YoutubeLinkEnhancement.nextId(),
      media: videoId,
      captions: this.captions($link),
      url: protocol + '//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid='
    })
  }

  YoutubeLinkEnhancement.prototype.protocol = function () {
    var scheme = document.location.protocol
    if (scheme === 'file:') {
      scheme = 'https:'
    }
    return scheme
  }

  YoutubeLinkEnhancement.prototype.captions = function ($link) {
    var $captions = $link.siblings('.captions')
    if ($captions.length) {
      return $captions.first().attr('href')
    }
  }

  YoutubeLinkEnhancement.nextId = function () {
    this.embedCount = this.embedCount || 0
    this.embedCount += 1
    return 'youtube-' + this.embedCount
  }

  // This is a public class method so it can be used outside of this embed to
  // check that user input for videos will be supported in govspeak
  YoutubeLinkEnhancement.parseVideoId = function (url) {
    var parts

    if (url.indexOf('youtube.com') > -1) {
      var params = {}
      parts = url.split('?')
      if (parts.length === 1) {
        return
      }
      parts = parts[1].split('&')
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i].split('=')
        params[part[0]] = part[1]
      }
      return params.v
    }

    if (url.indexOf('youtu.be') > -1) {
      parts = url.split('/')
      return parts.pop()
    }
  }

  // This function is so that static can maintain backwards compatible behaviour
  // without having it's own copy of this code.
  //
  // Traditionally static would enhance all govuk-govspeak elements, thus ones
  // outside of the govspeak components wouldn't be included. This problem
  // should go away if we reach the nirvana of the govspeak component being
  // the sole way to embed govspeak
  YoutubeLinkEnhancement.initLegacy = function () {
    var $govspeaks = $('.govuk-govspeak:not(.gem-c-govspeak):not(.disable-youtube)')
    $govspeaks.each(function () {
      var enhancement = new GOVUK.GovspeakYoutubeLinkEnhancement($(this))
      enhancement.init()
    })
  }

  GOVUK.GovspeakYoutubeLinkEnhancement = YoutubeLinkEnhancement
})(window.GOVUK, window.jQuery)
