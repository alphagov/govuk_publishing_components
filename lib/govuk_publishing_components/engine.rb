module GovukPublishingComponents
  class Engine < ::Rails::Engine
    isolate_namespace GovukPublishingComponents
    require 'govuk_frontend_toolkit'
  end
end
