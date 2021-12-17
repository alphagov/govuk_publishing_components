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

      def priority_breadcrumbs
        @priority_breadcrumbs ||= ContentBreadcrumbsBasedOnPriority.call(content_item, query_parameters)
      end

      def topic_breadcrumbs
        @topic_breadcrumbs ||= ContentBreadcrumbsBasedOnTopic.call(content_item)
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

      def tagged_to_brexit?
        taxons = content_item.dig("links", "taxons").to_a
        brexit_taxon = "d6c2de5d-ef90-45d1-82d4-5f2438369eea"
        world_brexit_taxon = "d4c4d91d-fbe7-4eff-bd57-189138c626c9"

        taxons.each do |taxon|
          if taxon["content_id"].eql?(brexit_taxon) ||
              taxon["content_id"].eql?(world_brexit_taxon) ||
              taxon.dig("links", "parent_taxons").to_a.any? { |taxon_item| taxon_item["content_id"].eql?(brexit_taxon) }
            return true
          end
        end

        false
      end

      def brexit_cta_taxon_allow_list
        # Overseas businesses: exporting to the UK
        # Exporting goods and services
        # Exporting
        # Manufacturing, wholesaling, importing and exporting medicines
        # Importing goods and services
        # Importing
        # Manufacturing, wholesaling, importing and exporting medicines
        %w[
          2f8b848d-23c8-4f42-a41a-df1f81c64d0f
          8af13fba-d969-4d87-a02e-2e71783d47be
          efa9782b-a3d0-4ca0-9c92-3b89748175b7
          f441e630-2bba-4bbd-8c1b-22ae61cc00c2
          4788b4b8-2642-47ca-bfc2-bd7e8705a1da
          d74faafc-781d-4087-8e0c-be4216180059
          f441e630-2bba-4bbd-8c1b-22ae61cc00c2
        ]
      end

      def brexit_cta_taxon_allow_list?
        taxons = content_item.dig("links", "taxons").to_a
        taxons.each do |taxon|
          if brexit_cta_taxon_allow_list.include?(taxon["content_id"]) || parent_taxon_include?(taxon, brexit_cta_taxon_allow_list)
            return true
          end
        end
        false
      end

      def parent_taxon_include?(taxon, taxon_list)
        if taxon.present?
          if taxon.dig("links", "parent_taxons").to_a.any? { |taxon_item| taxon_list.include?(taxon_item["content_id"]) }
            return true
          end

          taxon.dig("links", "parent_taxons").to_a.any? { |taxon_item| parent_taxon_include?(taxon_item, taxon_list) }
        else
          false
        end
      end

      def show_brexit_cta?
        brexit_cta_taxon_allow_list?
      end

      def show_covid_booster_cta?
        !covid_booster_cta_document_type_exempt? &&
          !covid_booster_cta_taxon_exception_list?
      end

      def covid_booster_cta_document_type_exempt?
        covid_booster_cta_document_type_exceptions.include?(content_item["document_type"])
      end

      def covid_booster_cta_document_type_exceptions
        %w[
          simple_smart_answer
          smart_answer
          step_by_step_nav
        ]
      end

      def covid_booster_cta_taxon_exception_list?
        taxons = content_item.dig("links", "taxons").to_a
        taxons.each do |taxon|
          if covid_booster_cta_taxon_exception_list.include?(taxon["content_id"]) || parent_taxon_include?(taxon, covid_booster_cta_taxon_exception_list)
            return true
          end
        end
        false
      end

      def covid_booster_cta_taxon_exception_list
        # Welfare > Death and benefits
        # Life circumstances > Death and bereavement
        # Life circumstances > Death registration disclosure
        %w[
          ac7b8472-5d09-4679-9551-87847b0ac827
          0fffa994-b76d-4539-8bf9-2a6c6751580d
          de978199-11e8-49b9-965e-4fa6a7ae79a8
        ]
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
