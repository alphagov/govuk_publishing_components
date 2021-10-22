module GovukPublishingComponents
  module Presenters
    class InterventionHelper
      attr_reader :query_string

      def initialize(local_assigns)
        @query_string = local_assigns[:query_string]
      end

      def dismiss_link
        if @query_string.present?
          "#{@query_string}&hide-intervention=true"
        else
          "?hide-intervention=true"
        end
      end
    end
  end
end
