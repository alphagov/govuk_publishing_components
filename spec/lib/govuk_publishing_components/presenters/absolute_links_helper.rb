require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::AbsoluteLinksHelper do
  describe "absolute links helper" do
    it "makes links absolute using the virtual host environment variable" do
      ENV["VIRTUAL_HOST"] = "https://frontend.dev.gov.uk"
      helper = described_class.new
      expect(helper.make_url_absolute("/hello")).to eql("https://frontend.dev.gov.uk/hello")
      ENV["VIRTUAL_HOST"] = nil
    end

    it "makes links absolute using Plek.new.website_root" do
      helper = described_class.new
      expect(helper.make_url_absolute("/hello")).to eql("http://www.dev.gov.uk/hello")
    end

    it "appends // to urls missing a protocol (http, https or //)" do
      ENV["VIRTUAL_HOST"] = "frontend.dev.gov.uk"
      helper = described_class.new
      expect(helper.make_url_absolute("/hello")).to eql("//frontend.dev.gov.uk/hello")
      ENV["VIRTUAL_HOST"] = nil
    end

    it "ignores links that are already absolute" do
      helper = described_class.new
      expect(helper.make_url_absolute("https://www.gov.uk/hello")).to eql("https://www.gov.uk/hello")
      expect(helper.make_url_absolute("https://example.com/hello")).to eql("https://example.com/hello")
    end
  end
end
