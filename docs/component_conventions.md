# Component Conventions

## Namespacing

All components must use a namespace with a `c` as part of the namespace -- the `c` is for component. For example `.app-c-banner`.

Do not use the `.govuk-` namespace.

The namespace indicates where a component lives. A single page on GOV.UK could render components from multiple places.

| Prefix | Place |
| -- | -- |
| `.app-c-` | Component lives within the frontend application |
| `.gem-c-` | Component originates from the govuk_publishing_components gem |
| `.govuk-` | Component originates from [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) |

## Structure

| Type | Location | Example | Description |
| -- | -- | -- | -- |
| Template | `app/views/components` | `_my_comp.html.erb` | [Template logic and markup](#template) |
| Documentation | `app/views/components/docs` | `my_comp.yml` | [Describes the component](#write-documentation) |
| Styles | `app/assets/stylesheets/components` | `_my-comp.scss` | [Component styles](#styles) |
| Print styles | Include in screen styles |  | [Print styles](#print-styles) |
| Images | `app/assets/images/govuk_publishing_components` | `my-comp.png` | [Images](#images) |
| Scripts | `app/assets/javascripts/components` | `my-comp.js` | [JavaScript enhancements](#javascript) |
| Tests | `spec/components` | `my_comp_spec.rb` | [Unit tests](#tests) |
| JavaScript tests | `spec/javascripts/components` | `my-comp-spec.js` | [Unit tests](#tests) |
| Helpers | `lib/govuk_publishing_components/presenters` | `my_comp_helper.rb` | [Helpers](#helpers) |

## Template

The template logic and markup. The template defines the component’s API. Filename must begin with an underscore.

If complex logic is required this should be handled using a [helper](#helpers).

Example:

```erb
<%
  options ||= []
  id ||= false
  helper = GovukPublishingComponents::Presenters::MyComponentHelper.new(options)
%>

<% if options.any? %>
  <div class="govuk-something" id="<%= id %>">
    <h2>An example component</h2>
    <%= helper.someContent %>
  </div>
<% endif %>
```

If a component includes a heading, consider including an option to control the heading level (see the [heading component](https://components.publishing.service.gov.uk/component-guide/heading/specific_heading_level) for example).

Components can use other components within their template, if required (see the [input component](https://github.com/alphagov/govuk_publishing_components/blob/main/app/views/govuk_publishing_components/components/_input.html.erb#L37) for example).

Complex components can be split into smaller partials to make them easier to understand and maintain (see the [feedback component](https://github.com/alphagov/govuk_publishing_components/blob/main/app/views/govuk_publishing_components/components/_feedback.html.erb) for example).

Components should not have an option to include arbitrary classes as this could violate the principle of isolation. If there is a requirement for a styling variation on a component this should be included as an option e.g. `small: true`.

## Write documentation

Each component is represented with a single `.yml` file. eg `lead_paragraph.yml`

The `.yml` file must have:

| Property | Required | Description |
| -- | -- | -- |
| filename | Required | Filename of `.yml` file must match component partial name |
| name | Required | Friendly name for component |
| description | Required | One or two sentences summarising the component
| body | Optional | A govspeak markdown block giving guidance for the component |
| accessibility_criteria | Required | A govspeak markdown block listing the [accessibility acceptance criteria](accessibility_acceptance_criteria.md) this component must meet to be accessible |
| examples | Required | Each block represents an example and each example is listed in the component guide. Examples must cover all expected use cases. |

### Example YAML file

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
shared_accessibility_criteria:
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

#### YAML configuration for a component which accepts a block

Some components can accept a block as an argument:

```erb
<%= render "my-accepts-block-component", { param: value }, do %>
  <span>Some text</span>
<% end %>
```

To configure the block in the component YAML file you should specify
a `block` key in the example data:

```yaml
examples:
  default:
    data:
      some_parameter: 'The parameter value'
      block: |
        <span>Some text</span>
```

#### YAML configuration for components that need contextual HTML

If a component is only visible, or behaves differently, in a certain context the examples for it can be embedded within HTML using the embed option:

```erb
<button class="trigger-for-component">Click me</button>
<%= render "my-hidden-by-default-component", { param: value } %>
```

To configure a HTML embed in the component YAML file you can specify `embed` at the root or individual examples:

```yaml
embed: |
  <button class="trigger-for-component">Click me<button>
  <%= component %>
examples:
  default:
  different_embed_example:
    embed: |
      <button class="different-trigger-for-component">Click me<button>
      <%= component %>
```

#### [Accessibility Acceptance Criteria](accessibility_acceptance_criteria.md)

Markdown listing what this component must do to be accessible.

[Shared accessibility criteria](https://github.com/alphagov/govuk_publishing_components/blob/main/app/models/govuk_publishing_components/shared_accessibility_criteria.rb) can be included in a list as shown. They are pre-written accessibility criteria that can apply to more than one component, created to avoid duplication. For example, links within components should all accept focus, be focusable with a keyboard, etc.

A component can have accessibility criteria, shared accessibility criteria, or both.

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

With the exception of namespaces, follow the [GOV.UK Frontend CSS conventions](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/css.md), which describes in more detail our approach to namespaces, linting and BEM (block, element, modifier) CSS naming methodology.

Components can rely on classes from GOV.UK Frontend to allow for modification that build on top of the styles from the Design System. This follows the [recommendations for extending](https://design-system.service.gov.uk/get-started/extending-and-modifying-components/#small-modifications-to-components) from the Design System guide.

For example, extending the button from GOV.UK Frontend could be done like so:

```html
<button class="govuk-button gem-c-button--inverse">
  Inverse button
</button>
```

This makes it clear what the base component is, what the modifier is, and where the modifications are coming from.


### BEM
`.block {}`

`.block__element {}`

`.block--modifier {}`

`.block__element--modifier {}`

All CSS selectors should follow the BEM naming convention shown above, explained in [more detail here](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/css.md#block-element-modifier-bem).

Note: to avoid long and complicated class names, we follow the [BEM guidance](http://getbem.com/faq/#css-nested-elements) that classes do not have to reflect the nested nature of the DOM. We also try to avoid nesting classes too deeply so that styles can be overridden if needed.

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

### Layout

New components should be built with a bottom margin and no top margin.

A standard for options to control this spacing has [not been decided upon yet](https://github.com/alphagov/govuk_publishing_components/pull/292), although it is likely we will adopt something using the [Design System spacing](https://design-system.service.gov.uk/styles/spacing/).

### Print styles

Print styles should be included in the main stylesheet for a component, using the print media query as shown below.

```Sass
.gem-c-example {
  background: red;

  @include govuk-media-query($media-type: print) {
    background: none;
  }
}
```

### Print style conventions

Ensure that colours are reset to black using the print specific variable `$govuk-print-text-colour`, for example:

- Text: `color: $govuk-print-text-colour;`
- Borders: `border-color: $govuk-print-text-colour;`

Some elements such as background images do not print by default in most browsers. To force these to print as intended, use the CSS property `print-color-adjust`, for example:
```
  .gem-c-organisation-logo__container {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
```

### Print styles helpers

There are currently three helper classes available for controlling print output in [`_print_support.scss`](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/stylesheets/govuk_publishing_components/lib/_print_support.scss). These helper classes should be added to a component's view template in the appropriate places.

#### Full page width columns

**`.gem-print-columns-none`**

A helper class for removing column layouts when printing. This should be applied to row/column layouts, by adding the class to elements with a `govuk-grid-row` class. The columns will then print at the full width of the page.

Note that only the immediate child columns will be affected. If a child column also contains a row/column layout of further elements, these will be unaffected and will retain their existing column layout. Use the class again on these nested grids to apply fullwidth column printing if required.

#### Consistent link formatting

**`.gem-c-force-print-link-styles`**

This class ensures that printed links receive consistent formatting. It should be added to any link element that will be printed. Typically this  means applying it to links with the `govuk-link` class.

Links with a `govuk-link` class will display their href when printed. This makes printed links more useful, but uses more space. When adding the `gem-c-force-print-link-styles` class to these links, the following changes are made to the printed output:
- the link colour is set to black
- the font size is reduced slighlty
- the layout of the href is improved by making it a block element and forcing it to display on a new line

**`.gem-c-force-print-link-styles-within`**

This is a variation of the previous class, to be used on parent elements that contain links with the `govuk-link` class. This can be used when the `gem-c-force-print-link-styles` class cannot be applied directly to a link, such as with the [inset_text component](https://github.com/alphagov/govuk_publishing_components/blob/main/app/views/govuk_publishing_components/components/_inset_text.html.erb).


### Linting

All stylesheets must be linted according to [the style rules](https://github.com/alphagov/govuk-lint/blob/master/configs/scss_lint/gds-sass-styleguide.yml) in [govuk-lint](https://github.com/alphagov/govuk-lint).

```sh
# Lint Sass in your application components using govuk-lint
bundle exec govuk-lint-sass app/assets/stylesheets/components
```

## Images

Images must be listed in `config/initializers/assets.rb` and can be referred to in Sass as follows.

```scss
background-image: image-url("govuk_publishing_components/component-image.png");
```

SVGs can also be used for images, ideally inline in templates and compressed.

## JavaScript

Follow the [GOV.UK Frontend JS conventions](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/js.md).

Scripts should use the [module pattern](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/javascript-modules.md) and be linted using [StandardJS](https://standardjs.com/).

Most components should have an option to include arbitrary data attributes (see the [checkboxes component](https://components.publishing.service.gov.uk/component-guide/checkboxes/checkboxes_with_data_attributes) for example). These can be used for many purposes including tracking (see the [select component](https://components.publishing.service.gov.uk/component-guide/select/with_tracking) for [example code](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/javascripts/govuk_publishing_components/components/select.js)) but specific tracking should only be added to a component where there is a real need for it.

Some [common JavaScript modules](https://github.com/alphagov/govuk_publishing_components/tree/master/app/assets/javascripts/govuk_publishing_components/lib) are available. If new functionality is required, consider adding it as a common module.

## Tests

Component tests should include a check that the component doesn't fail if no data is passed.

JavaScript tests should be included if the component has any JavaScript that is unique to it. Use of existing JavaScript modules should be covered by existing tests.

[Read further guidance on testing components](/docs/testing-components.md).

## Helpers

![](https://docs.google.com/drawings/d/e/2PACX-1vRj6JM7cQvngDl3Gr_U9G4xga2gsU7Z-d2qHHQcsBdjsW4WaC9_eQdryBJIS69cLkrY7S0fK9BcrPSF/pub?w=960&amp;h=720)

[Source](https://docs.google.com/drawings/d/1N8-kbyCN_xOvvshN6d2HnQz5i5Bqed2WIatI3Nj9gNQ/edit)

Any code needed by a component that is more complex than basic parameter initialisation should be included in a separate file rather than in the template. There are 2 types of helper classes in this app:

- [AppHelpers](lib/govuk_publishing_components/app_helpers). Are exposed to the applications using this gem. They should be documented using RDoc.

- [Component Presenters](lib/govuk_publishing_components/presenters). Anything in these classes is only for use within the components. New presenter files must be included in `lib/govuk_publishing_components.rb` to work. They should be marked `@private`.

Code can be called and referred to in the template as follows:

```erb
<%
  card_helper = GovukPublishingComponents::Presenters::ImageCardHelper.new(local_assigns)
%>

<%= card_helper.heading_tag %>
```

### Shared helper

There is a [shared helper](https://github.com/alphagov/govuk_publishing_components/blob/main/lib/govuk_publishing_components/presenters/shared_helper.rb) that can provide common functionality to all components. This includes:

- set heading level and heading font size
- translation helpers

The following is an example of how to use the shared helper to set margin bottom on a component.

Add the shared helper to the component template:

```erb
shared_helper = GovukPublishingComponents::Presenters::SharedHelper.new(local_assigns)
```

## Passing HTML to a component

Avoid marking HTML as safe within components, this means avoiding use of `raw` or `html_safe` within a component's view.

By doing this we can avoid the risk of a Cross Site Scripting (XSS) attack.

Only sanitise HTML when the component is used in the application.

There are a few methods to achieve this:

### Yielding blocks with single slots for nested children

Similar to HTML, there may be a clear slot where nested children should appear in a component.

For a panel component, you may expect anything nested within it to appear
at the bottom of the component.

Do not:

```erb
<%= render 'panel', content: "Your reference number<br><strong>HDJ2123F</strong>" %>
```

Do:

```erb
<%= render 'panel' do %>
  Your reference number
  <br>
  <strong>HDJ2123F</strong>
<% end %>
```

### Parameters with HTML for multiple slots

If you have multiple slots where HTML may go, you could consider passing them as parameters.

Note: If you can avoid a requirement for HTML this may be better. In the following example you may consider `title: { level: 1, text: 'Application complete' }`.

Do not:

```erb
<%= render 'panel', { title: '<h1>Application complete</h1>' } do %>
  Your reference number
  <br>
  <strong>HDJ2123F</strong>
<% end %>
```

Do:

```erb
<% panel_title = capture do %>
  <h1>Application complete</h1>
<% end %>
<%= render 'panel', { title: panel_title } do %>
  Your reference number
  <br>
  <strong>HDJ2123F</strong>
<% end %>
```

or (if the data is passed from a presenter / controller)

```erb
<%= render 'panel', { title: presented_panel_title.html_safe } do %>
  Your reference number
  <br>
  <strong>HDJ2123F</strong>
<% end %>
```
