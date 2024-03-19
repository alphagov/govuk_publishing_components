module GovukPublishingComponents
  module Presenters
    # Simple wrapper around a content store representation of a content item.
    # Works for both the main content item and the expanded links in the links
    # hash.
    #
    # @private
    class ContentItem
      attr_reader :content_store_response

      def initialize(content_store_response)
        @content_store_response = content_store_response.to_h
      end

      def parent
        parent_item = content_store_response.dig("links", "parent", 0)
        return unless parent_item

        ContentItem.new(parent_item)
      end

      def parent_taxon
        # TODO: Determine what to do when there are multiple taxons/parents. For
        # now just display the first of each.
        parent_taxons.min_by(&:title)
      end

      def parent_taxons
        @parent_taxons ||= taxon_links
            .select { |t| phase_is_live?(t) }
            .map { |taxon| ContentItem.new(taxon) }.sort_by(&:title)
      end

      def phase_is_live?(taxon)
        taxon["phase"] == "live"
      end

      def mainstream_browse_pages
        content_store_response.dig("links", "mainstream_browse_pages").to_a.map do |link|
          ContentItem.new(link)
        end
      end

      def title
        content_store_response.fetch("title")
      end

      def base_path
        content_store_response.fetch("base_path")
      end

      def url_override
        content_store_response.dig("details", "url_override")
      end

      def description
        content_store_response.fetch("description", "")
      end

      def content_id
        content_store_response.fetch("content_id")
      end

      def related_links
        content_store_response.dig("links", "ordered_related_items").to_a.map do |link|
          ContentItem.new(link)
        end
      end

      def curated_taxonomy_sidebar_links
        content_store_response.dig("links", "ordered_related_items_overrides").to_a.map do |link|
          ContentItem.new(link)
        end
      end

      def related_ordered_items
        content_store_response.dig("links", "ordered_related_items").to_a
      end

      def quick_links
        content_store_response.dig("details", "quick_links").to_a
      end

      def related_collections
        filter_link_type(content_store_response.dig("links", "document_collections").to_a, "document_collection")
      end

      def related_other_contacts
        filter_link_type(content_store_response.dig("links", "related").to_a, "contact")
      end

      def related_organisations
        filter_link_type(content_store_response.dig("links", "organisations").to_a, "organisation")
      end

      def related_statistical_data_sets
        filter_link_type(content_store_response.dig("links", "related_statistical_data_sets").to_a, "statistical_data_set")
      end

      def related_topical_events
        filter_link_type(content_store_response.dig("links", "topical_events").to_a, "topical_event")
      end

      def related_world_locations
        content_store_response.dig("links", "world_locations").to_a
      end

      def related_worldwide_organisations
        filter_link_type(content_store_response.dig("links", "worldwide_organisations").to_a, "worldwide_organisation")
      end

      def external_links
        content_store_response.dig("details", "external_related_links").to_a
      end

      def as_taxonomy_sidebar_link
        {
          title:,
          link: base_path,
        }
      end

      def ==(other)
        content_id == other.content_id
      end

      def hash
        content_id.hash
      end

      def eql?(other)
        self == other
      end

    private

      def taxon_links
        # A normal content item's taxon links are stored in ["links"]["taxons"]
        # whereas a Taxon content item's taxon links are stored in ["links"]["parent_taxons"]
        # so here we cater for both possibilities
        content_store_response.dig("links", "taxons") || content_store_response.dig("links", "parent_taxons") || []
      end

      def filter_link_type(links, type)
        links.select do |link|
          link["document_type"] == type
        end
      end
    end
  end
end
