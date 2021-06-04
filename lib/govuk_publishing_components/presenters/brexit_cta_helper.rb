module GovukPublishingComponents
  module Presenters
    class BrexitCtaHelper
      BREXIT_HUB_PAGE_IDS = %w[
        6555e0bf-c270-4cf9-a0c5-d20b95fab7f1
        91cd6143-69d5-4f27-99ff-a52fb0d51c78
      ].freeze

      def initialize(content_item)
        @content_item = content_item
      end

      def title_key
        use_brexit_hub_page_navigation? ? "components.related_navigation.transition.hub_page_title" : "components.related_navigation.transition.title"
      end

      def link_text_key
        use_brexit_hub_page_navigation? ? "components.related_navigation.transition.hub_page_link_text" : "components.related_navigation.transition.link_text"
      end

      def link_path_key
        use_brexit_hub_page_navigation? ? "components.related_navigation.transition.hub_page_link_path" : "components.related_navigation.transition.link_path"
      end

    private

      def use_brexit_hub_page_navigation?
        I18n.locale == :en &&
          BREXIT_HUB_PAGE_IDS.include?(@content_item["content_id"])
      end
    end
  end
end
