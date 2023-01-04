module GovukPublishingComponents
  module ComponentWrapperHelperOptions
    def self.description
      "
This component uses the component wrapper helper. It accepts the following options and applies them to the parent element of the component. See the [component wrapper helper documentation](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component-wrapper-helper.md) for more detail.

- `component_id` - accepts a string for the element ID attribute
- `component_data` - accepts a hash of data attributes
- `component_aria` - accepts a hash of aria attributes
- `component_class` - accepts a space separated string of classes, these should not be used for styling and must be prefixed with `js-`
      "
    end
  end
end
