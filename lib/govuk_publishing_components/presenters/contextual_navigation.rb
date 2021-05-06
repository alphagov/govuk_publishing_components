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
        # and answer pages that have a start button (tracked in https://docs.google.com/spreadsheets/d/1ynH8zIjvElvK-u8JLI8KOYylxTbzJsoXRqEnqrnqv_4/edit)
        %w[
          c3752802-f091-43a9-ba90-33568fccf391
          e1a9ce2b-4085-4761-b70f-d125a6571de3
          6a2bf66e-2313-4204-afd5-9940de5e1d66
          f65b0ac7-b8cd-476b-bd5d-738268517659
          45ad868a-2e79-4029-991b-c29559d7eb29
          e4e9c4ec-385e-4758-93ac-388bc154815e
          cee73f76-83f0-44e2-b657-3b51a9cbc76e
          9a945506-60bc-44d8-a2ec-0eb2824732d6
          6ae16c12-a554-44e2-b3e3-596375aa1b9a
          9add4ccc-dc4c-44cf-9b69-6878c162d431
          4f5cf1cd-efda-4c49-8292-1db1c6c3cfb0
          73058592-dedf-4379-9a1d-d8222a796c0a
          c9259172-5432-43a6-b710-409d463c7627
          59ecfc6d-cb9e-49b8-b013-fc368ebdf8ed
          9897695d-624b-4cb9-b873-f3113f0332a1
          715f4659-b058-46ec-84c8-cc346c210778
          c63890f9-2356-4be3-9e07-6cf4b8de7081
          e7661ec8-b678-444e-b4d0-a221fa83a7f7
          723f9c0a-bcdb-4d8f-952c-6df0ed468c57
          a1c420b7-11d7-4b9c-a97e-406fb73c0200
          c1347936-839b-4547-a570-0c315c34ee45
          1396f68b-6ffa-47ef-a049-414e7b548e81
          3b054acf-d0af-470e-b912-9481204d1a9a
          317b9c08-928b-4fd2-bc8e-4c6acf287c58
          44d6cb7a-d853-4cd8-a9cb-69eff0299d9e
          15517245-f142-4e45-ad84-773250f7d5a2
          6fe6644d-d037-4ea4-baf6-800dc1966ed0
          4a63625c-a195-4b86-9562-cb6653dd26ff
          47521233-20a8-4d02-ba31-6e1977448fd1
          7b8ca4ac-f3a3-41b8-9555-9e244c36575b
          be1a82d1-e53c-431a-9e7a-337ed4b2654f
          6c445001-4e29-4853-8c14-444d7f9374ee
          c8cf2a7c-5c13-4f3d-b1ff-6a7eb5533973
          2422a237-f8f1-4e9f-ad51-f1d44fde9755
          ae000c08-c74f-467b-b8a4-90f138252a5c
          7eec7800-9c4d-4160-af53-57b5d3e02972
          eb545b3b-111b-4c3c-890c-c9ec29b9090d
          8d705ade-8977-480d-9080-72a19e341c2a
          2a0dd317-0252-4c7c-8c13-b43af28406bc
          f27e5792-a84b-4164-9890-7e86767634e8
          b0b9a600-1fe6-4257-9e68-2be0f59ea25d
          28fa04ea-42e1-46ad-9abc-acf132c5666d
          64b27b8a-ae53-4034-a812-f4805cd7e3ad
          1dd5a75f-18b4-419d-b2b6-6d4808f2c7e4
          b21b9e34-455c-4305-b4cc-4e6b8d3f7522
          0ab53a0d-b098-43a8-b3cc-8b3224697228
          e3862156-ba5a-41ba-8ee6-22e5cd6a6144
          2e8f7fae-7164-459c-898b-0c0538eee3e0
          6087439c-26d2-4881-b345-5160e23f3b5e
          cac78a0a-9c28-436a-a29e-8ccbe8fbc956
          c2fd13a5-537b-4368-ac2e-6078b2c463f1
          98f0a21d-7b67-4089-a98c-f0a0177291a2
          06692612-8c39-464c-8aee-2aa62e6c8887
          df943977-69cb-479d-a921-9410d603c471
          2656eb6b-f2eb-4982-8a90-e40d03a34a4d
          4ca8698b-4a24-45ff-baea-7633cc24b679
          ed73581f-9bf8-48b5-bb66-935581a255e3
          15f1c594-af1d-4f16-97cc-ad4d12017509
        ]
      end

      def brexit_cta_document_exception?
        brexit_cta_document_exceptions.include?(content_item["content_id"])
      end

      def brexit_cta_document_type_exceptions
        %w[
          aaib_report
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

      def brexit_cta_lang_allow_list?
        %w[en cy].include?(content_item["locale"])
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
          brexit_cta_lang_allow_list? &&
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
