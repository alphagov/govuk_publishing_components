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
      window.GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
      window.GOVUK.analyticsGa4.vars = { disableModules: true }
      expected = {
        id: 'GTM-MG7HG5W',
        auth: undefined,
        preview: undefined,
        environment: 'production',
        gem_version: 'not found',
        disableModules: true
      }
    })

    it('loads GA4 on production domains', function () {
      var domains = [
        'www.gov.uk',
        'www-origin.publishing.service.gov.uk'
      ]

      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = { disableModules: true }
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('production')
      }
    })

    it('loads GA4 on staging domains', function () {
      var domains = [
        'www.staging.publishing.service.gov.uk',
        'www.staging.publishing.service.gov.uk',
        'www-origin.staging.publishing.service.gov.uk'
      ]
      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = { disableModules: true }
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('staging')
      }
    })

    it('loads GA4 on integration domains', function () {
      var domains = [
        'www.integration.publishing.service.gov.uk',
        'www.integration.publishing.service.gov.uk',
        'www-origin.integration.publishing.service.gov.uk'
      ]

      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = { disableModules: true }
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars.environment).toEqual('integration')
      }
    })

    it('loads GA4 on development domains', function () {
      var domains = [
        'localhost', '127.0.0.1', '0.0.0.0', 'static.dev.gov.uk'
      ]

      for (var i = 0; i < domains.length; i++) {
        window.GOVUK.analyticsGa4.vars = { disableModules: true }
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
        window.GOVUK.analyticsGa4.vars = { disableModules: true }
        var domain = domains[i]
        window.GOVUK.loadAnalytics.loadGa4(domain)
        expect(window.GOVUK.analyticsGa4.vars).toEqual({ disableModules: true })
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
      window.GOVUK.loadAnalytics.ga4EnvironmentVariables.production.initialiseGA4 = false
      window.GOVUK.loadAnalytics.loadGa4('www.gov.uk')
      expect(window.GOVUK.analyticsGa4.vars).toEqual({ disableModules: true })
      window.GOVUK.loadAnalytics.ga4EnvironmentVariables.production.initialiseGA4 = true
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
    expect(window.GOVUK.loadAnalytics.arrayContains({ valueToFind: 'dog', array: ['cat', 'dog'] })).toEqual(true)
    expect(window.GOVUK.loadAnalytics.arrayContains({ valueToFind: 'dog', array: ['cat'] })).toEqual(false)
    expect(window.GOVUK.loadAnalytics.arrayContains()).toEqual(false)
  })
})

describe('Initialising GA4', function () {
  var GOVUK = window.GOVUK

  afterEach(function () {
    GOVUK.analyticsGa4.analyticsModules.Ga4SpecialistLinkTracker.stopTracking()
    window.dataLayer = []
    window.removeEventListener('cookie-consent', window.GOVUK.loadAnalytics.loadGa4)
  })

  describe('when consent is given', function () {
    var test = {
      functionThatMightBeCalled: function () {}
    }

    beforeEach(function () {
      spyOn(test, 'functionThatMightBeCalled')
      GOVUK.analyticsGa4.analyticsModules.Test = function () {}
      GOVUK.analyticsGa4.analyticsModules.Test.init = function () { test.functionThatMightBeCalled() }
    })

    it('calls analytics modules successfully', function () {
      spyOn(GOVUK.analyticsGa4.analyticsModules.Test, 'init').and.callThrough()
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.loadAnalytics.loadGa4()

      expect(test.functionThatMightBeCalled).toHaveBeenCalled()
    })

    it('does not call analytics modules without a valid init function', function () {
      GOVUK.analyticsGa4.analyticsModules.Test.init = false
      spyOn(GOVUK.analyticsGa4.analyticsModules.Test, 'init').and.callThrough()

      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.loadAnalytics.loadGa4()

      expect(test.functionThatMightBeCalled).not.toHaveBeenCalled()
    })

    it('does not error if no init is found at all', function () {
      GOVUK.analyticsGa4.analyticsModules.Test = false

      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.loadAnalytics.loadGa4()

      expect(GOVUK.analyticsGa4).not.toEqual({})
    })
  })

  describe('Modules depending on cookie consent to run', function () {
    var testModule
    var testObject = {
      testFunction: function () {}
    }

    beforeEach(function () {
      function TestModule () {}

      TestModule.prototype.init = function () {
        var consentCookie = window.GOVUK.getConsentCookie()

        if (consentCookie && consentCookie.settings) {
          this.startModule()
        } else {
          this.startModule = this.startModule.bind(this)
          window.addEventListener('cookie-consent', this.startModule)
        }
      }
      TestModule.prototype.startModule = function () {
        testObject.testFunction()
      }

      testModule = new TestModule()
      spyOn(testObject, 'testFunction')
    })

    it('do not run if consent is not given', function () {
      GOVUK.setCookie('cookies_policy', '{"essential":false,"settings":false,"usage":false,"campaigns":false}')
      GOVUK.loadAnalytics.loadGa4()

      testModule.init()
      expect(testObject.testFunction).not.toHaveBeenCalled()
    })

    it('run if consent is given', function () {
      GOVUK.setCookie('cookies_policy', '{"essential":true,"settings":true,"usage":true,"campaigns":true}')
      GOVUK.loadAnalytics.loadGa4()

      testModule.init()
      expect(testObject.testFunction).toHaveBeenCalled()
    })
  })

  describe('adding the GTM script to the DOM', function () {
    it('loads the GTM snippet', function () {
      window.dataLayer = null
      GOVUK.loadAnalytics.addGtmScriptToDom()

      expect(window.dataLayer.length).toEqual(2)
      expect(Object.keys(window.dataLayer[0])).toContain('gtm.blocklist')
      expect(Object.keys(window.dataLayer[1])).toContain('gtm.start')
      expect(Object.keys(window.dataLayer[1])).toContain('event')
      expect(window.dataLayer[0]['gtm.blocklist']).toEqual(['customPixels', 'customScripts', 'html', 'nonGoogleScripts'])
    })

    describe('calls the right URL from Google', function () {
      it('if all three env vars are present', function () {
        window.GOVUK.analyticsGa4.vars.id = 'test-id'
        window.GOVUK.analyticsGa4.vars.auth = 'test-auth'
        window.GOVUK.analyticsGa4.vars.preview = 'test-preview'
        GOVUK.loadAnalytics.addGtmScriptToDom()

        expect(GOVUK.loadAnalytics.googleSrc).toEqual('https://www.googletagmanager.com/gtm.js?id=test-id&gtm_auth=test-auth&gtm_preview=test-preview&gtm_cookies_win=x')
      })

      it('if only id is present', function () {
        window.GOVUK.analyticsGa4.vars = {}
        window.GOVUK.analyticsGa4.vars.id = 'test-id'
        GOVUK.loadAnalytics.addGtmScriptToDom()

        expect(GOVUK.loadAnalytics.googleSrc).toEqual('https://www.googletagmanager.com/gtm.js?id=test-id')
      })
    })
  })
})
