# Google Analytics 4 form change tracker

This script is intended for adding GA4 tracking to form changes. It is triggered on the 'change' event of the form. It depends upon the main GA4 analytics code to function.

## Basic use

For the following form:

```html
<form
  data-module="ga4-form-change-tracker"
>
  <fieldset>
    <label for="text-input">What is your favourite pudding?</label>
    <input id="text-input" name="text-input" type="text">
  </fieldset>
  <fieldset>
    <label for="select">Choose your favourite ice cream flavour(s)</label>
    <select multiple id="select" name="select">
      <option value="chocolate">Chocolate</option>
      <option value="banana">Banana</option>
      <option value="strawberry">Strawberry</option>
    </select>
  </fieldset>
  <fieldset>
    <legend>What is your favourite cake?</label>
    <div>
      <label for="checkbox-1">Victoria</label>
      <input id="checkbox-1" type="checkbox" name="favourite-cake" value="victoria">
    </div>
    <div>
      <label for="checkbox-2">Carrot</label>
      <input id="checkbox-2" type="checkbox" name="favourite-cake" value="carrot">
    </div>
    <div>
      <label for="checkbox-3">Battenburg</label>
      <input id="checkbox-3" type="checkbox" name="favourite-cake" value="battenburg">
    </div>
  </fieldset>
  <fieldset data-ga4-redact>
    <legend>What is your favourite biscuit?</label>
    <div>
      <label for="radio-1">Digestive</label>
      <input id="radio-1" type="radio" name="favourite-biscuit" value="digestive" data-ga4-redact-permit>
    </div>
    <div>
      <label for="radio-2">Bourbon</label>
      <input id="radio-2" type="radio" name="favourite-biscuit" value="bourbon">
    </div>
  </fieldset>
</form>
```

If a field is changed then an event will fire in the following format:

```json
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "SECTION OF INPUT",
    "text": "VALUE OF INPUT"
    "action": "select|remove"
  }
}
```

When an input is changed or a selection from a group is chosen:

| Target | Section | Change | Text | Action |
| ------ | ------- | ------ | ---- | ------ |
| `input[type=text]` | What is your favourite pudding? | `value="Pie"` | 3 | select
| `select` | Choose your favourite ice cream flavour(s) | `<option value="chocolate" selected>` | Chocolate | select
| `input[type=checkbox]/input[type=radio]` | What is your favourite cake? | `<input id="checkbox-1" selected>` | Victoria | select
| `fieldset[data-ga4-redact] > input[type=checkbox]/input[type=radio]` | What is your favourite biscuit? | `<input id="radio-1" selected>` | REDACTED | select

For `input[type=text]`, the character count is returned instead of the value. This is to prevent inclusion of PII and the size of the event being too large for GA4 to record (if the `text` is too large).

For `input[type=radio]` and `input[type=checkbox]` within a container with a data-attribute of `data-ga4-redact` a value of "[REDACTED]" is returned in place of the label text unless the input includes a `data-ga4-redact-permit` data-attribute.

When a previously selected choice from a group is deselected:

| Target | Section | Change | Text | Action |
| ------ | ------- | ------ | ---- | ------ |
| `select` | Choose your favourite ice cream flavour(s) | `<option value="chocolate">` | Chocolate | remove
| `input[type=checkbox]` | What is your favourite cake? | `<input id="checkbox-1">` | Victoria | remove

If the changed element has a `data-ga4-index-section` or is a descendent of an element with a `data-ga4-index-section` attribute in the format:

```html
<fieldset data-ga4-index-section="{'index_section': 1, 'index_section_count': 1}">
```
this will be included in the event:

```json
{
  "event": "event_data",
  "event_data": {
    "index": {
      "index_section": 1,
      "index_section_count": 1
    },
    "event_name": "select_content",
    "section": "SECTION OF INPUT",
    "text": "VALUE OF INPUT"
    "action": "select|remove"
  }
}
```

By default `section` is determined by the label of the field or the legend of the fieldset that the field is within. This can be overridden by using `ga4-form-section` on a parent node:

```html
  <fieldset ga4-form-section="When was the last time you had desert?"></fieldset>
```

which will result in the following event:

```json
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "When was the last time you had desert?",
    "text": "VALUE OF INPUT"
    "action": "select|remove"
  }
}
```

This is useful for forms that have groupings of `fieldset` with multiple `input` within (such specifying a date and time ).

For the date component, an event will only be fired when all the fields of the date component have been filled in.

