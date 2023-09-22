window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var VideoTracker = {
    init: function () {
      this.handlers = {}
    },

    configureVideo: function (event) {
      var player = event.target
      var videoId = player.id
      var duration = player.getDuration()
      var percentages = [25, 50, 75]

      for (var i = 0; i < percentages.length; i++) {
        var percent = percentages[i]
        var position = (duration / 100) * percent
        this.handlers['video-' + videoId + '-' + percent + '-percent-begin'] = position
        // interval is once a second, so end point must be at least one second beyond begin point
        this.handlers['video-' + videoId + '-' + percent + '-percent-end'] = position + 2
      }
    },

    trackVideo: function (event, state) {
      var videoTracker = window.GOVUK.analyticsGa4.analyticsModules.VideoTracker
      var player = event.target
      var videoId = player.id
      clearInterval(videoTracker.handlers['video-' + videoId])

      if (state === 'VideoUnstarted') {
        videoTracker.handlers['video-' + videoId] = setInterval(videoTracker.checkProgress, 1000, player)
        videoTracker.sendData(player, 'start', 0) // VideoUnstarted seems to only happen the first time video is played
      } else if (state === 'VideoPlaying') {
        videoTracker.handlers['video-' + videoId] = setInterval(videoTracker.checkProgress, 1000, player)
      } else if (state === 'VideoEnded') {
        if (!videoTracker.handlers['video-' + videoId + '-100']) {
          videoTracker.sendData(player, 'complete', 100)
          videoTracker.handlers['video-' + videoId + '-100'] = true
        }
      }
    },

    checkProgress: function (player) {
      var videoId = player.id
      var videoTracker = window.GOVUK.analyticsGa4.analyticsModules.VideoTracker
      var pos = player.getCurrentTime()
      var percentages = [25, 50, 75]

      // this looks really clunky and long hand
      // but we have to do this once a second so doing the minimum before dropping out
      // of an if statement is more efficient than combining all these statements into one
      for (var i = 0; i < percentages.length; i++) {
        if (pos >= videoTracker.handlers['video-' + videoId + '-' + percentages[i] + '-percent-begin']) {
          if (pos < videoTracker.handlers['video-' + videoId + '-' + percentages[i] + '-percent-end']) {
            if (!videoTracker.handlers['video-' + videoId + '-' + percentages[i]]) {
              videoTracker.sendData(player, 'progress', percentages[i])
              videoTracker.handlers['video-' + videoId + '-' + percentages[i]] = true
            }
            return
          }
        }
      }
    },

    sendData: function (player, event, position) {
      var data = {}
      data.event_name = 'video_' + event
      data.type = 'video'
      data.url = this.cleanVideoUrl(player.getVideoUrl())
      data.text = player.videoTitle
      data.action = event
      data.video_current_time = Math.round(player.getCurrentTime())
      data.video_duration = Math.ceil(player.getDuration()) // number returned from the API varies, so round up
      data.video_percent = position

      var schemas = new window.GOVUK.analyticsGa4.Schemas()
      var schema = schemas.mergeProperties(data, 'event_data')

      window.GOVUK.analyticsGa4.core.sendData(schema)
    },

    cleanVideoUrl: function (url) {
      url = url.replace(/[?]{1}t=[0-9]+[&]{1}/, '?') // replace ?t=123& with ?
      url = url.replace(/[&]{1}t=[0-9]+/, '') // replace &t=123 with ''
      return url
    }
  }

  analyticsModules.VideoTracker = VideoTracker
})(window.GOVUK.analyticsGa4.analyticsModules)
