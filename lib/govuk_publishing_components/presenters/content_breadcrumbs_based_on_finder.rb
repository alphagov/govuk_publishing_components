module GovukPublishingComponents
  module Presenters
    # @private
    class ContentBreadcrumbsBasedOnFinder
      def self.call(content_item)
        new(content_item).breadcrumbs
      end

      def initialize(content_item)
        @content_item = ContentItem.new(content_item)
      end

      def breadcrumbs
          return [] unless parent_finder

          [
            {
              title: "Home",
              url: "/",
            },
            {
              title: parent_finder["title"],
              url: parent_finder["base_path"],
            },
          ]
      end

    private
    
      attr_reader :content_item

      def parent_finder
        @parent_finder ||= content_item.dig("links", "finder", 0)
      end
    end
  end
end
