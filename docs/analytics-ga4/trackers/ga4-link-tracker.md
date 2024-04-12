# Google Analytics 4 link tracker

This script is intended for adding GA4 tracking to links. It depends upon the main GA4 analytics code to function.

## Basic use (single link)

```html
<a
  href="/link"
  data-module="ga4-link-tracker"
  data-ga4-link='{ "event_name": "navigation", "type": "home page", "index_link": 1, "index_section": 1, "index_section_count": 3, "index_total": 1, "section": "name of section" }'>
    Link
</a>
```

Note that the specific detail of the `data-ga4-link` attribute will depend on the context of the link. This is particularly true for the index parameters.

## Basic use (multiple links)

Specific tracking can be applied to multiple elements within a container, by applying the data module once to the parent element.

```html
<div data-module="ga4-link-tracker">
  <a
    href="/a-page"
    data-ga4-link='{ "event_name": "navigation", "type": "browse", "index_link": 1, "index_section": 1, "index_section_count": 2, "index_total": "2", "section": "name of section" }'>
    Link 1
  </a>
  <a
    href="/another-page"
    data-ga4-link='{ "event_name": "navigation", "type": "browse", "index_link": 2, "index_section": 1, "index_section_count": 2, "index_total": "2", "section": "name of section" }'>
    Link 2
  </a>
</div>
```

Note that the specific detail of the `data-ga4-link` attribute will depend on the context of the link.

## Basic use (override text)

The text of the link can be overridden by another value if passed in the data attribute, as shown.

```html
<a
  href="/link"
  data-module="ga4-link-tracker"
  data-ga4-link='{ "event_name": "navigation", "type": "home page", "index_link": 1, "index_section": 1, "index_section_count": 3, "index_total": 1, "section": "name of section", "text": "This text will be recorded in the GA event" }'>
    This text will not be recorded
</a>
```

## Track links within content

Where tracking attributes cannot be directly applied to elements, links can be tracked with details applied to the parent. In this configuration the link text and href are automatically determined and included in the event data. This is helpful where page content is not editable, e.g. content comes from the content item or a publishing tool.

The `data-ga4-track-links-only` attribute ensures that only link clicks are tracked (without it, any click inside the element is tracked).

```html
<div
  data-module="ga4-link-tracker"
  data-ga4-link='{ "event_name": "navigation", "type": "browse", "section": "name of section" }'
  data-ga4-track-links-only
  data-ga4-set-indexes>
  <a href="/link1">This link will be tracked</a>
  <a href="/link2">
    <span>This link will also be tracked even though it contains child elements</span>
  </a>
  <span>This span will not be tracked</span>
</div>
```

The addition of the `data-ga4-set-indexes` data attribute on the parent element will allow the `index` and `index_total` properties to be set.

A value for `index_total` can be overridden by adding it to the `data-ga4-link` attribute. This is used in places where `data-ga4-set-indexes` is being used for part of a section of links, for example in [taxon pages](https://www.gov.uk/welfare).

If links that we can amend directly appear alongside links generated by content items or publishing tools and we do not want to index the former, adding a `data-ga4-do-not-index` attribute will prevent those links from being indexed. For example:

```html
<div data-ga4-set-indexes>
  <a href="/link1" data-ga4-do-not-index>This link will not be indexed</a>
  <a href="/link2">This link will be indexed</a>
</div>
```

## Track links within content within a specific element

To apply tracking to links within a specific elements within part of a page, use the `data-ga4-limit-to-element-class` alongside the `data-ga4-track-links-only` attribute. This is helpful where page content is not editable, e.g. content comes from the content item or a publishing tool. `data-ga4-limit-to-element-class` can accept multiple classes - each class must separated by a comma.

### With one CSS class
```html
<div
  data-module="ga4-link-tracker"
  data-ga4-link='{ "event_name": "navigation", "type": "browse", "section": "name of section" }'
  data-ga4-track-links-only
  data-ga4-limit-to-element-class="demoBox">
  <a href="/link1">This link will not be tracked</a>
  <div class="demoBox">
    <a href="/link2">This link will be tracked</a>
  </div>
</div>
```

### With multiple CSS classes
```html
<div
  data-module="ga4-link-tracker"
  data-ga4-link='{ "event_name": "navigation", "type": "browse", "section": "name of section" }'
  data-ga4-track-links-only
  data-ga4-limit-to-element-class="demoBox1, demoBox2, demoBox3">
  <a href="/link1">This link will not be tracked</a>
  <div class="demoBox1">
    <a href="/link2">This link will be tracked</a>
  </div>
    <div class="demoBox2">
    <a href="/link3">This link will be tracked</a>
  </div>
    <div class="demoBox3">
    <a href="/link4">This link will be tracked</a>
  </div>
    <div class="notTracked">
    <a href="/link5">This link will not be tracked</a>
  </div>
</div>
```
