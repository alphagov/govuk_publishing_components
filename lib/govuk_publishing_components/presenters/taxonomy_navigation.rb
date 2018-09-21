module GovukPublishingComponents
  module Presenters
    class TaxonomyNavigation
      RELATED_SECTIONS = %w(
        topical_events
        world_locations
        statistical_data_sets
      ).freeze

      def initialize(content_item)
        @content_item = ContentItem.new content_item
        @related_navigation = RelatedNavigationHelper.new(content_item)
      end

      def sidebar
        {
          items: related_items,
          collections: collections,
        }.merge(related_navigation_links)
      end

    private

      def related_navigation_links
        {}.tap do |hash|
          @related_navigation.related_navigation.each do |key, items|
            hash[key.to_sym] = items if RELATED_SECTIONS.include?(key)
          end
        end
      end

      def related_items
        CuratedTaxonomySidebarLinks.new(@content_item).related_items
      end

      def collections
        links = @content_item.related_collections
        links.map do |link|
          {
            path: link["base_path"],
            text: link["title"]
          }
        end
      end
    end
  end
end
