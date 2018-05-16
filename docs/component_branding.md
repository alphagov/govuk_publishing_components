# Component branding

## Overview

Organisation pages in whitehall ([example](https://www.gov.uk/government/organisations/attorney-generals-office)) have department-specific branding on them. This includes specific colours for links and borders. These pages are being migrated out of whitehall and will use components for their frontend, which means some components need a sensible way of displaying these colours.

This work follows [this RFC](https://github.com/alphagov/govuk_publishing_components/pull/287) to discuss the approach taken.

## Adding to a component

To add colours to a component, modify the component to follow the example below.

```
<%
  brand ||= false
  brand_helper = GovukPublishingComponents::AppHelpers::BrandHelper.new(brand)
%>

<div class="gem-c-component <%= brand_helper.brand_class %>">
  <div class="gem-c-component__title <%= brand_helper.border_color_class %>">
    Example element that requires a coloured border
  </div>

  <a href="#" class="<%= brand_helper.color_class %>">
    Example element that requires coloured text
  </a>
</div>
```

Note that the helper must be called for each element that needs a border or link colour applying. This allows for flexibility if one is required but not the other.

The `border_color_class` method/class can also be applied to the main element of a component if needed, for example where the component is only one element. This is currently not possible with `color_class` as there is no requirement for this.

```
<h1 class="gem-c-component <%= brand_helper.brand_class %> <%= brand_helper.border_color_class %>">Heading</h1>
```

For borders, the applied class only adds a `border-color` attribute. You will need to add the rest of the border style attributes to the component itself, for example:

```
// this border will default to black unless the branding is applied
.gem-c-component__title {
  border-style: solid;
  border-width: 5px;
}
```

The component can then be passed a string matching the required brand, for example:

```
<%= render "govuk_publishing_components/components/example-component", {
  brand: 'attorney-generals-office'
} %>
```
