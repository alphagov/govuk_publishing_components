# Google Analytics 4 focus loss tracker

This script is intended for adding GA4 tracking to any element that needs to be tracked when focus is removed from it.

## Basic use

```html
<div
  data-module="ga4-focus-loss-tracker"
  data-ga4-focus-loss='{ "event_name": "filter", "type": "filter" }'>
</div>
```

If the tracker is initialised on an input that has the type `text` or `search`, the tracker will automatically grab the input value and set it as the `text` value in the GA4 JSON. This can be overridden by simply adding your own text value in `data-ga4-focus-loss`.

This module was created to record what users were searching for in a client side DOM search filter. We did not want to track each keypress the user made as that would spam our analytics data. Therefore by tracking when focus is lost on the search input, we can see what keyword was leading to a user navigating off of the search box and onto the result they wanted.