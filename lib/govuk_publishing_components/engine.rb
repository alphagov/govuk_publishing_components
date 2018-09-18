module GovukPublishingComponents
  class Engine < ::Rails::Engine
    isolate_namespace GovukPublishingComponents
    require 'govuk_frontend_toolkit'
    require 'govspeak'
  end
end
