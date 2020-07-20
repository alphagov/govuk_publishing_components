require_relative "boot"

require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
# We need to load govuk_test before jasmine_selenium runner so webdrivers is
# initialised.
require "govuk_test"
require "jasmine"
require "jasmine_selenium_runner"
require "sassc-rails"

require "govuk_publishing_components"

module Dummy
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
