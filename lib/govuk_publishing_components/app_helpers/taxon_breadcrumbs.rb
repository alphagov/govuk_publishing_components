module GovukPublishingComponents
  module AppHelpers
    # @private
    class TaxonBreadcrumbs
      def initialize(content_item)
        @content_item = ContentItem.new(content_item)
      end

      def breadcrumbs
        ordered_parents = all_parents.map.with_index do |parent, index|
          {
            title: parent.title,
            url: parent.base_path,
            is_page_parent: index.zero?
          }
        end

        ordered_parents << {
          title: "Home",
          url: "/",
          is_page_parent: ordered_parents.empty?
        }

        ordered_breadcrumbs = ordered_parents.reverse
        ordered_breadcrumbs << { title: content_item.title, is_current_page: true }

        {
          breadcrumbs: ordered_breadcrumbs
        }
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
