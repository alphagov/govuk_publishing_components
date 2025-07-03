# Google Analytics 4 search tracker

This module allows us to consistently track usage of search across the several different search
fields from which a user can initiate a search on GOV.UK:
- the layout super navigation header
- the homepage
- the search page itself

It is not used by the legacy UI for finders, which triggers search events on user input (rather than
waiting for form submission) as part of its "live search" functionality.

## How it works
Annotate a `<form>` element containing a search field (`<input type="search">`, for example the
`search` or `search_with_autocomplete` publishing components) with the module and its required data
fields:

```html
<form
  data-module="ga4-search-tracker"
  data-ga4-search-type="site search"
  data-ga4-search-url="/search"
  data-ga4-search-section="section"
  data-ga4-search-index-section="19"
  data-ga4-search-index-section-count="89"
>
```

When the form is submitted, a `search` event will be tracked containing:
- an action according to the user's interaction with the form:
  - `search` if they have interacted with the search term field
  - `filter` if they have interacted with any other field in the form (but not the search term
    field)
  - `unchanged` otherwise, for example if they have just (re-)submitted the form
- the type, URL, section, index section, and index section count fields based on the data attributes
  outlined above
- the state (text) of the search field contained within
- information about the user's interaction with autocomplete (if present), based on attributes set
  by the `search_with_autocomplete` component

If `data-ga4-search-input-name` (optional) is defined, then the event `action` will only be set to `search` if the search field has the same name as `data-ga4-search-input-name`.
