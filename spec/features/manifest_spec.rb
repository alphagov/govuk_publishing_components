require "rails_helper"

describe "with `dartsass-rails`" do
  it "should include `govuk_publishing_components_manifest.js`" do
    expect(Rails.application.config.assets.precompile).to include("govuk_publishing_components_manifest.js")
    expect(Rails.application.config.assets.precompile).not_to include("govuk_publishing_components_sassc-rails_manifest.js")
  end
end
