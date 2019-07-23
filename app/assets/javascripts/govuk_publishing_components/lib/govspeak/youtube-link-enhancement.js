(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}
  var GOVUK = window.GOVUK || {}

  var YoutubeLinkEnhancement = function ($element) {
    this.$element = $element
  }

  YoutubeLinkEnhancement.prototype.init = function () {
    if (!this.campaignCookiesAllowed()) {
      return
    }

    var $youtubeLinks = this.$element.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]')

    if ($youtubeLinks.length > 0) {
      YoutubeLinkEnhancement.insertApiScript()
    }

    for (var i = 0; i < $youtubeLinks.length; ++i) {
      var $link = $youtubeLinks[i]

      var videoId = YoutubeLinkEnhancement.parseVideoId($link.getAttribute('href'))

      if (!this.hasDisabledEmbed($link) && videoId) {
        this.setupVideo($link, videoId)
      }
    }
  }

  YoutubeLinkEnhancement.prototype.hasDisabledEmbed = function ($link) {
    return $link.getAttribute('data-youtube-player') === 'off'
  }

  YoutubeLinkEnhancement.prototype.setupVideo = function ($link, videoId) {
    var elementId = YoutubeLinkEnhancement.nextId()

    var parentPara = $link.parentNode
    var parentContainer = parentPara.parentNode

    var youtubeVideoContainer = document.createElement('div')
    youtubeVideoContainer.className += 'gem-c-govspeak__youtube-video'
    youtubeVideoContainer.innerHTML = '<span id="' + elementId + '" data-video-id="' + videoId + '"></span>'

    parentContainer.replaceChild(youtubeVideoContainer, parentPara)
    this.insertVideo(elementId, videoId, $link.textContent)
  }

  YoutubeLinkEnhancement.prototype.insertVideo = function (elementId, videoId, title) {
    var videoInsert = function () {
      new window.YT.Player(elementId, { // eslint-disable-line no-new
        videoId: videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          // enables the player to be controlled via IFrame or JavaScript Player API calls
          enablejsapi: 1,
          origin: window.location.origin,
          // don't show related videos
          rel: 0,
          // disable option to allow single key shortcuts due to (WCAG SC 2.1.4)
          // https://www.w3.org/WAI/WCAG21/quickref/#character-key-shortcuts
          disablekb: 1,
          // prevent the YouTube logo from displaying in the control bar
          modestbranding: 1
        },
        events: {
          onReady: function (event) {
            // update iframe title attribute once video is ready
            event.target.a.setAttribute('title', title + ' (video)')
          }
        }
      })
    }

    videoInsert = videoInsert.bind(this)

    if (YoutubeLinkEnhancement.playerApiReady) {
      videoInsert.call()
    } else {
      YoutubeLinkEnhancement.queuedInserts.push(videoInsert)
    }
  }

  YoutubeLinkEnhancement.prototype.campaignCookiesAllowed = function () {
    var cookiePolicy = window.GOVUK.getConsentCookie()
    return cookiePolicy !== null ? cookiePolicy.campaigns : true
  }

  YoutubeLinkEnhancement.nextId = function () {
    this.embedCount = this.embedCount || 0
    this.embedCount += 1
    return 'youtube-' + this.embedCount
  }

  YoutubeLinkEnhancement.insertApiScript = function () {
    if (this.apiScriptInserted) {
      return
    }

    var tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/player_api'
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    this.apiScriptInserted = true
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

  YoutubeLinkEnhancement.apiScriptInserted = false
  YoutubeLinkEnhancement.playerApiReady = false
  // an array of functions to be called once the Youtube Player API is ready
  YoutubeLinkEnhancement.queuedInserts = []

  window.onYouTubePlayerAPIReady = function () {
    YoutubeLinkEnhancement.playerApiReady = true
    for (var i = 0; i < YoutubeLinkEnhancement.queuedInserts.length; i++) {
      YoutubeLinkEnhancement.queuedInserts[i].call()
    }
  }

  GOVUK.GovspeakYoutubeLinkEnhancement = YoutubeLinkEnhancement
})()
