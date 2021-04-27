# Generate a new component

You can create a new component in the application (when you don't intend to use it in other places), the gem, or Static (deprecated).

## Option 1: create a component in the application

The gem includes a component generator to stub the minimal files required for a component. The following command will create a component in the application it is run in - it will not create a component if run within the gem.

```ruby
rails generate govuk_publishing_components:component [component_name]
```

This will create a template, scss file and yml documentation file for a new component. It will not create a test file as this cannot be reliably done automatically across applications, but a test file will be necessary.

## Option 2: create a component in the gem

Currently components in the gem must be manually created. File naming conventions should follow those in the [component conventions](/docs/component_conventions.md), but a slightly different directory structure is required to avoid conflicts with components in applications.

* Stylesheets go in `app/assets/stylesheets/govuk_publishing_components/components`
* Print stylesheets go in `app/assets/stylesheets/govuk_publishing_components/components/print`
* Scripts go in `app/assets/javascripts/govuk_publishing_components/components`
* Templates go in `app/views/govuk_publishing_components/components`
* Documentation goes in `app/views/govuk_publishing_components/components/docs`
* Test files go in `spec/components`
* Script test files go in `spec/javascripts/components`

In addition, components in the gem can have helper files. Helper files go in `lib/govuk_publishing_components/components` and need to be required in `lib/govuk_publishing_components.rb`. Helper files should be structured as a class.

## Option 3: create a component in Static (don't)

This is deprecated, don't add any more components to Static.
