module GovukPublishingComponents
  module Presenters
    class SharedHelper
      attr_reader :options, :margin_bottom, :heading_level

      def initialize(local_assigns)
        @options = local_assigns
        @margin_bottom = @options[:margin_bottom] || 3
        @heading_level = @options[:heading_level] || 2
      end

      def get_margin_bottom
        [*0..9].include?(@margin_bottom) ? "govuk-!-margin-bottom-#{margin_bottom}" : "govuk-!-margin-bottom-3"
      end

      def get_heading_level
        [*1..6].include?(@heading_level) ? "h#{@heading_level}" : "h2"
      end
    end
  end
end
