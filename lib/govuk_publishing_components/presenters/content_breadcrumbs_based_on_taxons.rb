module GovukPublishingComponents
  module Presenters
    # @private
    class ContentBreadcrumbsBasedOnTaxons
      def self.call(content_item)
        new(content_item).breadcrumbs
      end

      def initialize(content_item)
        @content_item = ContentItem.new(content_item)
      end

      def breadcrumbs
        ordered_parents = all_parents.map.with_index do |parent, index|
          {
            title: parent.title,
            url: (parent.url_override.presence || parent.base_path),
            is_page_parent: index.zero?,
          }
        end

        ordered_parents << {
          title: "Home",
          url: "/",
          is_page_parent: ordered_parents.empty?,
        }

        ordered_parents.reverse
      end

    private

      attr_reader :content_item

      def all_parents
        parents = []
        direct_parent = content_item.parent_taxon
        while direct_parent
          parents << direct_parent
          direct_parent = direct_parent.parent_taxon
        end

        parents
      end
    end
  end
end
