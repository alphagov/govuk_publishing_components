# Component Conventions

All components must use the `.app-` or `.pub-` namespace with the `c` prefix. For example, `.app-c-banner`.

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
| fixtures | Required | Each block represents an example with a set of inputs. Each example is listed in the component guide. Examples must cover all expected use cases. |

## Styles

With the exception of namespaces, follow the [GOV.UK Frontend CSS conventions](https://github.com/alphagov/govuk-frontend/blob/master/docs/coding-standards/css.md).

All stylesheets must be linted according to [the style rules](https://github.com/alphagov/govuk-lint/blob/master/configs/scss_lint/gds-sass-styleguide.yml) in [govuk-lint](https://github.com/alphagov/govuk-lint).

## Javascript

Follow the [GOV.UK Frontend JS conventions](https://github.com/alphagov/govuk-frontend/blob/master/docs/coding-standards/js.md).

Scripts should use the [module pattern provided by govuk_frontend_toolkit](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/javascript.md#modules) and be linted using [StandardJS](https://standardjs.com/).
