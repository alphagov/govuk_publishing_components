module GovukPublishingComponents
  module Presenters
    class InterventionHelper
      def initialize(local_assigns)
        @accessible_text_suffix = I18n.t("components.intervention.accessible_link_text_suffix")
        @query_string = local_assigns[:query_string]
        @suggestion_link_text = local_assigns[:suggestion_link_text]
        @suggestion_link_url = local_assigns[:suggestion_link_url]
      end

      def accessible_text
        @suggestion_link_text << @accessible_text_suffix unless @suggestion_link_text.include?(@accessible_text_suffix)

        @suggestion_link_text
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

    private

      attr_reader :accessible_text_suffix, :query_string, :suggestion_link_text, :suggestion_link_url
    end
  end
end
