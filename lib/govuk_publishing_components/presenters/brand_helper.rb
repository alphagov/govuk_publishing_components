module GovukPublishingComponents
  module Presenters
    class BrandHelper
      def initialize(brand)
        @brand = brand if brand
      end

      def get_brand
        "brand--#{@brand}" if @brand
      end

      def get_brand_element(attribute)
        "brand__#{attribute}" if @brand
      end
    end
  end
end
