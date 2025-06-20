(function () {
  'use strict'
  window.GOVUK = window.GOVUK || {}
  var GOVUK = window.GOVUK || {}

  var YoutubeLinkEnhancement = function ($element, $classOverride) {
    this.$element = $element
    this.$classOverride = typeof $classOverride !== 'undefined' ? $classOverride : 'gem-c-govspeak__youtube-video'
    this.punctuationRegex = /[\.!\?"']/g // eslint-disable-line no-useless-escape
  }

  YoutubeLinkEnhancement.prototype.init = function () {
    if (!this.campaignCookiesAllowed()) {
      this.start = this.startModule.bind(this)
      window.addEventListener('cookie-consent', this.start)
      this.decorateLink()
      return
    }
    this.startModule()
  }

  YoutubeLinkEnhancement.prototype.paragraphHasOtherContent = function (paragraph, link) {
    return paragraph.innerHTML.replaceAll(this.punctuationRegex, '').trim() !== link.outerHTML.replaceAll(this.punctuationRegex, '').trim()
  }

  YoutubeLinkEnhancement.prototype.decorateLink = function () {
    var $youtubeLinks = this.$element.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]')
    for (var i = 0; i < $youtubeLinks.length; ++i) {
      var $link = $youtubeLinks[i]
      if (this.hasDisabledEmbed($link) || $link.getAttribute('href').includes('/playlist')) {
        continue
      }

      var $linkParent = $link.closest('p')

      // Only replace the <p> with a YT embed if the YT link is the only thing in the <p>.
      // This prevents other content in the <p> being lost.
      // However, if a <p> exists with only a YT link and punctuation, we do allow the punctuation characters to be lost to the YT embed.
      if (this.paragraphHasOtherContent($linkParent, $link)) {
        continue
      }
      var href = $link.getAttribute('href')
      var text = $link.textContent
      var placeholder = document.createElement('p')
      placeholder.setAttribute('class', 'gem-c-govspeak__youtube-placeholder govuk-body')
      var markup = `
        <span class="govuk-heading-s">How to watch this YouTube video</span>
        <span class="gem-c-govspeak__youtube-placeholder-text">There's a YouTube video on this page. You can't access it because of your cookie settings.</span>
        <span class="gem-c-govspeak__youtube-placeholder-text">You can <a href="/help/cookies" class="govuk-link">change your cookie settings</a> or watch the video on YouTube instead:</span>
        <a href="${href}" class="govuk-link">${text}</a>
      `
      placeholder.innerHTML = markup
      $linkParent.after(placeholder)
      $linkParent.classList.add('gem-c-govspeak__youtube-placeholder-link')
    }
  }

  YoutubeLinkEnhancement.prototype.startModule = function () {
    window.removeEventListener('cookie-consent', this.start)
    var $placeholders = this.$element.querySelectorAll('.gem-c-govspeak__youtube-placeholder')
    for (var p = 0; p < $placeholders.length; ++p) {
      $placeholders[p].remove()
    }

    var $youtubeLinks = this.$element.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]')

    if ($youtubeLinks.length > 0) {
      YoutubeLinkEnhancement.insertApiScript()
    }

    for (var i = 0; i < $youtubeLinks.length; ++i) {
      var $link = $youtubeLinks[i]
      var href = $link.getAttribute('href')
      var options = {
        link: $link
      }

      if (href.includes('/live_stream')) {
        var channelId = YoutubeLinkEnhancement.parseLivestream(href)

        if (!this.hasDisabledEmbed($link) && channelId) {
          options.channel = channelId
          this.setupVideo(options)
        }
      } else {
        var videoId = YoutubeLinkEnhancement.parseVideoId(href)
        if (!this.hasDisabledEmbed($link) && videoId) {
          options.videoId = videoId
          this.setupVideo(options)
        }
      }
    }
  }

  YoutubeLinkEnhancement.prototype.hasDisabledEmbed = function ($link) {
    return $link.getAttribute('data-youtube-player') === 'off'
  }

  YoutubeLinkEnhancement.prototype.setupVideo = function (options) {
    var elementId = YoutubeLinkEnhancement.nextId()
    var $link = options.link

    var id = options.videoId ? options.videoId : options.channel

    var parentPara = $link.parentNode
    var parentContainer = parentPara.parentNode

    // Only replace the <p> with a YT embed if the YT link is the only thing in the <p>.
    // This prevents other content in the <p> being lost.
    // However, if a <p> exists with only a YT link and punctuation, we do allow the punctuation characters to be lost to the YT embed.
    if (this.paragraphHasOtherContent(parentPara, $link)) {
      return
    }

    var youtubeVideoContainer = document.createElement('div')
    youtubeVideoContainer.className += this.$classOverride
    youtubeVideoContainer.innerHTML = '<span id="' + elementId + '" data-video-id="' + id + '"></span>'

    options.title = $link.textContent

    parentContainer.replaceChild(youtubeVideoContainer, parentPara)
    this.insertVideo(elementId, options)
  }

  YoutubeLinkEnhancement.prototype.insertVideo = function (elementId, options) {
    var channelId = ''
    var videoId = ''

    if (options.channel) {
      channelId = options.channel
      videoId = 'live_stream'
    } else {
      videoId = options.videoId
    }

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
          modestbranding: 1,
          // To support live_stream videos
          channel: channelId
        },
        events: {
          onReady: function (event) {
            // update iframe title attribute once video is ready
            // this is done to let screen reader users know that they are focused on a video
            // https://github.com/alphagov/govuk_publishing_components/pull/908#discussion_r302913995
            var videoTitle = options.title
            event.target.getIframe().title = videoTitle + ' (video)'
            if (window.GOVUK.analyticsGa4.analyticsModules && window.GOVUK.analyticsGa4.analyticsModules.VideoTracker) {
              window.GOVUK.analyticsGa4.analyticsModules.VideoTracker.configureVideo(event)
            }
          },
          onStateChange: function (event) {
            var eventData = event.data
            var states = {
              /* eslint-disable quote-props */
              '-1': 'VideoUnstarted',
              '0': 'VideoEnded',
              '1': 'VideoPlaying',
              '2': 'VideoPaused',
              '3': 'VideoBuffering',
              '5': 'VideoCued'
              /* eslint-enable */
            }
            if (window.GOVUK.analyticsGa4.analyticsModules.VideoTracker) {
              window.GOVUK.analyticsGa4.analyticsModules.VideoTracker.trackVideo(event, states[eventData])
            }
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
    return cookiePolicy !== null ? cookiePolicy.campaigns : false
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

  YoutubeLinkEnhancement.parseLivestream = function (url) {
    var matches = url.match(/channel=([^&]*)/)

    if (matches) {
      return matches[1]
    }
  }

  YoutubeLinkEnhancement.sanitiseVideoId = function (pathname) {
    // YouTube links can now contain an ?si= param in the URL.
    // This usually only appears on youtu.be links but it's appearing for us on youtube.com URLs due to some Whitehall regex being outdated.
    // Therefore we need to use regex to remove it from the path.
    // E.g. youtube.com/watch?v=[video-id]?si=ABCzJtVWBAZ2o_l3
    // ?=si in this case isn't a valid query parameter as it isn't using an &, so we can't use JS' native URL API to filter it out.
    if (pathname) {
      return pathname.replace(/(\?|&)(.+)=.+/g, '')
    }
  }

  // This is a public class method so it can be used outside of this embed to
  // check that user input for videos will be supported in govspeak
  YoutubeLinkEnhancement.parseVideoId = function (url) {
    var u

    try {
      u = new URL(url)
    } catch (e) { return undefined }

    if (u.host === 'www.youtube.com' || u.host === 'youtube.com') {
      return this.sanitiseVideoId(u.searchParams.get('v')) || undefined
    } else if (u.host === 'youtu.be') {
      var pathName = u.pathname.slice(1) // Trim the leading /
      return this.sanitiseVideoId(pathName)
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
