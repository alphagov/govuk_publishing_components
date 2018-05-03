# Component branding

## Overview

Organisation pages in whitehall ([example](https://www.gov.uk/government/organisations/attorney-generals-office)) have department-specific branding on them. This includes specific colours for links and borders. These pages are being migrated out of whitehall and will use components for their frontend, which means some components need a sensible way of displaying these colours.

This work follows [this RFC](https://github.com/alphagov/govuk_publishing_components/pull/287) to discuss the approach taken.

## Adding to a component

To add colours to a component, modify the component to follow the example below.

```
<%
  brand ||= false
  brand_helper = GovukPublishingComponents::Presenters::BrandHelper.new(brand)
%>

<div class="gem-c-component <%= brand_helper.get_brand %>">
  <div class="gem-c-component__title <%= brand_helper.get_brand_element("border-color") %>">
    Example element that requires a coloured border
  </div>

  <a href="#" class="<%= brand_helper.get_brand_element("color") %>">
    Example element that requires coloured text
  </a>
</div>
```

Note that the helper must be called for each element that needs a border or link colour applying. This allows for flexibility if one is required but not the other.

For borders, the applied class only adds a `border-color` attribute. You will need to add the rest of the border style attributes to the component itself, for example:

```
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
