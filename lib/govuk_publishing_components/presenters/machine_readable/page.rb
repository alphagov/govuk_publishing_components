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
        local_assigns[:canonical_url] || (Plek.new.website_root + content_item["base_path"])
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
        header_area_image.present?
      end

      def image_url
        header_area_image_url_from_sources || header_area_image&.dig("high_resolution_url") || header_area_image&.dig("url")
      end

      def image_alt_text
        header_area_image&.dig("alt_text")
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

    private

      def header_area_image_url_from_sources
        return if header_area_image.blank?

        header_area_image.dig("sources", "s960") || header_area_image.dig("sources", "s300")
      end

      def header_area_image
        get_image_in_priority_order || content_item.dig("details", "image")
      end

      def get_image_in_priority_order
        images = content_item.dig("details", "images")

        return unless images.present? && images.is_a?(Array)

        images.find { |i| i["type"] == "lead" } || images.find { |i| i["type"].present? }
      end
    end
  end
end
