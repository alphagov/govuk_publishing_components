# Google Tag Manager click tracking

This is a script to allow click tracking through Google Tag Manager to be added to any element using data attributes.

## Basic use

```html
<div data-module="gtm-click-tracking">
  <div data-ga4='{"event_name":"select_content", "type":"something", "index":0, "index_total":1, "text":"Click me"}'>
    Click me
  </div>
</div>
```

The module is initialised on the parent element, but tracking only occurs when clicks happen:

- on child elements that have a valid `data-ga4` attribute
- on the parent if it has a valid `data-ga4` attribute

A valid `data-ga4` attribute is a JSON string that can be parsed into an object, that contains a recognised value for `event_name`. Pushes to the dataLayer that do not include a valid `event_name` attribute will be ignored by Tag Manager.

In the example above, the following would be pushed to the dataLayer. Note that the schema automatically populates empty values, and that attributes not in the schema are ignored.

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'select_content',
    'type': 'something',
    'url': 'n/a',
    'text': 'Click me',
    'index': '0',
    'index_total': '1',
    'section': 'n/a',
    'action': 'n/a',
    'external': 'n/a'
  }
}
```

## Advanced use

In some situations we want to track dynamic elements like the 'Show/hide all' links on accordions. This is complicated by the element being created and updated dynamically using separate JavaScript, and the need to track the state of the element when clicked (to record whether it was opened or closed).

This is handled using the following approach.

```erb
<div data-module="gtm-click-tracking">
  <%
    show_all_attributes = {
      event_name: "select_content",
      type: "accordion",
      index: 0,
      index_total: 5,
      section: "n/a"
    }
  %>
  <%= render 'govuk_publishing_components/components/accordion', {
    data_attributes_show_all: {
      "ga4": show_all_attributes.to_json
    },
    items: []
  } %>
</div>
```

This works as follows.

- data attributes are added to the accordion's 'Show/hide all' link using the `data_attributes_show_all` option in the component
- `GtmClickTracking` can now be triggered because the accordion is wrapped in the module and its 'Show/hide all' link has a `gtm-event-name` attribute
- `GtmClickTracking` checks for the presence of an `aria-expanded` attribute, either on the clicked element or a child of the clicked element
- if it finds one, it sets the `state` attribute of `ui` to either 'opened' or 'closed' depending on the value of `aria-expanded`
- if `data-ga4` does not include `text`, `GtmClickTracking` automatically uses the text of the clicked element

When a user clicks 'Show all sections' the following information is pushed to the dataLayer.

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'select_content',
    'type': 'accordion',
    'url': 'n/a',
    'text': 'Show all sections',
    'index': '0',
    'index-total': '5',
    'section': 'n/a',
    'action': 'opened',
    'external': 'n/a'
  }
}
```

When a user clicks 'Hide all sections' the following information is pushed to the dataLayer.

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'select_content',
    'type': 'accordion',
    'url': 'n/a',
    'text': 'Hide all sections',
    'index': '0',
    'index-total': '5',
    'section': 'n/a',
    'action': 'closed',
    'external': 'n/a'
  }
}
```
