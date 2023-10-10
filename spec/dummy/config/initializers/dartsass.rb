app_stylesheets = {
  "components/_app-component.scss" => "components/_app-component.css",
  "views/_app-view.scss" => "views/_app-view.css",
  "application.scss" => "application.css",
}.freeze

all_stylesheets = app_stylesheets.merge(GovukPublishingComponents::Config.all_assets)
Rails.application.config.dartsass.builds = all_stylesheets
