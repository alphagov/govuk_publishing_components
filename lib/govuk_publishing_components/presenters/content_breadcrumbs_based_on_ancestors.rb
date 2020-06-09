module GovukPublishingComponents
  module Presenters
    # @private
    class ContentBreadcrumbsBasedOnAncestors
      def self.call(content_item)
        new(content_item).breadcrumbs
      end

      def initialize(content_item)
        @content_item = ContentItem.new(content_item)
      end

      def breadcrumbs
        ordered_ancestors = all_ancestors.map do |ancestor|
          { title: ancestor.title, url: ancestor.base_path }
        end

        ordered_ancestors << { title: "Home", url: "/" }
        ordered_ancestors.reverse!
        ordered_ancestors
      end

    private

      attr_reader :content_item

      def all_ancestors
        ancestors = []

        parent = content_item.parent
        while parent
          ancestors << parent

          parent = parent.parent
        end

        ancestors
      end
    end
  end
end
