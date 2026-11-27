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

If your application was `frontend` the component guide would be at:

http://frontend.dev.gov.uk/component-guide

An example guide this gem created for `frontend`:

https://govuk-frontend.herokuapp.com/component-guide

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

## 4. Loading Sass

GOV.UK Publishing Components uses the Sass module system following the GOV.UK Frontend 6.2 upgrade. Stylesheets should now be loaded with `@use` statements (as opposed to `@import`, which is deprecated and will be removed in a future release of Dart Sass).

For more information, see the resources below.

- [GOV.UK Design System v6.2 Release Notes](https://github.com/alphagov/govuk-frontend/releases/tag/v6.2.0) - See "Use `@use` to include GOV.UK Frontend styles in Sass" to include GOV.UK Frontend styles in Sass
- [`@import` is Deprecated](https://sass-lang.com/blog/import-is-deprecated/) - Sass blog post
- [The Sass module system](https://sass-lang.com/blog/the-module-system-is-launched/)

### Configuring your stylesheets

#### Base and core

When configuring your stylesheets, you'll need to load the GOV.UK Publishing Components `base` and `core` files, while `lib` is an optional module that's currently required by Frontend applications, but not needed by all applications (see the [`lib`](#lib) section below).

You now load these using `@use`:

```scss
@use "govuk_publishing_components/base";
@use "govuk_publishing_components/core";
```
```scss
@use "govuk_publishing_components/lib";
```

#### Base

`base` loads `govuk/base`, which contains GOV.UK Frontend's settings, tools and helpers. It also configures fonts and asset paths. **No CSS is generated when loading base**.

> [!NOTE]
> For most application stylesheets, base should be the first thing you load.
> You don't need to namespace base (for example, using `@use "govuk_publishing_components/base" as *;`) **unless** you're directly referencing GOV.UK Frontend settings, tools or helpers in your application stylesheet, such as the `govuk-colour` mixin (see [loading settings and helpers where they're needed](#loading-settings-and-helpers-where-theyre-needed) below).

#### Configuring base

You can configure base by passing in settings to override the default values provided by GOV.UK Frontend. Configuration must happen the first-time `base` is loaded. You can't change these settings in subsequent `@use` statements.

To pass in settings, use the `with` keyword, followed by the variables you want to override:

```scss
@use "govuk_publishing_components/base" with (
  $govuk-page-width: 1140px
);
```

#### Core

`core` loads core, objects, utilities and overrides from GOV.UK Frontend. This includes the basic styles used for typography, links and other common elements.

The classes defined in these layers generally correspond to HTML elements, such as paragraphs, headings, lists and links. These are the styles that generate CSS output.

#### Lib

Contains code specific to GOV.UK Publishing Components, such as brand colours, destructive link styles and print support.

> [!NOTE]
> Not every application will need to load `lib`, and its contents may be reorganised further in the future.

### Load Sass for selected components (recommended)

This approach only includes the Sass for components that your application needs, helping to keep the compiled CSS file size smaller.

To use this approach, you must first load `base` and `core`:

```scss
@use "govuk_publishing_components/base";
@use "govuk_publishing_components/core";
@use "govuk_publishing_components/lib";

// load only the required components
@use "govuk_publishing_components/components/back-link";
@use "govuk_publishing_components/components/breadcrumbs";
@use "govuk_publishing_components/components/button";
```

> [!NOTE]
> Note that you will need to keep this up to date if you add or remove components from your application.

### Load Sass for all components

Alternatively, you can load the Sass for all components. This is easier to manage, but results in a larger compiled CSS file. For this reason, it's not recommended for public-facing applications:

```scss
@use "govuk_publishing_components/base"; 
@use "govuk_publishing_components/core"; 
@use "govuk_publishing_components/lib";

// load all components
@use "govuk_publishing_components/all_components";
```

### Loading settings and helpers where they're needed

One important difference with the Sass module system is that you must load settings (such as variables) and helpers (such as mixins and functions) in every file where they're used.

Previously, you could "import" code into your application stylesheet and have it available throughout the other stylesheets. This is no longer the case with `@use`.

For example, if a partial contains the following:

```scss
.app-c-header {
  border-bottom: 3px solid govuk-colour("white");
}
```

You'll now need to load `base` in that partial to make the `govuk-colour` helper available:

```scss
@use "govuk_publishing_components/base" as *;

.app-c-header {
  border-bottom: 3px solid govuk-colour("white");
}
```

> [!NOTE]
> In this case, `base` needs to be loaded with as `*` because the code references the GOV.UK Frontend helper directly, without a namespace.

### Loading the component guide stylesheet

If you load the component guide in the application the suggested Sass for it has been generated for you. Click the 'Suggested imports for this application' link, then copy and paste the output into your `application.scss` file.

You will need add the stylesheet for the component guide into the applications `dartsass.rb`, using `GovukPublishingComponents::Config.component_guide_stylesheet`, which should look something like the following.

```Ruby
APP_STYLESHEETS = {
  "application.scss" => "application.css",
}.freeze

all_stylesheets = APP_STYLESHEETS.merge(GovukPublishingComponents::Config.component_guide_stylesheet)
Rails.application.config.dartsass.builds = all_stylesheets
```

## 5. Include and configure JavaScript

### Import JavaScript for individual components (recommended)

```ruby
# application.js
//= require govuk_publishing_components/dependencies
//= require govuk_publishing_components/lib
//= require govuk_publishing_components/components/button
```

### Import all JavaScript

Alternatively, you can simply import the JavaScript for all of the components. This is easier to manage but results in a larger JS file size, so it is not recommended for public facing applications.

```ruby
# application.js
//= require govuk_publishing_components/dependencies
//= require govuk_publishing_components/all_components
```

### Create a separate JS bundle for govuk-frontend components (optional)

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

### New `use_es6_components` config option (optional)

If you are using the `layout_for_public` or `layout_for_admin` templates, you can use the new `use_es6_components` config option in your application to load the `es6-components.js` bundle you create. If this config is set to true and there is no `es6-components.js` file then an error will occur.

```ruby
# config/initializers/govuk_publishing_components.rb
GovukPublishingComponents.configure do |config|
  config.use_es6_components = true
end
```

### Using the type="module" attribute

Scripts that use type=”module” will run in strict mode and be deferred by default. Please refer to the "Stop Internet Explorer 11 and other older browsers running unsupported JavaScript" section of the [govuk-frontend v5.0.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.0.0) release notes further details and recommendations.
