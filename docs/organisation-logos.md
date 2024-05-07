# Organisation logos

## Overview

The [Organisation logo component](https://components.publishing.service.gov.uk/component-guide/organisation_logo) can be used to render organisation logos that use either the [Government Identity System](https://gcs.civilservice.gov.uk/guidance/marketing/branding-guidelines/), such as [HMRC](https://components.publishing.service.gov.uk/component-guide/organisation_logo/hm_revenue_customs/preview), or have a [brand exemption](https://gcs.civilservice.gov.uk/guidance/marketing/branding-guidelines/#Brand-exemption-process), such as [HMPS](https://components.publishing.service.gov.uk/component-guide/organisation_logo/hm_prison_service/preview).

This documentation provides details on how to update and add new logos that are part of the Government Identity System.

## Image requirements

The image should be added to `app/assets/images/govuk_publishing_components/crests`. The image format required is a transparent PNG, with the whitespace trimmed, unless whitespace has been agreed with a designer.

### Naming convention

- `$crest` this is usually in the format `"[department_abbreviation]_crest"` all lowercase with underscores, for example `hmrc_crest`
- `_18px` (deprecated) referred to the font-size used
- `_x2` (deprecated) was used to provide an @2x image for screens that supported it

## Add the CSS required for new organisation logos

If you have added a new organisation logo, you will also need to add the required CSS to ensure it is requested on page load and renders correctly.

The first step is to add a new CSS class name in [_organisation-logo.scss](https://github.com/alphagov/govuk_publishing_components/blob/main/app/assets/stylesheets/govuk_publishing_components/components/_organisation-logo.scss).

The class name should be in the format "gem-c-organisation-logo__crest--[LOWERCASE-ORGANISATION-ABBREVIATION]", for example `gem-c-organisation-logo__crest--hmrc`

The next step is to include the `crest` mixin to set the background image and styling for the new organisation logo, for example:

```scss
.gem-c-organisation-logo__crest--hmrc {
  @include crest("hmrc_crest");
}
```

The value passed to the `crest` mixin here follows the naming convention mentioned above.

### Adjusting the logo height

You can also use the `tall-crest` mixin to increase the height of the logo. This can be used to help avoid the organisation logo appearing too narrow.

Example used on the MOD organisation logo:

```scss
.gem-c-organisation-logo__crest--mod {
  @include crest("mod_crest");
  @include tall-crest;
}
```

Ministry of Defence organisation logo preview - https://components.publishing.service.gov.uk/component-guide/organisation_logo/ministry_of_defence/preview

## Updating the Organisation logo component YML file

After adding a new logo to the organisation logo component, please add an example of this to the [organisation logo component YML file](https://github.com/alphagov/govuk_publishing_components/blob/main/app/views/govuk_publishing_components/components/docs/organisation_logo.yml).
