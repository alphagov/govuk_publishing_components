require 'spec_helper'

RSpec.describe GovukPublishingComponents::AppHelpers::BrandHelper do
  describe "Brand helper" do
    it "returns nothing if no brand is specified" do
      brand = GovukPublishingComponents::AppHelpers::BrandHelper.new(nil)

      expect(brand.brand_class).to eql(nil)
      expect(brand.border_color_class).to eql(nil)
      expect(brand.color_class).to eql(nil)
    end

    it "returns the expected brand" do
      brand = GovukPublishingComponents::AppHelpers::BrandHelper.new('attorney-generals-office')

      expect(brand.brand_class).to eql('brand--attorney-generals-office')
      expect(brand.border_color_class).to eql('brand__border-color')
      expect(brand.color_class).to eql('brand__color')
    end
  end
end
