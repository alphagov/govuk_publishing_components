module GovukPublishingComponents
  module Presenters
    class FilterOptionsHelper
      attr_reader :form_action, :reset_fields_link

      def initialize(local_assigns)
        @filter_action = local_assigns[:filter_action]
        @anchor = local_assigns[:anchor] || ""
        @reset_link_query_string = local_assigns[:anchor] || ""

        @form_action = @filter_action + @anchor
        @reset_fields_link = @filter_action + @reset_link_query_string + @anchor
      end
    end
  end
end
