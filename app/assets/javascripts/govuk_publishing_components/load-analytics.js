//= require govuk_publishing_components/analytics
//= require govuk_publishing_components/analytics-ga4
//= require govuk_publishing_components/analytics/linked-domains

window.GOVUK.loadAnalytics = {
  domains: [
    {
      // need to have this one at the start, see loadGa4 function
      name: 'development',
      domains: [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        'dev.gov.uk'
      ],
      initialiseGA4: true,
      id: 'GTM-MG7HG5W',
      auth: 'bRiZ-jiEHtw6hHpGd6dF9w',
      preview: 'env-3',
      gaProperty: 'UA-UNSET',
      gaPropertyCrossDomain: 'UA-UNSET'
    },
    {
      name: 'production',
      domains: [
        'www.gov.uk',
        'www-origin.publishing.service.gov.uk',
        'assets.publishing.service.gov.uk'
      ],
      initialiseGA4: true,
      id: 'GTM-MG7HG5W',
      gaProperty: 'UA-26179049-1',
      gaPropertyCrossDomain: 'UA-145652997-1'
    },
    {
      name: 'staging',
      domains: [
        'www.staging.publishing.service.gov.uk',
        'www-origin.staging.publishing.service.gov.uk',
        'assets.staging.publishing.service.gov.uk'
      ],
      initialiseGA4: true,
      id: 'GTM-MG7HG5W',
      auth: 'oJWs562CxSIjZKn_GlB5Bw',
      preview: 'env-5',
      gaProperty: 'UA-26179049-20',
      gaPropertyCrossDomain: 'UA-145652997-1'
    },
    {
      name: 'integration',
      domains: [
        'www.integration.publishing.service.gov.uk',
        'www-origin.integration.publishing.service.gov.uk',
        'assets.integration.publishing.service.gov.uk'
      ],
      initialiseGA4: true,
      id: 'GTM-MG7HG5W',
      auth: 'C7iYdcsOlYgGmiUJjZKrHQ',
      preview: 'env-4',
      gaProperty: 'UA-26179049-22',
      gaPropertyCrossDomain: 'UA-145652997-1'
    },
    {
      name: 'devdocs',
      domains: [
        'docs.publishing.service.gov.uk'
      ],
      initialiseGA4: true,
      id: 'GTM-TNKCK97'
    }
  ],

  loadExtraDomains: function () {
    if (Array.isArray(window.GOVUK.analyticsGa4Domains)) {
      this.domains = this.domains.concat(window.GOVUK.analyticsGa4Domains)
    }
  },

  // For Universal Analytics' cross domain tracking. linkedDomains is defined by the require statement at the top of the file.
  linkedDomains: window.GOVUK.analytics.linkedDomains,

  loadUa: function (currentDomain) {
    currentDomain = currentDomain || window.location.hostname

    // Universal Analytics variables
    window.GOVUK.analyticsVars = window.GOVUK.analyticsVars || {}
    window.GOVUK.analyticsVars.primaryLinkedDomains = ['account.gov.uk']
    window.GOVUK.analyticsVars.linkedDomains = this.linkedDomains
    window.GOVUK.analyticsVars.gaProperty = 'UA-UNSET'
    window.GOVUK.analyticsVars.gaPropertyCrossDomain = 'UA-UNSET'

    for (var i = 0; i < this.domains.length; i++) {
      var current = this.domains[i]
      if (this.arrayContains(currentDomain, current.domains)) {
        window.GOVUK.analyticsVars.gaProperty = current.gaProperty
        window.GOVUK.analyticsVars.gaPropertyCrossDomain = current.gaPropertyCrossDomain
        break
      }
    }
    // Load universal analytics
    if (typeof window.GOVUK.analyticsInit !== 'undefined') {
      window.GOVUK.analyticsInit()
    }
  },

  loadGa4: function (currentDomain) {
    currentDomain = currentDomain || window.location.hostname
    var environment = this.getEnvironment(currentDomain)

    // If we recognise the environment (i.e. the string isn't empty), load in GA4
    if (environment) {
      // If analytics-ga4.js exists and our detected environment has 'initialiseGA4' set to true, load GA4.
      if (typeof window.GOVUK.analyticsGa4.init !== 'undefined' && environment.initialiseGA4) {
        window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
        window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
        window.GOVUK.analyticsGa4.vars.id = environment.id
        window.GOVUK.analyticsGa4.vars.auth = environment.auth
        window.GOVUK.analyticsGa4.vars.preview = environment.preview
        window.GOVUK.analyticsGa4.vars.environment = environment.name // Used for testing and debugging

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
  },

  getEnvironment: function (currentDomain) {
    // lots of dev domains, so simplify the matching process
    if (currentDomain.match(/[a-zA-Z0-9.-]+dev\.gov\.uk/)) {
      return this.domains[0]
    } else {
      for (var i = 0; i < this.domains.length; i++) {
        if (this.arrayContains(currentDomain, this.domains[i].domains)) {
          return this.domains[i]
        }
      }
    }
  }
}
