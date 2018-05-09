module GovukPublishingComponents
  module Presenters
    class BrandHelper
      def initialize(brand)
        @brand = brand if brand
      end

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
