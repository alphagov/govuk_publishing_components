$:.push File.expand_path("../lib", __FILE__)

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

  s.files = Dir["{app,config,db,lib}/**/*", "DEVELOPMENT.md", "LICENCE.md", "Rakefile", "README.md"]

  s.add_dependency "rails", ">= 5.0.0.1"
  s.add_dependency "slimmer"
  s.add_dependency "sass-rails", ">= 5.0.4"
  s.add_dependency "govuk_frontend_toolkit"
  s.add_dependency "govspeak", ">= 5.0.3"

  s.add_development_dependency "govuk-lint", "~> 2.1.0"
  s.add_development_dependency "rspec", "~> 3.6"
  s.add_development_dependency "capybara", "~> 2.14.4"
  s.add_development_dependency "poltergeist", "~> 1.16.0"
  s.add_development_dependency "jasmine", "~> 2.4.0"

  # Needed to load slimmer test helpers
  # https://github.com/alphagov/slimmer/issues/201
  s.add_development_dependency "webmock", "~> 1.18.0"
end
