# Use a component

Components are included in templates in slightly different ways depending on whether the component is in the application itself or in the gem.

A component from the application would be included in a template like this:

```erb
<%= render "components/back-to-top-link", href: "#contents" %>
```

A component from the gem would be included like this:

```erb
<%= render "govuk_publishing_components/components/back_link", href: "#" %>
```

Components can be rendered from outside of a Rails view by calling a render method directly on `GovukPublishingComponents`.

```ruby
GovukPublishingComponents.render("govuk_publishing_components/components/back_link", href: "#")
```

A locale can be specified as an argument to render a component in a particular localisation.

```ruby
GovukPublishingComponents.render("govuk_publishing_components/components/back_link", href: "#", locale: "cy")
```
