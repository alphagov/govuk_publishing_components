# Install and use this gem

## 1. Install the gem

Add this line to your application's Gemfile:

```ruby
gem "govuk_publishing_components"
```

And then execute:
```sh
bundle
```

## 2. Mount the component guide

Mount the component guide in your application:

```ruby
# config/routes.rb
mount GovukPublishingComponents::Engine, at: "/component-guide" if Rails.env.development?
```

If your application was `government-frontend` the component guide would be at:

http://government-frontend.dev.gov.uk/component-guide

An example guide this gem created for `government-frontend`:

https://government-frontend.herokuapp.com/component-guide

You are encouraged to set up [Heroku review apps](https://docs.publishing.service.gov.uk/manual/review-apps.html) for your application, so that any changes to local components can be reviewed by looking at the component guide.

## 3. Configure the gem

Use a config block in an initialiser:

```ruby
# config/initializers/govuk_publishing_components.rb
GovukPublishingComponents.configure do |c|
  c.component_guide_title = "My component guide"
  c.application_stylesheet = "custom_stylesheet" # Defaults to "application", set to `nil` if the application stylesheet is not in use
  c.application_javascript = "custom_javascript" # Defaults to "application"
end
```

## 4. Include the assets

To make use of the components, you'll have to include the JS and CSS in your application.

### Import Sass for individual components

The Sass for any components in use in an application should be imported. In order for this to work you must first import some generic Sass files that include `govuk-frontend` and some gem specific mixins and variables.

**Note that you will need to keep this up to date if you add or remove components from your application.**

For example:

```scss
// supporting sass
@import "govuk_publishing_components/govuk_frontend_support";
@import "govuk_publishing_components/component_support";
// component specific sass
@import "govuk_publishing_components/components/back-link";
```

If you load the component guide in the application the suggested Sass for it has been generated for you. Click the 'Suggested imports for this application' link, then copy and paste the output into your `application.scss` file.

If you are not using [individual component css loading](set-up-individual-component-css-loading.md) you will need add the stylesheet for the component guide into the applications `dartsass.rb`, using `GovukPublishingComponents::Config.component_guide_stylesheet`, which should look something like the following.

```Ruby
APP_STYLESHEETS = {
  "application.scss" => "application.css",
}.freeze

all_stylesheets = APP_STYLESHEETS.merge(GovukPublishingComponents::Config.component_guide_stylesheet)
Rails.application.config.dartsass.builds = all_stylesheets
```

### Import all Sass (deprecated, will be removed in a later version)

```scss
// application.scss
@import "govuk_publishing_components/all_components";
```

### Import JavaScript for individual components

If your application doesn't use Slimmer/Static:

```ruby
# application.js
//= require govuk_publishing_components/dependencies
//= require govuk_publishing_components/lib
//= require govuk_publishing_components/components/button
```

If your application does use Slimmer/Static:

```ruby
# application.js
//= require govuk_publishing_components/lib
//= require govuk_publishing_components/components/button
```

#### Create a separate JS bundle for govuk-frontend components

As of [govuk-frontend v5.0.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.0.0), the target for browser support has changed to browsers that support using the `type="module"` attribute on `script` tags. This means that govuk_publishing_components JavaScript files that include files from govuk-frontend will now error ungracefully and potentially function in an unpredictable way if a browser that doesn't support `type="module"`, tries to evaluate the Javascript in a script tag without the `type="module"` attribute.

To ensure that [grade X browsers](https://frontend.design-system.service.gov.uk/browser-support/#grade-x) don't evaluate the JavaScript that they don't support, consider using a separate file called `es6-components.js` for these components, for example:

```rb
# es6-components.js
//= require govuk_publishing_components/lib
//= require govuk_publishing_components/components/accordion
```

Then include this in a script tag with the `type="module` attribute:

```ruby
# application.html.erb
<%= javascript_include_tag 'es6-components.js', type: "module" %>
```

This will ensure that browsers will only be able to load the JavaScript that they are capable of running.

**Note:** You can get an up-to-date list of components that use govuk-frontend JS using the [component auditing tools](./auditing.md), components that use JS from govuk-frontend will be marked as "Yes" under the "GF JS" column.

### New `use_es6_components` config option

If you are using the `layout_for_public` or `layout_for_admin` templates, you can use the new `use_es6_components` config option in your application to load the `es6-components.js` bundle you create. If this config is set to true and there is no `es6-components.js` file then an error will occur.

```ruby
# config/initializers/govuk_publishing_components.rb
GovukPublishingComponents.configure do |config|
  config.use_es6_components = true
end
```

### Using the type="module" attribute

Scripts that use type=”module” will run in strict mode and be deferred by default. Please refer to the "Stop Internet Explorer 11 and other older browsers running unsupported JavaScript" section of the [govuk-frontend v5.0.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.0.0) release notes further details and recommendations.

### Import all JavaScript (deprecated, will be removed in a later version)

If your application doesn't use Slimmer/Static:

```ruby
# application.js
//= require govuk_publishing_components/dependencies
//= require govuk_publishing_components/all_components
```

If your application does use Slimmer/Static:

```ruby
# application.js
//= require govuk_publishing_components/all_components
```
