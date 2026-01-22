window.GOVUK = window.GOVUK || {}
window.GOVUK.vars = window.GOVUK.vars || {}
window.GOVUK.vars.domains = [
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
    preview: 'env-3'
  },
  {
    name: 'production',
    domains: [
      'www.gov.uk',
      'www-origin.publishing.service.gov.uk',
      'assets.publishing.service.gov.uk'
    ],
    initialiseGA4: true,
    id: 'GTM-MG7HG5W'
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
    preview: 'env-5'
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
    preview: 'env-4'
  },
  {
    name: 'devdocs',
    domains: [
      'docs.publishing.service.gov.uk'
    ],
    initialiseGA4: true,
    id: 'GTM-TNKCK97'
  }
]
