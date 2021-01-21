return unless Rails.application.config.respond_to?(:assets)

# GOV.UK Publishing Components assets
Rails.application.config.assets.precompile += %w[
  component_guide/accessibility-test.js
  component_guide/application.js
  component_guide/filter-components.js
  component_guide/visual-regression.js
  component_guide/print.css
  govuk_publishing_components/all_components.js
  govuk_publishing_components/ie.js
  govuk_publishing_components/modules.js
  govuk_publishing_components/vendor/modernizr.js
  govuk_publishing_components/analytics.js
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
  govuk_publishing_components/chevron-banner/*.svg
  govuk_publishing_components/crests/*.png
  govuk_publishing_components/take-action-amber.svg
  govuk_publishing_components/take-action-green.svg
  govuk_publishing_components/take-action-red.svg
]

# GOV.UK Frontend assets
Rails.application.config.assets.precompile += %w[
  govuk-logotype-crown.png
  favicon.ico
  govuk-opengraph-image.png
  govuk-mask-icon.svg
  govuk-apple-touch-icon-180x180.png
  govuk-apple-touch-icon-167x167.png
  govuk-apple-touch-icon-152x152.png
  govuk-apple-touch-icon.png
]

Rails.application.config.assets.paths += %W[
  #{__dir__}/../../node_modules/govuk-frontend/govuk/assets/images
  #{__dir__}/../../node_modules/govuk-frontend/govuk/assets/fonts
  #{__dir__}/../../node_modules/govuk-frontend/
  #{__dir__}/../../node_modules/
]
