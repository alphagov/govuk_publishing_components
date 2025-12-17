module GovukPublishingComponents
  module Presenters
    class ImageCardHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :href, :large, :extra_details, :extra_details_no_indent, :heading_text, :metadata, :lang, :image_loading, :image_src, :two_thirds, :large_font_size_mobile

      def initialize(local_assigns)
        @href = local_assigns[:href]
        @extra_details = local_assigns[:extra_details] || []
        @image_src = local_assigns[:image_src]
        @image_alt = local_assigns[:image_alt] || ""
        @srcset = local_assigns[:srcset] || nil
        @sizes = local_assigns[:sizes] || nil
        @image_loading = local_assigns[:image_loading] || "auto"
        @context = local_assigns[:context]
        @description = local_assigns[:description]
        @large = local_assigns[:large]
        @two_thirds = local_assigns[:two_thirds] || false
        @large_font_size_mobile = local_assigns[:large_font_size_mobile] || false
        @heading_text = local_assigns[:heading_text]
        @extra_details_no_indent = local_assigns[:extra_details_no_indent]
        @metadata = local_assigns[:metadata]
        @lang = local_assigns[:lang]
      end

      def large_mobile_font_size?
        # allow the font-size to be 19px on mobile
        # for the two-thirds varation of the
        # image card component
        @two_thirds && @large_font_size_mobile
      end

      def media
        height = 200
        width = 300
        height = 90 if @two_thirds
        width = 90 if @two_thirds

        if @image_src
          content_tag(:figure, class: "gem-c-image-card__image-wrapper") do
            image_tag(
              @image_src,
              class: "gem-c-image-card__image",
              alt: @image_alt,
              loading: @image_loading,
              sizes: @sizes,
              srcset: @srcset,
              height:,
              width:,
            )
          end
        end
      end

      def context
        return unless @context

        content_tag(:p, class: "gem-c-image-card__context") do
          if @context[:date]
            @context[:date] = Date.parse(@context[:date]) if @context[:date].is_a? String
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
        return unless @description

        classes = %w[gem-c-image-card__description]
        classes << "gem-c-image-card__description--large-font-size-mobile" if large_mobile_font_size?
        content_tag(:div, @description, class: classes)
      end
    end
  end
end
