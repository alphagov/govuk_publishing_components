module GovukPublishingComponents
  module Presenters
    # @private
    # Only used by the related_topics_navigation component
    class RelatedTopicsNavigation
      def self.call(content_item)
        new(content_item).()
      end

      def initialize(content_item)
        @content_item = content_item
      end

      def call
        if related_links.any?
          related_links.map { |link| { path: link['base_path'], text: link['title'] } }
        elsif live_taxon_links.any?
          live_taxon_links.map { |link| { path: link['base_path'], text: link['title'] } }
        else
          []
        end
      end

    private

      def content_item_links(document_type, link_key = document_type.pluralize)
        @content_item
          .dig('links', link_key)
          .yield_self { |links| Array(links) }
          .find_all { |link| link['document_type'] == document_type }
      end

      def mainstream_browse_page_links
        @mainstream_browse_page_links ||= content_item_links('mainstream_browse_page')
      end

      def related_links
        mainstream_browse_page_links + topic_links.find_all do |topic_link|
          mainstream_browse_page_links.none? do |mainstream_browse_page_link|
            mainstream_browse_page_link['title'] == topic_link['title']
          end
        end
      end

      def live_taxon_links
        @live_taxon_links ||= content_item_links('taxon').find_all { |taxon| taxon['phase'] == 'live' }
      end

      def topic_links
        @topic_links ||= content_item_links('topic')
      end
    end
  end
end
