module GovukPublishingComponents
  module Presenters
    class SelectHelper
      include ActionView::Helpers::FormOptionsHelper

      attr_reader :options, :options_markup, :error_items, :error_id, :hint, :hint_id, :describedby

      def initialize(local_assigns)
        @options = local_assigns[:options] || []
        @error_items = local_assigns[:error_items] || []
        @error_items << { text: local_assigns[:error_message] } if local_assigns[:error_message]
        @error_id = local_assigns[:error_id] || nil
        @hint = local_assigns[:hint] || nil
        @hint_id = local_assigns[:hint_id] || nil
        @heading_size = local_assigns[:heading_size]
        @full_width = local_assigns[:full_width] || false
        @options_markup = options_for_select(get_options, @selected_option)
        @describedby = get_describedby
      end

      def css_classes
        classes = %w[govuk-form-group gem-c-select]
        classes << "govuk-form-group--error" if @error_items.present?
        classes
      end

      def select_classes
        classes = %w[govuk-select]
        classes << "gem-c-select__select--full-width" if @full_width
        classes << "govuk-select--error" if @error_id
        classes
      end

      def label_classes
        classes = %w[govuk-label]
        classes << "govuk-label--#{@heading_size}" if @heading_size
        classes
      end

    private

      def get_options
        return if options.nil?

        options.map do |option|
          @selected_option = option[:value] if option[:selected]
          [
            option[:text],
            option[:value],
            options_extra_attributes(option[:data_attributes], option[:disabled]),
          ]
        end
      end

      def options_extra_attributes(attributes, disabled)
        attrs = {}
        attrs[:disabled] = true if disabled
        return attrs if attributes.nil?

        attrs = {}
        attributes.each do |key, value|
          key_name = "data-#{key.to_s.split('_').join('-')}"
          attrs[key_name] = value.is_a?(Hash) ? value.to_json : value
        end

        attrs
      end

      def get_describedby
        describedby = %w[]

        if @error_items.present? || @error_id
          @error_id ||= "error-#{SecureRandom.hex(4)}"
          describedby << @error_id
        end

        if @hint
          @hint_id ||= "hint-#{SecureRandom.hex(4)}"
          describedby << @hint_id
        end

        describedby
      end
    end
  end
end
