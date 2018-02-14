# Use a component

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
