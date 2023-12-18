require "spec_helper"
ENV["RAILS_ENV"] ||= "test"
require File.expand_path("dummy/config/environment", __dir__)
abort("The Rails environment is running in production mode!") if Rails.env.production?
require "rspec/rails"
require "capybara/rails"
require "govuk_test"

GovukTest.configure
# Selenium::WebDriver::Options.chrome(loggingPrefs: { browser: "ALL" })

# Selenium::WebDriver::Options.chrome('goog:loggingPrefs' => {browser: 'ALL'})

# options = Selenium::WebDriver::Options.chrome(browser_version: 'stable', 'goog:loggingPrefs' => {browser: 'ALL'})
# options.args << '--headless=new'
# driver = Selenium::WebDriver.for(:chrome, options: options)

# browser_versions = %w(stable beta)
# headless_options = %w(--headless --headless=new)
# browser_versions.product(headless_options).each do |browser_version, headless_option|
#   options = Selenium::WebDriver::Options.chrome(browser_version: browser_version)
#   options.args << headless_option
#   driver = Selenium::WebDriver.for(:chrome, options: options)

#   puts "browser_version: #{browser_version}"
#   puts "headless_option: #{headless_option}"
#   puts "driver.respond_to?(:logs): #{driver.respond_to?(:logs)}"
#   puts "driver.bridge.browser: #{driver.send(:bridge).browser}"

#   puts
# end

RSpec.configure do |config|
  config.include Capybara::DSL
  config.include Helpers::Components, type: :view
  config.include ActiveSupport::Testing::TimeHelpers
end
