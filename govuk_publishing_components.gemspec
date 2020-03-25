$:.push File.expand_path("lib", __dir__)

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

  s.files = Dir["{node_modules/govuk-frontend,node_modules/axe-core,node_modules/jquery,app,config,db,lib}/**/*", "DEVELOPMENT.md", "LICENCE.md", "Rakefile", "README.md"]

  s.add_dependency "gds-api-adapters"
  s.add_dependency "govuk_app_config"
  s.add_dependency "kramdown"
  s.add_dependency "plek"
  s.add_dependency "rails", ">= 5.0.0.1"
  s.add_dependency "rake"
  s.add_dependency "rouge"
  s.add_dependency "sass", "3.7.4"
  s.add_dependency "sassc-rails", ">= 2.0.1"
  s.add_dependency "sprockets", "< 4"

  s.add_development_dependency "capybara", "~> 3.25"
  s.add_development_dependency "foreman", "= 0.85"
  s.add_development_dependency "gds-api-adapters", ">= 0"
  s.add_development_dependency "govuk_schemas", "~> 4.0"
  s.add_development_dependency "govuk_test", "~> 1"
  s.add_development_dependency "jasmine", "~> 3.5.1"
  s.add_development_dependency "pry-byebug"
  s.add_development_dependency "rspec-rails", "~> 4.0"
  s.add_development_dependency "rubocop-govuk", "~> 3"
  s.add_development_dependency "selenium-webdriver", "= 3.142.7"
  s.add_development_dependency "uglifier", ">= 4.1.0"
  # Webmock is needed to load slimmer test helpers
  # https://github.com/alphagov/slimmer/issues/201
  s.add_development_dependency "webmock", "~> 3.8.3"
  s.add_development_dependency "yard"
end
