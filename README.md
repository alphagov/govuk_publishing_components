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
  mount GovukPublishingComponents::Engine, at: "/component-guide" if defined?(GovukPublishingComponents)
end
```

If your application was government-frontend the component guide would be at:
http://government-frontend.dev.gov.uk/component-guide

### Write components in your application

Components are partials included by your application:
```erb
<%= render 'components/description', { description: "A description is one or two leading sentences." } %>
```

Components must:
* [meet the component principles](docs/component_principles.md)
* [follow component conventions](docs/component_conventions.md)

The component guide will include your application’s styles and scripts.

It will include `application.scss` and `application.js` by default but this is [configurable](#configuration).

### Configure the gem

Use a config block in an initializer:

```ruby
# config/initializers/govuk_publishing_components.rb
if defined?(GovukPublishingComponents)
  GovukPublishingComponents.configure do |c|
    c.component_guide_title = "My component guide"

    c.application_stylesheet = "custom_stylesheet" # defaults to "application"
    c.application_javascript = "custom_javascript" # default to "application"
  end
end
```

## Licence

[MIT Licence](LICENCE.md)
