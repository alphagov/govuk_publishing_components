module GovukPublishingComponents
  module Presenters
    # @private
    class ContextualSidebar
      attr_reader :content_item, :request_path

      # @param content_item A content item hash with strings as keys
      # @param request_path `request.path`
      def initialize(content_item, request_path)
        @content_item = content_item
        @request_path = request_path
      end

      def taxonomy_sidebar
        nav_helper = GovukNavigationHelpers::NavigationHelper.new(content_item)
        nav_helper.taxonomy_sidebar
      end

      def should_present_taxonomy_navigation?
        navigation = GovukPublishingComponents::AppHelpers::NavigationType.new(content_item)
        navigation.should_present_taxonomy_navigation?
      end

      def step_nav_helper
        GovukPublishingComponents::AppHelpers::StepNavHelper.new(content_item, request_path)
      end
    end
  end
end
