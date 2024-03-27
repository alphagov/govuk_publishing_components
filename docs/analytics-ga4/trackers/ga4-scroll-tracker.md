# Google Analytics 4 scroll tracker

The scroll tracker can be added to pages that require scroll tracking.

## Overview

The scroll tracker is a GOVUK.Module and can be initialised by adding the relevant code to a template. Since scroll tracking is only required once on a page, it should be initialised using a meta tag in the HEAD element as shown.

```html
<% content_for :extra_head_content do %>
  <meta name="govuk:scroll-tracker" content="" data-module="ga4-scroll-tracker"/>
<% end %>
```

Note that since the scroll tracker is initialised by the `data-module` attribute, the meta `name` can be anything, we use `govuk:scroll-tracker` only for reference.

### Track percentages

By default, the scroll tracker tracks by percentage scrolled. Specifically, it will make a push to the dataLayer when the user scrolls to 20%, 40%, 60%, 80% and 100% of the page height.

When tracking percentages, the following data will be pushed to the dataLayer.

```
{
  event: "event_data",
  event_data: {
    action: "scroll",
    event_name: "scroll",
    percent_scrolled: 20,
    type: "percent"
  }
}
```

### Track headings

The scroll tracker can be configured to track headings using the `data-ga4-track-type` option.

```html
<% content_for :extra_head_content do %>
  <meta name="govuk:scroll-tracker" content="" data-module="ga4-scroll-tracker" data-ga4-track-type="headings"/>
<% end %>
```

When tracking headings, the following data will be pushed to the dataLayer.

```
{
  event: "event_data",
  event_data: {
    action: "scroll",
    event_name: "scroll",
    index: {
      index_section: 2, // index of heading in headings tracked
      index_section_count: 5 // total number of headings being tracked
    },
    text: "Text of heading",
    section: "Text of heading",
    type: "heading"
  }
}
```

If you need custom text when tracking a specific heading, a data attribute can be added to the element for this purpose.

```HTML
<h2 data-ga4-text="this text will be recorded in the event">
  This text will be ignored
</h2>
```

### Track markers

Sometimes only certain elements on a page should be tracked. This can be done by adding a marker to the required elements and configuring as shown.

```html
<% content_for :extra_head_content do %>
  <meta name="govuk:scroll-tracker" content="" data-module="ga4-scroll-tracker" data-ga4-track-type="markers"/>
<% end %>

<div data-ga4-scroll-marker>
  Some content
</div>

<div data-ga4-scroll-marker>
  Some other content
</div>
```

Any element that a marker is attached to should be short in both height and text content to be tracked well, because:

- the `text` attribute collects the full text of the element with the marker (or the `data-ga4-text` attribute can be applied, as for heading tracking)
- scroll tracking only happens when the marked element is fully visible to the user

When tracking markers, the following data will be pushed to the dataLayer.

```
{
  event: "event_data",
  event_data: {
    action: "scroll",
    event_name: "scroll",
    index: {
      index_section: 1, // index of marker in markers tracked
      index_section_count: 2 // total number of markers being tracked
    },
    text: "Some content",
    section: "Some content",
    type: "marker"
  }
}
```

## Adding tracking to specific pages

A single template may render multiple pages and different configurations may be required. If this is the case, configuration can be handled by the template.

```html
<% content_for :extra_head_content do %>
  <% if ["/foreign-travel-advice/benin", "/foreign-travel-advice/france"].include?(content_item.base_path) %>
    <meta name="govuk:scroll-tracker" content="" data-module="ga4-scroll-tracker" data-ga4-track-type="headings" data-track-headings="['Summary']"/>
  <% else %>
    <meta name="govuk:scroll-tracker" content="" data-module="ga4-scroll-tracker"/>
  <% end %>
<% end %>
```

## Tracking dynamic pages

Dynamically updated pages like the search pages present a challenge for scroll tracking. Since scroll events are only recorded once, if the page content changes and users have already scrolled, those scroll events will not fire again even though the page has changed.

It is possible to 'reset' the behaviour of the scroll tracker on dynamic pages by creating an event called `dynamic-page-update`. This is used on the [search pages](https://github.com/alphagov/finder-frontend/pull/3129/files#diff-fe1355439297aa459f871621b4f95627ea330655c7c6eb08ef10bda7ab66c0feR510) where the event is fired when the page is updated with new search results. Once this has happened previously tracked scroll positions will be tracked again.

## Behaviour

The scroll tracker finds the position of things (percentages and headings, including the text of headings) on page load to minimise calculations when the user scrolls. This finding of positions is repeated if any of the following occur:

- the user resizes the page
- the height of the page changes (for example if the cookie banner is dismissed, or an accordion item is expanded). This also detects user font size or zoom level changes

Operation:

- Tracking events are only fired once i.e. if a user scrolls up and down a page, duplicate events are not tracked.
- Tracking events are fired on page load for things that are immediately visible.
- If the user has followed a jump link, e.g. `https://www.gov.uk/foreign-travel-advice/spain/coronavirus#finance` the tracker detects this and doesn't fire tracking events until after the browser jumps to the relevant section. It also checks that the hash matches a valid element on the page, and continues as normal if it doesn't.
- Headings are tracked only when the whole of the heading is visible in the viewport.
- Headings are only tracked if they are inside the 'main' element, in order to avoid tracking headings in e.g. the cookie banner, the footer (this has been written to be extendable in future if other elements/classes are required)
- Hidden headings are not tracked, unless they become visible (e.g. if inside an accordion that is opened).
