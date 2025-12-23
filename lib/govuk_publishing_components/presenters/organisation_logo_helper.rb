module GovukPublishingComponents
  module Presenters
    class OrganisationLogoHelper
      include ActionView::Helpers
      include ActionView::Context

      def initialize(local_assigns)
        raise(ArgumentError, "Component requires an organisation including a name") unless minimum_for_component?(local_assigns)

        @name = local_assigns[:organisation][:name]
        @url = local_assigns[:organisation][:url]
        @crest = local_assigns[:organisation][:crest]
        @image = local_assigns[:organisation][:image] || false
        if @image
          @logo_image_src = local_assigns[:organisation][:image][:url] || nil
          @logo_image_alt = local_assigns[:organisation][:image][:alt_text] || nil
        end
        @hide_underline = local_assigns[:hide_underline] || false
      end

      def logo_content
        if @image
          image_tag(@logo_image_src, alt: @logo_image_alt, class: "gem-c-organisation-logo__image")
        else
          content_tag("span", @name, class: "gem-c-organisation-logo__name")
        end
      end

      def logo_container_class
        logo_class = %w[gem-c-organisation-logo__container]
        logo_class << "gem-c-organisation-logo__link" if @url
        logo_class << "gem-c-organisation-logo__link-hide-underline" if @hide_underline
        logo_class << "gem-c-organisation-logo__crest gem-c-organisation-logo__crest--#{@crest}" if crest_has_visual_identity?
        logo_class.join(" ")
      end

    private

      def minimum_for_component?(options)
        true unless !options[:organisation] || options[:organisation] && !options[:organisation][:name]
      end

      def crest_has_visual_identity?
        @crest.present? && !%w[no-identity custom].include?(@crest)
      end
    end
  end
end
