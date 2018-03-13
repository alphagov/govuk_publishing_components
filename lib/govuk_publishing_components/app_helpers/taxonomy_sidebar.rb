require 'govuk_publishing_components/app_helpers/services'
require 'govuk_publishing_components/app_helpers/configuration'

module GovukPublishingComponents
  module AppHelpers
    # @private
    class TaxonomySidebar
      def initialize(content_item)
        @content_item = ContentItem.new content_item
      end

      def sidebar
        {
          items: related_items,
        }
      end

    private

      def there_are_related_item_overrides?
        # TODO: We should check for any external links when we have "new"
        # external links being curated in Content Tagger
        @content_item.curated_taxonomy_sidebar_links.any?
      end

      def related_items
        related_items_factory.new(@content_item).related_items
      end

      def related_items_factory
        if there_are_related_item_overrides?
          CuratedTaxonomySidebarLinks
        else
          RummagerTaxonomySidebarLinks
        end
      end
    end
  end
end
