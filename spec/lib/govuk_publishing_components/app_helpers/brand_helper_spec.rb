require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::BrandHelper do
  describe "Brand helper" do
    it "returns nothing if no brand is specified" do
      brand = described_class.new(nil)

      expect(brand.brand_class).to be_nil
      expect(brand.border_color_class).to be_nil
      expect(brand.color_class).to be_nil
    end

    it "returns the expected brand" do
      brand = described_class.new("attorney-generals-office")

      expect(brand.brand_class).to eql("brand--attorney-generals-office")
      expect(brand.border_color_class).to eql("brand__border-color")
      expect(brand.color_class).to eql("brand__color")
    end
  end
end
