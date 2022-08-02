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

In some scenarios we use components that cannot be modified directly (i.e. unable to place the `data-ga4` attribute on the element as shown in the 'Basic use' section). In these cases, we attach the necessary data attributes for tracking by passing an argument containing our data attributes to the render method.

Many components already accept data attributes in this way (see the [component guide](https://components.publishing.service.gov.uk/component-guide) for examples) but some, like the accordion, are more complicated.

### Overview

To track clicks on the 'Show/hide all sections' accordion link, pass data to the accordion using the `data_attributes_show_all` option as shown.

```erb
<%
  ga4_attributes = {
    event_name: "select_content",
    type: "accordion",
    # other attributes
  }
%>
<div data-module="gtm-click-tracking">
  <%= render 'govuk_publishing_components/components/accordion', {
    data_attributes_show_all: {
      "ga4": ga4_attributes.to_json
    },
    items: []
  } %>
</div>
```

### Detailed guide

In some situations we want to track dynamic elements like the 'Show/hide all sections' links on accordions. This is complicated by the element being created and updated dynamically using JavaScript and the need to track the state of the element when clicked (to record whether it was opened or closed).

It is also complicated by the fact that the JavaScript that creates this element is imported from `govuk-frontend` and therefore can't be modified directly. In order to get attributes onto this link, we have to do the following.

- pass attributes to the accordion for the 'Show/hide all' link using the `data_attributes_show_all` option
  - this should contain an object with one or many keys, each with a value converted into JSON
  - this is appended to the main component element as `data-show-all-attributes`
- the 'Show/hide all' link is created by govuk-frontend JavaScript
- the accordion JavaScript reads `data-show-all-attributes`
  - it creates a `data-` attribute on the 'Show/hide all' link for each key in the JSON
  - in the example above, the result will be `data-ga4="{ "event_name": "select_content", "type": "accordion" }"`
- wrap the accordion in the click tracking script
  - tracking will be activated by clicks on elements with a `data-ga4` attribute
  - it checks for an `aria-expanded` attribute, either on the clicked element or a child of the clicked element, and sets the `action` of the GA data accordingly
  - the current text of the clicked element is also recorded (this can be overridden to a non-dynamic value by including `text` in the attributes if required)

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
