module GovukPublishingComponents
  module Presenters
    # @private
    class CuratedTaxonomySidebarLinks
      def initialize(content_item)
        @content_item = content_item
      end

      def related_items
        @related_items ||=
          taxon_links +
          elsewhere_on_gov_uk_links +
          elsewhere_on_the_web_links
      end

    private

      def taxon_links
        @content_item.parent_taxons.map do |taxon|
          {
            title: taxon.title,
            url: taxon.base_path,
            description: taxon.description,
            related_content: format_for_sidebar(related_content_by_taxon[taxon]),
          }
        end
      end

      def elsewhere_on_gov_uk_links
        elsewhere_items = related_content_elsewhere_on_govuk
        return [] if elsewhere_items.empty?

        [
          {
            title: "Elsewhere on GOV.UK",
            related_content: format_for_sidebar(elsewhere_items),
          },
        ]
      end

      def elsewhere_on_the_web_links
        return [] if @content_item.external_links.empty?

        external_links = @content_item.external_links.map do |link|
          {
            title: link["title"],
            link: link["url"],
          }
        end

        [
          {
            title: "Elsewhere on the web",
            related_content: external_links,
          },
        ]
      end

      def related_content_by_taxon
        @related_content_by_taxon ||= begin
          curated_related_items = @content_item.curated_taxonomy_sidebar_links.to_set

          @content_item.parent_taxons.each_with_object({}) do |taxon, items_by_taxon|
            items_related_to_taxon = filter_items_by_taxon(curated_related_items, taxon)
            items_by_taxon[taxon] = items_related_to_taxon
            curated_related_items = undisplayed_items(curated_related_items, items_related_to_taxon)
          end
        end
      end

      def related_content_elsewhere_on_govuk
        @related_content_elsewhere_on_govuk ||= begin
          related_content = @content_item.curated_taxonomy_sidebar_links.to_set
          related_taxon_content = related_content_by_taxon.values.flatten.to_set
          related_content - related_taxon_content
        end
      end

      def filter_items_by_taxon(items, taxon)
        items.select do |item|
          item.parent_taxons.include?(taxon)
        end
      end

      def undisplayed_items(all_items, displayed_items)
        all_items - displayed_items
      end

      def format_for_sidebar(collection)
        collection
          .to_a
          .sort_by(&:title)
          .map(&:as_taxonomy_sidebar_link)
      end
    end
  end
end
