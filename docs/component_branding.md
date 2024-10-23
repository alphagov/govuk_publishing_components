# Component branding

## Overview

Organisation pages in `collections` have some department-specific branding on them. Custom border colours are used on all organisation pages ([example](https://www.gov.uk/government/organisations/attorney-generals-office)), and custom colours for links are used on [Prime Minister's Office, 10 Downing Street](https://www.gov.uk/government/organisations/prime-ministers-office-10-downing-street).

[Most colours now come from govuk-frontend](https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/settings/_colours-organisations.scss), however custom colours can be added to [_brand_colours.scss](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/stylesheets/govuk_publishing_components/components/helpers/_brand-colours.scss) if required.

This work follows [this RFC](https://github.com/alphagov/govuk_publishing_components/pull/287) to discuss the approach taken.

**Note: as of October 2024, the use of brand colours for styling was reduced to just borders and accents for most organisations. Brand colours should not be added to text or links, except for in specific agreed circumstances. Text and links should ideally always use our default styles for accessibility and to ensure that the user journey across GOV.UK is consistent from a design perspective.**

## Adding to a component

To add colours to a component, modify the component to follow the example below.

```erb
<%
  brand ||= false
  brand_helper = GovukPublishingComponents::AppHelpers::BrandHelper.new(brand)
%>

<div class="gem-c-component <%= brand_helper.brand_class %>">
  <div class="gem-c-component__title <%= brand_helper.border_color_class %>">
    Example element that requires a coloured border
  </div>

  <a href="#" class="<%= brand_helper.color_class %>">
    Rare use case where a link requires coloured text
  </a>
</div>
```

The above will style borders with colours from the design system automatically, as we have a SASS mixin for this in `_brand_colours.scss` that will map the class to its colour in the design system.

If your use case fits one of these scenarios:
- you need to use `brand_helper.color_class`
- a new brand name or colour outside of the design system needs to be used
- styles other than the border colour are needed

Then a new class in `_brand_colours.scss` will need to be created, that is namespaced to the brand name:

```scss
.brand--your-brand-name-here {
  .brand__color {
    &:link,
    &:visited,
    &:active {
      color: govuk-colour("black"); // link colours ideally shouldn't be changed, so this is only shown here for demonstration purposes.
    }

    &:hover,
    &:focus {
      color: $govuk-focus-text-colour;
    }
  }

  &.brand__border-color,
  .brand__border-color {
    border-color: govuk-colour("black"); // your border colour here
  }
}
```

Note that the helper must be called for each element that needs a border or other brand-specific colour applied. This allows for flexibility if one is required but not the other.

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
  brand: 'prime-ministers-office-10-downing-street'
} %>
```
