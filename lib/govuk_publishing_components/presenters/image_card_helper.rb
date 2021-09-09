module GovukPublishingComponents
  module Presenters
    class ImageCardHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :href, :href_data_attributes, :extra_details, :large, :extra_details_no_indent, :heading_text, :metadata, :lang, :image_loading

      def initialize(local_assigns)
        @href = local_assigns[:href]
        @href_data_attributes = local_assigns[:href_data_attributes]
        @extra_details = local_assigns[:extra_details] || []
        @image_src = local_assigns[:image_src]
        @image_alt = local_assigns[:image_alt] || ""
        @image_loading = local_assigns[:image_loading] || "auto"
        @context = local_assigns[:context]
        @description = local_assigns[:description]
        @large = local_assigns[:large]
        @heading_text = local_assigns[:heading_text]
        @extra_details_no_indent = local_assigns[:extra_details_no_indent]
        @metadata = local_assigns[:metadata]
        @lang = local_assigns[:lang]
      end

      def is_tracking?
        return true if @href_data_attributes

        if @extra_details
          @extra_details.each do |link|
            return true if link[:data_attributes]
          end
        end
        false
      end

      def image
        if @image_src
          content_tag(:figure, class: "gem-c-image-card__image-wrapper") do
            image_tag(@image_src, class: "gem-c-image-card__image", alt: @image_alt, loading: @image_loading)
          end
        end
      end

      def context
        return unless @context

        content_tag(:p, class: "gem-c-image-card__context") do
          if @context[:date]
            date = content_tag(:time, l(@context[:date], format: "%e %B %Y"), datetime: @context[:date].iso8601, lang: "en")
            dash = content_tag(:span, " — ", 'aria-hidden': true)

            if @context[:text]
              date.concat(dash).concat(@context[:text])
            else
              date
            end
          else
            @context[:text]
          end
        end
      end

      def description
        content_tag(:div, @description, class: "gem-c-image-card__description") if @description
      end
    end
  end
end
