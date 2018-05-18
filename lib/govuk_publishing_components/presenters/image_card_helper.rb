module GovukPublishingComponents
  module Presenters
    class ImageCardHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :href, :href_data_attributes, :extra_links, :large, :extra_links_no_indent, :heading_text

      def initialize(local_assigns)
        @href = local_assigns[:href]
        @href_data_attributes = local_assigns[:href_data_attributes]
        @extra_links = local_assigns[:extra_links]
        @image_src = local_assigns[:image_src]
        @image_alt = local_assigns[:image_alt] || ""
        @context = local_assigns[:context]
        @description = local_assigns[:description]
        @large = local_assigns[:large]
        @heading_text = local_assigns[:heading_text]
        @heading_level = local_assigns[:heading_level]
        @extra_links_no_indent = local_assigns[:extra_links_no_indent]
      end

      def is_tracking?
        return true if @href_data_attributes
        if @extra_links
          @extra_links.each do |link|
            return true if link[:data_attributes]
          end
        end
        false
      end

      def image
        if @image_src
          content_tag(:figure, class: "gem-c-image-card__image-wrapper") do
            image_tag(@image_src, class: "gem-c-image-card__image", alt: @image_alt)
          end
        end
      end

      def context
        content_tag(:p, @context, class: "gem-c-image-card__context") if @context
      end

      def heading_tag
        return "h#{@heading_level}" if [1, 2, 3, 4, 5, 6].include? @heading_level
        "h2"
      end

      def description
        content_tag(:p, @description, class: "gem-c-image-card__description") if @description
      end
    end
  end
end
