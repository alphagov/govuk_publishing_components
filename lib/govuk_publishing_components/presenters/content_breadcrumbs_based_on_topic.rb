module GovukPublishingComponents
  module Presenters
    class ContentBreadcrumbsBasedOnTopic
      def self.call(content_item)
        new(content_item).breadcrumbs
      end

      attr_reader :content_item

      def initialize(content_item)
        @content_item = content_item
      end

      def breadcrumbs
        breadcrumbs = [{ title: "Home", url: "/" }]
        return breadcrumbs unless topics.present?

        breadcrumbs << topic_breadcrumb
        breadcrumbs
      end

      def topic_breadcrumb
        {
          title: first_topic["title"],
          url: first_topic["base_path"],
        }
      end

      def first_topic
        topics.first
      end

      def topics
        @topics ||= content_item.dig("links", "topics")
      end
    end
  end
end
