require 'govuk_navigation_helpers/services'
require 'govuk_navigation_helpers/configuration'

module GovukNavigationHelpers
  class TaxonomySidebar
    def initialize(content_item)
      @content_item = ContentItem.new content_item
    end

    def sidebar
      {
        items: related_items,
        collections: collections,
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
