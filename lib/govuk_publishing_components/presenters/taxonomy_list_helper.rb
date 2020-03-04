module GovukPublishingComponents
  module Presenters
    class TaxonomyListHelper
      def initialize(image_cards)
        @image_cards = image_cards
      end

      def image_card_data
        @image_cards[:items].map do |image_card|
          {
            context: image_card[:image][:context],
            href: image_card[:link][:path],
            heading_text: image_card[:link][:text],
            image_src: image_card[:image][:url],
            image_alt: image_card[:image][:alt],
            heading_level: image_card[:link][:heading_level],
            href_data_attributes: image_card[:link][:data_attributes],
          }
        end
      end
    end
  end
end
