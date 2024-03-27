# Google Analytics 4 event tracker

This script is intended for adding GA4 tracking to interactive elements such as buttons or details elements. It depends upon the main GA4 analytics code to function.

## Basic use

```html
<div data-module="ga4-event-tracker">
  <button data-ga4-event='{ "event_name": "select_content", "type": "something", "index": "0", "index_total": "1" }'>
    Click me
  </button>
</div>
```

The module is initialised on the parent element, but tracking only occurs when clicks happen:

- on child elements that have a valid `data-ga4-event` attribute
- on the parent if it has a valid `data-ga4-event` attribute

A valid `data-ga4-event` attribute is a JSON string that can be parsed into an object, that contains a recognised value for `event_name` (this is added automatically by the event tracker). Pushes to the dataLayer that do not include a valid `event_name` attribute will be ignored by Tag Manager.

In the example above, the following would be pushed to the dataLayer. Note that the schema automatically populates empty values, and that attributes not in the schema are ignored.

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'select_content',
    'type': 'something',
    'text': 'Click me',
    'index': {
      index_section: '0'
    },
    'index_total': '1'
  }
}
```

The value for `text` will be determined based on the text of the element, or a value can be passed to override this in the `data-ga4-event` attribute.

## Advanced use

Sometimes it isn't possible to use the event tracker as shown above as the requirements are more complicated. For example when tracking dynamic elements like the 'Show/hide all sections' links on accordions. In this situation tracking has to be built into the component itself.

This is because the element being tracked is created and updated dynamically using JavaScript, and the state of the element and the data to be recorded changes on interaction (i.e. whether it was opened or closed).

This is further complicated as the JavaScript that creates this element is imported from `govuk-frontend` and therefore can't be modified directly. In order to get attributes onto this link, we have to do the following.

- the 'Show/hide all' link is created by `govuk-frontend` JavaScript
- the accordion JavaScript checks for `ga4-event-tracker`
  - it adds `data-ga4-event` with the relevant GTM JSON to the 'Show/hide all' link
  - in the example above, the result will be `data-ga4-event="{ "event_name": "select_content", "type": "accordion", index: "0", index_total: "0" }"`
  - tracking will be activated by clicks on elements with a `data-ga4-event` attribute
  - it checks for an `aria-expanded` attribute, as the accordion will contain a `data-ga4-expandable` value. This sets the `action` property of the `event_data` object accordingly.
  - the current text of the clicked element is also recorded (this can be overridden to a non-dynamic value by including `text` in the attributes if required)

When a user clicks 'Show all sections' the following information is pushed to the dataLayer.

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'select_content',
    'type': 'accordion',
    'text': 'Show all sections',
    'index': {
      index_section: '0'
    },
    'index-total': '5',
    'action': 'opened',
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
    'text': 'Hide all sections',
    'index': {
      index_section: '0'
    },
    'index-total': '5',
    'action': 'closed',
  }
}
```
