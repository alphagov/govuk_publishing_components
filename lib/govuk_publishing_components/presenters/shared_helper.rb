module GovukPublishingComponents
  module Presenters
    class SharedHelper
      attr_reader :options, :margin_top, :margin_bottom, :heading_level

      def initialize(local_assigns)
        @options = local_assigns
        @margin_top = @options[:margin_top] || nil
        @margin_bottom = @options[:margin_bottom] || 3
        @heading_level = @options[:heading_level] || 2
      end

      def get_margin_top
        [*0..9].include?(@margin_top) ? "govuk-!-margin-top-#{margin_top}" : ""
      end

      def get_margin_bottom
        [*0..9].include?(@margin_bottom) ? "govuk-!-margin-bottom-#{margin_bottom}" : "govuk-!-margin-bottom-3"
      end

      def get_heading_level
        return [*1..6].include?(@heading_level) ? "h#{@heading_level}" : "h2" unless @heading_level.zero?

        "span"
      end
    end
  end
end
