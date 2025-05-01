# Google Analytics 4 finder tracker

This script is used to add GA4 tracking to the GOVUK finders in `finder-frontend` such as https://www.gov.uk/search/all. These finders use client side JavaScript to update their results in response to a change in the search term or filters. Therefore, this tracker hooks in to the JavaScript `change` event that fires whenever a user updates their search. A GA4 schema is then built depending on what change was made to their search. This differs from the `ga4-form-tracker`. Firstly, this is because our finders are all contained in one large form. The `ga4-form-tracker` only allows for one GTM object per `<form>` when we need multiple for each element that can change the search results. Secondly, the `ga4-form-tracker` relies on a JavaScript `submit` event. Our finder pages use a `change` event to update their results.

## Basic use

```html
<form id="myForm">
  <div data-ga4-filter-container>
    <div data-ga4-filter-parent>
        <select data-ga4-change-category="update-filter select" data-ga4-section="Topic">
            <option value="1">Default option</option>
            <option value="2">Option 1</option>
            <option value="3">Option 2</option>
        </select>
    </div>
  </div>
  <input type="search" data-ga4-change-category="update-keyword text" />
</form>
```

```JavaScript
var myForm = document.querySelector('#myForm')

myForm.addEventListener('change', function(event) {
    var ga4ChangeCategory = event.target.closest('[data-ga4-change-category]').getAttribute('data-ga4-change-category')
    window.GOVUK.analyticsGa4.Ga4FinderTracker.trackChangeEvent(event.target, ga4ChangeCategory)
})
```

The tracker is not a regular module. Instead it is called manually where needed. This is to allow the tracker to be called at the appropriate time in our finder's code. In our case, we only call `Ga4FinderTracker.trackChangeEvent()` when our search successfully displays new results to the user. This stops erroring change events (i.e. the user inputting non-dates into the date filter) from being tracked as an "added filter" event. Therefore we only track updates to the finders if they result in a successful update to the search results.

The flow of the tracker is:

1. On the finder results page, tag your elements with the appropriate `data` attributes.

    a. Tag the parent `<div>` or wrapper element for your filters with `data-ga4-filter-container`. This tells our code where to look for filter sections, so that we can set an `index_section` for each filter.

    b. Tag each filter's wrapper element with a `data-ga4-filter-parent` attribute, so that indexes can be set. Tag each individual filter with `data-ga4-section="Topics"` to populate the GA4 section value for that filter.

    c. Tag each element of the form that can trigger a `change` event with a `data-ga4-change-category`. This will contain some metadata about what the change is. The current categories are: `update-filter`, `update-sort`, `clear-all-filters` and `update-keyword`. As well as this, add the type of element that the filter is (further details on what types are tracked is documented below.) This assists with our tracker extracting the value of the filter. For example, a `<select>` element that updates a filter would have `data-ga4-change-category="update-filter select"`. A search box would have `data-ga4-change-category="update-keyword text"`.

2. In the finder's JavaScript code, find where it updates your search results, and call `Ga4FinderTracker.trackChangeEvent()`. Pass through the `event` of the element that triggered the change.

3. The `ga4-finder-tracker` will then grab the "value" of the event target, using the metadata passed through to help categorise what type of element the change came from. The value in this case is the name of the filter that was set, the keyword that was input. For filters, it will also determine whether the change was the filter being "added" or "removed".
For example if the event target is a checkbox, `<input type="checkbox" data-ga4-change-category="update-filter checkbox">`, and it is `checked`, then we know the filter was added. If it isn't `checked`, we know the filter was removed.

4. Using the `data-ga4-change-category`, the value of the event target, and whether it is a removed filter or not, we then build the GTM object and push it to the `dataLayer`.

## Element types tracked

### Checkbox (`<input type="checkbox" />`)

Checkboxes have `data-ga4-change-category="update-filter checkbox"` on them. If a change event is fired on the element, and the checkbox is `checked`, the `update-filter` event will build an "Add filter" GTM Object. If the checkbox is not `checked`, it will build a "Remove filter" GTM Object. The value we grab for a checkbox is the user friendly label associated with the `<input>`.

### Select (`<select>`)

The value we grab from a `<select>` is the user friendly text of the selected option.

Filter selects have  `data-ga4-change-category="update-filter select"` on them.

If the filter `<select>` element changes and is set to their _first option_, we treat this as a "Filter removed" event. This is because the first `<option>` in a `<select>` is their default state in our use case. Therefore if the select has changed, and we're on the first option, we can safely assume we've moved from a "Added filter" option, back to the default option, so it's treated as a "Removed filter."

"Sort by" selects have  `data-ga4-change-category="update-sort select"` on them. They send a separate "Sort event", so checking whether the filter was added or removed is irrelevant in this case.

### Radio buttons (`<input type="radio">`)

Radio buttons have `data-ga4-change-category="update-filter radio"` on them. If the changed radio button is not the _first radio button_ (i.e. the default selection), then, the `update-filter` event will build an "Filter added" GTM Object. If the changed radio button is the _first radio button_, it will build a "Filter removed" GTM Object. This is because the first radio button in a list is typically the default "All XYZ" filter state. The value we grab for a radio button is the user friendly label associated with the `<input>`.

### Date filters with single input field (`<input type="text">`)

Our date filters have `data-ga4-change-category="update-filter text"` on them. The value we grab is the text that is input into its text field. If the text is an empty string, we treat this as a "Filter removed" event, as this means the date was removed. If text is available in the text box, we treat this as a "Filter added" event.

### Date filters with three input fields (day/month/year)
These use the GOV.UK Design System date input pattern/component and have `data-ga4-change-category="update-filter date"` on them. To avoid excessive events and cardinality, despite technically allowing partial values, we expect users to mostly fill in complete dates and only track them as an entire value triggered by all fields being present, and combine the three into a single D/M/Y string. Conversely, it only counts as removed if all fields have been cleared.

### Search keyword changes (`<input type="text">`)

Search boxes have `data-ga4-change-category="update-keyword text"` on them. The value we grab on change is the text that was input into the text box.  Regardless if text is available in the text box, we always treat it as a "search" event. This is because an empty search box is still as search event but it just searches for everything in our database.

The search value is sanitised with PII removal, + characters converted to spaces, spaces and new lines trimmed, and downcasing.


### Clear all filters button

On mobile, there is a "Clear all filters" button. This triggers a `change` event on the whole `<form>` element when clicked. Therefore, we have added `data-ga4-change-category="clear-all-filters"` on the parent `<form>` in our finders. The value pushed to GTM is hard coded in `Ga4FinderTracker` as "Clear all filters", so an element type is not passed through to `data-ga4-change-category` as we don't need to do any value extraction.

### Extending element types

To add additional element types that are not present in `govuk_publishing_components`, you can assign an object to `Ga4FinderTracker.extraSupportedElements` in the following format:

```JavaScript
{
    `elementType`: function (eventTarget, event) {
        return {
            elementValue: string,
            wasFilterRemoved: boolean,
        }
    }
}
```

`extraSupportedElements` will be merged with `defaultSupportedElements`. This element type will then be used if `data-ga4-change-category` is assigned a value of `change-category elementType`.

## Example GTM Objects

```JSON
{
    "event": "event_data",
    "event_data": {
        "event_name": "select_content",
        "type": "finder",
        "text": "Environment",
        "index": {
            "index_section": 2,
            "index_section_count": 5
        },
        "section": "Topic",
        "action": "select"
    },
    "govuk_gem_version": "35.3.1",
}
```

```JSON
{
    "event": "event_data",
    "event_data": {
        "event_name": "search",
        "type": "finder",
        "url": "/search/research-and-statistics",
        "text": "hello world",
        "section": "Search",
        "action": "search"
    },
    "govuk_gem_version": "35.3.1",
}
```
