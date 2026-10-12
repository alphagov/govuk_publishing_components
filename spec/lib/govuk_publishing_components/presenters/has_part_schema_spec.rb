require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::HasPartSchema do
  describe "#structured_data" do
    it "returns minimal schema.org hasPart structured data for the given URL" do
      structured_data = described_class.new("https://www.gov.uk/some-part").structured_data

      expect(structured_data).to eq(
        "@context" => "http://schema.org",
        "@type" => "CreativeWork",
        "sameAs" => "https://www.gov.uk/some-part",
      )
    end
  end

  describe "#has_part_url" do
    it "exposes the URL passed to the initializer" do
      schema = described_class.new("https://www.gov.uk/some-part")

      expect(schema.has_part_url).to eq("https://www.gov.uk/some-part")
    end
  end
end
