# Google Analytics 4 smart answer results (Cost of Living) tracker

This script is intended for adding GA4 tracking to the Cost of Living smart answer results.

## Overview

```html
<div data-module="ga4-smart-answer-results-tracker" data-ga4-list-title="Title of smart answer">
    <span id="result-count">5 results</span>
    <a href="/example-smart-answer-result" data-ga4-ecommerce-path="/example-smart-answer-result" data-ga4-ecommerce-index="1">Example smart answer result</a>
    ... remaining smart answer results
</div>
```

The module is initialised on the parent element and results that are contained within the module (i.e. child elements) are tracked.

Once initialised, the smart answer results tracker will call `window.GOVUK.analyticsGa4.core.ecommerceHelperFunctions.populateEcommerceSchema()`.
The `populateEcommerceSchema()` function takes an object parameter containing the module (passed as `data.element`) and the id of the element containing the amount of results returned (passed as `data.resultsId`). An optional `event` parameter can also be passed (passed as `data.event`), which is used to differentiate between a page load (where all results are tracked) and a click event (where only the clicked result is tracked - please see 'Clicking a result' for further details).

`populateEcommerceSchema()` will then build the ecommerce object using the attributes listed in the HTML snippet above before sending the object to the `dataLayer`.
In the example above, the following would be pushed to the dataLayer:

```
{
  'event': 'search_results',
  'search_results': {
    'event_name': 'select_item',
    'results': 5,
    'ecommerce': {
      'items': [
        {
          'index': 1,
          'item_id': '/example-smart-answer-result',
          'item_list_name': [Title of smart answer]
        },
        ... remaining smart answer results
      ]
    }
  }
}
```

## Clicking a result

When a result is clicked, `populateEcommerceSchema()` is called with the `data.event` parameter. The presence of an `data.event` parameter indicates that is a click event and a slightly different object is built. If the result in the example above were clicked, the following would be sent to the `dataLayer`:

```
{
  'event': 'search_results',
  'event_data': {
      'external': 'false'
    },
  'search_results': {
    'event_name': 'select_item',
    'results': 5,
    'ecommerce': {
      'items': [
        {
          'index': 1,
          'item_id': '/example-smart-answer-result',
          'item_list_name': [Title of smart answer],
          'item_name': 'Example smart answer result'
        }
      ]
    }
  }
}
```
