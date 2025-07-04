##
# Helper methods for use with the "select-with-search" component.
# This wraps and extends the Select component's helper methods to add support for option groups.
##
module GovukPublishingComponents
  module Presenters
    class SelectWithSearchHelper
      include ActionView::Helpers::FormOptionsHelper

      attr_reader :options, :selected_options, :aria, :options_markup

      delegate :describedby,
               :hint_id,
               :hint,
               :label_classes,
               :select_classes,
               :error_items,
               :error_id,
               to: :@select_helper

      def initialize(local_assigns)
        @select_helper = SelectHelper.new(local_assigns.except(:options, :grouped_options))
        @options = local_assigns[:options]
        @grouped_options = local_assigns[:grouped_options]
        @include_blank = local_assigns[:include_blank]
        @selected_options = []
        @options_markup = get_options
        @local_assigns = local_assigns
      end

      def css_classes
        classes = @select_helper.css_classes
        classes << "gem-c-select-with-search"
        classes
      end

    private

      def get_options
        blank_option_if_include_blank +
          if @grouped_options.present?
            grouped_and_ungrouped_options_for_select(@grouped_options)
          elsif @options.present?
            options_for_select(
              transform_options(@options),
              selected_options,
            )
          end
      end

      def grouped_and_ungrouped_options_for_select(unsorted_options)
        # Filter out the 'single option' options and treat them as simply `<option>`
        # The remainder should be treated as true 'grouped options', i.e. `<optgroup>`
        single_options = []
        grouped_options = []
        unsorted_options.each_with_index do |(group, options), _index|
          if group == ""
            single_options << options
          else
            grouped_options << [group, options]
          end
        end
        single_options.flatten!

        options_for_select(transform_options(single_options), selected_options) +
          grouped_options_for_select(transform_grouped_options(grouped_options), selected_options)
      end

      def transform_options(options)
        options.map do |option|
          @selected_options << option[:value] if option[:selected]
          [
            option[:text],
            option[:value],
          ]
        end
      end

      def transform_grouped_options(grouped_options)
        grouped_options.map do |(group, options)|
          [group, transform_options(options)]
        end
      end

      def blank_option_if_include_blank
        return "".html_safe if @include_blank.blank?

        options_for_select([["", ""]])
      end
    end
  end
end
