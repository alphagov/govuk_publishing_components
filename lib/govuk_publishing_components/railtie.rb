module GovukPublishingComponents
  class Railtie < Rails::Railtie
    initializer "govuk_publishing_components.view_helpers" do
      ActiveSupport.on_load(:action_view) { include GovukPublishingComponents::AppHelpers::AssetHelper }
    end
  end
end
