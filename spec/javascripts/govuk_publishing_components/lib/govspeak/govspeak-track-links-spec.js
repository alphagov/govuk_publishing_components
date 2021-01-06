/* eslint-env jasmine, jquery */
var GOVUK = window.GOVUK

describe('Govspeak Track Links', function () {
  var tracker
  var element

  beforeEach(function () {
    spyOn(GOVUK.analytics, 'trackEvent')
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
  })

  describe('Single link', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('data-track-links-category', 'Content page 1')
      element.innerHTML = '<a href="/blah/blahhhh">Blahh</a>'

      tracker = new GOVUK.Modules.GovspeakTrackLinks()
      tracker.start($(element))
    })

    it('sends a ga event when link is clicked', function () {
      element.querySelector('a').dispatchEvent(new window.Event('click'))

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'Content page 1', 'Blahh', { transport: 'beacon', label: '/blah/blahhhh' }
      )
    })
  })

  describe('Multiple links', function () {
    beforeEach(function () {
      element = document.createElement('div')
      element.setAttribute('data-track-links-category', 'Content page 2')
      element.innerHTML = '<a href="/blah/blahhhh">Blahh</a>'
      element.innerHTML += '<a href="/blah/blahhhh2">Blahh2</a>'
      element.innerHTML += '<a href="https://www.external-link.com">External link blahhh</a>'

      tracker = new GOVUK.Modules.GovspeakTrackLinks()
      tracker.start($(element))
    })

    it('sends ga events for all links clicked', function () {
      element
        .querySelectorAll('a')
        .forEach(function (link) {
          link.dispatchEvent(new window.Event('click'))
        })

      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'Content page 2', 'Blahh', { transport: 'beacon', label: '/blah/blahhhh' }
      )
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'Content page 2', 'Blahh2', { transport: 'beacon', label: '/blah/blahhhh2' }
      )
      expect(GOVUK.analytics.trackEvent).toHaveBeenCalledWith(
        'Content page 2', 'External link blahhh', { transport: 'beacon', label: 'https://www.external-link.com' }
      )
    })
  })
})
