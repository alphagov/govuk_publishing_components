# Install and use this gem

## 1. Install the gem

Add this line to your application's Gemfile:

```ruby
gem 'govuk_publishing_components'
```

And then execute:
```bash
$ bundle
```

## 2. Mount the component guide

Mount the component guide in your application:

```ruby
# config/routes.rb
mount GovukPublishingComponents::Engine, at: "/component-guide"
```

If your application was government-frontend the component guide would be at:

http://government-frontend.dev.gov.uk/component-guide

An example guide this gem created for government-frontend:

https://government-frontend.herokuapp.com/component-guide

You are encouraged to set up [Heroku review apps](https://docs.publishing.service.gov.uk/manual/review-apps.html) for your application, so that any changes to local components can be reviewed by looking at the component guide.

## 3. Configure the gem

Use a config block in an initialiser:

```ruby
# config/initializers/govuk_publishing_components.rb
GovukPublishingComponents.configure do |c|
  c.component_guide_title = "My component guide"

  c.application_stylesheet = "custom_stylesheet" # Defaults to "application"
  c.application_print_stylesheet = "print" # Not included by default
  c.application_javascript = "custom_javascript" # Defaults to "application"
end
```

## 4. Include the assets

To make use of the components, you'll have to include the JS and CSS in your application.

### CSS

```css
# application.scss
@import "govuk_publishing_components/all_components";
```

And for print styles

```css
# print.scss
@import "govuk_publishing_components/all_components_print";
```

### Javascript

If your application doesn't use Slimmer/Static (newer admin applications):

```js
# application.js
//= require govuk_publishing_components/dependencies
//= require govuk_publishing_components/all_components
```

If your application does use Slimmer/Static:

```js
# application.js
//= require govuk_publishing_components/all_components
```
