require "rails/engine"
require "action_dispatch"

module GovukPublishingComponents
  class Engine < ::Rails::Engine
    isolate_namespace GovukPublishingComponents
    require 'govuk_frontend_toolkit'
    require 'kramdown'
  end
end
