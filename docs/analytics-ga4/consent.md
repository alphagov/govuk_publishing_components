# GA4 and cookie consent

The analytics code is only loaded if users consent to cookies. This is managed by the `init-ga4.js` script.

If the page loads and cookie consent has already been given, the analytics code is initialised. This includes sending a page view and creating any event listeners for analytics code such as link tracking.

If the page loads and cookie consent has not been given, an event listener is created for the `cookie-consent` event, which is dispatched by the [cookie banner component](https://github.com/alphagov/govuk_publishing_components/pull/2041/commits/777a381d2ccb67f0a7e78ebf659be806d8d6442d). If triggered, the event listener will initialise the analytics code as described above. This allows analytics to begin on the page where the user consents to cookies.
