(() => {
  // app/assets/javascripts/govuk_publishing_components/modules/youtube-link-enhancement.js
  var YoutubeLinkEnhancement = class {
    constructor($element, $classOverride) {
      this.$element = $element;
      this.$classOverride = typeof $classOverride !== "undefined" ? $classOverride : "gem-c-govspeak__youtube-video";
      window.apiScriptInserted = window.apiScriptInserted !== void 0 ? window.apiScriptInserted : false;
      window.playerApiReady = window.playerApiReady !== void 0 ? window.playerApiReady : false;
      window.YoutubeQueuedInserts = window.YoutubeQueuedInserts && window.YoutubeQueuedInserts.length ? window.YoutubeQueuedInserts : [];
      window.onYouTubePlayerAPIReady = window.onYouTubePlayerAPIReady || function() {
        window.playerApiReady = true;
        for (var i = 0; i < window.YoutubeQueuedInserts.length; i++) {
          window.YoutubeQueuedInserts[i].call();
        }
      };
    }
    init() {
      if (!this.campaignCookiesAllowed()) {
        this.startModule = this.startModule.bind(this);
        window.addEventListener("cookie-consent", this.startModule);
        return;
      }
      this.startModule();
    }
    startModule() {
      window.removeEventListener("cookie-consent", this.startModule);
      var $youtubeLinks = this.$element.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
      if ($youtubeLinks.length > 0) {
        this.insertApiScript();
      }
      for (var i = 0; i < $youtubeLinks.length; ++i) {
        var $link = $youtubeLinks[i];
        var href = $link.getAttribute("href");
        var hasTracking = $link.hasAttribute("data-youtube-player-analytics");
        var options = {
          link: $link
        };
        if (hasTracking) {
          options.tracking = {
            hasTracking,
            category: $link.getAttribute("data-youtube-player-analytics-category")
          };
        }
        if (href.indexOf("/live_stream") >= 0) {
          var channelId = this.parseLivestream(href);
          if (!this.hasDisabledEmbed($link) && channelId) {
            options.channel = channelId;
            this.setupVideo(options);
          }
        } else {
          var videoId = this.parseVideoId(href);
          if (!this.hasDisabledEmbed($link) && videoId) {
            options.videoId = videoId;
            this.setupVideo(options);
          }
        }
      }
    }
    hasDisabledEmbed($link) {
      return $link.getAttribute("data-youtube-player") === "off";
    }
    setupVideo(options) {
      var elementId = this.nextId();
      var $link = options.link;
      var id = options.videoId ? options.videoId : options.channel;
      var parentPara = $link.parentNode;
      var parentContainer = parentPara.parentNode;
      var youtubeVideoContainer = document.createElement("div");
      youtubeVideoContainer.className += this.$classOverride;
      youtubeVideoContainer.innerHTML = '<span id="' + elementId + '" data-video-id="' + id + '"></span>';
      options.title = $link.textContent;
      parentContainer.replaceChild(youtubeVideoContainer, parentPara);
      this.insertVideo(elementId, options);
    }
    insertVideo(elementId, options) {
      var channelId = "";
      var videoId = "";
      if (options.channel) {
        channelId = options.channel;
        videoId = "live_stream";
      } else {
        videoId = options.videoId;
      }
      var videoInsert = function() {
        new window.YT.Player(elementId, {
          // eslint-disable-line no-new
          videoId,
          host: "https://www.youtube-nocookie.com",
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
            onReady: function(event) {
              var videoTitle = options.title;
              event.target.getIframe().title = videoTitle + " (video)";
            },
            onStateChange: function(event) {
              var eventData = event.data;
              var eventTarget = event.target;
              var states = {
                /* eslint-disable quote-props */
                "-1": "VideoUnstarted",
                "0": "VideoEnded",
                "1": "VideoPlaying",
                "2": "VideoPaused",
                "3": "VideoBuffering",
                "5": "VideoCued"
                /* eslint-enable */
              };
              if (states[eventData] && options.tracking && options.tracking.hasTracking && window.GOVUK.analytics && window.GOVUK.analytics.trackEvent) {
                var tracking = {
                  category: options.tracking.category,
                  action: states[eventData],
                  label: { transport: "beacon", label: eventTarget.getVideoData && eventTarget.getVideoData().title }
                };
                window.GOVUK.analytics.trackEvent(tracking.category, tracking.action, tracking.label);
              }
            }
          }
        });
      };
      videoInsert = videoInsert.bind(this);
      if (window.playerApiReady) {
        videoInsert.call();
      } else {
        window.YoutubeQueuedInserts.push(videoInsert);
      }
    }
    campaignCookiesAllowed() {
      var cookiePolicy = window.GOVUK.getConsentCookie();
      return cookiePolicy !== null ? cookiePolicy.campaigns : true;
    }
    nextId() {
      this.embedCount = this.embedCount || 0;
      this.embedCount += 1;
      return "youtube-" + this.embedCount;
    }
    insertApiScript() {
      if (window.apiScriptInserted) {
        return;
      }
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/player_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.apiScriptInserted = true;
    }
    parseLivestream(url) {
      var matches = url.match(/channel=([^&]*)/);
      if (matches) {
        return matches[1];
      }
    }
    // This is a public class method so it can be used outside of this embed to
    // check that user input for videos will be supported in govspeak
    parseVideoId(url) {
      var parts;
      if (url.indexOf("youtube.com") > -1) {
        var params = {};
        parts = url.split("?");
        if (parts.length === 1) {
          return;
        }
        parts = parts[1].split("&");
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i].split("=");
          params[part[0]] = part[1];
        }
        return params.v;
      } else if (url.indexOf("youtu.be") > -1) {
        parts = url.split("/");
        return parts.pop();
      }
    }
  };
  var youtube_link_enhancement_default = YoutubeLinkEnhancement;
})();
//# sourceMappingURL=assets/youtube-link-enhancement.js.map
