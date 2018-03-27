module GovukPublishingComponents
  module Presenters
    # @private
    class ContextualNavigation
      attr_reader :content_item, :request_path

      # @param content_item A content item hash with strings as keys
      # @param request_path `request.path`
      def initialize(content_item, request_path)
        @content_item = content_item
        @request_path = request_path
      end

      def taxonomy_sidebar
        @taxonomy_sidebar ||= TaxonomySidebar.new(content_item).sidebar
      end

      def taxon_breadcrumbs
        @taxon_breadcrumbs ||= TaxonBreadcrumbs.new(content_item).breadcrumbs
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
          Breadcrumbs.new(content_item).breadcrumbs[:breadcrumbs]
        end
      end

      def should_present_taxonomy_navigation?
        navigation = NavigationType.new(content_item)
        navigation.should_present_taxonomy_navigation?
      end

      def step_nav_helper
        @step_nav_helper ||= StepNavHelper.new(content_item, request_path)
      end
    end
  end
end
