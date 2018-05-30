Rails.application.config.assets.precompile += %w(
  govuk_publishing_components/component_guide.css
  component_guide/all_components.css
  component_guide/all_components_print.css
  govuk_publishing_components/search-button.png
  govuk_publishing_components/feed-icon-black.png
  govuk_publishing_components/mail-icon-x2.png
  govuk_publishing_components/mail-icon.png
)

Rails.application.config.assets.paths << Rails.root.join("node_modules/@govuk-frontend/frontend/assets")
