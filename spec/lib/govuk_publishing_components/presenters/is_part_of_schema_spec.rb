require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::IsPartOfSchema do
  describe "#structured_data" do
    it "returns minimal schema.org isPartOf structured data for the given URL" do
      structured_data = described_class.new("https://www.gov.uk/some-collection").structured_data

      expect(structured_data).to eq(
        "@context" => "http://schema.org",
        "@type" => "CreativeWork",
        "sameAs" => "https://www.gov.uk/some-collection",
      )
    end
  end
end
