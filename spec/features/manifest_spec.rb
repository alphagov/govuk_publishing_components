require "rails_helper"

describe "with `dartsass-rails`" do
  it "should include `govuk_publishing_components_manifest.js`" do
    if Gem.loaded_specs.key?("dartsass-rails")
      expect(Rails.application.config.assets.precompile).to include("govuk_publishing_components_manifest.js")
      expect(Rails.application.config.assets.precompile).not_to include("govuk_publishing_components_sassc-rails_manifest.js")
    end
  end
end

describe "with `sassc-rails`" do
  before "update `loaded_specs` to simulate using `sassc-rails`" do
    Gem.loaded_specs.delete("dartsass-rails")
    Gem.loaded_specs["sassc-rails"] = Gem::Specification.new do |s|
      s.name = "sassc-rails"
      s.version = Gem::Version.new("2.1")
    end
    Rails.application.config.assets.precompile = ["manifest.js"]
    load Rails.root.join(GovukPublishingComponents::Config.gem_directory, "config", "initializers", "assets.rb")
  end

  it "should include `govuk_publishing_components_sassc-rails_manifest.js`" do
    if Gem.loaded_specs.key?("sassc-rails")
      expect(Rails.application.config.assets.precompile).to include("govuk_publishing_components_sassc-rails_manifest.js")
      expect(Rails.application.config.assets.precompile).not_to include("govuk_publishing_components_manifest.js")
    end
  end

  after "update `loaded_specs` to its initial state" do
    Gem.loaded_specs.delete("sassc-rails")
    Gem.loaded_specs["dartsass-rails"] = Gem::Specification.new do |s|
      s.name = "dartsass-rails"
      s.version = Gem::Version.new("0.5.0")
    end
  end
end
