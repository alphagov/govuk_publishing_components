module GovukPublishingComponents
  module Presenters
    class HeadingHelper
      attr_reader :heading_tag, :id, :classes

      def initialize(options)
        @id = options[:id]

        @classes = ""
        @classes << " gem-c-heading--font-size-#{options[:font_size]}" if [24, 19].include? options[:font_size]
        @classes << " gem-c-heading--mobile-top-margin" if options[:mobile_top_margin]
        @classes << " gem-c-heading--padding" if options[:padding]
        @classes << " gem-c-heading--border-top-#{options[:border_top]}" if [1, 2, 5].include? options[:border_top]
      end
    end
  end
end
