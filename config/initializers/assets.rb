return unless Rails.application.config.respond_to?(:assets)

# GOV.UK Publishing Components assets
Rails.application.config.assets.precompile += %w(
  govuk_publishing_components_manifest.js
  manifest.js
)

Rails.application.config.assets.precompile += %w(
  component_guide/accessibility-test.js
  component_guide/application.css
  component_guide/application.js
  component_guide/filter-components.js
  component_guide/visual-regression.js
  govuk_publishing_components/all_components.js
  govuk_publishing_components/modules.js
  govuk_publishing_components/vendor/modernizr.js
  govuk_publishing_components/component_guide.css
  govuk_publishing_components/favicon-development.png
  govuk_publishing_components/favicon-example.png
  govuk_publishing_components/favicon-integration.png
  govuk_publishing_components/favicon-production.png
  govuk_publishing_components/favicon-staging.png
  govuk_publishing_components/govuk-logo.png
  govuk_publishing_components/govuk-schema-placeholder-1x1.png
  govuk_publishing_components/govuk-schema-placeholder-4x3.png
  govuk_publishing_components/govuk-schema-placeholder-16x9.png
  govuk_publishing_components/search-button.png
  govuk_publishing_components/icon-file-download.svg
  govuk_publishing_components/icon-important.svg
  govuk_publishing_components/chevron-banner.svg
  govuk_publishing_components/chevron-banner-focus.svg
  govuk_publishing_components/chevron-banner-hover-border.svg
  govuk_publishing_components/chevron-banner-hover.svg
  govuk_publishing_components/chevron-banner-small.svg
  govuk_publishing_components/chevron-banner-small-focus.svg
  govuk_publishing_components/crests/*.png
)

# GOV.UK Frontend assets
Rails.application.config.assets.precompile += %w(
  govuk-logotype-crown.png
)

Rails.application.config.assets.paths += %W(
  #{__dir__}/../../node_modules/govuk-frontend/govuk/assets/images
  #{__dir__}/../../node_modules/govuk-frontend/govuk/assets/fonts
  #{__dir__}/../../node_modules/govuk-frontend
  #{__dir__}/../../node_modules/jquery/dist
  #{__dir__}/../../node_modules/axe-core
)
