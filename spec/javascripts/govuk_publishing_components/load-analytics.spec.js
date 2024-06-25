/* eslint-env jasmine */

var expected
var savedGa4Vars

describe('Analytics loading', function () {
  beforeAll(function () {
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    savedGa4Vars = window.GOVUK.extendObject(window.GOVUK.analyticsGa4.vars)
  })

  afterAll(function () {
    window.GOVUK.analyticsGa4.vars = savedGa4Vars
  })

  describe('for GA4', function () {
    beforeEach(function () {
      window.GOVUK.analyticsGa4.vars = null
      expected = {
        id: 'GTM-MG7HG5W',
        auth: undefined,
        preview: undefined,
        environment: 'production',
        gem_version: 'not found'
      }
    })

    it('loads GA4 on production domains', function () {
      var domains = [
        'www.gov.uk',
        'www-origin.publishing.service.gov.uk',
        'assets.publishing.service.gov.uk'
      ]

      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = null
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('production')
      }
    })

    it('loads GA4 on staging domains', function () {
      var domains = [
        'www.staging.publishing.service.gov.uk',
        'www-origin.staging.publishing.service.gov.uk',
        'assets.staging.publishing.service.gov.uk'
      ]
      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = null
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('staging')
      }
    })

    it('loads GA4 on integration domains', function () {
      var domains = [
        'www.integration.publishing.service.gov.uk',
        'www-origin.integration.publishing.service.gov.uk',
        'assets.integration.publishing.service.gov.uk'
      ]

      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = null
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('integration')
      }
    })

    it('loads GA4 on development domains', function () {
      var domains = [
        'localhost', '127.0.0.1', '0.0.0.0', '//static.dev.gov.uk'
      ]

      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = null
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('development')
      }
    })

    it('ignores loading GA4 on unrecognised domains', function () {
      var domains = [
        'www.nationalarchives.gov.uk'
      ]

      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = null
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars).toEqual(null)
      }
    })

    it('sets the correct production variables', function () {
      window.GOVUK.loadAnalytics.loadGa4('www.gov.uk')
      delete window.GOVUK.analyticsGa4.vars.internalDomains
      expect(window.GOVUK.analyticsGa4.vars).toEqual(expected)
    })

    it('sets the correct staging variables', function () {
      expected.environment = 'staging'
      expected.auth = 'oJWs562CxSIjZKn_GlB5Bw'
      expected.preview = 'env-5'

      window.GOVUK.loadAnalytics.loadGa4('www.staging.publishing.service.gov.uk')
      delete window.GOVUK.analyticsGa4.vars.internalDomains
      expect(window.GOVUK.analyticsGa4.vars).toEqual(expected)
    })

    it('sets the correct integration variables', function () {
      expected.environment = 'integration'
      expected.auth = 'C7iYdcsOlYgGmiUJjZKrHQ'
      expected.preview = 'env-4'
      window.GOVUK.loadAnalytics.loadGa4('www.integration.publishing.service.gov.uk')
      delete window.GOVUK.analyticsGa4.vars.internalDomains
      expect(window.GOVUK.analyticsGa4.vars).toEqual(expected)
    })

    it('sets the correct development variables', function () {
      expected.environment = 'development'
      expected.auth = 'bRiZ-jiEHtw6hHpGd6dF9w'
      expected.preview = 'env-3'
      window.GOVUK.loadAnalytics.loadGa4('localhost')
      delete window.GOVUK.analyticsGa4.vars.internalDomains
      expect(window.GOVUK.analyticsGa4.vars).toEqual(expected)
    })

    it('doesnt load GA4 variables if initialiseGA4 is set to false', function () {
      window.GOVUK.vars.domains[0].initialiseGA4 = false
      window.GOVUK.loadAnalytics.loadGa4('localhost')
      expect(window.GOVUK.analyticsGa4.vars).toEqual(null)
      window.GOVUK.vars.domains[0].initialiseGA4 = true
    })

    describe('when additional domain details are needed', function () {
      var saveDomains

      beforeEach(function () {
        // use slice to clone the array, otherwise this 'saving' doesn't work
        saveDomains = window.GOVUK.vars.domains.slice()
      })

      afterEach(function () {
        delete window.GOVUK.vars.extraDomains
        window.GOVUK.vars.domains = saveDomains.slice()
      })

      it('defaults to the normal list when no extras are passed', function () {
        var expected = window.GOVUK.vars.domains.slice()
        window.GOVUK.loadAnalytics.loadExtraDomains()
        window.GOVUK.loadAnalytics.loadGa4()
        expect(window.GOVUK.vars.domains).toEqual(expected)
      })

      it('allows extra domains to be passed and appended to the existing list', function () {
        var extra = {
          name: 'test-domain',
          domains: ['not-a-real-domain'],
          initialiseGA4: true,
          id: 'GTM-001'
        }
        window.GOVUK.vars.extraDomains = [extra]
        expected = window.GOVUK.vars.domains.slice()
        expected.push(extra)

        window.GOVUK.loadAnalytics.loadExtraDomains()
        // the new domain should be appended to the end of the array
        expect(window.GOVUK.vars.domains).toEqual(expected)

        window.GOVUK.loadAnalytics.loadGa4('not-a-real-domain')
        expect(window.GOVUK.analyticsGa4.vars.id).toEqual('GTM-001')
        expect(window.GOVUK.analyticsGa4.vars.auth).toEqual(undefined)
        expect(window.GOVUK.analyticsGa4.vars.preview).toEqual(undefined)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('test-domain')
      })
    })
  })

  it('finds values in arrays correctly', function () {
    expect(window.GOVUK.loadAnalytics.arrayContains('dog', ['cat', 'dog'])).toEqual(true)
    expect(window.GOVUK.loadAnalytics.arrayContains('dog', ['cat'])).toEqual(false)
  })
})
