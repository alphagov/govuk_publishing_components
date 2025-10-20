require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/applications_page"

describe "The applications status page" do
  it "returns no information if the app doesn't exist" do
    fake_app = "application"
    stub_request(:get, "https://raw.githubusercontent.com/alphagov/#{fake_app}/main/Gemfile.lock").to_return(status: 404, body: "", headers: {})

    app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
    expect(app.found).to eq(false)
    expect(app.gem_version).to eq(nil)
    expect(app.slimmer_version).to eq(nil)
  end
end
