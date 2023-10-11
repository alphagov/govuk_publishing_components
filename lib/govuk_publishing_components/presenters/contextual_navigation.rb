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

      def breadcrumbs
        if content_tagged_to_a_finder?
          finder_breadcrumbs
        elsif content_tagged_to_current_step_by_step?
          # step_nav_helper.header(@ga4_tracking)
        elsif content_is_tagged_to_a_live_taxon? && prioritise_taxon_breadcrumbs
          taxon_breadcrumbs
        elsif content_is_travel_advice?
          ancestor_breadcrumbs
        elsif content_tagged_to_mainstream_browse_pages?
          ancestor_breadcrumbs
        elsif content_has_a_topic?
          topic_breadcrumbs
        elsif use_taxon_breadcrumbs?
          taxon_breadcrumbs
        elsif ancestor_breadcrumbs.any?
          ancestor_breadcrumbs
        else
          nil
        end
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

      def topic_breadcrumbs
        @topic_breadcrumbs ||= ContentBreadcrumbsBasedOnTopic.call(content_item)
      end

      def ancestor_breadcrumbs
       @ancestor_breadcrumbs ||= ContentBreadcrumbsBasedOnAncestors.call(content_item)
      end

      def finder_breadcrumbs
        @finder_breadcrumbs ||= ContentBreadcrumbsBasedOnFinder.call(content_item)
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

      def content_has_a_topic?
        content_item.dig("links", "topics").present?
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

      def step_nav_helper
        @step_nav_helper ||= PageWithStepByStepNavigation.new(content_item, request_path, query_parameters)
      end

    end
  end
end
