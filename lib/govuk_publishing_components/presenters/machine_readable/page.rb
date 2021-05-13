module GovukPublishingComponents
  module Presenters
    class Page
      attr_reader :local_assigns

      def initialize(local_assigns)
        @local_assigns = local_assigns
      end

      def schema
        local_assigns.fetch(:schema)
      end

      def canonical_url
        local_assigns[:canonical_url] || (Plek.current.website_root + content_item["base_path"])
      end

      def body
        local_assigns[:body] || content_item.dig("details", "body")
      end

      def title
        local_assigns[:title] || content_item["title"]
      end

      def description
        local_assigns[:description] || content_item["description"]
      end

      def has_image?
        content_item.dig("details", "image").present?
      end

      def image_url
        content_item.dig("details", "image", "high_resolution_url") || content_item.dig("details", "image", "url")
      end

      def image_alt_text
        content_item.dig("details", "image", "alt_text")
      end

      def image_placeholders
        local_assigns[:image_placeholders]
      end

      def document_type
        content_item["document_type"]
      end

      def base_path
        content_item["base_path"]
      end

      def attachments
        content_item.dig("details", "attachments")
      end

      def content_item
        local_assigns[:content_item]
      end

      def logo_url
        local_assigns[:logo_url]
      end

      def requested_path
        local_assigns[:request_path]
      end

      def withdrawn?
        content_item["withdrawn_notice"].present?
      end
    end
  end
end
