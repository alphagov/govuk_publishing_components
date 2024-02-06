# Loading analytics into our applications

For analytics tracking, each environment (production, staging, integration, development) uses different environment variables. These environment variables are used to determine which dashboard analytics data is sent to. This is useful to us for testing and debugging, as we can test our analytics in isolated environments. Therefore, we want to be able to set different environment variables depending on which environment we are in. This needs to happen before our analytics code is initialised, so `load-analytics.js` executes before our analytics code is run.

Therefore, `load-analytics.js` has been written to do the following:

1. Grab the current domain that the code is running on using `window.location.hostname`.
2. Determine the environment you are on by comparing your domain against hardcoded categorised domains.
3. Set the correct environment variables for both Universal Analytics, and Google Analytics 4, depending on the environment you are on. These are also hardcoded now.
4. Kick off the initialisation of analytics by running their respective `init()` functions, which will then run the `ga4-core.js` code and the UA tracking initialisation code.
5. The `ga4-core.js` / UA code then makes use of these environment variables. It can access them as they are set on the JavaScript `window` object.

The Google Analytics 4 environment variables are:

- `id` - this is the Google Tag Manager ID used to identify our organisation so that analytics data is sent to the right account.
- `preview` - this is an optional variable that is used to determine what GTM environment the analytics data is sent to. If this is empty, analytics data is sent to the production dashboard. If you wanted to have your integration analytics to an 'integration' dashboard, you would populate this variable with the relevant value.
- `auth` - this is used to authenticate analytics data being sent to another dashboard, such as an 'integration' dashboard. This can be determined through the browser so they're not classified as secret.

## Passing extra options

If you wish to initialise the GA4 code on a new domain with different attributes, the code has been written to accept an array of additional values. Extra domains can be added before loading `dependencies.js` as below.

```JavaScript
window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4Domains = [
  {
    name: 'my-domain',
    domains: ['not-a-real-domain.co.org.uk'],
    initialiseGA4: true,
    // add your own details as required
    id: 'id', // for GA4
    auth: 'auth', // for GA4 (optional)
    preview: 'preview', // for GA4 (optional)
    gaProperty: 'gaProperty', // for UA
    gaPropertyCrossDomain: 'gaPropertyCrossDomain' // for UA (optional)
  }
  // add further into the array as required
]
```
