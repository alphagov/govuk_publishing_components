# Google Analytics 4 event tracker

This script is intended for adding GA4 tracking to interactive elements such as buttons or details elements. It depends upon the main GA4 analytics code to function.

## Basic use (single interactive element)

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

## Basic use (multiple interactive elements)

To track a group of interactive elements together on the page - such as a button group - the data module can be applied once to the parent element.  
This approach should only be used in the case that the parent element only contains buttons or similar features as it can lead to double tracking issues if used too broadly, see the next section for how to approach tracking all buttons on a page.

```
<div class="govuk-button-group" data-module="ga4-event-tracker">
  <button ...></button>
  <button ...></button>
</div>
```

### Tracking all buttons on a page

[Unlike the link tracker](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/analytics-ga4/trackers/ga4-link-tracker.md#basic-use-multiple-links), it's not advisable to place the event tracker at the top of the page. This is due to the built in tracking for components such as tabs or details. Clicks on the tabs or details components will be tracked both by the `ga4-event-tracker` on the component `div` and the `ga4-event-tracker` at the top of the page. Instead the `ga4-event-tracker` should be limited in scope to the element that needs to be tracked. This can be performed programatically, [as in Whitehall](https://github.com/alphagov/whitehall/blob/main/app/assets/javascripts/admin/analytics-modules/ga4-button-setup.js#L29-L30).

```
button.dataset.module = 'ga4-event-tracker'
GOVUK.modules.start(button)
```

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
