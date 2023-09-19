# GA4 filter expand/collapse tracking

The `ga4-event-tracker` is used in finders to add tracking to the filter accordion headings, and the mobile "Filter" toggle button. It tracks if these elements have been expanded or collapsed.

The tracking relies on the `ga4-finder-tracker` running the `setFilterIndexes` function first. This is because we need the indexes to be appended onto the parent <div> for each filter, so that when a filter is expanded or collapsed, we can use this index to track the position that the filter is in the whole list of filters.

Therefore, some code exists in `expander.js` and `option-select.js` to wait for a custom JavaScript event before setting any GA4 attributes. This event is called `ga4-filter-indexes-added`. The `setFilterIndexes` function fires the `ga4-filter-indexes-added` event when it has finished running. When this event has fired, `addFilterButtonTracking` in `ga4-finder-tracker` will then be called, and will set the relevant GA4 attributes on each filter's accordion heading.

The mobile "Filter" toggle button doesn't rely on `setFilterIndexes`, because it only uses an `index_total` in its tracking, which can be grabbed by running `document.querySelectorAll(['data-ga4-filter-parent']).length`. The filter accordion headings however need their specific index position within the filter list, which is why they wait for more specific indexes to be added to the DOM first.

The `addFilterButtonTracking` function in `ga4-finder-tracker`, which adds GA4 attributes to the filter accordion headings, will  grab the `data-ga4-index` value from the trigger button's parent div when run. It will then merge the index attributes onto the existing GA4 object we have constructed for the buttons, and then append the completed GA4 object to the button.