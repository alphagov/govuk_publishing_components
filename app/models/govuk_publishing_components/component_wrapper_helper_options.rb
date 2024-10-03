module GovukPublishingComponents
  module ComponentWrapperHelperOptions
    def self.description
      "
This component uses the component wrapper helper. It accepts the following options and applies them to the parent element of the component. See the [component wrapper helper documentation](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component-wrapper-helper.md) for more detail.

- `id` - accepts a string for the element ID attribute
- `data_attributes` - accepts a hash of data attributes
- `aria` - accepts a hash of aria attributes
- `classes` - accepts a space separated string of classes, these should not be used for styling and must be prefixed with `js-`
- `role` - accepts a space separated string of roles
- `lang` - accepts a language attribute value
- `open` - accepts an open attribute value (true or false)
- `hidden` - accepts an empty string, 'hidden', or 'until-found'
      "
    end
  end
end
