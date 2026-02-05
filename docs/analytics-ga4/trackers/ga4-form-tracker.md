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

The script will automatically collect the answer submitted in the `text` field. For questions where multiple answers are possible, these will be comma separated. Where the answer is a text input, the value given is replaced with `[REDACTED]`, to avoid collecting personally identifiable information.

## Options for `text` field

There are several optional data attributes, which will enable different output for the `text` field.


| Data attribute | Element apply to | Description | Before | After |
| -------- | ------- | -------- | ------- | ------- |
| `data-ga4-form-include-text`  | `form` | Prevents redaction of text inputs  | `[REDACTED],[REDACTED]` | `Text input value,Another text input value` |
| `data-ga4-form-include-input`  | `input[type=text]` | Prevents redaction of specific text input  | `[REDACTED],[REDACTED]` | `[REDACTED],Specific text input value` |
| `data-ga4-form-use-text-count`  | `form` | Uses character count instead of text input value | `[REDACTED]` | `24` |
| `data-ga4-form-use-select-count`  | `form` | Uses number of selected options instead of selected options values  | `yoghurt,pie,trifle` | `3` |
| `data-ga4-form-record-json`  | `form` | Uses JSON format with label of input as key | `yoghurt,ice cream,trifle` | `{ "What are your favourite cold puddings?": "yoghurt,ice cream,trifle" }` |
| `data-ga4-form-no-answer-undefined` | `form` | Use `undefined` instead of `No answer given` for empty inputs | `"No answer given"` | `undefined` |

These can be used in combination as well as separately.

## Options for `radio` and `checkbox` fields

There is the optional `data-ga4-redact` data-attribute for the containing `fieldset` element, which will redact the output for the `radio` and `checkbox` fields unless the input has a `data-ga4-redact-permit` data-attribute.

| Data attribute | Element apply to | Description | Before | After |
| `data-ga4-redact` | `fieldset` | Redacts value for radio and checkbox inputs | `Value 1,Value 2` | `[REDACTED],[REDACTED]` |
| `data-ga4-redact-permit` | `input` | Allows value for that radio/checkbox input | `Value 1,Value 2` | `[REDACTED],Value 2` |

Additionally, there is a `data-ga4-form-split-response-text` attribute. If this is set on the form then the `text` value in the dataLayer will be split into 5 fields to overcome the GA4 500 character limit:

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

## Options for `label`

In the case of a JS enhanced field (for example the JS enhanced File Upload component) which hides the actual `input` and changes its `id`, you can set `data-ga4-hidden-input` on the `label` to the `id` of that concealed `input`.