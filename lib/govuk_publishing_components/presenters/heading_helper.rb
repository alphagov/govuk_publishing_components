module GovukPublishingComponents
  module Presenters
    class HeadingHelper
      attr_reader :heading_tag, :id, :classes, :heading_classes

      def initialize(options)
        @id = options[:id]

        @classes = ""
        @classes += " gem-c-heading--padding" if options[:padding]
        @classes += " gem-c-heading--border-top-#{options[:border_top]}" if [1, 2, 5].include? options[:border_top]
        @classes += " gem-c-heading--inverse" if options[:inverse]

        @heading_classes = "gem-c-heading__text #{heading_size(options[:font_size])}"
      end

    private

      def heading_size(option)
        govuk_class = "govuk-heading-"

        case option
        when "xl"
          "#{govuk_class}xl"
        when "l"
          "#{govuk_class}l"
        when 24, "m"
          "#{govuk_class}m"
        when 19, "s"
          "#{govuk_class}s"
        else
          "#{govuk_class}m"
        end
      end
    end
  end
end
