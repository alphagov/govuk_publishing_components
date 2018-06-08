module GovukPublishingComponents
  module Presenters
    class OrganisationLogoHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :name, :url, :crest, :image, :logo_image_src, :logo_image_alt

      def initialize(local_assigns)
        if local_assigns[:organisation][:name]
          @name = local_assigns[:organisation][:name]
          @name.gsub! "<script>", ""
          @name.gsub! "</script>", ""
          @name = @name.html_safe
        end

        @url = local_assigns[:organisation][:url]
        @crest = local_assigns[:organisation][:crest]
        @image = local_assigns[:organisation][:image] || false

        if @image
          @logo_image_src = local_assigns[:organisation][:image][:url] || false
          @logo_image_alt = local_assigns[:organisation][:image][:alt_text] || false
        end
      end

      def logo_content
        if image
          image_tag(logo_image_src, alt: logo_image_alt, class: "gem-c-organisation-logo__image")
        else
          content_tag('span', name, class: "gem-c-organisation-logo__name")
        end
      end

      def logo_container_class
        logo_class = "gem-c-organisation-logo__container"
        logo_class = "#{logo_class} gem-c-organisation-logo__link" if url
        logo_class = "#{logo_class} gem-c-organisation-logo__crest gem-c-organisation-logo__crest--#{crest}" if crest
        logo_class
      end
    end
  end
end
