# Data schemas

Our event and ecommerce schemas are defined in [ga4-schemas.js](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/analytics-ga4/ga4-schemas.js). These schemas define the content and structure for data that is pushed to the dataLayer.

The schemas have been written to allow data to be collected from data attributes on HTML elements without it needing to conform exactly to the schema. This means that:

- the entire schema does not have to be included in data attributes
- nested attributes in the schema do not have to be nested in data attributes
- attributes in data attributes that are not part of the schema will be ignored
- if the structure of the schema needs to change, or new attributes need to be added, this can be done centrally in the schemas file, instead of having to update hundreds of data attributes across the site

For example, if an event to be picked up by the event tracker only requires a few attributes, it can be defined in a data attribute as follows.

```HTML
<div data-ga4-event='{ "section": "hello", "index_link": "1", "not_in_the_schema": "4" }'></div>
```

The event tracker will read this attribute and pass it to the schemas, where it will be checked and inserted into a copy of the schema to create the following for the dataLayer. Note that the `index_link` attribute has been nested automatically inside the `index` attribute. The `event` attribute is set automatically by each tracker according to its own configuration.

```JavaScript
{
  event: "event_data",
  event_data: {
    event_name: undefined,
    type: undefined,
    url: undefined,
    text: undefined,
    index: {
      index_link: "1",
      index_section: undefined,
      index_section_count: undefined
    },
    index_total: undefined,
    section: "hello",
    action: undefined,
    external: undefined,
    method: undefined,
    link_domain: undefined,
    link_path_parts: undefined,
    tool_name: undefined,
    percent_scrolled: undefined,
    video_current_time: undefined,
    length: undefined,
    video_percent: undefined
  }
}
```