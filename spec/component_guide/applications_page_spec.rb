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
    terser (1.2.6)
      execjs (>= 0.3.0, < 3)"
  fake_gemfile_partial = "
    govuk_publishing_components (61.3.5)
      govuk_personalisation (>= 0.7.0)
    terser (1.2.6)
      execjs (>= 0.3.0, < 3)"
  fake_ruby_file = "3.2.1\n"
  fake_package_json = '
    {
      "name": "frontend",
      "description": "Frontend application for GOV.UK",
      "packageManager": "yarn@3.5.0",
    }
  '
  fake_package_json_without_yarn_version = '
    {
      "name": "frontend",
      "description": "Frontend application for GOV.UK",
    }
  '

  describe "when the app is found locally" do
    before do
      allow(Dir).to receive(:exist?).and_return(true)
    end

    it "can read the gemfile.lock" do
      allow(File).to receive_messages(file?: true, read: fake_gemfile)
      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("local")
      expect(app.gem_version).to eq("61.3.1")
      expect(app.sass_version).to eq("1.93.2")
    end

    it "can read the ruby version" do
      allow(File).to receive_messages(file?: true, read: fake_ruby_file)
      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("local")
      expect(app.ruby_version).to eq("3.2.1")
    end

    it "can read the yarn version" do
      allow(File).to receive_messages(file?: true, read: fake_package_json)
      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("local")
      expect(app.yarn_version).to eq("3.5.0")
    end

    it "defaults to a sensible yarn version if not found in package.json" do
      allow(File).to receive_messages(file?: true, read: fake_package_json_without_yarn_version)
      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("local")
      expect(app.yarn_version).to be_nil
    end

    it "returns incomplete information" do
      allow(File).to receive_messages(file?: true, read: fake_gemfile_partial)
      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("local")
      expect(app.gem_version).to eq("61.3.5")
      expect(app.sass_version).to be_nil
    end

    describe "it checks the ruby version" do
      it "when 3.2 is nearing end of life" do
        allow(Date).to receive(:today).and_return(Date.parse("2026-02-20"))
        app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
        expect(app.ruby_status("3.1")).to eq("red")
        expect(app.ruby_status("3.1.2")).to eq("red")
        expect(app.ruby_status("3.2")).to eq("orange")
        expect(app.ruby_status("3.2.9")).to eq("orange")
        expect(app.ruby_status("3.3")).to eq("green")
        expect(app.ruby_status("3.3.4")).to eq("green")
      end

      it "when 3.1 is nearing end of life" do
        allow(Date).to receive(:today).and_return(Date.parse("2024-04-10"))
        app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
        expect(app.ruby_status("3.1")).to eq("orange")
        expect(app.ruby_status("3.1.2")).to eq("orange")
        expect(app.ruby_status("3.2")).to eq("green")
        expect(app.ruby_status("3.2.9")).to eq("green")
        expect(app.ruby_status("3.3")).to eq("green")
        expect(app.ruby_status("3.3.4")).to eq("green")
      end

      it "when 3.3 is nearing end of life" do
        allow(Date).to receive(:today).and_return(Date.parse("2027-03-10"))
        app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
        expect(app.ruby_status("3.1")).to eq("red")
        expect(app.ruby_status("3.1.2")).to eq("red")
        expect(app.ruby_status("3.2")).to eq("red")
        expect(app.ruby_status("3.2.9")).to eq("red")
        expect(app.ruby_status("3.3")).to eq("orange")
        expect(app.ruby_status("3.3.4")).to eq("orange")
      end

      it "in the distant future" do
        allow(Date).to receive(:today).and_return(Date.parse("2051-03-10"))
        app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
        expect(app.ruby_status("3.1")).to eq("red")
        expect(app.ruby_status("3.1.2")).to eq("red")
        expect(app.ruby_status("3.2")).to eq("red")
        expect(app.ruby_status("3.2.9")).to eq("red")
        expect(app.ruby_status("3.3")).to eq("red")
        expect(app.ruby_status("3.3.4")).to eq("red")
      end
    end
  end

  describe "when the app is not found locally" do
    it "returns no information if the app is not available remotely" do
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/Gemfile.lock").to_return(status: 404, body: "", headers: {})
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/.ruby-version").to_return(status: 404, body: "", headers: {})
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/package.json").to_return(status: 404, body: "", headers: {})

      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to be_nil
      expect(app.gem_version).to be_nil
      expect(app.sass_version).to be_nil
      expect(app.ruby_version).to be_nil
      expect(app.yarn_version).to be_nil
    end

    it "returns all information if the app is available remotely" do
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/Gemfile.lock").to_return(status: 200, body: fake_gemfile, headers: {})
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/.ruby-version").to_return(status: 200, body: fake_ruby_file, headers: {})
      stub_request(:get, "https://raw.githubusercontent.com:443/alphagov/#{fake_app}/main/package.json").to_return(status: 200, body: fake_package_json, headers: {})

      app = GovukPublishingComponents::ApplicationsPage.new(fake_app)
      expect(app.source).to eq("remote")
      expect(app.gem_version).to eq("61.3.1")
      expect(app.sass_version).to eq("1.93.2")
      expect(app.ruby_version).to eq("3.2.1")
      expect(app.yarn_version).to eq("3.5.0")
    end
  end
end
