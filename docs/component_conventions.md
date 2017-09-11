# Component Conventions

## Namespacing

All components must use the `.app-` or `.pub-` namespace with the `c` prefix. The `c` is for component. For example, `.app-c-banner`.

Do not use the `.govuk-c` namespace.

The namespace indicates where a component lives. A single page on GOV.UK could render components from multiple places.

| Prefix | Place |
| -- | -- |
| `.app-c-` | Component lives within the frontend application |
| `.pub-c-` | Component is shared between publishing frontends and lives in static |
| `.govuk-c-` | Component originates from [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) |

## Structure

| Type | Location | Example | Description |
| -- | -- | -- | -- |
| Template | `app/views/components` | `_lead-paragraph.html.erb` | The template logic and markup. The template defines the component’s API. Filename must begin with an underscore. |
| Documentation | `app/views/components/docs` | `lead-paragraph.yml` | [Describes the component](#write-documentation) |
| Styles | `app/assets/stylesheets/components` | `_lead-paragraph.scss` | [Component styles](#styles) |
| Scripts | `app/assets/javascripts/components` | `lead-paragraph.js` | [Javascript enhancements](#javascript) |
| Tests | `test/components` | `lead_paragraph_test.rb` | Unit tests |

## Write documentation

Each component is represented with a single `.yml` file. eg `lead-paragraph.yml`

The `.yml` file must have:

| Property | Required | Description |
| -- | -- | -- |
| filename | Required | Filename of `.yml` file must match component partial name |
| name | Required | Friendly name for component |
| description | Required | One or two sentences summarising the component
| body | Optional | A govspeak markdown block giving guidance for the component |
| accessibility_criteria | Required | A govspeak markdown block listing the accessibility acceptance criteria this component must meet to be accessible |
| examples | Required | Each block represents an example and each example is listed in the component guide. Examples must cover all expected use cases. |

### Example yaml file

```yaml
name: Name of component
description: Short description of component
body: |
  Optional markdown providing further detail about the component
accessibility_criteria: |
  Markdown listing what this component must do to be accessible. For example:

  The banner must:

  - be visually distinct from other content on the page
  - have an accessible name that describes the banner as a notice
universal_accessibility_criteria:
  - link
examples:
  default:
    data:
      some_parameter: 'The parameter value'
    description: |
      This component is used in the following contexts:

      - [the GOV.UK homepage](https://www.gov.uk)
  another_example:
    data:
      some_parameter: 'A different parameter value'
```

#### Accessibility Criteria

Markdown listing what this component must do to be accessible.

Universal accessibility criteria can be included in a list as shown. They are pre-written accessibility criteria that can apply to more than one component, created to avoid duplication. For example, links within components should all accept focus, be focusable with a keyboard, etc.

A component can have accessibility criteria, universal accessibility criteria, or both.

#### Description

An example can have an optional description. This is a govspeak markdown block.

#### Providing context to examples

A context block can be passed to examples. The guide currently supports `right_to_left` and `dark_background` contexts. For example:

```yaml
examples:
  right_to_left_example:
    data:
      some_parameter: 'عربى'
    context:
      right_to_left: true
```

The component guide will wrap the example with a `direction-rtl` class. It is expected that the host application will set the text direction using the class in a parent element using the following CSS:

```css
.direction-rtl {
  direction: rtl;
  text-align: start;
}
```

The component guide will wrap a `dark_background` context example with a `dark-background` class that sets the parent element background color to govuk-blue. The component should either already work on a dark background or contain a param that, when set to `true`, allows it to work against darker colours.

## Styles

With the exception of namespaces, follow the [GOV.UK Frontend CSS conventions](https://github.com/alphagov/govuk-frontend/blob/master/docs/coding-standards/css.md), which describes in more detail our approach to namespaces, linting and BEM (block, element, modifier) CSS naming methodology.

### BEM
`.block {}`

`.block__element {}`

`.block--modifier {}`

`.block__element--modifier {}`

All CSS selectors should follow the BEM naming convention shown above, explained in [more detail here](https://github.com/alphagov/govuk-frontend/blob/master/docs/coding-standards/css.md#bem).

Note: to avoid long and complicated class names, we follow the [BEM guidance](http://getbem.com/faq/#css-nested-elements) that classes do not have to reflect the nested nature of the DOM.

```scss
  // Avoid this:
  .block__elem1__elem2__elem3

  // Instead use:
  .block__elem1
  .block__elem2
  .block__elem3
```

Using BEM means we have confidence in our styles only being applied within the component context, and never interfering with other global styles. It also makes it clearer how HTML elements relate to each other.

Visit the links below for more information:

* [Official BEM Documentation](https://en.bem.info/methodology/naming-convention/#css-selector-naming-convention)
* [Guide on BEM naming conventions](https://webdesign.tutsplus.com/articles/an-introduction-to-the-bem-methodology--cms-19403)

### Linting
All stylesheets must be linted according to [the style rules](https://github.com/alphagov/govuk-lint/blob/master/configs/scss_lint/gds-sass-styleguide.yml) in [govuk-lint](https://github.com/alphagov/govuk-lint).

```
# Lint Sass in your application components using govuk-lint
bundle exec govuk-lint-sass app/assets/stylesheets/components
```

## Javascript

Follow the [GOV.UK Frontend JS conventions](https://github.com/alphagov/govuk-frontend/blob/master/docs/coding-standards/js.md).

Scripts should use the [module pattern provided by govuk_frontend_toolkit](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/javascript.md#modules) and be linted using [StandardJS](https://standardjs.com/).
