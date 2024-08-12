$LOAD_PATH.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "govuk_publishing_components/version"
# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "govuk_publishing_components"
  s.version     = GovukPublishingComponents::VERSION
  s.authors     = ["GOV.UK Dev"]
  s.email       = ["govuk-dev@digital.cabinet-office.gov.uk"]
  s.summary     = "A gem to document components in GOV.UK frontend applications"
  s.description = "A gem to document components in GOV.UK frontend applications"
  s.homepage    = "https://github.com/alphagov/govuk_publishing_components"
  s.license     = "MIT"
  s.required_ruby_version = ">= 3.2"

  s.files = Dir["{node_modules/govuk-frontend,node_modules/axe-core,node_modules/sortablejs,node_modules/govuk-single-consent,app,config,db,lib}/**/*", "LICENCE.md", "README.md"]

  s.add_dependency "govuk_app_config"
  s.add_dependency "govuk_personalisation", ">= 0.7.0"
  s.add_dependency "kramdown"
  s.add_dependency "plek"
  s.add_dependency "rails", ">= 6"
  s.add_dependency "rouge"
  s.add_dependency "sprockets", ">= 3"
  s.add_dependency "sprockets-rails"

  s.add_development_dependency "capybara"
  s.add_development_dependency "dartsass-rails"
  s.add_development_dependency "faker"
  s.add_development_dependency "gds-api-adapters"
  s.add_development_dependency "govuk_schemas"
  s.add_development_dependency "govuk_test"
  s.add_development_dependency "i18n-coverage"
  s.add_development_dependency "percy-capybara"
  s.add_development_dependency "pry-byebug"
  s.add_development_dependency "rails_translation_manager"
  s.add_development_dependency "rake"
  s.add_development_dependency "rspec-rails"
  s.add_development_dependency "rubocop-govuk"
  s.add_development_dependency "terser"
  s.add_development_dependency "webmock"
  s.add_development_dependency "yard"
end
