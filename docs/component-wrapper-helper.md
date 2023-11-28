# Component wrapper helper

The component wrapper helper is designed to provide a standard way to wrap components so that common options can be passed without having to explicitly define them in the component.

## Adding to a component

The helper can be added to a component by including the helper and replacing the component parent element as shown. Note that a `div` tag is only used as an example.

```Ruby
<% component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns) %>

<%= tag.div(**component_helper.all_attributes) do %>
  component content
<% end %>
```

You must also add the following line to the component documentation YAML file, in order that these extra options are shown when viewing the component in the component guide.

```Ruby
uses_component_wrapper_helper: true
```

Since the wrapper provides functionality and tests for various attributes, any existing tests that would now be duplicate can be removed (for example, if there is already a test for passing `data_attributes` to the parent element of the component).

To test that the wrapper is installed and continues to be installed as expected, the following test can be added to the component. The minimum data required to make the component render will need to be added to `test_data`.

```Ruby
it "has the component wrapper installed correctly" do
  test_data = {
    component_wrapper_test: true,
  }

  render_component(test_data)
  assert_select ".gem-c-nameofcomponent[data-componentwrappertest='component wrapper installed']"
end
```

## Passing options

The component wrapper helper accepts the following options.

- `id` - accepts a string for the element ID attribute
- `data_attributes` - accepts a hash of data attributes
- `aria` - accepts a hash of aria attributes
- `classes` - accepts a space separated string of classes, these should not be used for styling and must be prefixed with `js-`
- `role` - accepts a space separated string of roles
- `lang` - accepts a language attribute value

The helper checks that any passed `id` attribute is valid, specifically that it does not start with a number or contain whitespace or contain any characters other than letters, numbers, and `_` or `-`. It also checks that role and lang attribute values are valid, along with some other checks detailed below.

### Data and aria

The `data_attributes` and `aria` options must be Ruby hashes of the form that would normally be passed to the `tag` method. For example:

```Ruby
<%= render "govuk_publishing_components/components/example", {
  data_attributes: {
    module: "example-module",
    other_data_attribute: "other",
  },
  aria: {
    describedby: "element-id",
  }
} %>
```

The helper checks that passed aria attributes are valid, based on a hard coded list.

### Classes

Classes can be passed to components. To prevent breaking [component isolation](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component_principles.md#a-component-is-isolated-when), passed classes should only be used for JavaScript hooks and not styling. All component styling should be included only in the component itself.

Any passed classes should be prefixed with `js-`. To allow for extending this option, classes prefixed with `gem-c-` or `govuk-` are also permitted, but should only be used within the component and not passed to it.

```Ruby
<%= render "govuk_publishing_components/components/example", {
  classes: "js-example"
} %>
```

## Extending options

The helper is designed to collect any options passed through `local_assigns` to minimise the amount of code required in the component. In many situations it will be necessary to include or override specific values in the component template, instead of always passing them into the component.

The helper includes additional methods to make this possible.

- `add_class("gem-c-example govuk-example")` - combines the given class with any passed classes, e.g. if `js-hook` had been passed, the result would be `js-hook gem-c-example govuk-example`
- `set_id("my-id")` - overrides any passed ID with this one (IDs can't be combined)
- `add_data_attribute({ module: "ga4-event-tracker" })` - combines the given data attributes with any that have been passed, merging duplicate keys, e.g. if `{ module: "gem-track-click", a: "1" }` had been passed, the result would be `{ module: "ga4-event-tracker gem-track-click", a: "1" }`
- `add_aria_attribute()` - works the same as `add_data_attribute`
- `add_role()` - works the same as `add_class`
- `set_lang()` - works the same as `set_id`

This is an example component template using some of these methods.

```Ruby
<%
  helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns)
  helper.add_class("gem-c-my-component")
  helper.add_data_attribute({ module: "gem-track-click" })
%>

<%= tag.div(**component_helper.all_attributes) do %>
  component content
<% end %>
```

This is an example call to this component.

```Ruby
<%= render "govuk_publishing_components/components/example", {
  classes: "js-hook",
  data_attributes: {
    module: "another-module",
    example: "example"
  }
} %>
```

This would be the result.

```Ruby
<div class="gem-c-my-component js-hook" data-module="gem-track-click another-module" data-example="example">
  component content
</div>
```
