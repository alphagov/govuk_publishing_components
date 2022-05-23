# Google Tag Manager click tracking

This is an experimental script to allow click tracking through Google Tag Manager to be added to any element using data attributes.

## Basic use

```html
<div data-module="gtm-click-tracking">
  <div
    data-gtm-event-name="anything"
    data-gtm-attributes='{"type":"something","index":0,"index-total":1,"section":"n/a","text":"Click me"}'>
    Click me
  </div>
</div>
```

The module is initialised on the parent element, but tracking only occurs when clicks happen:

- on child elements that have a `data-gtm-event-name` attribute
- on the parent if it has a `data-gtm-event-name` attribute

The contents of `data-gtm-attributes` are parsed as a JSON object and included in the information passed to GTM. In the example above, the following would be pushed to the dataLayer. Note that the `link_url` attribute is automatically populated with the current page path.

```
{
  'event': 'analytics',
  'event_name': 'anything',
  'link_url': '/government/publications/cheese',
  'ui': {
    'type': 'something',
    'index': '0',
    'index-total': '1',
    'section': 'n/a',
    'text': 'Click me'
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
      type: "accordion",
      index: 0,
      "index-total": 5,
      section: "n/a"
    }
  %>
  <%= render 'govuk_publishing_components/components/accordion', {
    data_attributes_show_all: {
      "gtm-event-name": "select_content",
      "gtm-attributes": show_all_attributes.to_json
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
- if `data-gtm-attributes` does not include `text`, `GtmClickTracking` automatically uses the text of the clicked element

When a user clicks 'Show all sections' the following information is pushed to the dataLayer.

```
{
  'event': 'analytics',
  'event_name': 'select_content',
  'link_url': '/government/publications/cheese',
  'ui': {
    'type': 'accordion',
    'index': '0',
    'index-total': '5',
    'section': 'n/a',
    'text': 'Show all sections',
    'state': 'opened'
  }
}
```

When a user clicks 'Hide all sections' the following information is pushed to the dataLayer.

```
{
  'event': 'analytics',
  'event_name': 'select_content',
  'link_url': '/government/publications/cheese',
  'ui': {
    'type': 'accordion',
    'index': '0',
    'index-total': '5',
    'section': 'n/a',
    'text': 'Hide all sections',
    'state': 'closed'
  }
}
```
