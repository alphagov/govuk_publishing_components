# Google Analytics 4 link tracker

This script is intended for adding GA4 tracking to links. It depends upon the main GA4 analytics code to function.

## Basic use (single link)

```html
<a
  href="/link"
  data-module="ga4-track-click"
  data-ga4='{ "event_name": "navigation", "type": "home page", "index": 0, "index_total": 1, "section": "name of section", "external": "false" }'>
    Link
</a>
```

Note that the specific detail of the `data-ga4` attribute will depend on the context of the link.

## Basic use (multiple links)

Specific tracking can be applied to multiple elements within a container, by applying the data module once to the parent element.

```html
<div data-module="ga4-track-click">
  <a
    href="/a-page"
    data-ga4='{ "event_name": "navigation", "type": "browse", "index": "0", "index_total": "2", "section": "name of section", "external": "false" }'>
    Link 1
  </a>
  <a
    href="/another-page"
    data-ga4='{ "event_name": "navigation", "type": "browse", "index": "1", "index_total": "2", "section": "name of section", "external": "false" }'>
    Link 2
  </a>
</div>
```

Note that the specific detail of the `data-ga4` attribute will depend on the context of the link.

## Track links within content

Where tracking attributes cannot be directly applied to elements, links can be tracked with details applied to the parent. In this configuration the link text and href are automatically determined and included in the event data. This is helpful where page content is not editable, e.g. content comes from the content item or a publishing tool.

The `data-ga4-track-links-only` attribute ensures that only link clicks are tracked (without it, any click inside the element is tracked).

```html
<div
  data-module="ga4-track-click"
  data-ga4='{ "event_name": "navigation", "type": "browse", "section": "name of section", "external": "false" }'
  data-ga4-track-links-only>
  <a href="/link1">This link will be tracked</a>
  <a href="/link2">
    <span>This link will also be tracked even though it contains child elements</span>
  </a>
  <span>This span will not be tracked</span>
</div>
```

Note that in this configuration specific values such as `index` and `index_total` cannot currently be applied to links.

## Track links within content within a specific element

To apply tracking to links within a specific element within part of a page, use the `data-ga4-limit-to-element-class` alongside the `data-ga4-track-links-only` attribute. This is helpful where page content is not editable, e.g. content comes from the content item or a publishing tool.

```html
<div
  data-module="ga4-track-click"
  data-ga4='{ "event_name": "navigation", "type": "browse", "section": "name of section", "external": "false" }'
  data-ga4-track-links-only
  data-ga4-limit-to-element-class="demoBox">
  <a href="/link1">This link will not be tracked</a>
  <div class="demoBox">
    <a href="/link2">This link will be tracked</a>
  </div>
</div>
```
