# Generate a new component

You can create a new component in the application (when you don't intend to use it in other places) or the components gem.

## Option 1: create a component in the application

The gem includes a component generator to stub the minimal files required for a component. The following command will create a component in the application it is run in - it will not create a component if run within the gem.

```ruby
rails generate govuk_publishing_components:component [component_name]
```

`component_name` should use underscores and not hyphens. Read our [component conventions](https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component_conventions.md#structure) for further details.

This will create a template, scss file and yml documentation file for a new component. It will not create a test file as this cannot be reliably done automatically across applications, but a test file will be necessary.

## Option 2: create a component in the gem

New components in the gem should be tested with users. Mark all new components as `(experimental)` (after the component name in the documentation file) until you collect enough feedback to be confident it can be used across applications.

Currently components in the gem must be manually created. File naming conventions should follow those in the [component conventions](/docs/component_conventions.md), but a slightly different directory structure is required to avoid conflicts with components in applications.

* Stylesheets go in `app/assets/stylesheets/govuk_publishing_components/components`
* [Print styles](/docs/component_conventions.md#print-styles) should be included in the main stylesheet
* Scripts go in `app/assets/javascripts/govuk_publishing_components/components`
* Templates go in `app/views/govuk_publishing_components/components`
* Documentation goes in `app/views/govuk_publishing_components/components/docs`
* Test files go in `spec/components`
* Script test files go in `spec/javascripts/components`

In addition, components in the gem can have helper files. Helper files go in `lib/govuk_publishing_components/components` and need to be required in `lib/govuk_publishing_components.rb`. Helper files should be structured as a class.
