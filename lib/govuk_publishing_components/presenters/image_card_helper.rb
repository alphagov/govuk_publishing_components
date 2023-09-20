module GovukPublishingComponents
  module Presenters
    class ImageCardHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :href_data_attributes, :extra_details, :extra_details_no_indent, :heading_text, :metadata, :lang, :image_loading, :youtube_video_id, :image_src, :two_thirds

      def initialize(local_assigns, brand_helper)
        @href = local_assigns[:href]
        @href_data_attributes = local_assigns[:href_data_attributes]
        @extra_details = local_assigns[:extra_details] || []
        @image_src = local_assigns[:image_src]
        @image_alt = local_assigns[:image_alt] || ""
        @youtube_video_alt = local_assigns[:youtube_video_alt]
        @image_loading = local_assigns[:image_loading] || "auto"
        @srcset = local_assigns[:srcset] || nil
        @sizes = local_assigns[:sizes] || nil
        @image_loading = local_assigns[:image_loading] || "auto"
        @context = local_assigns[:context]
        @description = local_assigns[:description]
        @large = local_assigns[:large]
        @two_thirds = local_assigns[:two_thirds] || false
        @heading_text = local_assigns[:heading_text]
        @extra_details_no_indent = local_assigns[:extra_details_no_indent]
        @metadata = local_assigns[:metadata]
        @lang = local_assigns[:lang]
        @youtube_video_id = local_assigns[:youtube_video_id] || nil

        @brand_helper = brand_helper
      end

      def href
        return youtube_href if @youtube_video_id

        @href
      end

      def large
        # if youtube video, we don't want to use
        # the small variant, large will be always
        # true if a youtube_video_id is supplied
        @youtube_video_id || @large
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

      def media
        return youtube_link if @youtube_video_id

        image
      end

      def image
        classes = %w[gem-c-image-card__image-wrapper]
        classes << "gem-c-image-card__image-wrapper--one-third" if @two_thirds

        if @image_src
          content_tag(:figure, class: classes) do
            image_tag(
              @image_src,
              class: "gem-c-image-card__image",
              alt: @image_alt,
              loading: @image_loading,
              sizes: @sizes,
              srcset: @srcset,
              height: 200,
              width: 300,
            )
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

      def youtube_href
        "https://www.youtube.com/watch?v=#{@youtube_video_id}"
      end

      def youtube_thumbnail_url
        "https://img.youtube.com/vi/#{@youtube_video_id}/maxresdefault.jpg"
      end

      def youtube_thumbnail
        thumbnail = content_tag(:div, class: "gem-c-image-card__youtube-thumbnail-image-container") do
          image_tag(
            youtube_thumbnail_url,
            class: "gem-c-image-card__image gem-c-image-card__youtube-thumbnail-image",
            alt: "",
            loading: @image_loading,
          )
        end
        thumbnail + content_tag(:figcaption, @youtube_video_alt, class: "gem-c-image-card__youtube-thumbnail-container-text govuk-link #{@brand_helper.color_class}")
      end

      def youtube_link
        content_tag(
          :figure,
          class: "gem-c-image-card__image-wrapper gem-c-image-card__image-wrapper--youtube-embed",
        ) do
          content_tag(:div) do
            link_to(
              href,
              {
                class: "govuk-body govuk-link gem-c-image-card__youtube-thumbnail-container js-youtube-card-embed",
                "data-youtube-player-analytics": true,
                "data-youtube-player-analytics-category": "EmbeddedYoutube",
              },
            ) do
              youtube_thumbnail
            end
          end
        end
      end
    end
  end
end
