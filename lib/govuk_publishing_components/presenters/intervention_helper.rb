module GovukPublishingComponents
  module Presenters
    class InterventionHelper
      attr_reader :query_string, :suggestion_link_text, :suggestion_link_url

      def initialize(local_assigns)
        @query_string = local_assigns[:query_string]
        @suggestion_link_text = local_assigns[:suggestion_link_text]
        @suggestion_link_url = local_assigns[:suggestion_link_url]
      end

      def dismiss_link
        if @query_string.present?
          "#{@query_string}&hide-intervention=true"
        else
          "?hide-intervention=true"
        end
      end

      def security_attr
        rel = "noopener noreferrer"
        rel << " external" unless @suggestion_link_url.start_with?("/", "https://gov.uk", "https://www.gov.uk")

        rel
      end
    end
  end
end
