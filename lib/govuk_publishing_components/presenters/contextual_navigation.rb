module GovukPublishingComponents
  module Presenters
    # @private
    class ContextualNavigation
      attr_reader :content_item, :request_path, :query_parameters

      # @param content_item A content item hash with strings as keys
      # @param request_path `request.path`
      def initialize(content_item, request)
        @content_item = content_item
        @request_path = simple_smart_answer? ? content_item["base_path"] : request.path
        @query_parameters = request.query_parameters
      end

      def simple_smart_answer?
        content_item["document_type"] == "simple_smart_answer"
      end

      def content_is_travel_advice?
        content_item["document_type"] == "travel_advice"
      end

      def html_publication_with_parent?
        (content_item["document_type"] == "html_publication") && parent_api_path
      end

      def parent_api_path
        parent = content_item.dig("links", "parent")&.first
        parent["base_path"] if parent
      end

      def taxon_breadcrumbs
        @taxon_breadcrumbs ||= ContentBreadcrumbsBasedOnTaxons.call(content_item)
      end

      def breadcrumbs
        breadcrumbs_based_on_ancestors
      end

      def finder_breadcrumbs
        return [] unless parent_finder

        [
          {
            title: "Home",
            url: "/",
          },
          {
            title: parent_finder["title"],
            url: parent_finder["base_path"],
          },
        ]
      end

      def use_taxon_breadcrumbs?
        content_is_tagged_to_a_live_taxon? && !content_is_a_specialist_document?
      end

      def content_tagged_to_a_finder?
        content_item.dig("links", "finder").present?
      end

      def content_tagged_to_mainstream_browse_pages?
        content_item.dig("links", "mainstream_browse_pages").present?
      end

      def content_parent_is_mainstream_browse?
        content_item.dig("links", "parent").present? && content_item.dig("links", "parent", 0, "document_type") == "mainstream_browse_page"
      end

      def content_has_curated_related_items?
        content_item.dig("links", "ordered_related_items").present? && content_item.dig("links", "parent").present?
      end

      def content_is_tagged_to_a_live_taxon?
        content_item.dig("links", "taxons").to_a.any? { |taxon| taxon["phase"] == "live" }
      end

      def content_is_a_specialist_document?
        content_item["schema_name"] == "specialist_document"
      end

      def content_is_a_html_publication?
        content_item["document_type"] == "html_publication"
      end

      def content_tagged_to_current_step_by_step?
        # TODO: remove indirection here
        step_nav_helper.show_header?
      end

      def content_tagged_to_a_reasonable_number_of_step_by_steps?
        step_nav_helper.show_related_links?
      end

      def content_tagged_to_other_step_by_steps?
        step_nav_helper.show_also_part_of_step_nav?
      end

      def content_tagged_to_ukraine_topical_event?
        ukraine_topical_event_id = "bfa79635-ffda-4b5d-8266-a9cd3a03649c"
        topical_events = content_item.dig("links", "topical_events").to_a
        topical_events.each do |topical_event|
          if topical_event["content_id"].eql?(ukraine_topical_event_id)
            return true
          end
        end

        false
      end

      def show_ukraine_cta?
        content_tagged_to_ukraine_topical_event?
      end

      def breadcrumbs_based_on_ancestors
        ContentBreadcrumbsBasedOnAncestors.call(content_item)
      end

      def step_nav_helper
        @step_nav_helper ||= PageWithStepByStepNavigation.new(content_item, request_path, query_parameters)
      end

      def parent_finder
        @parent_finder ||= content_item.dig("links", "finder", 0)
      end
    end
  end
end
