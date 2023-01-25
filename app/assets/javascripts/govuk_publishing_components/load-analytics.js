//= require govuk_publishing_components/analytics
//= require govuk_publishing_components/analytics-ga4
//= require govuk_publishing_components/analytics/linked-domains

window.GOVUK = window.GOVUK || {}

window.GOVUK.loadAnalytics = {
  productionDomains: [
    'www.gov.uk',
    'www-origin.publishing.service.gov.uk'
  ],
  stagingDomains: [
    'www.staging.publishing.service.gov.uk',
    'www-origin.staging.publishing.service.gov.uk'
  ],
  integrationDomains: [
    'www.integration.publishing.service.gov.uk',
    'www-origin.integration.publishing.service.gov.uk'
  ],
  developmentDomains: [
    'localhost', '127.0.0.1', '0.0.0.0'
  ],

  // For Universal Analytics' cross domain tracking. linkedDomains is defined by the require statement at the top of the file.
  linkedDomains: window.GOVUK.analytics.linkedDomains,

  ga4EnvironmentVariables: {
    // initialiseGA4 is used to enable/disable GA4 on specific environments
    production: {
      initialiseGA4: true
    },
    staging: {
      initialiseGA4: true,
      auth: 'oJWs562CxSIjZKn_GlB5Bw',
      preview: 'env-5'
    },
    integration: {
      initialiseGA4: true,
      auth: 'C7iYdcsOlYgGmiUJjZKrHQ',
      preview: 'env-4'
    },
    development: {
      initialiseGA4: true,
      auth: 'bRiZ-jiEHtw6hHpGd6dF9w',
      preview: 'env-3'
    }
  },

  loadUa: function (currentDomain) {
    // The domain can be overridden. This is needed for testing as we need to fake the domain that we are on to test each environment.
    currentDomain = currentDomain || window.location.hostname

    // Universal Analytics variables
    window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}
    window.GOVUK.analyticsVars.primaryLinkedDomains = ['account.gov.uk']
    window.GOVUK.analyticsVars.linkedDomains = this.linkedDomains
    window.GOVUK.analyticsVars.gaProperty = 'UA-UNSET'
    window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-UNSET'

    if (this.arrayContains({ valueToFind: currentDomain, array: this.productionDomains })) {
      window.GOVUK.analyticsVars.gaProperty = 'UA-26179049-1'
      window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-145652997-1'
    } else if (this.arrayContains({ valueToFind: currentDomain, array: this.stagingDomains })) {
      window.GOVUK.analyticsVars.gaProperty = 'UA-26179049-20'
      window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-145652997-1'
    } else if (this.arrayContains({ valueToFind: currentDomain, array: this.integrationDomains })) {
      window.GOVUK.analyticsVars.gaProperty = 'UA-26179049-22'
      window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-145652997-1'
    }

    // Load universal analytics
    if (typeof window.GOVUK.analyticsInit !== 'undefined') {
      window.GOVUK.analyticsInit()
    }
  },

  loadGa4Vars: function () {
    // If we recognise the environment, load the GA4 vars
    if (this.ga4EnvironmentVariables[this.environment]) {
      window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
      window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
      window.GOVUK.analyticsGa4.vars.id = 'GTM-MG7HG5W'
      window.GOVUK.analyticsGa4.vars.auth = this.ga4EnvironmentVariables[this.environment].auth
      window.GOVUK.analyticsGa4.vars.preview = this.ga4EnvironmentVariables[this.environment].preview
      window.GOVUK.analyticsGa4.vars.environment = this.environment // Used for testing and debugging

      window.GOVUK.analyticsGa4.vars.gem_version = 'not found'
      var gemMeta = document.querySelector('meta[name="govuk:components_gem_version"]')
      if (gemMeta) {
        window.GOVUK.analyticsGa4.vars.gem_version = gemMeta.getAttribute('content')
      }

      window.GOVUK.analyticsGa4.vars.internalDomains = []
      window.GOVUK.analyticsGa4.vars.internalDomains.push(window.GOVUK.analyticsGa4.core.trackFunctions.getHostname())
      window.GOVUK.analyticsGa4.core.trackFunctions.appendDomainsWithoutWWW(window.GOVUK.analyticsGa4.vars.internalDomains)
    }
  },

  addGtmScriptToDom: function () {
    var firstScript = document.getElementsByTagName('script')[0]
    var newScript = document.createElement('script')
    newScript.async = true

    // initialise GTM
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ 'gtm.blocklist': ['customPixels', 'customScripts', 'html', 'nonGoogleScripts'] })
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

    var auth = window.GOVUK.analyticsGa4.vars.auth || ''
    var preview = window.GOVUK.analyticsGa4.vars.preview || ''
    if (auth) {
      auth = '&gtm_auth=' + auth
    }
    if (preview) {
      preview = '&gtm_preview=' + preview + '&gtm_cookies_win=x'
    }

    this.googleSrc = 'https://www.googletagmanager.com/gtm.js?id=' + window.GOVUK.analyticsGa4.vars.id + auth + preview
    newScript.src = this.googleSrc
    firstScript.parentNode.insertBefore(newScript, firstScript)
  },

  loadGa4: function (currentDomain) {
    // The domain can be overridden. This is needed for testing as we need to fake the domain that we are on to test each environment.
    currentDomain = currentDomain || window.location.hostname

    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}

    if (typeof window.GOVUK.analyticsGa4.core === 'undefined') {
      console.warn('load-analytics.js: window.GOVUK.analyticsGa4.core was not found - has ./analytics-ga4.js been imported?')
      return
    }

    this.environment = ''
    // Categorise current environment
    if (this.arrayContains({ valueToFind: currentDomain, array: this.productionDomains })) {
      this.environment = 'production'
    } else if (this.arrayContains({ valueToFind: currentDomain, array: this.stagingDomains })) {
      this.environment = 'staging'
    } else if (this.arrayContains({ valueToFind: currentDomain, array: this.integrationDomains })) {
      this.environment = 'integration'
    } else if (this.arrayContains({ valueToFind: currentDomain, array: this.developmentDomains }) || currentDomain.indexOf('.dev.gov.uk') !== -1) {
      this.environment = 'development'
    }

    if (!this.environment) {
      console.warn('load-analytics.js: environment for GA4 not recognised - ' + this.environment + ' on ' + currentDomain)
      return
    }

    // Don't load GA4 if initialiseGA4 is set to false. This allows us to disable analytics if required.
    if (!this.ga4EnvironmentVariables[this.environment].initialiseGA4) {
      return
    }

    // to be added: digital identity consent mechanism
    var consentCookie = window.GOVUK.getConsentCookie()
    if (consentCookie && consentCookie.usage) {
      // Creates 'window.GOVUK.analyticsGa4.vars', then adds the gtm.js script to the DOM.
      window.GOVUK.loadAnalytics.loadGa4Vars()
      window.GOVUK.loadAnalytics.addGtmScriptToDom()

      /* Initialises our GA4 modules once the DOM has loaded.
          document.readyState is needed as when cookies aren't set the DOM is likely already loaded.
          Therefore, if they accept cookies after the page has loaded our modules wouldn't initialise,
          as DOMContentLoaded won't fire if the DOM has already loaded. */
      if (document.readyState === 'complete') {
        window.GOVUK.loadAnalytics.startGa4Modules()
      } else {
        window.addEventListener('DOMContentLoaded', function () {
          window.GOVUK.loadAnalytics.startGa4Modules()
        })
      }

      // to be added: cross domain tracking code
    } else {
      window.addEventListener('cookie-consent', function (e) {
        window.GOVUK.loadAnalytics.loadGa4()
      })
    }
  },

  startGa4Modules: function () {
    // Some tests initialise GA4, but we do not want our modules initialising, so this check is in place.
    if (!window.GOVUK.analyticsGa4.vars.disableModules) {
      var analyticsModules = window.GOVUK.analyticsGa4.analyticsModules
      for (var property in analyticsModules) {
        var module = analyticsModules[property]
        if (typeof module.init === 'function') {
          module.init()
        }
      }
    }
  },

  arrayContains: function (params) {
    if (!params || !params.valueToFind || !params.array) {
      return false
    }

    return params.array.indexOf(params.valueToFind) !== -1
  }
}

// This if statement stops this function running during testing
if (!window.jasmine) {
  window.GOVUK.loadAnalytics.loadUa()
  window.GOVUK.loadAnalytics.loadGa4()
}
