module GovukPublishingComponents
  module Presenters
    class CheckboxesHelper
      attr_reader :css_classes, :error, :has_conditional, :has_nested, :id

      def initialize(local_assigns)
        @css_classes = %w( gem-c-checkboxes govuk-form-group )
        @css_classes << "govuk-form-group--error" if local_assigns[:error]
        @error = true if local_assigns[:error]

        # check if any item is set as being conditional
        @has_conditional = local_assigns[:items].any? { |item| item.is_a?(Hash) && item[:conditional] }
        @has_nested = local_assigns[:items].any? { |item| item.is_a?(Hash) && item[:items] }

        @id = local_assigns[:id] ? local_assigns[:id] : "checkboxes-#{SecureRandom.hex(4)}"
      end
    end
  end
end
