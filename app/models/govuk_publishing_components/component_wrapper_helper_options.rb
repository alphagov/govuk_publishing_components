module GovukPublishingComponents
  module ComponentWrapperHelperOptions
    def self.description
      "
This component uses the component wrapper helper. It accepts the following options and applies them to the parent element of the component. See the [component wrapper helper documentation](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component-wrapper-helper.md) for more detail.

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
- `type` - accepts any valid type attribute e.g. 'button', 'submit', 'text'.
- `rel` - accepts any valid rel attribute e.g. 'nofollow'.
- `draggable` - accepts a draggable attribute value (\"true\" or \"false\")
      "
    end
  end
end
