/* eslint-env jasmine, jquery */
/* global GOVUK */

var $ = window.jQuery

describe('GOVUK.GoogleAnalyticsUniversalTracker', function () {
  'use strict'

  function addGoogleAnalyticsSpy () {
    window.ga = function () {}
    spyOn(window, 'ga')
  }

  var universal
  var setupArguments

  beforeEach(function () {
    addGoogleAnalyticsSpy()
    pageWantsDatesStripped()
    pageWantsPostcodesStripped()

    universal = new GOVUK.GoogleAnalyticsUniversalTracker('id', {
      cookieDomain: 'cookie-domain.com',
      siteSpeedSampleRate: 100
    })

    GOVUK.analytics.setDimension = GOVUK.analytics.setDimension || {}
  })

  afterEach(function () {
    $('head').find('meta[name="govuk:static-analytics:strip-dates"]').remove()
    $('head').find('meta[name="govuk:static-analytics:strip-postcodes"]').remove()
    $('[src="https://www.google-analytics.com/analytics.js"]').remove()

    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
    if (GOVUK.analytics.setDimension.calls) {
      GOVUK.analytics.setDimension.calls.reset()
    }
  })

  it('can load the libraries needed to run universal Google Analytics', function () {
    delete window.ga
    // window.ga.calls.reset()
    $('[src="https://www.google-analytics.com/analytics.js"]').remove()
    GOVUK.GoogleAnalyticsUniversalTracker.load()
    expect($('script[async][src="https://www.google-analytics.com/analytics.js"]').length).toBe(1)
    expect(typeof window.ga).toBe('function')

    window.ga('send message')
    expect(window.ga.q[0]).toEqual(jasmine.any(Object))
  })

  describe('when created', function () {
    beforeEach(function () {
      setupArguments = window.ga.calls.allArgs()
    })

    it('configures a Google tracker using the provided profile ID and config', function () {
      expect(setupArguments[0]).toEqual(['create', 'id', { cookieDomain: 'cookie-domain.com', siteSpeedSampleRate: 100 }])
    })

    it('anonymises the IP', function () {
      expect(setupArguments[1]).toEqual(['set', 'anonymizeIp', true])
    })

    it('disables Ad features', function () {
      expect(setupArguments[2]).toEqual(['set', 'allowAdFeatures', false])
    })
  })

  describe('when created (with legacy non-object syntax)', function () {
    beforeEach(function () {
      addGoogleAnalyticsSpy()

      universal = new GOVUK.GoogleAnalyticsUniversalTracker('id', 'cookie-domain.com')
      setupArguments = window.ga.calls.allArgs()
    })

    it('configures a Google tracker using the provided profile ID and cookie domain', function () {
      expect(setupArguments[0]).toEqual(['create', 'id', { cookieDomain: 'cookie-domain.com' }])
    })
  })

  describe('when pageviews are tracked', function () {
    it('sends them to Google Analytics', function () {
      universal.trackPageview()
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview'])
    })

    it('sends them to Google Analytics, forcing a new session', function () {
      universal.trackPageview(undefined, undefined, { sessionControl: 'start' })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { sessionControl: 'start' }])
    })

    it('can track a virtual pageview', function () {
      universal.trackPageview('/nicholas-page')
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/nicholas-page' }])
    })

    it('can track a virtual pageview with a custom title', function () {
      universal.trackPageview('/nicholas-page', 'Nicholas Page')
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/nicholas-page', title: 'Nicholas Page' }])
    })

    it('can set the transport method on a pageview', function () {
      universal.trackPageview('/t', 'T', { transport: 'beacon' })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/t', title: 'T', transport: 'beacon' }])
    })

    it('can send a pageview to a named tracker', function () {
      universal.trackPageview('/path', 'title', { trackerName: 'another_tracker' })
      expect(window.ga.calls.mostRecent().args).toEqual(['another_tracker.send', 'pageview', { page: '/path', title: 'title', trackerName: 'another_tracker' }])
    })
  })

  describe('when events are tracked', function () {
    function eventObjectFromSpy () {
      return window.ga.calls.mostRecent().args[1]
    }

    it('sends them to Google Analytics', function () {
      universal.trackEvent('category', 'action', { label: 'label' })
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', { hitType: 'event', eventCategory: 'category', eventAction: 'action', eventLabel: 'label' }]
      )
    })

    it('tracks custom dimensions', function () {
      universal.trackEvent('category', 'action', { dimension29: 'Home' })
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', { hitType: 'event', eventCategory: 'category', eventAction: 'action', dimension29: 'Home' }]
      )
    })

    it('the label is optional', function () {
      universal.trackEvent('category', 'action')
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', { hitType: 'event', eventCategory: 'category', eventAction: 'action' }]
      )
    })

    it('the option trackerName overrides the default tracker', function () {
      universal.trackEvent('category', 'action', { trackerName: 'testTracker' })
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['testTracker.send', { hitType: 'event', eventCategory: 'category', eventAction: 'action' }]
      )
    })

    it('only sends values if they are parseable as numbers', function () {
      universal.trackEvent('category', 'action', { label: 'label', value: '10' })
      expect(eventObjectFromSpy().eventValue).toEqual(10)

      universal.trackEvent('category', 'action', { label: 'label', value: 10 })
      expect(eventObjectFromSpy().eventValue).toEqual(10)

      universal.trackEvent('category', 'action', { label: 'label', value: 'not a number' })
      expect(eventObjectFromSpy().eventValue).toEqual(undefined)
    })

    it('can mark an event as non interactive', function () {
      universal.trackEvent('category', 'action', { label: 'label', value: 0, nonInteraction: true })
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', {
          hitType: 'event',
          eventCategory: 'category',
          eventAction: 'action',
          eventLabel: 'label',
          eventValue: 0,
          nonInteraction: 1
        }]
      )
    })

    it('sends the page if supplied', function () {
      universal.trackEvent('category', 'action', { page: '/path/to/page' })
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', { hitType: 'event', eventCategory: 'category', eventAction: 'action', page: '/path/to/page' }]
      )
    })

    it('can set the transport method on an event', function () {
      universal.trackEvent('category', 'action', { transport: 'beacon' })
      expect(window.ga.calls.mostRecent().args).toEqual(
        ['send', { hitType: 'event', eventCategory: 'category', eventAction: 'action', transport: 'beacon' }]
      )
    })
  })

  describe('when social events are tracked', function () {
    it('sends them to Google Analytics', function () {
      universal.trackSocial('network', 'action', 'target')
      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'network',
        socialAction: 'action',
        socialTarget: 'target'
      }])
    })
  })

  describe('when setting a custom dimension', function () {
    it('sends the dimension to Google Analytics with the specified index and value', function () {
      universal.setDimension(1, 'value')
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value'])
    })

    it('coerces the value to a string', function () {
      universal.setDimension(1, 10)
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '10'])
    })
  })

  describe('when tracking all events', function () {
    beforeAll(function () {
      window.history.replaceState(null, null, '?address=an.email@digital.cabinet-office.gov.uk&postcode=sw11wa&date=2019-01-01')
    })

    afterAll(function () {
      var href = window.location.href.replace('?address=an.email@digital.cabinet-office.gov.uk&postcode=sw11wa&date=2019-01-01', '')
      window.history.replaceState(null, null, href)
    })

    it('removes any pii from the location', function () {
      expect(window.ga.calls.mostRecent().args[2]).toContain('address=[email]')
      expect(window.ga.calls.mostRecent().args[2]).toContain('postcode=[postcode]')
      expect(window.ga.calls.mostRecent().args[2]).toContain('date=[date]')
    })

    it('removes any pii from the title', function () {
      var title = document.title
      $('title').html('With email@email.com 2012-01-01 and wc2b 6nh in it')
      // need to reinit all the GA setup because the page title has changed
      addGoogleAnalyticsSpy()
      pageWantsDatesStripped()
      pageWantsPostcodesStripped()

      universal = new GOVUK.GoogleAnalyticsUniversalTracker('id', {
        cookieDomain: 'cookie-domain.com',
        siteSpeedSampleRate: 100
      })

      expect(window.ga.calls.allArgs()).toContain(['set', 'title', 'With [email] [date] and [postcode] in it'])
      $('title').html(title)
    })
  })

  describe('adding a linked tracker', function () {
    var callIndex

    beforeAll(function () {
      window.history.replaceState(null, null, '?address=an.email@digital.cabinet-office.gov.uk&postcode=sw11wa&date=2019-01-01')
    })

    afterAll(function () {
      var href = window.location.href.replace('?address=an.email@digital.cabinet-office.gov.uk&postcode=sw11wa&date=2019-01-01', '')
      window.history.replaceState(null, null, href)
    })

    beforeEach(function () {
      callIndex = window.ga.calls.count()
      universal.addLinkedTrackerDomain('UA-123456', 'testTracker', ['some.service.gov.uk'])
    })

    it('creates a tracker for the ID', function () {
      expect(window.ga.calls.argsFor(callIndex)).toEqual(['create', 'UA-123456', 'auto', Object({ name: 'testTracker' })])
    })
    it('requires and configures the linker plugin', function () {
      expect(window.ga.calls.argsFor(callIndex + 1)).toEqual(['testTracker.require', 'linker'])
    })
    it('disables Ad features', function () {
      expect(window.ga.calls.allArgs()).toContain(['set', 'allowAdFeatures', false])
    })
    it('configures the domain', function () {
      expect(window.ga.calls.argsFor(callIndex + 2)).toEqual(['testTracker.linker:autoLink', ['some.service.gov.uk']])
    })
    it('sends a pageview', function () {
      expect(window.ga.calls.mostRecent().args).toEqual(['testTracker.send', 'pageview'])
    })
    it('removes pii from the pageview', function () {
      var title = document.title
      $('title').html('With email@email.com 2012-01-01 and wc2b 6nh in it')

      // need to reinit all the GA setup because the page title has changed
      addGoogleAnalyticsSpy()
      pageWantsDatesStripped()
      pageWantsPostcodesStripped()

      universal = new GOVUK.GoogleAnalyticsUniversalTracker('id', {
        cookieDomain: 'cookie-domain.com',
        siteSpeedSampleRate: 100
      })

      expect(window.ga.calls.allArgs()).toContain(['set', 'title', 'With [email] [date] and [postcode] in it'])
      expect(window.ga.calls.argsFor(4)[2]).toContain('?address=[email]&postcode=[postcode]&date=[date]')

      $('title').html(title)
    })
    it('can omit sending a pageview', function () {
      universal.addLinkedTrackerDomain('UA-123456', 'testTracker', 'some.service.gov.uk', false)
      expect(window.ga.calls.mostRecent().args).not.toEqual(['testTracker.send', 'pageview'])
    })
  })

  describe('adding a linked tracker with two domains', function () {
    var callIndex

    beforeEach(function () {
      callIndex = window.ga.calls.count()
      universal.addLinkedTrackerDomain('UA-789', 'multiple', ['some.service.gov.uk', 'another.service.gov.uk'])
    })
    it('creates a tracker for the ID', function () {
      expect(window.ga.calls.argsFor(callIndex)).toEqual(['create', 'UA-789', 'auto', Object({ name: 'multiple' })])
    })
    it('requires and configures the linker plugin', function () {
      expect(window.ga.calls.argsFor(callIndex + 1)).toEqual(['multiple.require', 'linker'])
    })
    it('configures the domains', function () {
      expect(window.ga.calls.argsFor(callIndex + 2)).toEqual(['multiple.linker:autoLink', ['some.service.gov.uk', 'another.service.gov.uk']])
    })
    it('sends a pageview', function () {
      expect(window.ga.calls.mostRecent().args).toEqual(['multiple.send', 'pageview'])
    })
  })

  describe('adding a linked tracker with multiple domains', function () {
    var callIndex

    beforeEach(function () {
      callIndex = window.ga.calls.count()
      universal.addLinkedTrackerDomain('UA-987', 'multiple', ['some.service.gov.uk', 'another.service.gov.uk', 'third.service.gov.uk', 'fourth.service.gov.uk'])
    })
    it('creates a tracker for the ID', function () {
      expect(window.ga.calls.argsFor(callIndex)).toEqual(['create', 'UA-987', 'auto', Object({ name: 'multiple' })])
    })
    it('requires and configures the linker plugin', function () {
      expect(window.ga.calls.argsFor(callIndex + 1)).toEqual(['multiple.require', 'linker'])
    })
    it('configures the domains', function () {
      expect(window.ga.calls.argsFor(callIndex + 2)).toEqual(['multiple.linker:autoLink', ['some.service.gov.uk', 'another.service.gov.uk', 'third.service.gov.uk', 'fourth.service.gov.uk']])
    })
    it('sends a pageview', function () {
      expect(window.ga.calls.mostRecent().args).toEqual(['multiple.send', 'pageview'])
    })
  })

  function pageWantsDatesStripped () {
    $('head').append('<meta name="govuk:static-analytics:strip-dates" value="does not matter" />')
  }

  function pageWantsPostcodesStripped () {
    $('head').append('<meta name="govuk:static-analytics:strip-postcodes" value="does not matter" />')
  }
})
