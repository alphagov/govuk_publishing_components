# Google Analytics 4 and Google Tag Manager

This document describes the use of Google Tag Manager (GTM) with Google Analytics 4 (GA4) on GOV.UK Publishing. Further information can be found in our [Implementation record](https://docs.publishing.service.gov.uk/analytics/).

No analytics code is initialised and no data is gathered without user consent. For more information, see our [consent](consent.md) documentation.

If you are a developer working on a part of GOV.UK that includes analytics, read our [developer guide](developer-guide.md).

## General approach

We pass three types of data to GA4.

- page views
- events
- search data

Page views happen when a page loads.

Events happen when a user interacts with certain things, for example clicking on an accordion, tab, or link.

Search data is gathered when users perform a search.

For more information about different kinds of tracking, read our [overview of trackers](trackers.md).

## Code structure

We have two ways of running analytics code:

- as modules attached to elements on the page e.g. the [GA4 auto tracker](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-auto-tracker.js) `<div data-module="ga4-auto-tracker">`
- as code that runs on page load regardless of page content e.g. the [GA4 copy tracker](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-copy-tracker.js)

For modules, our existing guidance on writing [GOV.UK JavaScript modules](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/javascript-modules.md) should be followed.

For analytics code that runs on page load, the following approach should be used. Code should be attached to the `window.GOVUK.analyticsGa4.analyticsModules` object and include an `init` function, using the structure shown below.

When cookie consent is given, `init-ga4.js` looks through the `analyticsModules` object for anything with an `init` function, and executes them if found. This means that analytics code will not be executed unless consent is given, and gives a standard way to add more analytics code without additional initialisation.

```JavaScript
window.GOVUK = window.GOVUK || {}
window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
window.GOVUK.analyticsGa4.analyticsModules = window.GOVUK.analyticsGa4.analyticsModules || {};

(function (analyticsModules) {
  'use strict'

  var ExampleCode = {
    init: function () {
      // do analytics stuff, like send a page view
    }
  }

  analyticsModules.ExampleCode = ExampleCode
})(window.GOVUK.analyticsGa4.analyticsModules)
```

### Core code

General analytics code and reused functions are kept in [ga4-core.js](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-core.js).

This includes the code that initialises Google Tag Manager and pushes data to the dataLayer, as well as shared functions for link and ecommerce tracking.

### Code in other applications

While our aim is to keep the majority of the analytics code in `govuk_publishing_components` it makes sense to put analytics code specific to a certain page in the application that renders that page. GA4 analytics documentation can also be found in the following applications.

- [finder-frontend](https://github.com/alphagov/finder-frontend/tree/main/docs/analytics-ga4)

### Code in components

Often tracking will need to be built into components, either using an [existing tracker](trackers.md) or some custom code, or a combination of both.

Where component tracking needs additional data to be passed (for example `index` or `section` values to show where the component is on a page) this should be built into the component and the data required documented in the component guide.

Where component tracking can be entirely self contained (i.e. nothing needs to be passed) tracking should be enabled by default, but a `disable_ga4` option should be included and documented to allow the tracking to be disabled if required. See the [tabs component](https://github.com/alphagov/govuk_publishing_components/blob/main/app/views/govuk_publishing_components/components/_tabs.html.erb#L11) for an example.

## Data schemas

All of the data sent to GTM is based on a common schema.

```
{
  event: '',
  page: {},
  event_data: {},
  search_results: {}
}
```

`event` must have a specific value to activate the right trigger in GTM.

`page` is defined in the [ga4-page-views script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-page-views.js).

`event_data` is defined in the [ga4-schemas script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-schemas.js) and used in the [ga4-event-tracker script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-event-tracker.js).

`search_results` is defined in the [ga4-ecommerce-tracker script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-ecommerce-tracker.js).

For more details of how our data schemas work, read our [data schemas documentation](schemas.md) or for the structure read our [Implementation record](https://docs.publishing.service.gov.uk/analytics/).

## How the dataLayer works

GTM's dataLayer has two elements - an array and an object. `window.dataLayer = []` is executed when the page loads.

GOV.UK JavaScript (JS) pushes objects to the dataLayer array when certain things happen e.g. when the page loads, or a user clicks on a certain type of link. Once that happens GTM takes over. It reads the latest object in the array and passes the data found into the dataLayer object. Importantly, it only adds to the object, so data can persist from previous array pushes.

For example:

- an event happens and JS pushes `{ a: 1 }` to the dataLayer array
- GTM adds this to the dataLayer object, which is now `{ a: 1 }`
- another event happens and JS pushes `{ b: 1 }` to the array
- GTM adds this to the dataLayer object, which is now `{ a: 1, b: 1 }`

If data shouldn't persist it can be erased in a following push, for example by sending `{ a: 1, b: false }`, but often this overall behaviour is desirable - for example, page view data will persist in events that happen on that page, providing more context for analysts.

If the data given to GTM contains a recognised `event` attribute value, GTM then sends that data on to GA4.

The dataLayer is recreated when a user navigates to another page, so no data in the dataLayer will persist between pages.
