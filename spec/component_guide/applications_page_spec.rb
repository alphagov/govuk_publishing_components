require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/applications_page"

describe "The applications status page" do
  fake_app = "application"

  it "returns no information if the app doesn't exist" do
    stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/Gemfile.lock").to_return(status: 404, body: "", headers: {})

    app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
    expect(app.location).to be_nil
    expect(app.gem_version).to be_nil
    expect(app.slimmer_version).to be_nil
  end

  it "returns information if the app is found" do
    body = "
    govspeak (10.6.5)
      govuk_publishing_components (>= 43)
    govuk_ab_testing (3.0.0)
    govuk_publishing_components (61.3.1)
      govuk_app_config
      govuk_personalisation (>= 0.7.0)
    slimmer (18.7.0)
      json
    "
    stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/Gemfile.lock").to_return(status: 200, body: body, headers: {})

    app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
    expect(app.location).to eq("remote")
    expect(app.gem_version).to eq("61.3.1")
    expect(app.slimmer_version).to eq("18.7.0")
  end
end
