/* eslint-env jasmine */

describe('Google Analytics video tracker', function () {
  var GOVUK = window.GOVUK
  var videoTracker, event, expected

  beforeEach(function () {
    window.dataLayer = []
    videoTracker = window.GOVUK.analyticsGa4.analyticsModules.VideoTracker
    videoTracker.init()
    window.GOVUK.analyticsGa4.vars.gem_version = 'aVersion'
    event = {
      target: {
        id: 1,
        videoTitle: 'An example video',
        getCurrentTime: function () {
          return 0
        },
        getVideoUrl: function () {
          return 'https://www.youtube.com/watch?t=26&v=abcdef'
        },
        getDuration: function () {
          return 500
        }
      }
    }
    spyOn(GOVUK.analyticsGa4.core, 'getTimestamp').and.returnValue('123456')
  })

  it('performs initial setup', function () {
    var expectedHandlers = {
      'video-1-25-percent-begin': 125,
      'video-1-25-percent-end': 127,
      'video-1-50-percent-begin': 250,
      'video-1-50-percent-end': 252,
      'video-1-75-percent-begin': 375,
      'video-1-75-percent-end': 377,
      'video-1-duration': 500,
      'video-1-title': 'An example video',
      'video-1-url': 'https://www.youtube.com/watch?v=abcdef'
    }
    videoTracker.configureVideo(event)
    expect(videoTracker.handlers).toEqual(expectedHandlers)
  })

  describe('sends events', function () {
    beforeEach(function () {
      videoTracker.configureVideo(event)
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.type = 'video'
      expected.event_data.text = 'An example video'
      expected.event_data.url = 'https://www.youtube.com/watch?v=abcdef'
      expected.event_data.length = '500'
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
    })

    it('when a video starts', function () {
      videoTracker.trackVideo(event, 'VideoUnstarted')
      expected.event_data.event_name = 'video_start'
      expected.event_data.action = 'start'
      expected.event_data.video_current_time = '0'
      expected.event_data.video_percent = '0'

      expect(window.dataLayer[0]).toEqual(expected)
      // stop the interval from continuing and interfering with other tests
      videoTracker.trackVideo(event, 'VideoEnded')
    })

    it('when a video ends', function () {
      videoTracker.trackVideo(event, 'VideoEnded')
      expected.event_data.event_name = 'video_complete'
      expected.event_data.action = 'complete'
      expected.event_data.video_current_time = '0'
      expected.event_data.video_percent = '100'

      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('cleans urls', function () {
    beforeEach(function () {
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.type = 'video'
      expected.event_data.text = 'An example video'
      expected.event_data.url = 'https://www.youtube.com/watch?v=abcdef'
      expected.event_data.length = '500'
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'
      expected.event_data.event_name = 'video_start'
      expected.event_data.action = 'start'
      expected.event_data.video_current_time = '0'
      expected.event_data.video_percent = '0'
    })

    it('with a time as the first parameter', function () {
      event.target.getVideoUrl = function () {
        return 'https://www.youtube.com/watch?t=26&v=abcdef'
      }
      videoTracker.configureVideo(event)
      videoTracker.trackVideo(event, 'VideoUnstarted')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('with a time as the second parameter', function () {
      event.target.getVideoUrl = function () {
        return 'https://www.youtube.com/watch?v=abcdef&t=03434'
      }
      videoTracker.configureVideo(event)
      expected.event_data.url = 'https://www.youtube.com/watch?v=abcdef'
      videoTracker.trackVideo(event, 'VideoUnstarted')
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('with another random parameter', function () {
      event.target.getVideoUrl = function () {
        return 'https://www.youtube.com/watch?v=abcdef&t=03434&test=test'
      }
      videoTracker.configureVideo(event)
      expected.event_data.url = 'https://www.youtube.com/watch?v=abcdef&test=test'
      videoTracker.trackVideo(event, 'VideoUnstarted')
      expect(window.dataLayer[0]).toEqual(expected)
    })
  })

  describe('when monitoring video playback', function () {
    beforeEach(function () {
      videoTracker.configureVideo(event)
      spyOn(videoTracker, 'checkProgress')
      jasmine.clock().install()
    })

    afterEach(function () {
      videoTracker.checkProgress.calls.reset()
      jasmine.clock().uninstall()
    })

    it('starts monitoring when a video is played', function () {
      videoTracker.trackVideo(event, 'VideoUnstarted')
      jasmine.clock().tick(2000)
      expect(videoTracker.checkProgress).toHaveBeenCalled()
    })

    it('stops monitoring when a video is paused', function () {
      videoTracker.trackVideo(event, 'VideoUnstarted')
      jasmine.clock().tick(2000)
      expect(videoTracker.checkProgress).toHaveBeenCalled()
      jasmine.clock().tick(2000)

      videoTracker.checkProgress.calls.reset()
      videoTracker.trackVideo(event, 'VideoPaused')
      jasmine.clock().tick(2000)
      expect(videoTracker.checkProgress).not.toHaveBeenCalled()
    })
  })

  describe('sends events during playing', function () {
    beforeEach(function () {
      videoTracker.configureVideo(event)
      expected = new GOVUK.analyticsGa4.Schemas().eventSchema()
      expected.event = 'event_data'
      expected.event_data.type = 'video'
      expected.event_data.text = 'An example video'
      expected.event_data.url = 'https://www.youtube.com/watch?v=abcdef'
      expected.event_data.length = '500'
      expected.event_data.event_name = 'video_progress'
      expected.event_data.action = 'progress'
      expected.govuk_gem_version = 'aVersion'
      expected.timestamp = '123456'

      jasmine.clock().install()
    })

    afterEach(function () {
      jasmine.clock().uninstall()
    })

    it('at 25 percent', function () {
      event.target.getCurrentTime = function () {
        return 125
      }
      expected.event_data.video_current_time = '125'
      expected.event_data.video_percent = '25'

      videoTracker.trackVideo(event, 'VideoPlaying')
      jasmine.clock().tick(1000)
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('at 50 percent', function () {
      event.target.getCurrentTime = function () {
        return 250
      }
      expected.event_data.video_current_time = '250'
      expected.event_data.video_percent = '50'

      videoTracker.trackVideo(event, 'VideoPlaying')
      jasmine.clock().tick(1000)
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('at 75 percent', function () {
      event.target.getCurrentTime = function () {
        return 375
      }
      expected.event_data.video_current_time = '375'
      expected.event_data.video_percent = '75'

      videoTracker.trackVideo(event, 'VideoPlaying')
      jasmine.clock().tick(1000)
      expect(window.dataLayer[0]).toEqual(expected)
    })

    it('sends only one event for each percentage reached', function () {
      event.target.getCurrentTime = function () {
        return 250
      }
      expected.event_data.video_current_time = '250'
      expected.event_data.video_percent = '50'

      videoTracker.trackVideo(event, 'VideoPlaying')
      jasmine.clock().tick(1000)
      expect(window.dataLayer[0]).toEqual(expected)

      videoTracker.trackVideo(event, 'VideoPlaying')
      jasmine.clock().tick(5000)
      expect(window.dataLayer.length).toEqual(1)
    })
  })

  describe('with more than one video', function () {
    var event2 = {
      target: {
        id: 2,
        videoTitle: 'Another example video',
        getCurrentTime: function () {
          return 0
        },
        getVideoUrl: function () {
          return 'https://www.youtube.com/watch?t=26&v=xyz'
        },
        getDuration: function () {
          return 1000
        }
      }
    }

    beforeEach(function () {
      spyOn(videoTracker, 'checkProgress')
      jasmine.clock().install()
    })

    afterEach(function () {
      videoTracker.checkProgress.calls.reset()
      jasmine.clock().uninstall()
    })

    it('sets distinct handlers', function () {
      videoTracker.configureVideo(event)
      videoTracker.configureVideo(event2)

      var expectedHandlers = {
        'video-1-25-percent-begin': 125,
        'video-1-25-percent-end': 127,
        'video-1-50-percent-begin': 250,
        'video-1-50-percent-end': 252,
        'video-1-75-percent-begin': 375,
        'video-1-75-percent-end': 377,
        'video-1-duration': 500,
        'video-1-title': 'An example video',
        'video-1-url': 'https://www.youtube.com/watch?v=abcdef',
        'video-2-25-percent-begin': 250,
        'video-2-25-percent-end': 252,
        'video-2-50-percent-begin': 500,
        'video-2-50-percent-end': 502,
        'video-2-75-percent-begin': 750,
        'video-2-75-percent-end': 752,
        'video-2-duration': 1000,
        'video-2-title': 'Another example video',
        'video-2-url': 'https://www.youtube.com/watch?v=xyz'
      }
      expect(videoTracker.handlers).toEqual(expectedHandlers)
    })

    it('handles monitoring when videos are paused', function () {
      videoTracker.trackVideo(event, 'VideoUnstarted')
      videoTracker.trackVideo(event2, 'VideoUnstarted')
      jasmine.clock().tick(2000)
      expect(videoTracker.checkProgress).toHaveBeenCalled()
      jasmine.clock().tick(2000)

      videoTracker.checkProgress.calls.reset()
      videoTracker.trackVideo(event, 'VideoPaused')
      jasmine.clock().tick(2000)
      expect(videoTracker.checkProgress).toHaveBeenCalled()

      videoTracker.checkProgress.calls.reset()
      videoTracker.trackVideo(event2, 'VideoPaused')
      jasmine.clock().tick(2000)
      expect(videoTracker.checkProgress).not.toHaveBeenCalled()
    })
  })
})
