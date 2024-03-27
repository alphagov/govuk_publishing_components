# Using our GA4 tracking in your application

If you are a developer on GOV.UK looking to integrate the tracking code into one of our Rails applications there are several steps needed.

The code in this gem is set up to track and structure data in a very specific way. If you wish to use a different [data schema](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/analytics-ga4/schemas.md) or track different things it may be easier to implement GA4 in a different way. Ask in the `#govuk-ga4` slack channel for advice.

## Installation

Ensure the gem is [installed in your application](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/install-and-use.md).

Include the gem dependencies in your main JavaScript file: `//= require govuk_publishing_components/dependencies`.

Add this meta tag to your main page template: `<meta name="govuk:components_gem_version" content="<%= GovukPublishingComponents::VERSION %>" />` (the gem version number is read from here for versioning purposes in the analytics data).

Configure the GTM variables for your site as described in 'Passing extra options' in the [load analytics documentation](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/load-analytics.md), and include the `load-analytics.js` script in your code.

If your application does not require cookie consent from your users, you will need to 'force' cookie consent to occur, as the analytics code depends upon it.

```JavaScript
window.GOVUK.approveAllCookieTypes()
window.GOVUK.cookie('cookies_preferences_set', 'true', { days: 365 })
```

If your application already has a cookie banner and it is not the one from this gem, you will need to switch to ours.

## Testing

Once the code is configured correctly, data will start to be pushed to the dataLayer. Read the 'Testing and debugging' section of the [developer guide](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/analytics-ga4/developer-guide.md) to see how to check it is working correctly.

Page views and some link tracking should happen automatically. Some components also track automatically. If you wish to add new tracking, start with the 'Creating tracking' section of the developer guide.

## Configuring GTM/GA4

Even if all of the above has worked correctly some configuration will still need to be done at the GTM/GA4 level to actually collect and store the analytics data. Talk to a performance analyst or ask in `#govuk-ga4` for more information.
