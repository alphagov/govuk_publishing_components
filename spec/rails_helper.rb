require "spec_helper"
ENV["RAILS_ENV"] ||= "test"
require File.expand_path("dummy/config/environment", __dir__)
abort("The Rails environment is running in production mode!") if Rails.env.production?
require "rspec/rails"
require "capybara/rails"
require "govuk_test"
require "climate_control"

GovukTest.configure
Selenium::WebDriver::Options.chrome(loggingPrefs: { browser: "ALL" })

RSpec.configure do |config|
  config.include Capybara::DSL
  config.include Helpers::Components, type: :view
  config.include ActiveSupport::Testing::TimeHelpers
end
