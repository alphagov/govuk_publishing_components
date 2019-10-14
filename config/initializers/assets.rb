return unless Rails.application.config.respond_to?(:assets)

# GOV.UK Publishing Components assets
Rails.application.config.assets.precompile += %w(
  govuk_publishing_components_manifest.js
  manifest.js
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
