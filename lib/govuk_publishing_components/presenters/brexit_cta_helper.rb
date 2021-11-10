module GovukPublishingComponents
  module Presenters
    class BrexitCtaHelper
      def initialize(content_item)
        @content_item = content_item
      end

      def title_key
        "components.related_navigation.transition.title"
      end

      def link_text_key
        "components.related_navigation.transition.link_text"
      end

      def link_path_key
        "components.related_navigation.transition.link_path"
      end
    end
  end
end
