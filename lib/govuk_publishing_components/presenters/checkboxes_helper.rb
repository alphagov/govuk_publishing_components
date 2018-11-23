module GovukPublishingComponents
  module Presenters
    class CheckboxesHelper
      include ActionView::Helpers
      include ActionView::Context

      attr_reader :items, :name, :css_classes, :error, :has_conditional, :has_nested, :id, :hint_text

      def initialize(options)
        @items = options[:items] || []
        @name = options[:name]
        @css_classes = %w(gem-c-checkboxes govuk-form-group)
        @css_classes << "govuk-form-group--error" if options[:error]
        @error = true if options[:error]

        # check if any item is set as being conditional
        @has_conditional = options[:items].any? { |item| item.is_a?(Hash) && item[:conditional] }
        @has_nested = options[:items].any? { |item| item.is_a?(Hash) && item[:items] }

        @id = options[:id] || "checkboxes-#{SecureRandom.hex(4)}"
        @heading = options[:heading]
        @is_page_heading = options[:is_page_heading]
        @hint_text = options[:hint_text] || "Select all that apply."
      end

      def heading_markup
        return unless @heading.present?

        if @is_page_heading
          content_tag(
            :legend,
            class: "govuk-fieldset__legend govuk-fieldset__legend--xl gem-c-title gem-c-title--margin-bottom-5"
          ) do
            content_tag(:h1, @heading, class: "gem-c-title__text")
          end
        else
          content_tag(:legend, @heading, class: "govuk-fieldset__legend govuk-fieldset__legend--m")
        end
      end
    end
  end
end
