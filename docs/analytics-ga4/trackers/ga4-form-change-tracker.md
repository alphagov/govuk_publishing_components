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
      <label for="radio-1">Victoria</label>
      <input id="radio-1" type="checkbox" name="favourite-cake" value="victoria">
    </div>
    <div>
      <label for="radio-2">Carrot</label>
      <input id="radio-2" type="checkbox" name="favourite-cake" value="carrot">
    </div>
    <div>
      <label for="radio-3">Battenburg</label>
      <input id="radio-3" type="checkbox" name="favourite-cake" value="battenburg">
    </div>
  </fieldset>
</form>
```

If the `input` field is changed to `pie` then on blur the following event will fire:

```
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "What is your favourite pudding?",
    "text": 3,
    "action": "select"
  }
}
```

When "Chocolate" is selected from `select` then on blur the following event will fire:

```
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "Choose your favourite ice cream flavour",
    "text": "Chocolate",
    "action": "select"
  }
}
```

When "Chocolate" is deselected from `select` then the following event will fire:

```
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "Choose your favourite ice cream flavour",
    "text": "Chocolate",
    "action": "remove"
  }
}
```
When "Victoria" is selected from the `checkbox` group then the following event will fire:

```
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "What is your favourite cake?",
    "text": "Victoria",
    "action": "select"
  }
}
```

`radio` inputs will also fire this event on selection.

If "Victoria" is deselected from the `checkbox` group then the following event will fire:

```
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "What is your favourite cake?",
    "text": "Victoria",
    "action": "remove"
  }
}
```

If `data-ga4-index-section` is present on the changed input:

```html
  <input id="text-input" name="text-input" type="text" data-ga4-index-section="{'index_section': 1, 'index_section_count': 2}">
```

or in a parent `fieldset`

```html
  <fieldset data-ga4-index-section="{'index_section': 2, 'index_section_count': 2}">
    <legend>What is your favourite cake?</label>
    <div>
      <label for="radio-1">Victoria</label>
      <input id="radio-1" type="checkbox" name="favourite-cake" value="victoria">
    </div>
    <div>
      <label for="radio-2">Carrot</label>
      <input id="radio-2" type="checkbox" name="favourite-cake" value="carrot">
    </div>
    <div>
      <label for="radio-3">Battenburg</label>
      <input id="radio-3" type="checkbox" name="favourite-cake" value="battenburg">
    </div>
  </fieldset>
```

then the `index` will be included in the resulting event:

```
{
  "event": "event_data",
  "event_data": {
    "index": {
      "index_section": 1,
      "index_section_count": 2
    },
    "event_name": "select_content",
    "section": "Choose your favourite ice cream flavour",
    "text": "Chocolate",
    "action": "select"
  }
}
```

```
{
  "event": "event_data",
  "event_data": {
    "index": {
      "index_section": 2,
      "index_section_count": 2
    },    
    "event_name": "select_content",
    "section": "What is your favourite cake?",
    "text": "Victoria",
    "action": "select"
  }
}
```

For a form with a date:

```html
<form
  data-module="ga4-form-change-tracker"
>
  <fieldset class="govuk-date-input">
    <legend>When did you last have pudding?</legend>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label for="date_1i" class="gem-c-label govuk-label">Day</label>
        <input class="gem-c-input govuk-input govuk-input--width-4" name="date(1i)" id="date_1i" type="text">
      </div>
    </div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label for="date_2i" class="gem-c-label govuk-label">Month</label>
        <input class="gem-c-input govuk-input govuk-input--width-4" name="date(2i)" id="date_2i" type="text">
      </div>
    </div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label for="date_3i" class="gem-c-label govuk-label">Year</label>
        <input class="gem-c-input govuk-input govuk-input--width-4" name="date(3i)" id="date_3i" type="text">
      </div>
    </div>
  </fieldset>    
</form>
```
an event will only fire if all the date fields are filled in:

```
{
  "event": "event_data",
  "event_data": {
    "event_name": "select_content",
    "section": "When did you last have pudding?",
    "text": 23/10/2025,
    "action": "select"
  }
}
```