/* eslint-env jasmine */

var expected
var savedUaVars
var savedGa4Vars

describe('Analytics loading', function () {
  beforeAll(function () {
    savedUaVars = window.GOVUK.extendObject(window.GOVUK.analyticsVars)
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    savedGa4Vars = window.GOVUK.extendObject(window.GOVUK.analyticsGa4.vars)
  })

  afterAll(function () {
    window.GOVUK.analyticsGa4.vars = savedGa4Vars
    window.GOVUK.analyticsVars = savedUaVars
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
      window.GOVUK.loadAnalytics.domains[0].initialiseGA4 = false
      window.GOVUK.loadAnalytics.loadGa4('localhost')
      expect(window.GOVUK.analyticsGa4.vars).toEqual(null)
      window.GOVUK.loadAnalytics.domains[0].initialiseGA4 = true
    })
  })

  describe('for UA', function () {
    beforeEach(function () {
      window.GOVUK.analyticsVars = null
      expected = {
        gaPropertyCrossDomain: 'UA-145652997-1',
        primaryLinkedDomains: ['account.gov.uk'],
        linkedDomains: ['hello', 'world']
      }
      window.GOVUK.loadAnalytics.linkedDomains = ['hello', 'world']
    })

    it('loads the correct UA values on production', function () {
      expected.gaProperty = 'UA-26179049-1'
      window.GOVUK.loadAnalytics.loadUa('www.gov.uk')
      expect(window.GOVUK.analyticsVars).toEqual(expected)
    })

    it('loads the correct UA values on staging', function () {
      expected.gaProperty = 'UA-26179049-20'
      window.GOVUK.loadAnalytics.loadUa('www.staging.publishing.service.gov.uk')
      expect(window.GOVUK.analyticsVars).toEqual(expected)
    })

    it('loads the correct UA values on integration', function () {
      expected.gaProperty = 'UA-26179049-22'
      window.GOVUK.loadAnalytics.loadUa('www.integration.publishing.service.gov.uk')
      expect(window.GOVUK.analyticsVars).toEqual(expected)
    })

    it('loads the correct UA values on development', function () {
      expected.gaProperty = 'UA-UNSET'
      expected.gaPropertyCrossDomain = 'UA-UNSET'
      window.GOVUK.loadAnalytics.loadUa('localhost')
      expect(window.GOVUK.analyticsVars).toEqual(expected)
    })

    it('loads the correct UA values on unrecognised domains', function () {
      expected.gaProperty = 'UA-UNSET'
      expected.gaPropertyCrossDomain = 'UA-UNSET'
      window.GOVUK.loadAnalytics.loadUa('www.nationalarchives.gov.uk')
      expect(window.GOVUK.analyticsVars).toEqual(expected)
    })
  })

  it('finds values in arrays correctly', function () {
    expect(window.GOVUK.loadAnalytics.arrayContains('dog', ['cat', 'dog'])).toEqual(true)
    expect(window.GOVUK.loadAnalytics.arrayContains('dog', ['cat'])).toEqual(false)
  })
})
