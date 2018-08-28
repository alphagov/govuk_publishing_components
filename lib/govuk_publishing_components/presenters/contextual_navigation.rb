module GovukPublishingComponents
  module Presenters
    # @private
    class ContextualNavigation
      attr_reader :content_item, :request_path

      # @param content_item A content item hash with strings as keys
      # @param request_path `request.path`
      def initialize(content_item, request_path, active_step_nav_content_id = false)
        @content_item = content_item
        @request_path = simple_smart_answer? ? content_item['base_path'] : request_path
        @active_step_nav_content_id = active_step_nav_content_id
      end

      def simple_smart_answer?
        content_item['document_type'] === "simple_smart_answer"
      end

      def taxonomy_sidebar
        @taxonomy_sidebar ||= TaxonomyNavigation.new(content_item).sidebar
      end

      def taxon_breadcrumbs
        @taxon_breadcrumbs ||= ContentBreadcrumbsBasedOnTaxons.new(content_item).breadcrumbs
      end

      def breadcrumbs
        if content_item["schema_name"] == "specialist_document"
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

      def content_tagged_to_mainstream_browse_pages?
        content_item.dig("links", "mainstream_browse_pages").present?
      end

      def content_has_curated_related_items?
        content_item.dig("links", "ordered_related_items").present?
      end

      def content_is_tagged_to_a_live_taxon?
        content_item.dig("links", "taxons").to_a.any? { |taxon| taxon["phase"] == "live" }
      end

      def content_tagged_to_single_step_by_step?
        # TODO: remove indirection here
        step_nav_helper.show_header?
      end

      def content_tagged_to_a_reasonable_number_of_step_by_steps?
        step_nav_helper.show_related_links?
      end

      def step_nav_helper
        @step_nav_helper ||= PageWithStepByStepNavigation.new(content_item, request_path, @active_step_nav_content_id)
      end
    end
  end
end
