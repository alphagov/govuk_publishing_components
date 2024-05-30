'use strict'

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
    preview: 'env-3',
    gaProperty: 'UA-UNSET',
    gaPropertyCrossDomain: 'UA-UNSET',
    consentApiUrl: 'staging'
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
    gaPropertyCrossDomain: 'UA-145652997-1',
    consentApiUrl: 'production'
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
    gaPropertyCrossDomain: 'UA-145652997-1',
    consentApiUrl: 'staging'
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
    gaPropertyCrossDomain: 'UA-145652997-1',
    consentApiUrl: 'staging'
  },
  {
    name: 'devdocs',
    domains: [
      'docs.publishing.service.gov.uk'
    ],
    initialiseGA4: true,
    id: 'GTM-TNKCK97',
    consentApiUrl: 'production'
  }
]
