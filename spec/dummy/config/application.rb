require_relative "boot"

require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "sassc-rails"

# In a heroku environment we don't have chrome and chromedriver available
# so loading these gems fails.
unless ENV["HEROKU"]
  # We need to load govuk_test before jasmine_selenium runner so webdrivers is
  # initialised.
  require "govuk_test"
  require "jasmine"
  require "jasmine_selenium_runner"
end

require "govuk_publishing_components"
require "magic_lamp"

module Dummy
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.i18n.default_locale = :en
    config.i18n.fallbacks = [I18n.default_locale]
  end
end
