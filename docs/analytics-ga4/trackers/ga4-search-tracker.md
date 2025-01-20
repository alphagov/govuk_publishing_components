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

When the form is submitted, a `search` event will be tracked if any of the following are true:
- the user has interacted with the search term/keyword field (by typing)
- the user has interacted with a filter (by typing, selecting, checking, ...)
- the search term/keyword field was originally empty (and still is) - this lets us track "blank" search usage

This event contains the following:
- an `action` of either `search` (if the keywords/term field was modified) or `filter` (if only
  fields other than the keywords/term field was modified)
- the type, URL, section, index section, and index section count fields based on the data attributes
  outlined above
- the state (text) of the search field contained within
- information about the user's interaction with autocomplete (if present), based on attributes set
  by the `search_with_autocomplete` component
