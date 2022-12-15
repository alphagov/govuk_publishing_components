# Analytics

The gem now contains the GOV.UK analytics code from `static`, originally from `govuk_frontend_toolkit`.

The following documentation is included from the original for reference only.

## Toolkit analytics

The analytics code provides an abstraction around analytics to make tracking pageviews, events and dimensions across multiple analytics providers easier. Specifically it was created to ease the migration from Google’s Classic Analytics to Universal Analytics. It includes:

* a Google Analytics universal tracker wrapper
* code to asynchronously load universal analytics
* a generic Analytics wrapper that allows multiple trackers to be configured
* sensible defaults such as anonymising IPs
* data coercion into the format required by Google Analytics (eg a custom dimension’s value must be a string)
* stripping of PII from data sent to the tracker (strips email by default, can be configured to also strip dates and UK postcodes)

## Create an analytics tracker

The minimum you need to use the analytics function is:

1. Include the following files from /javascripts/analytics_toolkit in your project:
  * google-analytics-universal-tracker.js
  * analytics.js
2. Copy the following `init` script into your own project and replace the dummy IDs with your own (they begin with `UA-`).
  * This initialisation can occur immediately as this API has no dependencies.
  * Load and create the analytics tracker at the earliest opportunity so that:
    * the time until the first pageview is tracked is kept small and pageviews aren’t missed
    * javascript that depends on `GOVUK.analytics` runs after the tracker has been created

```js
(function() {
  "use strict";

  // Load Google Analytics libraries
  GOVUK.Analytics.load();

  // Use document.domain in dev, preview and staging so that tracking works
  // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
  var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  // Configure profiles and make interface public
  // for custom dimensions, virtual pageviews and events
  GOVUK.analytics = new GOVUK.Analytics({
    universalId: 'UA-XXXXXXXX-X',
    cookieDomain: cookieDomain
  });

  // Set custom dimensions before tracking pageviews
  // GOVUK.analytics.setDimension(…)

  // Activate any event plugins eg. print intent, error tracking
  // GOVUK.analyticsPlugins.error();
  // GOVUK.analyticsPlugins.printIntent();

  // Track initial pageview
  GOVUK.analytics.trackPageview();
})();
```

Once instantiated, the `GOVUK.analytics` object can be used to track virtual pageviews, custom events and custom dimensions.

## Virtual pageviews

> Page tracking allows you to measure the number of views you had of a particular page on your web site.

* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages)

Argument | Description
---------|------------
`path` (optional) | Custom path, eg `/path`
`title` (optional) | Custom page title, Universal only


```js
// Track current page
GOVUK.analytics.trackPageview();

// Track a custom path
GOVUK.analytics.trackPageview('/path');

// Track a custom path and custom page title
GOVUK.analytics.trackPageview('/path', 'Title');

// As above, plus additional options passed into the `pageview` call
GOVUK.analytics.trackPageview('/path', 'Title', {
  sessionControl: 'start'
});
```

## Custom events

> Event tracking allows you to measure how users interact with the content of your website. For example, you might want to measure how many times a button was pressed, or how many times a particular item was used.

* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)

Argument | Description
---------|------------
`category` (required) | Typically the object that was interacted with, eg "JavaScript error"
`action` (required) | The type of interaction, eg a JavaScript error message
`options` (optional) | Optional parameters to further describe event

Option | Description
-------|------------
`page`  | Useful for sending the URL when `window.location` has been updated using JavaScript since the Analytics tracking object was created
`label` | Useful for categorising events, eg JavaScript error source
`value` | Values must be non-negative. Useful to pass counts, eg error happened 5 times
`nonInteraction` | Defaults to false. When set the event will not affect bounce rate

```js
// Track a custom event with required category and action fields
GOVUK.analytics.trackEvent('category', 'action');

// Track a custom event with optional page, label, value and nonInteraction options
GOVUK.analytics.trackEvent('category', 'action', {
  page: '/path/to/page',
  label: 'label',
  value: 1,
  nonInteraction: true // event will not affect bounce rate
});
```

## Custom dimensions

> Custom dimensions and metrics are a powerful way to send custom data to Google Analytics. Use custom dimensions and metrics to segment and measure differences between: logged in and logged out users, authors of pages, or any other business data you have on a page.

* [Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets)

Universal custom dimensions are configured within analytics.

### Set custom dimensions before tracking pageviews

Many page level custom dimensions must be set before the initial pageview is tracked. Calls to `setDimension` should typically be made before the initial `trackPageview` is sent to analytics.

Argument | Description
---------|------------
`index` (required) | The Universal dimension’s index as configured in the profile.
`value` (required) | Value of the custom dimension

```js
// Set a custom dimension at index 1 with value and name
GOVUK.analytics.setDimension(1, 'value');
```

### Create custom dimension helpers

Because dimensions rely on the correct index and that index doesn’t indicate its purpose, it’s helpful to create methods that abstract away the details. For example:

```js
function setPixelDensityDimension(pixelDensity) {
  GOVUK.analytics.setDimension(1, pixelDensity);
}
```

## Tracking across domains

Once an Analytics instance has been created, tracking across domains can be set up
for pages like:

```js
GOVUK.analytics.addLinkedTrackerDomain(trackerIdHere, nameForTracker, domainToLinkTo);
```

Note that `domainToLinkTo` must be an array of strings.

Once this is done hits to that page will be tracked in both your local and the
named tracker, and sessions will persist to the other domain.

### Adding more domains to GOV.UK's cross domain linker

Once a service starts sending analytics data to the shared GA property and has configured their system to include `www.gov.uk` in their cross domain linking, we must also configure `www.gov.uk` to include their domain in our cross linker configuration.

Add the domain of the service to [linked-domains.js](https://github.com/alphagov/govuk_publishing_components/tree/main/app/assets/javascripts/govuk_publishing_components/analytics/linked-domains.js).

Here's an [example of an earlier PR](https://github.com/alphagov/static/pull/1845) to do this.

Only the domain should be added, GA will ignore any path details e.g. `/government/service/`

Note that GA matches subdomains of any domains added this way. So `passport.service.gov.uk` also includes `www.passport.service.gov.uk`.

On that basis the simplest course of action would appear to be to simply add `gov.uk` or even `service.gov.uk` and then it'll just match everything we want it to. **We must not do this** for very good reasons:

- any link from `www.gov.uk` to a matching domain would have a URL parameter automatically added to it e.g. `https://something.service.gov.uk/?_ga=23.32423234.213.1.2213`. This could interfere with that site's own analytics.
- the client ID might be reset.

Once the changes to the linker configuration have been deployed a performance analyst will need to check that everything is working correctly. Since static PRs can take upwards of half an hour to pass CI tests, it's worth having a revert PR ready early on just in case.

## Plugins

Plugins are namespaced to `GOVUK.analyticsPlugins`. They should be pulled in by your project and initialised after `GOVUK.analytics` (see [Create an analytics tracker, above](#create-an-analytics-tracker)).

### Print tracking (`print-intent.js`)

Track when users are attempting to print content. The plugin sends a `Print intent` event and a `/print` prefixed pageview:

Example event:

Category | Action
---------|-------
Print Intent | `/current/page`

Example pageview:

`/print/current/page`

### Error tracking (`error-tracking.js`)

Track JavaScript errors, capturing the error message, file and line number. These events don’t affect bounce rate. Errors can be filtered to include only files of interest by passing in an options argument with a regexp matcher (to avoid tracking errors generated by browser plugins):

```js
GOVUK.analyticsPlugins.error({filenameMustMatch: /gov\.uk/});
```

Category | Action | Label | Value
---------|--------|-------|-------
JavaScript Error | The error message | file.js: line number | 1

### External link tracking (`external-link-tracker.js`)

The tracker will send an event for clicks on links beginning, `http` and linking outside of the current host. By default the plugin uses Google Analytics’ `transport: beacon` method so that events are tracked even if the page unloads.

Category | Action | Label
---------|--------|-------
External Link Clicked | http://www.some-external-website.com | Link text


### Download link tracking (`download-link-tracker.js`)

The tracker will send an event for clicks on any link that matches the selector passed in. A selector must be provided. By default the plugin uses Google Analytics’ `transport: beacon` method so that events are tracked even if the page unloads.

```js
GOVUK.analyticsPlugins.downloadTracker({selector: 'a[rel="download"]'});
```

Category | Action | Label
---------|--------|-------
Download Link Clicked | `/some/upload/attachment/file.pdf` | Link text

### Mailto link tracking (`mailto-link-tracker.js`)

The tracker will send events for clicks on links beginning with `mailto`. By default the
plugin uses Google Analytics’ `transport: beacon` method so that events are tracked even if the page unloads.

Category | Action | Label
---------|--------|-------
Mailto Link Clicked | mailto:name@email.com | Link text

### Stripping Personally Identifiable Information (PII)

The tracker will strip any PII it detects from all arguments sent to the
tracker.  If a PII is detected in the arguments it is replaced with a
placeholder value of `[<type of PII removed>]`; for example: `[email]` if an
email address was removed, `[date]` if a date was removed, or `[postcode]`
if a postcode was removed.

We have to parse all arguments which means that if you don't pass a path to
`trackPageview` to track the current page we have to extract the current page
and parse it, turning all `trackPageview` calls into ones with a path argument.
We use `window.location.href.split('#')[0]` as the default path when one is
not provided.  The original behaviour would have been to ignore the anchor
part of the URL anyway so this doesn't change the behaviour other than to make
the path explicit.

By default we strip email addresses, but it can also be configured to strip
dates and postcodes too.  Dates and postcodes are off by default because
they're more likely to cause false positives.  If you know you are likely to
include dates or postcodes in the data you send to the tracker you can configure
to strip postcodes at initialize time as follows:

```js
  GOVUK.analytics = new GOVUK.Analytics({
    universalId: 'UA-XXXXXXXX-X',
    cookieDomain: cookieDomain,
    stripDatePII: true,
    stripPostcodePII: true
  });
````

Any value other than the JS literal `true` will leave the analytics module
configured not to strip.

#### Avoiding false positives

Sometimes you will have data you want to send to analytics that looks like PII
and would be stripped out.  For example on GOV.UK the content_ids that belong
to every document can sometimes contain a string of characters that look like a
UK postcode: in `eed5b92e-8279-4ca9-a141-5c35ed22fcf1` the substring `c35ed` in
the final portion looks like a postcode, `C3 5ED`, and will be transformed into
`eed5b92e-8279-4ca9-a141-5[postcode]22fcf1` which breaks the `content_id`.  To
send data that you know is not PII, but it looks like an email address, a date,
or a UK postcode you can provide your arguments wrapped in a `GOVUK.Analytics.PIISafe`
object.  If any argument to an analytics function is an instance of one of these
objects the value contained within will be extracted and sent directly to the
analytics tracker without attempting to strip PII from it.  For example:

```js
  GOVUK.analytics.setDimension(1, new GOVUK.Analytics.PIISafe('this-is-not-an@email-address-but-it-looks-like-one'));
  GOVUK.analytics.trackEvent('report title clicked', new GOVUK.Analytics.PIISafe('this report title looks like it contains a P0 5TC ode but it does not really'));
````
#### Tooling

[Omnibug](https://chrome.google.com/webstore/detail/omnibug/bknpehncffejahipecakbfkomebjmokl?hl=en) is a useful extension to easily capture and review the events being sent to Google Analytics.
