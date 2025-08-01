# Google Analytics 4 form tracker

This script is intended for adding GA4 tracking to forms, specifically for smart answers and simple smart answers. The script is triggered on the 'submit' event of the form. It depends upon the main GA4 analytics code to function.

## Basic use

```html
<form
  data-module="ga4-form-tracker"
  data-ga4-form='{ "event_name": "form_response", "type": "something", "section": "form title", "action": "Continue", "tool_name": "title" }'>
  <!-- form contents -->
</form>
```

The data attributes are used as follows:

- `type` records the type of form e.g. `smart answer` or `simple smart answer`
- `section` records the current question e.g. `What are your favourite puddings?`
- `action` records the text of the form submission button e.g. `Continue`
- `tool_name` records the overall name of the smart answer e.g. `How do I eat more healthily?`

The script will automatically collect the answer submitted in the `text` field. For questions where multiple answers are possible, these will be comma separated. Where the answer is a text input, the value given is replaced with `[REDACTED]`, to avoid collecting personally identifiable information. If all inputs should not have their text redacted, add a `data-ga4-form-include-text` attribute to the form. If you only want a certain text input to be exempt from redaction, add a `data-ga4-form-include-input` attribute to that input element. If the `data-ga4-form-use-text-count` attribute is also used then the form will use the text count of a text input instead of the value of the text field.

In the example above, the following would be pushed to the dataLayer. Note that the schema automatically populates empty values, and that attributes not in the schema are ignored.

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'form_response',
    'type': 'smart answer',
    'tool_name': 'How do I eat more healthily?',
    'section': 'What are your favourite puddings?',
    'text': 'yoghurt,pie,trifle',
    'action': 'Continue'
  }
}
```

If the `data-ga4-form-record-json` attribute is set on the form then the JSON format will be used for the `text` field. So instead of the `text` being set to:

```
value,value,[REDACTED]
```

with `data-ga4-form-record-json` it will be set to:

```
{ "label1": "value", "label2": "value", "label3": "[REDACTED]" }
```

When a form is submitted with an empty input value, the tracker will set the `text` value in the dataLayer to `"No answer given"`. If you require empty input to be sent as `undefined` instead, add the `data-ga4-form-no-answer-undefined` attribute to the form.

If the `data-ga4-form-split-response-text` attribute is set on the form then the `text` value in the dataLayer will be split into 5 fields to overcome the GA4 500 character limit:

```
{
  'event': 'event_data',
  'event_data': {
    'event_name': 'form_response',
    'type': 'smart answer',
    'tool_name': 'How do I eat more healthily?',
    'section': 'What are your favourite puddings?',
    'text': '500 character long text',
    'text_2': 'More characters after the 500',
    'action': 'Continue'
  }
}
```