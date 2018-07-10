module GovukPublishingComponents
  module Presenters
    class HighlightBoxesHelper
      def initialize(options)
        @items = options[:items]
      end

      def data_tracking?
        @items.any? { |item| item[:link][:data_attributes] }
      end
    end
  end
end
