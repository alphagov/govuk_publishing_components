//= require govuk_publishing_components/analytics
//= require govuk_publishing_components/analytics-ga4
//= require govuk_publishing_components/analytics/linked-domains

window.GOVUK.loadAnalytics = {
  productionDomains: [
    'www.gov.uk',
    'www-origin.publishing.service.gov.uk',
    'assets.publishing.service.gov.uk'
  ],
  stagingDomains: [
    'www.staging.publishing.service.gov.uk',
    'www-origin.staging.publishing.service.gov.uk',
    'assets.staging.publishing.service.gov.uk'
  ],
  integrationDomains: [
    'www.integration.publishing.service.gov.uk',
    'www-origin.integration.publishing.service.gov.uk',
    'assets.integration.publishing.service.gov.uk'
  ],
  developmentDomains: [
    'localhost', '127.0.0.1', '0.0.0.0'
  ],
  devdocsDomains: [
    'docs.publishing.service.gov.uk'
  ],

  // For Universal Analytics' cross domain tracking. linkedDomains is defined by the require statement at the top of the file.
  linkedDomains: window.GOVUK.analytics.linkedDomains,

  ga4EnvironmentVariables: {
    // initialiseGA4 is used to enable/disable GA4 on specific environments
    production: {
      initialiseGA4: true,
      id: 'GTM-MG7HG5W'
    },
    staging: {
      initialiseGA4: true,
      id: 'GTM-MG7HG5W',
      auth: 'oJWs562CxSIjZKn_GlB5Bw',
      preview: 'env-5'
    },
    integration: {
      initialiseGA4: true,
      id: 'GTM-MG7HG5W',
      auth: 'C7iYdcsOlYgGmiUJjZKrHQ',
      preview: 'env-4'
    },
    development: {
      initialiseGA4: true,
      id: 'GTM-MG7HG5W',
      auth: 'bRiZ-jiEHtw6hHpGd6dF9w',
      preview: 'env-3'
    },
    devdocs: {
      initialiseGA4: true,
      id: 'GTM-TNKCK97',
      // auth and preview not required for devdocs
      auth: '',
      preview: ''
    }
  },

  loadUa: function (currentDomain) {
    currentDomain = currentDomain || window.location.hostname

    // Universal Analytics variables
    window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}
    window.GOVUK.analyticsVars.primaryLinkedDomains = ['account.gov.uk']
    window.GOVUK.analyticsVars.linkedDomains = this.linkedDomains
    window.GOVUK.analyticsVars.gaProperty = 'UA-UNSET'
    window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-UNSET'

    if (this.arrayContains(currentDomain, this.productionDomains)) {
      window.GOVUK.analyticsVars.gaProperty = 'UA-26179049-1'
      window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-145652997-1'
    } else if (this.arrayContains(currentDomain, this.stagingDomains)) {
      window.GOVUK.analyticsVars.gaProperty = 'UA-26179049-20'
      window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-145652997-1'
    } else if (this.arrayContains(currentDomain, this.integrationDomains)) {
      window.GOVUK.analyticsVars.gaProperty = 'UA-26179049-22'
      window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-145652997-1'
    }

    // Load universal analytics
    if (typeof window.GOVUK.analyticsInit !== 'undefined') {
      window.GOVUK.analyticsInit()
    }
  },

  loadGa4: function (currentDomain) {
    currentDomain = currentDomain || window.location.hostname
    var environment = ''

    // Categorise current environment
    if (this.arrayContains(currentDomain, this.productionDomains)) {
      environment = 'production'
    } else if (this.arrayContains(currentDomain, this.stagingDomains)) {
      environment = 'staging'
    } else if (this.arrayContains(currentDomain, this.integrationDomains)) {
      environment = 'integration'
    } else if (this.arrayContains(currentDomain, this.developmentDomains) || currentDomain.indexOf('.dev.gov.uk') !== -1) {
      environment = 'development'
    } else if (this.arrayContains(currentDomain, this.devdocsDomains)) {
      environment = 'devdocs'
    }

    // If we recognise the environment (i.e. the string isn't empty), load in GA4
    if (environment) {
      // If analytics-ga4.js exists and our detected environment has 'initialiseGA4' set to true, load GA4.
      if (typeof window.GOVUK.analyticsGa4.init !== 'undefined' && this.ga4EnvironmentVariables[environment].initialiseGA4) {
        window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
        window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
        window.GOVUK.analyticsGa4.vars.id = this.ga4EnvironmentVariables[environment].id
        window.GOVUK.analyticsGa4.vars.auth = this.ga4EnvironmentVariables[environment].auth
        window.GOVUK.analyticsGa4.vars.preview = this.ga4EnvironmentVariables[environment].preview
        window.GOVUK.analyticsGa4.vars.environment = environment // Used for testing and debugging

        window.GOVUK.analyticsGa4.vars.gem_version = 'not found'
        var gemMeta = document.querySelector('meta[name="govuk:components_gem_version"]')
        if (gemMeta) {
          window.GOVUK.analyticsGa4.vars.gem_version = gemMeta.getAttribute('content')
        }
        window.GOVUK.analyticsGa4.init()
      }
    }
  },

  arrayContains: function (valueToFind, array) {
    return array.indexOf(valueToFind) !== -1
  }
}
