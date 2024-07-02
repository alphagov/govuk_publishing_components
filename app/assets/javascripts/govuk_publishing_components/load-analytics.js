//= require govuk_publishing_components/analytics-ga4
//= require govuk_publishing_components/domain-config

window.GOVUK.loadAnalytics = {
  loadExtraDomains: function () {
    if (Array.isArray(window.GOVUK.vars.extraDomains)) {
      window.GOVUK.vars.domains = window.GOVUK.vars.domains.concat(window.GOVUK.vars.extraDomains)
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
      return window.GOVUK.vars.domains[0]
    } else {
      for (var i = 0; i < window.GOVUK.vars.domains.length; i++) {
        if (this.arrayContains(currentDomain, window.GOVUK.vars.domains[i].domains)) {
          return window.GOVUK.vars.domains[i]
        }
      }
    }
  }
}
