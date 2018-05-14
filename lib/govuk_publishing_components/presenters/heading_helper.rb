module GovukPublishingComponents
  module Presenters
    class HeadingHelper
      attr_reader :heading_tag, :id, :classes

      def initialize(options)
        @heading_tag = "h1"
        @heading_tag = "h#{options[:heading_level]}" if [1, 2, 3, 4, 5, 6].include? options[:heading_level]
        @id = options[:id]

        @classes = ""
        @classes << " gem-c-heading--font-size-#{options[:font_size]}" if [24, 19].include? options[:font_size]
        @classes << " gem-c-heading--mobile-top-margin" if options[:mobile_top_margin]
        @classes << " gem-c-heading--padding" if options[:padding]
        @classes << " gem-c-heading--margin-bottom-#{options[:margin_bottom]}" if [2, 4].include? options[:margin_bottom]
        @classes << " gem-c-heading--border-top-#{options[:border_top]}" if [1, 2, 5].include? options[:border_top]
      end
    end
  end
end
