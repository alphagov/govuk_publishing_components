module GovukPublishingComponents
  module AppHelpers
    class NavigationType
      GUIDANCE_SCHEMAS =
        %w{answer contact guide detailed_guide document_collection publication}.freeze

      def initialize(content_item)
        @content_item = content_item
      end

      def should_present_taxonomy_navigation?
        !content_is_tagged_to_browse_pages? &&
          content_is_tagged_to_a_live_taxon? &&
          content_schema_is_guidance?
      end

    private

      def content_is_tagged_to_a_live_taxon?
        @content_item.dig("links", "taxons").to_a.any? { |taxon| taxon["phase"] == "live" }
      end

      def content_is_tagged_to_browse_pages?
        @content_item.dig("links", "mainstream_browse_pages").present?
      end

      def content_schema_is_guidance?
        GUIDANCE_SCHEMAS.include? @content_item["schema_name"]
      end
    end
  end
end
