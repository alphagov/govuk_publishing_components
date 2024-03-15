# GA4 developer guide

The following is intended for developers working on a part of GOV.UK that includes analytics.

## Identifying tracking

Anything relating to GA4 will be prefixed with `ga4-`. This includes `data-ga4` attributes and module names. If you are modifying code that contains or is inside anything with a `ga4-` prefix you should check that the tracking still works after your change.

Tracking is normally initialised on an element with a `data-module` for a [tracker](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/analytics-ga4/ga4-all-trackers.md) accompanied by a `data-ga4-(something)` attribute either on the same element or child elements. This attribute will usually contain a JSON snippet of data that will be picked up by the tracker and passed to GA4. See individual tracker documentation for more details.

## Testing and debugging

To see what events have already occurred on a page, type `window.dataLayer` into the browser console.

To see events as they occur for the current page only, there is a [browser console command](https://github.com/alphagov/govuk_publishing_components/blob/00d81931a46e9826f07b939e0957ebc34d37f9ce/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-core.js#L36-L38) to assist with debugging. Enter the following in your browser console.

```
window.GOVUK.analyticsGa4.showDebug = true
```

This is useful for seeing what is being pushed to the dataLayer for in-page events such as tabs or accordions. Enabling 'Preserve log' in Chrome will allow link click and other page reload events to be seen, but the command will need to be run again after a page reload to see subsequent event data.

## Components and tracking

Many of [our components](https://components.publishing.service.gov.uk/component-guide) have GA4 tracking built in and enabled by default. This can be either:

- all of the tracking for the component can be determined automatically and is handled entirely by the component
- most of the tracking can be determined automatically, but some extra parameters may need to be passed

An example of the latter is the [Details component](https://components.publishing.service.gov.uk/component-guide/details#with_ga4_tracking).

When a component includes tracking it should always be possible to disable this by passing a `disable_ga4` option to the component.

## Understanding indexes

Often GA4 events will include index attributes. These are used by analysts to understand where on a page an event originates. Indexes can be applied to any element but are most often seen when tracking links. All indexes start at 1. The index attributes are:

- `index_link` should be the index of the link within this group of links
- `index_section` should be the index of this group of links, within groups of links in this part of the page
- `index_section_count` should be the total number of groups of links in this part of the page
- `index_total` should be the number of links within this group

If you are adding or removing links to a part of a page where indexes are used for tracking, you may need to update the values accordingly. If you're uncertain, speak to a performance analyst.

Here's a simplified example.

```HTML
<h2>Guidance on cheese</h2>
<ul>
  <li>
    <a href="/link1">Correct application of cheeses</a>
    <!-- index_link: 1, index_section: 1, index_section_count: 2, index_total: 3 -->
  </li>
  <li>
    <a href="/link2">Differences between hard and soft cheese</a>
    <!-- index_link: 2, index_section: 1, index_section_count: 2, index_total: 3 -->
  </li>
  <li>
    <a href="/link3">A balanced cheese diet</a>
    <!-- index_link: 3, index_section: 1, index_section_count: 2, index_total: 3 -->
  </li>
</ul>

<h2>Popular links</h2>
<ul>
  <li>
    <a href="/link4">My favourite cheeses</a>
    <!-- index_link: 1, index_section: 2, index_section_count: 2, index_total: 2 -->
  </li>
  <li>
    <a href="/link5">Cheese adventures abroad</a>
    <!-- index_link: 2, index_section: 2, index_section_count: 2, index_total: 2 -->
  </li>
</ul>
```
