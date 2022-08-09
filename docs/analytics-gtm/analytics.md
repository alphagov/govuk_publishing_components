# Google Analytics 4 and Google Tag Manager

This document describes the use of Google Tag Manager (GTM) with Google Analytics 4 (GA4) on GOV.UK Publishing.

No analytics code is initialised and no data is gathered without user consent.

## General approach

We pass three types of data to GA4.

- page views
- events
- search data

Page views happen when a page loads.

Events happen when a user interacts with certain things, for example clicking on an accordion, tab, or link.

Search data is gathered when users perform a search.

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

`page` is defined in the [gtm-page-views script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/gtm-page-views.js).

`event_data` is defined in the [gtm-schemas script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/gtm-schemas.js) and used in the [gtm-event-click-tracker script](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/gtm-event-click-tracker.js).

`search_results` has not been implemented yet.

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
