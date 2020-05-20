module GovukPublishingComponents
  module Presenters
    class ContentBreadcrumbsPrependParentTaxons
      attr_reader :content_item

      def initialize(content_item)
        @content_item = ContentItem.new(content_item)
      end
    end
  end
end
