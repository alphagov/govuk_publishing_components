require "rails_helper"
require_relative "../../app/models/govuk_publishing_components/applications_page"

describe "The applications status page" do
  fake_app = "application"
  fake_gemfile = "
    govspeak (10.6.5)
      govuk_publishing_components (>= 43)
    govuk_ab_testing (3.0.0)
    govuk_publishing_components (61.3.1)
      govuk_personalisation (>= 0.7.0)
    sass-embedded (1.93.2)
      google-protobuf (~> 4.31)
    slimmer (18.7.0)
      json
    terser (1.2.6)
      execjs (>= 0.3.0, < 3)"
  fake_gemfile_partial = "
    govuk_publishing_components (61.3.5)
      govuk_personalisation (>= 0.7.0)
    terser (1.2.6)
      execjs (>= 0.3.0, < 3)"

  describe "when the app is found locally" do
    before do
      allow(Dir).to receive(:exist?).and_return(true)
    end

    it "returns all information" do
      allow(File).to receive_messages(file?: true, read: fake_gemfile)
      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("local")
      expect(app.gem_version).to eq("61.3.1")
      expect(app.slimmer_version).to eq("18.7.0")
      expect(app.sass_version).to eq("1.93.2")
    end

    it "returns incomplete information" do
      allow(File).to receive_messages(file?: true, read: fake_gemfile_partial)
      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("local")
      expect(app.gem_version).to eq("61.3.5")
      expect(app.slimmer_version).to be_nil
      expect(app.sass_version).to be_nil
    end
  end

  describe "when the app is not found locally" do
    it "returns no information if the app is not available remotely" do
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/Gemfile.lock").to_return(status: 404, body: "", headers: {})

      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to be_nil
      expect(app.gem_version).to be_nil
      expect(app.slimmer_version).to be_nil
      expect(app.sass_version).to be_nil
    end

    it "returns all information if the app is available remotely" do
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/Gemfile.lock").to_return(status: 200, body: fake_gemfile, headers: {})

      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("remote")
      expect(app.gem_version).to eq("61.3.1")
      expect(app.slimmer_version).to eq("18.7.0")
      expect(app.sass_version).to eq("1.93.2")
    end
  end
end
