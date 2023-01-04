# Component wrapper helper

The component wrapper helper is designed to provide a standard way to wrap components so that common options can be passed without having to explicitly define them in the component.

## Adding to a component

The helper can be added to a component by including the helper and replacing the component parent element as shown. Note that a `div` tag is only used as an example.

```
<% component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns, request) %>

<%= tag.div(**component_helper.component_attributes) do %>
  component content
<% end %>
```

You must also add the following line to the component documentation YAML file, in order that these extra options are shown when viewing the component in the component guide.

```
uses_component_wrapper_helper: true
```

## Passing options

The component wrapper helper accepts the following options.

- `component_id` - accepts a string for the element ID attribute
- `component_data` - accepts a hash of data attributes
- `component_aria` - accepts a hash of aria attributes
- `component_class` - accepts a space separated string of classes, these should not be used for styling and must be prefixed with `js-`

### Data and aria

The `component_data` and `component_aria` options must be Ruby hashes of the form that would normally be passed to the `tag` method. For example:

```
<%= render "govuk_publishing_components/components/example", {
  component_data: {
    module: "example-module",
    other_data_attribute: "other",
  },
  component_aria: {
    describedby: "element-id",
  }
} %>
```

### Class

Classes can be passed to components. To prevent breaking [component isolation](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component_principles.md#a-component-is-isolated-when), passed classes should only be used for JavaScript hooks and not styling. All component styling should be included only in the component itself.

Any passed classes should be prefixed with `js-`. To allow for extending this option, classes prefixed with `gem-c-` or `govuk-` are also permitted.

```
<%= render "govuk_publishing_components/components/example", {
  component_class: "js-example"
} %>
```

## Extending options

The helper is designed to collect any options passed through `local_assigns` to minimise the amount of code required in the component. In many situations it will be necessary to include or override specific values in the component template, instead of always passing them into the component.

The helper includes additional methods to make this possible.

- `add_class("gem-c-example govuk-example")` - combines the given class with any passed classes, e.g. if `js-hook` had been passed, the result would be `js-hook gem-c-example govuk-example`
- `set_id("my-id")` - overrides any passed ID with this one (IDs can't be combined)
- `add_data_attribute({ module: "ga4-event-tracker" })` - combines the given data attributes with any that have been passed, merging duplicate keys, e.g. if `{ module: "gem-track-click", a: "1" }` had been passed, the result would be `{ module: "ga4-event-tracker gem-track-click", a: "1" }`
- `add_aria_attribute()` - works the same as `add_data_attribute`

This is an example component template using some of these methods.

```
<%
  helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns)
  helper.add_class("gem-c-my-component")
  helper.add_data_attribute({ module: "gem-track-click" })
%>

<%= tag.div(**component_helper.component_attributes) do %>
  component content
<% end %>
```

This is an example call to this component.

```
<%= render "govuk_publishing_components/components/example", {
  component_class: "js-hook",
  component_data: {
    module: "another-module",
    example: "example"
  }
} %>
```

This would be the result.

```
<div class="gem-c-my-component js-hook" data-module="gem-track-click another-module" data-example="example">
  component content
</div>
```

## Component auditing
