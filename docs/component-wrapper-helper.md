# Component wrapper helper

The component wrapper helper is designed to provide a standard way to wrap components so that common options can be passed without having to explicitly define them in the component.

## Basic use

The helper can be added to a component by including the helper and replacing the component parent element as shown. Note that `tag.div` can be replaced with any tag.

```ruby
<%
  component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns)
%>
<%= tag.div(**component_helper.all_attributes) do %>
  component content
<% end %>
```

You must also add this to the component documentation YAML file, in order that component wrapper options are shown in the component guide.

```yml
uses_component_wrapper_helper: true
```

## Passing options

These options can be passed to any component that uses the component wrapper.

- `id` - accepts a string for the element ID attribute
- `data_attributes` - accepts a hash of data attributes
- `aria` - accepts a hash of aria attributes
- `classes` - accepts a space separated string of classes, these should not be used for styling and must be prefixed with `js-`
- `margin_bottom` - accepts a number from `0` to `9` (`0px` to `60px`) using the [GOV.UK Frontend spacing scale](https://design-system.service.gov.uk/styles/spacing/#the-responsive-spacing-scale) (defaults to no margin)
- `role` - accepts a space separated string of roles
- `lang` - accepts a language attribute value
- `open` - accepts an open attribute value (true or false)
- `hidden` - accepts an empty string, 'hidden', or 'until-found'
- `tabindex` - accepts an integer. The integer can also be passed as a string.
- `dir` - accepts 'rtl', 'ltr', or 'auto'.
- `type` - accepts any valid type attribute e.g. 'button', 'submit', 'text'
- `rel` - accepts any valid rel attribute e.g. 'nofollow'
- `target` - accepts a valid target attribute e.g. '_blank'
- `title` - accepts any string
- `draggable` - accepts a draggable attribute value ("true" or "false")
- `name` - accepts a name attribute

To prevent breaking [component isolation](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component_principles.md#a-component-is-isolated-when), passed classes should only be used for JavaScript hooks and not styling. All component styling should be included only in the component itself. Any passed classes should be prefixed with `js-`. To allow for extending this option, classes prefixed with `gem-c-`, `govuk-`, `app-c-`, `brand--`, or `brand__` are also permitted, as well as an exact match of `direction-rtl`, but these classes should only be used within the component and not passed to it.

The helper checks that any passed `id` attribute is valid, specifically that it does not start with a number or contain whitespace or contain any characters other than letters, numbers, and `_` or `-`. It also checks that role and lang attribute values are valid, along with some other checks detailed below.

An example of passing data to a component with the component wrapper:

```ruby
<%= render "govuk_publishing_components/components/example", {
  classes: "js-example",
  data_attributes: {
    module: "example-module",
    other_data_attribute: "other",
  },
  aria: {
    describedby: "element-id",
  },
} %>
```

## Advanced use

The component wrapper includes several methods to make managing options easier, as shown below.

```ruby
<%
  # note that these variables do not explicitly need to be defined, shown here for clarity
  classes ||= ""
  id ||= nil
  data_attributes ||= {}
  aria_attributes ||= {}
  role ||= nil
  local_assigns[:margin_bottom] ||= 4

  component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns)
  component_helper.add_class("gem-c-example govuk-example") # combines the given class with any passed classes
  component_helper.set_id("my-id") # overrides any passed 'id' with this one (can only have one id)
  component_helper.add_data_attribute({ module: "ga4-event-tracker" }) # combines any passed 'data_attributes' with those given, merging duplicate keys, e.g. if `{ module: "ga4-link-tracker", a: "1" }` had been passed, would result in `{ module: "ga4-event-tracker ga4-link-tracker", a: "1" }`
  component_helper.add_aria_attribute({ label: "my-label" }) # works like 'add_data_attribute'
  component_helper.add_role("button") # works like 'add_class'
  component_helper.set_lang("en") # works like 'set_id' (can only have one lang)
  component_helper.set_open(true) # can pass true or false
  component_helper.set_tabindex(1)
  component_helper.set_dir("rtl")
  component_helper.set_type("text")
  component_helper.set_draggable("true")
  component_helper.set_rel("nofollow") # overrides any existing rel
  component_helper.add_rel("noopener") # adds to existing rel
  component_helper.set_target("_blank")
  component_helper.set_title("this is a title")
  component_helper.set_margin_bottom(3) # can pass any number from 1 to 9
%>
<%= tag.div(**component_helper.all_attributes) do %>
  component content
<% end %>
```

### Set and add methods

There are two kinds of methods for options shown above: `set` (e.g. `set_id`) and `add` (e.g. `add_class`). Either or both methods may be available for any option.

Set methods are used to override a passed value with a new one, particularly for situations where the option can be only one value (e.g. `id`). This might be used with conditional logic or because the option should never be changed.

```ruby
<%
  component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns)
  component_helper.set_lang("en") if some_other_option # conditionally set the lang based on other variables
%>
```

```ruby
<%
  component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns)
  component_helper.set_tabindex(-1) # effectively hardcode the option
%>
```

Add methods are used to combine one or more values. This includes adding to anything that has already been passed to the component.

```ruby
<%
  component_helper = GovukPublishingComponents::Presenters::ComponentWrapperHelper.new(local_assigns)
  component_helper.add_class("gem-c-example")
  component_helper.add_class("gem-c-example--large") if size == 'large'
  # class output could be `js-passed-class gem-c-example gem-c-example--large
%>
```
