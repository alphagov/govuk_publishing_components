module GovukPublishingComponents
  module Presenters
    class CheckboxesHelper
      attr_reader :css_classes, :error

      def initialize(local_assigns)
        @css_classes = %w( gem-c-checkboxes govuk-form-group )
        @css_classes << "govuk-form-group--error" if local_assigns[:error]
        @error = true if local_assigns[:error]
      end
    end
  end
end
