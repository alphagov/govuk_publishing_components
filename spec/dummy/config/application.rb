require_relative "boot"

require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "rails/test_unit/railtie"
require "sassc-rails"
# Require jasmine at runtime allow the app:jasmine:ci task to build correctly

begin
  require "jasmine"
rescue LoadError
  puts "Running in production mode"
end

Bundler.require(*Rails.groups)
require "govuk_publishing_components"

module Dummy
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
