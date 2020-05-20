module GovukPublishingComponents
  module Presenters
    class SharedHelper
      attr_reader :options, :margin_top, :margin_bottom, :heading_level, :classes

      def initialize(local_assigns)
        @options = local_assigns
        @margin_top = @options[:margin_top] || nil
        @margin_bottom = @options[:margin_bottom] || 3
        @heading_level = @options[:heading_level] || 2

        if local_assigns.include?(:classes)
          @classes = local_assigns[:classes].split(" ")
          unless @classes.all? { |c| c.start_with?("js-") }
            raise(ArgumentError, "Passed classes must be prefixed with `js-`")
          end
        end
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
