module GovukPublishingComponents
  module Presenters
    class CheckboxesHelper
      attr_reader :items, :css_classes, :error, :has_conditional, :has_nested, :id, :heading, :hint_text, :is_page_heading

      def initialize(options)
        @items = options[:items] ? options[:items] : []
        @css_classes = %w( gem-c-checkboxes govuk-form-group )
        @css_classes << "govuk-form-group--error" if options[:error]
        @error = true if options[:error]

        # check if any item is set as being conditional
        @has_conditional = options[:items].any? { |item| item.is_a?(Hash) && item[:conditional] }
        @has_nested = options[:items].any? { |item| item.is_a?(Hash) && item[:items] }

        @id = options[:id] ? options[:id] : "checkboxes-#{SecureRandom.hex(4)}"
        @heading = options[:heading]
        @hint_text = options[:hint_text] ? options[:hint_text] : "Select all that apply."
        @is_page_heading = options[:is_page_heading]
      end
    end
  end
end
