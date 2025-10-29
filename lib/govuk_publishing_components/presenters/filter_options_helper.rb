module GovukPublishingComponents
  module Presenters
    class FilterOptionsHelper
      attr_reader :form_action, :reset_fields_link, :filter_options

      def initialize(local_assigns)
        @filter_action = local_assigns[:filter_action]
        @anchor = local_assigns[:anchor] || ""
        @query_string_params = local_assigns[:anchor] || ""
        @filter_options = local_assigns[:filter_options] || []

        @form_action = @filter_action + @anchor
        @reset_fields_link = @filter_action + @query_string_params + @anchor
      end
    end
  end
end
