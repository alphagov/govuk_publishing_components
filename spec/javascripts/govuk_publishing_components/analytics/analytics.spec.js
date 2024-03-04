/* eslint-env jasmine, jquery */

describe('GOVUK.Analytics', function () {
  'use strict'
  var GOVUK = window.GOVUK

  function addGoogleAnalyticsSpy () {
    if (typeof window.ga === 'undefined') {
      window.ga = function () {}
    }
    spyOn(window, 'ga')
  }

  var analytics
  var universalSetupArguments

  beforeEach(function () {
    addGoogleAnalyticsSpy()

    analytics = new GOVUK.Analytics({
      universalId: 'universal-id',
      cookieDomain: '.www.gov.uk',
      siteSpeedSampleRate: 100
    })

    GOVUK.analytics.setDimension = GOVUK.analytics.setDimension || {}
  })

  afterEach(function () {
    if (GOVUK.analytics.trackEvent.calls) {
      GOVUK.analytics.trackEvent.calls.reset()
    }
    if (GOVUK.analytics.setDimension.calls) {
      GOVUK.analytics.setDimension.calls.reset()
    }
  })

  describe('when created', function () {
    beforeEach(function () {
      universalSetupArguments = window.ga.calls.allArgs()
    })

    it('configures a universal tracker', function () {
      expect(universalSetupArguments[0]).toEqual(['create', 'universal-id', { cookieDomain: '.www.gov.uk', siteSpeedSampleRate: 100 }])
      expect(universalSetupArguments[1]).toEqual(['set', 'anonymizeIp', true])
      expect(universalSetupArguments[2]).toEqual(['set', 'allowAdFeatures', false])
    })
  })

  describe('extracting the default path for a page view', function () {
    it('returns a path extracted from the location', function () {
      var location = {
        protocol: 'https:',
        hostname: 'govuk-frontend-toolkit.example.com',
        href: 'https://govuk-frontend-toolkit.example.com/a/path',
        origin: 'https://govuk-frontend-toolkit.example.com'
      }
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path')
    })

    it('includes the querystring in the path extracted from the location', function () {
      var location = {
        protocol: 'https:',
        hostname: 'govuk-frontend-toolkit.example.com',
        href: 'https://govuk-frontend-toolkit.example.com/a/path?with=a&query=string',
        origin: 'https://govuk-frontend-toolkit.example.com'
      }
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path?with=a&query=string')
    })

    it('removes any anchor from the path extracted from the location', function () {
      var location = {
        protocol: 'https:',
        hostname: 'govuk-frontend-toolkit.example.com',
        href: 'https://govuk-frontend-toolkit.example.com/a/path#with-an-anchor',
        origin: 'https://govuk-frontend-toolkit.example.com'
      }
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path')
      location.href = 'https://govuk-frontend-toolkit.example.com/a/path?with=a&query=string#with-an-anchor'
      expect(analytics.defaultPathForTrackPageview(location)).toEqual('/a/path?with=a&query=string')
    })
  })

  describe('tracking pageviews', function () {
    beforeEach(function () {
      spyOn(analytics, 'defaultPathForTrackPageview').and.returnValue('/a/page?with=a&query=string')
    })

    it('injects a default path if no args are supplied', function () {
      analytics.trackPageview()
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/a/page?with=a&query=string')
    })

    it('injects a default path if args are supplied, but the path arg is blank', function () {
      analytics.trackPageview(null)
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/a/page?with=a&query=string')

      analytics.trackPageview(undefined)
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/a/page?with=a&query=string')
    })

    it('uses the supplied path', function () {
      analytics.trackPageview('/foo')
      expect(window.ga.calls.mostRecent().args[2].page).toEqual('/foo')
    })

    it('does not inject a default title if no args are supplied', function () {
      analytics.trackPageview()
      expect(window.ga.calls.mostRecent().args[2].title).toEqual(undefined)
    })

    it('does not inject a default title if args are supplied, but the title arg is blank', function () {
      analytics.trackPageview('/foo', null)
      expect(window.ga.calls.mostRecent().args[2].title).toEqual(undefined)

      analytics.trackPageview('/foo', undefined)
      expect(window.ga.calls.mostRecent().args[2].title).toEqual(undefined)
    })

    it('uses the supplied title', function () {
      analytics.trackPageview('/foo', 'A page')
      expect(window.ga.calls.mostRecent().args[2].title).toEqual('A page')
    })

    it('removes pii from the title', function () {
      analytics.trackPageview('/foo', 'With email@email.com in it')
      expect(window.ga.calls.mostRecent().args[2].title).toEqual('With [email] in it')
    })
  })

  describe('when tracking pageviews, events and custom dimensions', function () {
    it('tracks them in universal analytics', function () {
      analytics.trackPageview('/path', 'Title')
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path', title: 'Title' }])

      analytics.trackEvent('category', 'action')
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: 'category', eventAction: 'action' }])

      analytics.setDimension(1, 'value', 'name')
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'value'])
    })

    it('strips email addresses embedded in arguments', function () {
      analytics.trackPageview('/path/to/an/embedded.email@example.com/address/?with=an&email=in.it@example.com', 'an.email@example.com', { label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personal.email@example.com address'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/[email]/address/?with=an&email=[email]', title: '[email]', label: '[email]', value: ['data', 'data', 'someone has added their [email] address'] }])

      analytics.trackEvent('an_email@example.com_address-category', 'an.email@example.com-action', { label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personal.email@example.com address'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: '[email]', eventAction: '[email]', eventLabel: '[email]' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, 'an_email@example.com_address-value', { label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personal.email@example.com address'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '[email]']) // set dimension ignores extra options
    })

    it('leaves dates embedded in arguments by default', function () {
      analytics.trackPageview('/path/to/an/embedded/2018-01-01/postcode/?with=an&postcode=2017-01-01', '20192217', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/2018-01-01/postcode/?with=an&postcode=2017-01-01', title: '20192217', label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] }])

      analytics.trackEvent('2017-01-01-category', '20192217-action', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: '2017-01-01-category', eventAction: '20192217-action', eventLabel: '12345678' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, '2017-01-01-value', { label: '12345678', value: ['data', 'data', 'someone has added their personal9999-9999 postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', '2017-01-01-value']) // set dimension ignores extra options
    })

    it('leaves postcodes embedded in arguments by default', function () {
      analytics.trackPageview('/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', 'TD15 2SE', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', title: 'TD15 2SE', label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] }])

      analytics.trackEvent('SW1+1AA-category', 'SP4%207DE-action', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: 'SW1+1AA-category', eventAction: 'SP4%207DE-action', eventLabel: 'RG209NJ' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, 'SW1+1AA-value', { label: 'RG209NJ', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'SW1+1AA-value']) // set dimension ignores extra options
    })

    it('ignores any PIISafe arguments even if they look like emails, dates, or postcodes', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripDatePII: true,
        stripPostcodePII: true
      })

      analytics.trackPageview(new GOVUK.Analytics.PIISafe('/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE'), new GOVUK.Analytics.PIISafe('an.email@example.com 2017-01-01'), { label: new GOVUK.Analytics.PIISafe('another.email@example.com'), value: ['data', 'data', new GOVUK.Analytics.PIISafe('someone has added their personalIV63 6TU postcode')] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', 'pageview', { page: '/path/to/an/embedded/SW1+1AA/postcode/?with=an&postcode=SP4%207DE', title: 'an.email@example.com 2017-01-01', label: 'another.email@example.com', value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] }])

      analytics.trackEvent(new GOVUK.Analytics.PIISafe('SW1+1AA-category'), new GOVUK.Analytics.PIISafe('an.email@example.com-action 2017-01-01'), { label: new GOVUK.Analytics.PIISafe('RG209NJ'), value: ['data', 'data', 'someone has added their personalIV63 6TU postcode'] })
      expect(window.ga.calls.mostRecent().args).toEqual(['send', { hitType: 'event', eventCategory: 'SW1+1AA-category', eventAction: 'an.email@example.com-action 2017-01-01', eventLabel: 'RG209NJ' }]) // trackEvent ignores options other than label or integer values for value

      analytics.setDimension(1, new GOVUK.Analytics.PIISafe('an.email@SW1+1AA-value.com 2017-01-01'), { label: new GOVUK.Analytics.PIISafe('RG209NJ'), value: ['data', 'data', new GOVUK.Analytics.PIISafe('someone has added their personalIV63 6TU postcode')] })
      expect(window.ga.calls.mostRecent().args).toEqual(['set', 'dimension1', 'an.email@SW1+1AA-value.com 2017-01-01']) // set dimension ignores extra options
    })
  })

  describe('when tracking social media shares', function () {
    it('tracks in universal', function () {
      analytics.trackShare('network')

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'network',
        socialAction: 'share',
        socialTarget: jasmine.any(String)
      }])
    })

    it('strips email addresses embedded in arguments', function () {
      analytics.trackShare('email', {
        to: 'myfriend@example.com',
        label: 'another.email@example.com',
        value: ['data', 'data', 'someone has added their personal.email@example.com address']
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: '[email]',
        label: '[email]',
        value: ['data', 'data', 'someone has added their [email] address']
      }])
    })

    it('leaves dates embedded in arguments by default', function () {
      analytics.trackShare('email', {
        to: '2017-01-01',
        label: '20170101',
        value: ['data', 'data', 'someone has added their personal29990303 postcode']
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: '2017-01-01',
        label: '20170101',
        value: ['data', 'data', 'someone has added their personal29990303 postcode']
      }])
    })

    it('leaves postcodes embedded in arguments by default', function () {
      analytics.trackShare('email', {
        to: 'IV63 6TU',
        label: 'SP4%207DE',
        value: ['data', 'data', 'someone has added their personalTD15 2SE postcode']
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: 'IV63 6TU',
        label: 'SP4%207DE',
        value: ['data', 'data', 'someone has added their personalTD15 2SE postcode']
      }])
    })

    it('ignores any PIISafe arguments even if they look like emails, dates, or postcodes', function () {
      analytics = new GOVUK.Analytics({
        universalId: 'universal-id',
        cookieDomain: '.www.gov.uk',
        siteSpeedSampleRate: 100,
        stripPostcodePII: true
      })

      analytics.trackShare('email', {
        to: new GOVUK.Analytics.PIISafe('IV63 6TU'),
        label: new GOVUK.Analytics.PIISafe('an.email@example.com 2017-01-01'),
        value: new GOVUK.Analytics.PIISafe(['data', 'another.email@example.com', 'someone has added their personalTD15 2SE postcode'])
      })

      expect(window.ga.calls.mostRecent().args).toEqual(['send', {
        hitType: 'social',
        socialNetwork: 'email',
        socialAction: 'share',
        socialTarget: jasmine.any(String),
        to: 'IV63 6TU',
        label: 'an.email@example.com 2017-01-01',
        value: ['data', 'another.email@example.com', 'someone has added their personalTD15 2SE postcode']
      }])
    })
  })

  describe('when adding a linked domain', function () {
    it('adds a linked domain to universal analytics', function () {
      analytics.addLinkedTrackerDomain('1234', 'test', ['www.example.com'])

      var allArgs = window.ga.calls.allArgs()
      expect(allArgs).toContain(['create', '1234', 'auto', { name: 'test' }])
      expect(allArgs).toContain(['test.require', 'linker'])
      expect(allArgs).toContain(['test.linker:autoLink', ['www.example.com']])
      expect(allArgs).toContain(['test.set', 'anonymizeIp', true])
      expect(allArgs).toContain(['test.set', 'allowAdFeatures', false])
      expect(allArgs).toContain(['test.send', 'pageview'])
    })

    it('adds two linked domains to universal analytics', function () {
      analytics.addLinkedTrackerDomain('5678', 'test2', ['www.example.com', 'www.something.com'])

      var allArgs = window.ga.calls.allArgs()
      expect(allArgs).toContain(['create', '5678', 'auto', { name: 'test2' }])
      expect(allArgs).toContain(['test2.require', 'linker'])
      expect(allArgs).toContain(['test2.linker:autoLink', ['www.example.com', 'www.something.com']])
      expect(allArgs).toContain(['test2.set', 'anonymizeIp', true])
      expect(allArgs).toContain(['test2.set', 'allowAdFeatures', false])
      expect(allArgs).toContain(['test2.send', 'pageview'])
    })

    it('adds multiple linked domains to universal analytics', function () {
      analytics.addLinkedTrackerDomain('5678', 'test3', ['www.example.com', 'www.something.com', 'www.else.com'])

      var allArgs = window.ga.calls.allArgs()
      expect(allArgs).toContain(['create', '5678', 'auto', { name: 'test3' }])
      expect(allArgs).toContain(['test3.require', 'linker'])
      expect(allArgs).toContain(['test3.linker:autoLink', ['www.example.com', 'www.something.com', 'www.else.com']])
      expect(allArgs).toContain(['test3.set', 'anonymizeIp', true])
      expect(allArgs).toContain(['test3.set', 'allowAdFeatures', false])
      expect(allArgs).toContain(['test3.send', 'pageview'])
    })
  })

  describe('when window.GOVUK.stopSendingAnalytics is true', function () {
    beforeEach(function () {
      window.GOVUK.stopSendingAnalytics = true
    })

    it('disables pageview tracking', function () {
      expect(analytics.trackPageview()).toEqual(false)
    })

    it('disables share tracking', function () {
      expect(analytics.trackShare()).toEqual(false)
    })

    it('disables event tracking', function () {
      expect(analytics.trackShare()).toEqual(false)
    })
  })
})
