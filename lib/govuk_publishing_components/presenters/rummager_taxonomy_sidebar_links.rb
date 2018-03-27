require 'govuk_app_config'

module GovukPublishingComponents
  module Presenters
    # @private
    class RummagerTaxonomySidebarLinks
      def initialize(content_item)
        @content_item = content_item
      end

      def related_items
        parent_taxons = @content_item.parent_taxons
        used_related_links = Set.new

        parent_taxons.each_with_index.map do |parent_taxon, index|
          related_content = index < 2 ? content_related_to(parent_taxon, used_related_links) : []

          used_related_links.merge(
            related_content.map { |content| content[:link] }
          )

          {
            title: parent_taxon.title,
            url: parent_taxon.base_path,
            description: parent_taxon.description,
            related_content: related_content,
          }
        end
      end

    private

      # This method will fetch content related to content_item, and tagged to taxon. This is a
      # temporary method that uses search to achieve this. This behaviour is to be moved into
      # the content store
      def content_related_to(taxon, used_related_links)
        GovukStatsd.time(:taxonomy_sidebar_search_time) do
          begin
            results = Services.rummager.search(
              similar_to: @content_item.base_path,
              start: 0,
              count: 3,
              filter_taxons: [taxon.content_id],
              filter_navigation_document_supertype: 'guidance',
              reject_link: used_related_links.to_a,
              fields: %w[title link],
            )['results']

            GovukStatsd.increment(:taxonomy_sidebar_searches)

            results
              .map { |result| { title: result['title'], link: result['link'], } }
              .sort_by { |result| result[:title] }
          rescue StandardError => e
            GovukError.notify(e)
            []
          end
        end
      end
    end
  end
end
