# GOV.UK Publishing Components

A gem to document components in GOV.UK frontend applications and provide shared components to applications. Components should be added to this gem if they are required in more than one application, otherwise they should be added to that application.

![Screenshot of component guide](docs/screenshot.png)

## Write components in your application

Components are packages of template, style, behaviour and documentation.

A component must:
* [meet the component principles](docs/component_principles.md)
* [follow component conventions](docs/component_conventions.md)

Components are included in templates in slightly different ways depending on whether the component is in the application itself, in static, or in the gem.

A component from the application would be included in a template like this:

```erb
<%= render "components/back-to-top", href: "#contents" %>
```

A component from static would be included like this:

```erb
<%= render "govuk_component/lead_paragraph", text: "A description is one or two leading sentences." %>
```

A component from the gem would be included like this:

```erb
<%= render "govuk_publishing_components/components/back_link", href: "#" %>
```

## Set up a component guide

This gem creates a component guide for all your application’s components.

An example guide this gem created for government-frontend:
https://government-frontend.herokuapp.com/component-guide

The guide includes your application’s `application.scss` and `application.js` files by default. This is [configurable](#configuration).

You are encouraged to set up [Heroku review apps](https://docs.publishing.service.gov.uk/manual/review-apps.html) for your application, so that any changes to local components can be reviewed by looking at the component guide.

### Install gem

Add this line to your application's Gemfile:

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
mount GovukPublishingComponents::Engine, at: "/component-guide"
```

If your application was government-frontend the component guide would be at:
http://government-frontend.dev.gov.uk/component-guide

### Configure the gem

Use a config block in an initializer:

```ruby
# config/initializers/govuk_publishing_components.rb
GovukPublishingComponents.configure do |c|
  c.component_guide_title = "My component guide"

  c.application_stylesheet = "custom_stylesheet" # Defaults to "application"
  c.application_print_stylesheet = "print" # Not included by default
  c.application_javascript = "custom_javascript" # Defaults to "application"
end
```

### Running the gem as a standalone app

If you want to work on this gem directly, without having to add it to another
application, you can run it in the development vm:

```
./startup.sh
```

The app should start on http://localhost:3212 or http://publishing-components.dev.gov.uk/component-guide on GOV.UK development machines.

```
./startup.sh --live
```

This will run the app and point it at the production `static` instance.

#### Running with bowl on the VM

```
$ cd /var/govuk/govuk_publishing_components
$ bundle

$ cd /var/govuk/govuk-puppet/development-vm
$ bowl publishing-components
```

Then visit [publishing-components.dev.gov.uk/component-guide](http://publishing-components.dev.gov.uk/component-guide).

#### Running locally

If you don't want to run it in the development vm, you can start the app with:

```
$ cd /var/govuk/govuk_publishing_components
$ bundle

$ PLEK_SERVICE_STATIC_URI=assets.publishing.service.gov.uk bundle exec foreman start
```

Then visit [localhost:5000/component-guide](http://localhost:5000/component-guide).

### Test the component guide

The gem [includes integration tests](lib/govuk_publishing_components/minitest/component_guide_test.rb) to check that your component guide and examples are error free and that they meet basic accessibility needs.

Automated accessibility tests use [aXe](https://github.com/dequelabs/axe-core). Using our `AccessibilityTest` wrapper the gem runs the aXe suite against each example and throws JavaScript errors for any violations. These JavaScript errors can be used to fail a build in CI.

#### Minitest

```ruby
# component_guide_test.rb
require 'govuk_publishing_components/minitest/component_guide_test'

class ComponentGuideTest < ActionDispatch::IntegrationTest
  include GovukPublishingComponents::Minitest::ComponentGuideTest
end
```

#### Test files

All test files for components in the gem can be run with the command `bundle exec rake`.

### Exclude accessibility rules

Sometimes you will have a component that will throw an error due to it being in isolation, for example radio buttons not being in a fieldset.

For this case you can add `accessibility_excluded_rules` to your components' documentation yml file with the rules you want to exclude. These rules can be found in brackets in the error messages displayed.

For an example of this check [test/.../docs/test-component-with-duplicate-ids.yml](spec/dummy/app/views/components/docs/test-component-with-duplicate-ids.yml)


## Component generator

The gem includes a component generator to stub the minimal files required for a component. The following command will create a component in the application it is run in - it will not create a component if run within the gem.

```ruby
rails generate govuk_publishing_components:component [component_name]
```

This will create a template, scss file and yml documentation file for a new component. It will not create a test file as this cannot be reliably done automatically across applications, but a test file will be necessary.

### Creating components in the gem

Currently components in the gem must be manually created. File naming conventions should follow those in the [component conventions](docs/component_conventions.md), but a slightly different directory structure is required to avoid conflicts with components in applications.

* Stylesheets go in `app/assets/stylesheets/govuk_publishing_components/components`
* Print stylesheets go in `app/assets/stylesheets/govuk_publishing_components/components/print`
* Scripts go in `app/assets/javascripts/govuk_publishing_components/components`
* Templates go in `app/views/govuk_publishing_components/components`
* Documentation goes in `app/views/govuk_publishing_components/components/docs`
* Test files go in `spec/components`
* Script test files go in `spec/javascripts/components`

In addition, components in the gem can have helper files. Helper files go in `lib/govuk_publishing_components/components` and need to be required in `lib/govuk_publishing_components.rb`. Helper files should be structured as a class.

## Automated Testing
### Visual Diff Tool
The component guide includes a visual diff tool that should make it easier to spot when you are introducing visual regressions in your components.

It can be run on a locally running version of the component guide, to compare it to the heroku master deploy. For example: [government-frontend.dev.gov.uk/component-guide](http://government-frontend.dev.gov.uk/component-guide) will be compared to [government-frontend.herokuapp.com/component-guide](https://government-frontend.herokuapp.com/component-guide).

The tool can be run via the console using the following command:
```js
  window.GOVUK.VisualDiffTool()
```

## Licence

[MIT Licence](LICENCE.md)

## Development
For documentation on how to update and develop this gem see [DEVELOPMENT.md](./DEVELOPMENT.md)

### Moving components upstream into this gem
See [the documentation on how to move components into this gem](docs/moving-components-upstream-into-this-gem.md)
