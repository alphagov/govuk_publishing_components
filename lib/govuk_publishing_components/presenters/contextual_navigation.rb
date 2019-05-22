module GovukPublishingComponents
  module Presenters
    # @private
    class ContextualNavigation
      attr_reader :content_item, :request_path, :query_parameters
      delegate :content_tagged_to_current_step_by_step?,
               :show_related_links?, :show_also_part_of_step_nav?,
               :header, :related_links, :sidebar, :also_part_of_step_nav,
               to: :step_nav_helper

      # @param content_item A content item hash with strings as keys
      # @param request_path `request.path`
      def initialize(content_item, request)
        @content_item = content_item
        @request_path = simple_smart_answer? ? content_item['base_path'] : request.path
        @query_parameters = request.query_parameters
      end

      def simple_smart_answer?
        content_item['document_type'] === "simple_smart_answer"
      end

      def taxon_breadcrumbs
        @taxon_breadcrumbs ||= ContentBreadcrumbsBasedOnTaxons.new(content_item).breadcrumbs
      end

      def breadcrumbs
        if content_tagged_to_a_finder?
          parent_finder = content_item.dig("links", "finder", 0)
          return [] unless parent_finder

          [
            {
              title: "Home",
              url: "/",
            },
            {
              title: parent_finder['title'],
              url: parent_finder['base_path'],
            }
          ]
        else
          ContentBreadcrumbsBasedOnParent.new(content_item).breadcrumbs[:breadcrumbs]
        end
      end

      def content_tagged_to_a_finder?
        content_item.dig("links", "finder").present?
      end

      def content_tagged_to_mainstream_browse_pages?
        content_item.dig("links", "mainstream_browse_pages").present?
      end

      def content_has_curated_related_items?
        content_item.dig("links", "ordered_related_items").present?
      end

      def content_is_tagged_to_a_live_taxon?
        content_item.dig("links", "taxons").to_a.any? { |taxon| taxon["phase"] == "live" }
      end

      def content_is_a_specialist_document?
        content_item["schema_name"] == "specialist_document"
      end

    private

      def step_nav_helper
        @step_nav_helper ||= PageWithStepByStepNavigation.new(content_item, request_path, query_parameters)
      end
    end
  end
end
