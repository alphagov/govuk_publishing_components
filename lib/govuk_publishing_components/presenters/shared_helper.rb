module GovukPublishingComponents
  module Presenters
    class SharedHelper
      attr_reader :options, :margin_bottom

      def initialize(local_assigns)
        @options = local_assigns
        @margin_bottom = @options[:margin_bottom] || 3
      end

      def get_margin_bottom
        [*0..9].include?(@margin_bottom) ? "govuk-!-margin-bottom-#{margin_bottom}" : "govuk-!-margin-bottom-3"
      end
    end
  end
end
