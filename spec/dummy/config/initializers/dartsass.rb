APP_STYLESHEETS = {
  "components/_app-component.scss" => "components/_app-component.css",
  "views/_app-view.scss" => "views/_app-view.css",
  "application.scss" => "application.css",
}.freeze

all_stylesheets = APP_STYLESHEETS.merge(GovukPublishingComponents::Config.component_guide_stylesheet)
Rails.application.config.dartsass.builds = all_stylesheets

Rails.application.config.dartsass.build_options << " --quiet-deps"
Rails.application.config.dartsass.build_options << " --silence-deprecation=import"
