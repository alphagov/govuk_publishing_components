# GOV.UK Publishing Components

A gem to document components in GOV.UK frontend applications.

## Usage

Add this line to your application's Gemfile in the [development and test groups](http://bundler.io/v1.12/groups.html#grouping-your-dependencies):

```ruby
gem 'govuk_publishing_components'
```

And then execute:
```bash
$ bundle
```

### Mount the component guide

Mount the component guide in your application:

```ruby
# config/routes.rb
unless Rails.env.production?
  mount GovukPublishingComponents::Engine, at: "/component-guide"
end
```

If your application was government-frontend the component guide would be at:
http://government-frontend.dev.gov.uk/component-guide

### Write components in your application

Components are partials included by your application:
```erb
<%= render 'components/description', { description: "A description is one or two leading sentences." } %>
```

`govuk_publishing_components` expects the following component structure:

* a partial view in `app/views/components` - The template logic and markup, also defines the arguments expected. Filename must begin with an underscore.
* a documentation file in `app/views/components/docs` - a `.yml` per component, describing the component and containing fixture data.
* a SCSS module in `app/assets/stylesheets/components` - The styling of the component
* [a Javascript module](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/javascript.md#modules) in `app/assets/javascripts/components` - JS behaviour of the component
* a unit test in `test/components` - testing the component renders correctly based on parameters passed in

For a "print link" component you would have:
* app/views/components/_print-link.html.erb
* app/views/components/docs/print-link.yml
* app/assets/stylesheets/components/_print-link.scss
* test/components/print_link_test.rb

The component guide will include your application’s styles and scripts. It will include `application.scss` and `application.js` by default but this is [configurable](#configuration).

### Write documentation

The `.yml` file must have:
* a name
* a description
* a default fixture (this can be `{}` if the component takes no parameters)

#### Example documentation

```yaml
name: Withdrawal notice
description: A banner that displays when content is withdrawn
fixtures:
  default:
    title: 'This consultation was withdrawn on 20 April 2017'
    explanation_html: '<p>A supporting paragraph</p>'
```

### Configuration

Configure the gem with a config block in an initializer:

```ruby
# config/initializers/govuk_publishing_components.rb
GovukPublishingComponents.configure do |c|
  c.component_guide_title = "My component guide"

  c.application_stylesheet = "custom_stylesheet" # defaults to "application"
  c.application_javascript = "custom_javascript" # default to "application"
end
```

## Licence

[MIT Licence](LICENCE.md)
