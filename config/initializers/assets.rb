return unless Rails.application.config.respond_to?(:assets)

# Include the govuk_publishing_components manifest into list of assets to
# be pre-compiled. This allows that the same Sprockets manifest to be used 0
# with Sprockets 3 and 4 without applications needing to manually require it.
#
# In future we may want applications to link directly to this from their
# manifest file as the use of `config.assets.precompile` is discouraged
Rails.application.config.assets.precompile += %w[govuk_publishing_components_manifest.js]

Rails.application.config.assets.paths += %W[
  #{__dir__}/../../node_modules/govuk-frontend/dist/govuk/assets/images
  #{__dir__}/../../node_modules/govuk-frontend/dist/govuk/assets/fonts
  #{__dir__}/../../node_modules/govuk-frontend/dist
  #{__dir__}/../../node_modules/
]

# We've experienced segmentation faults when pre-compiling assets with libsass.
# Disabling Sprockets 4's export_concurrent setting seems to resolve the issues
# see: https://github.com/rails/sprockets/issues/633
Rails.application.config.assets.configure do |env|
  env.export_concurrent = false if env.respond_to?(:export_concurrent=)
end
