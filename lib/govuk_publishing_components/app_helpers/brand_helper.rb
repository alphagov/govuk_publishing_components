module GovukPublishingComponents
  module AppHelpers
    class BrandHelper
      def initialize(brand)
        @brand = brand if brand
      end

      # Apply government organisation branding to individual components, specifically
      # link colour and border colour
      # see https://github.com/alphagov/govuk_publishing_components/blob/main/docs/component_branding.md

      def brand_class
        "brand--#{@brand}" if @brand
      end

      def border_color_class
        "brand__border-color" if @brand
      end

      def color_class
        "brand__color" if @brand
      end
    end
  end
end
