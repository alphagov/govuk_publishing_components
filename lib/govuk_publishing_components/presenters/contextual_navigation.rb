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

      def show_brexit_related_links?
        # If tagged directly to /brexit or /world/brexit
        # Or if tagged to a taxon which has /brexit as a parent
        # And is not the brexit checker start page
        brexit_start_page_content_id = "58d093a1-787d-4f36-a568-86da23a7b884"
        page_content_id = content_item["content_id"]
        tagged_to_brexit? && (page_content_id != brexit_start_page_content_id)
      end

      def brexit_cta_document_exceptions
        # /government/news/30-creative-teams-awarded-up-to-100000-each-for-festival-uk-2022-rd-project
        %w[c3752802-f091-43a9-ba90-33568fccf391]
      end

      def brexit_cta_document_exception?
        brexit_cta_document_exceptions.include?(content_item["content_id"])
      end

      def brexit_cta_document_type_exceptions
        %w[
          aaib_report
          answer
          asylum_support_decision
          fatality_notice
          maib_report
          raib_report
          simple_smart_answer
          transaction
        ]
      end

      def brexit_cta_document_type_exception?
        brexit_cta_document_type_exceptions.include?(content_item["document_type"])
      end

      def brexit_cta_taxon_allow_list
        # Entering and staying in the UK
        # Going and being abroad
        # Corporate information
        # Transport
        # Environment
        # International
        # Defence and armed forces
        # Society and culture
        # Government
        # Work
        # Welfare
        # Money
        # Business and industry
        # Health and social care
        # Education > Further and higher education
        # Education > Teaching and leadership
        # Education > Funding and finance for students
        # Coronavirus (COVID-19)
        %w[
          ba3a9702-da22-487f-86c1-8334a730e559
          9597c30a-605a-4e36-8bc1-47e5cdae41b3
          a544d48b-1e9e-47fb-b427-7a987c658c14
          a4038b29-b332-4f13-98b1-1c9709e216bc
          3cf97f69-84de-41ae-bc7b-7e2cc238fa58
          37d0fa26-abed-4c74-8835-b3b51ae1c8b2
          e491505c-77ae-45b2-84be-8c94b94f6a2b
          e2ca2f1a-0ff3-43ce-b813-16645ff27904
          e48ab80a-de80-4e83-bf59-26316856a5f9
          d0f1e5a3-c8f4-4780-8678-994f19104b21
          dded88e2-f92e-424f-b73e-6ad24a839c51
          6acc9db4-780e-4a46-92b4-1812e3c2c48a
          495afdb6-47be-4df1-8b38-91c8adb1eefc
          8124ead8-8ebc-4faf-88ad-dd5cbcc92ba8
          dd767840-363e-43ad-8835-c9ab516633de
          ff00b8b2-dcdb-4659-93c2-291c9be354f3
          23265b25-7ec3-4960-8517-4ff8d4d92cac
          5b7b9532-a775-4bd2-a3aa-6ce380184b6c
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

      def brexit_cta_taxon_exception_list
        # Entering and staying in the UK > Immigration offences
        # Entering and staying in the UK > Inspections of border, immigration and asylum services
        # Entering and staying in the UK > Refugees, asylum and human rights
        # Transport > Local transport
        # Education > Further and higher education > Education in prisons
        %w[
          fa13521f-9285-45b0-bd65-4a472a8037e7
          0fab9131-f877-4286-b4d8-922fbfb402b6
          08a8a69f-2825-4fe2-a4cf-c83458a5629e
          3b4d6319-fcef-4637-b35a-e3df76321894
          6426d1c5-93c8-4659-85d5-1f0d3368a124
        ]
      end

      def brexit_cta_taxon_exception_list?
        taxons = content_item.dig("links", "taxons").to_a
        taxons.each do |taxon|
          if brexit_cta_taxon_exception_list.include?(taxon["content_id"]) || parent_taxon_include?(taxon, brexit_cta_taxon_exception_list)
            return true
          end
        end
        false
      end

      def brexit_cta_exception?
        brexit_cta_document_exception? ||
          brexit_cta_document_type_exception? ||
          brexit_cta_taxon_exception_list?
      end

      def show_brexit_cta?
        brexit_cta_taxon_allow_list? &&
          step_by_step_count.zero? &&
          !brexit_cta_exception?
      end

      def step_by_step_count
        step_nav_helper.step_navs.count
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
