# Google Analytics ecommerce tracker (i.e. search)

The ecommerce tracker script tracks search results in finder applications (e.g. search) and sends them to the `dataLayer`. There are 3 scenarios that result in a push to the `dataLayer`:

- on page load
- the application of filters and/or sorting (i.e. a dynamic page update)
- clicking a search result

## Basic use

In `analytics-ga4.js`:

```JavaScript
//= require ./analytics-ga4/ga4-ecommerce-tracker
```

In `live_search.js` in the `finder-frontend` repository (https://github.com/alphagov/finder-frontend/blob/main/app/assets/javascripts/live_search.js#L129):

```JavaScript
GOVUK.analyticsGa4.Ga4EcommerceTracker.init(referrer) 
```

The init() function takes a string (`referrer`) as an optional parameter to detect whether dynamic updates have been made to the page via AJAX requests. The presence of the `referrer` parameter is used to determine what is pushed to the dataLayer. If a parameter is not passed, this indicates a fresh page load (e.g. by refreshing the page or using the pagination) and that the page has not been dynamically updated via JS.

Unlike the other GA4 tracking scripts in this repository, ecommerce tracking is not initialised by `init-ga4.js`. Instead, it is initialised by the JS that runs on finder pages (specifically, the `LiveSearch.prototype.Ga4EcommerceTracking()` function). It is called:

On page load (where no parameters are passed) e.g.

```
this.Ga4EcommerceTracking()
```

And whenever search results are updated (where a string parameter is passed) e.g.

```
this.Ga4EcommerceTracking(this.previousSearchUrl)
```

Note: ecommerce tracking will only run if there is an element which has the `data-ga4-ecommerce` attribute. If the script can't find an element with this attribute, it will stop running.

## Ecommerce tracking

### On page load

Upon initialisation, the ecommerce tracker script will first detect whether a new page has been loaded (this is determined by the presence of the `referrer` parameter that `LiveSearch.prototype.Ga4EcommerceTracking()` passes to `Ga4EcommerceTracker.init()`). If `Ga4EcommerceTracker.init()` does *not* receive a parameter, this indicates that a new page has been loaded (i.e. the user has conducted a new search or has navigated to a new page using the pagination) and the initial set of search results that is loaded is pushed to the `dataLayer`.

For example, if a user searches for "tax", the following object will be pushed to the `dataLayer` on page load:

```JSON
{
    "event": "search_results",
    "search_results": {
        "event_name": "view_item_list",
        "results": 65426,
        "sort": "Relevance",
        "term": "tax",
        "ecommerce": {
            "items": [
                {
                    "index": 1,
                    "item_id": "/vehicle-tax",
                    "item_list_name": "Search"
                },
                {
                    "index": 2,
                    "item_id": "/income-tax",
                    "item_list_name": "Search"
                },
                {
                    "index": 3,
                    "item_id": "/income-tax/overview",
                    "item_list_name": "Search"
                },
                "etc..."
            ]
        }
    }
}
```

### Application of filters and/or sorting

If a user applies a filter (such as a topic or content type) or changes the sorting option (such as sorting by newest), the list of search results will be updated accordingly and this will result in another push to the `dataLayer`. The object that is pushed follows the same structure as the object described in the 'On page load' section above. The only differences are that the results in the `search_results.ecommerce.items` array will change to reflect the updated list of search results and, if a new sorting option has been applied, the `search_results.sort` property will change to reflect what was selected.

Additionally, updating the search results causes the URL to change and this also needs to be tracked. For example, if the user searches for "tax", the initial URL would be:

`https://www.gov.uk/search/all?keywords=tax&order=relevance`

Then if the user applies the "Corporate information" topic filter and sorts by newest, the URL would become:

`https://www.gov.uk/search/all?keywords=tax&level_one_taxon=a544d48b-1e9e-47fb-b427-7a987c658c14&order=updated-newest`

To track these changes to the URL, a new `page_view` object is sent to the `dataLayer` along with the updated search results so that the user journey can be tracked. In addition to this, PA's also need to be able to differentiate between a dynamic page update and a fresh page load; this is why the `referrer` parameter is passed on dynamic page updates and allows the `page_view.referrer` and `page_view.dynamic` to be set appropriately.

Note: currently, filters that have been applied are not tracked; only the `search_results.ecommerce.items` and `search_result.sort` properties are updated.

### Clicking a search result

If a user clicks on a search result, the following object will be pushed to the `dataLayer`:

```JSON
{
    "event": "search_results",
    "event_data": {
        "external": "false"
    },
    "search_results": {
        "event_name": "select_item",
        "results": 65426,
        "sort": "Relevance",
        "term": "tax",
        "ecommerce": {
            "items": [
                {
                    "index": 1,
                    "item_id": "/vehicle-tax",
                    "item_content_id": "fa748fae-3de4-4266-ae85-0797ada3f40c",
                    "item_list_name": "Search",
                    "item_name": "Tax your vehicle"
                }
            ]
        }
    }
}
```

In this case, the `search_results.ecommerce.items` array will only ever contain 1 item (i.e. the clicked result) with the addition of the `item_name` property. In addition, the `event_data.external` property is included to indicate whether the search result is an internal (i.e. within gov.uk) or external (e.g. www.google.co.uk) link.

### Nullifying the ecommerce object

Each time the `ecommerce` object is pushed to the `dataLayer`, it needs to be nullified first. This results in 2 pushes to the `dataLayer`; the first push contains the nullified `ecommerce` object and the second contains the `ecommerce` object with the data. Nullifying the `ecommerce` object clears it and prevents multiple ecommerce events on a page from affecting each other. This is considered best practice (further details can be found here: https://developers.google.com/analytics/devguides/collection/ua/gtm/enhanced-ecommerce).
