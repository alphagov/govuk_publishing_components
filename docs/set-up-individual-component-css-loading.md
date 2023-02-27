## Set up individual component CSS loading

Set the component gem up so that rendering applications can (optionally) load each component's stylesheet individually, as described in [RFC #149](https://github.com/alphagov/govuk-rfcs/pull/152).

### TL;DR

An array for stylesheet names is set up in the rendering application using a helper. Templates can then add the names of stylesheets to the array, which is then used by the application to output all the stylesheets needed on the page.

Example of rendering application upgrade: https://github.com/alphagov/frontend/pull/3342/

### Initial set up

There are 3 types of stylesheet that are used across GOVUK:

- CSS from components in the gem
- CSS from components in the application
- CSS from views in the application

The helper adds each type of stylesheet to the array - gem components, app components, and views.

Any other styles should be added in the application's `application.scss` file.

Four shorthand methods for adding each type of stylesheet to the array:

- `add_gem_component_stylesheet`
- `add_app_component_stylesheet`
- `add_view`
- `add_view_stylesheet`

The first three take the name of the Sass file relevant to the component or view:

```ruby
add_gem_component_stylesheet("accordion")
```

```ruby
add_app_component_stylesheet("calendar")
```

```ruby
add_view("homepage")
```

There is also 1 generic method that takes a file path:

```ruby
add_view_stylesheet("views/dir-1/_partial.css")
```

### Precompiling

The stylesheets need to be added to the rendering applications list of assets to precompile. The `get_component_css_paths` method is available from the AssetHelper module in GovukPublishingComponents.

```ruby
#config/application.rb
module Frontend
  class Application < Rails::Application
    include GovukPublishingComponents::AppHelpers::AssetHelper
    ...
    config.assets.precompile << get_component_css_paths
```

Stylesheets for components in the gem are automatically generated, any app component and view stylesheets should be added to the application's `manifest.js`.

### Known problems

#### Nested components in GOV.UK Frontend

GOV.UK Frontend has components that use other components - for example, both the radio button and character count component include the label component. These are deduped by GOV.UK Frontend when compiling the CSS to a single file.

As this pull request includes the stylesheets for the components individually, this will mean that both the radio stylesheet and the character count stylesheet will include the label component.

This shouldn't make a difference in visual appearance of the site, since the stylesheets were included in alphabetical order and continue to do so. However, it means that there still is some CSS that is unnecessarily included twice.

The page sizes were calculated from individual compiled CSS files, so there still is a performance improvement - but it could be further improved.

Ideally there'd be a way of including only the components without including the nested components; for example, the partial for radio inputs would include both the label and radio:

```ruby
add_gem_component_stylesheet("label")
add_gem_component_stylesheet("radio")
```

which would then be deduped before being added to the array of stylesheets.

#### Increased request header size

Rails automatically adds the stylesheets on the page to the request `preload` header. This means that it gets bigger with every additional stylesheet that's added to the page. Coupled with a large Content Security Policy (CSP), this means that some pages have a header size that nginx doesn't like at all - so causes nginx to return a 502 error. This error is seen on Integration, but not locally or on Heroku.

A pull request has been raised to fix this by [increasing the cache size in NGINX](https://github.com/alphagov/govuk-puppet/pull/11846).

**Note:**

We will use this feature in the `frontend` app first and review the performance impact before rolling out to other frontend apps.

The increased cache size in NGINX is large enough for the loading of individual CSS assets in the `frontend` app. However, we will need to increase the cache size further before being used in other apps such as `government-frontend` that use a larger number of components, and before it is used to load individual JS assets.

### Step by step changes to the rendering application

**Set up the stylesheets to be precompiled**. Add any app components and views in `app/assets/config/manifest.js` (and then remove them from `app/assets/stylesheets/application.scss`).

```js
//= link components/_calendar.css
//= link views/_homepage.css
```

Add list of gem components to be precompiled in `config/application.rb` (and then all gem component `@import`s can also be removed from `app/assets/stylesheets/application.scss`):

```ruby
#config/application.rb
module Frontend
  class Application < Rails::Application
    include GovukPublishingComponents::AppHelpers::AssetHelper

   ...

    config.assets.precompile << get_component_css_paths
```

#### Using the publishing components gem without the `static` rendering app

The `static` rendering application already includes several components from the publishing components gem. To avoid requesting the same stylesheet twice, we exclude any stylesheets included in `static` by default.

If you are using the individual assets loading feature in an app that does not rely on `static`, we recommend adding the config file below in your application to ensure that the components render correctly.

```rb
# config/initializers/govuk_publishing_components.rb
GovukPublishingComponents.configure do |c|
  c.exclude_css_from_static = false
end
```

**Add the app components and views** to the array. This bit will likely take the most time - and really benefits from a comprehensive list of what pages use which templates (and template variations).

Add the `add_view` and `add_app_component_stylesheet` to the top of each partial template that needs it:

```rb
add_view("homepage")
```

```rb
add_app_component_stylesheet("calendar")
```

Each stylesheet that is used individually will need an extra `@import` added to allow them to use GOV.UK Frontend variables and mixins:

```scss
@import "govuk_publishing_components/individual_component_support";
```

**Hoist the content of the body to the top of the base template in `app/views/layouts/application.html.erb`**. This ensures that all of the components are added to the array before the array is used in the `<head>` of the template.

On line 1:

```rb
<% content_for :body do %>
  <!-- Everything that was between <body> and </body> --->
<% end %>
```

And then between `<body>` and `</body>`:

```rb
<%= yield :body %>
```

**Add the stylesheets just before the closing `</head>` tag of the base template**:

```rb
<%= stylesheet_link_tag "application.css", integrity: false %>
<%=
  render_component_stylesheets
%>
```

## Why

See [RFC #149](https://github.com/alphagov/govuk-rfcs/pull/152) for more details about this approach.
