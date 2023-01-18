# Loading analytics into our applications

For analytics tracking, each environment (production, staging, integration, development) uses different environment variables. These environment variables are used to determine which dashboard analytics data is sent to. This is useful to us for testing and debugging, as we can test our analytics in isolated environments. Therefore, we want to be able to set different environment variables depending on which environment we are in. This needs to happen before our analytics code is initialised, so `load-analytics.js` handles the initialisation of these variables before our analytics code is run.

Therefore, `load-analytics.js` has been written to do the following:

1. Grab the current domain that the code is running on using `window.location.hostname`.
2. Determine the environment you are on by comparing your domain against hardcoded categorised domains.
3. Set the correct environment variables for both Universal Analytics, and Google Analytics 4, depending on the environment you are on. These envrionment variables are also hardcoded.
4. Kick off the initialisation of analytics by adding the `gtm.js` and `analytics.js` scripts from Google to the `<head>` of the page.
5. The GA4 code then waits for a `DOMContentLoaded` event to initialise the analytics modules, as our modules rely on the `<body>` existing so they cannot be initialised straight away. The UA code however will initiliase at the same point that `analytics.js` is added to the `<head>` of the page.
6. The `loadGa4` function in this file also handles cookie consent for GA4. If the user has accepted cookies, the analytics code will run as soon as possible. If they have not accepted cookies, the analytics code will only initialise once it receives a `cookie-consent` event, which is a custom event we send when cookies are accepted.

The Google Analytics 4 environment variables are:

- `id` - this is the Google Tag Manager ID used to identify our organisation so that analytics data is sent to the right account.
- `preview` - this is an optional variable that is used to determine what GTM environment the analytics data is sent to. If this is empty, analytics data is sent to the production dashboard. If you wanted to have your integration analytics to an 'integration' dashboard, you would populate this variable with the relevant value.
- `auth` - this is used to authenticate analytics data being sent to another dashboard, such as an 'integration' dashboard. This can be determined through the browser so they're not classified as secret.