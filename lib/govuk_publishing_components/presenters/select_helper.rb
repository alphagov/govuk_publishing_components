module GovukPublishingComponents
  module Presenters
    class SelectHelper
      attr_reader :options, :option_markup, :selected_option

      def initialize(options)
        @options = options
        @option_markup = get_options
      end

      def data_tracking?
        @options.any? { |item| item[:data_attributes] && item[:data_attributes][:track_category] && item[:data_attributes][:track_action] }
      end

    private

      def get_options
        return if options.nil?

        options.map do |option|
          @selected_option = option[:value] if option[:selected]
          [
            option[:text],
            option[:value],
            options_data_attribute(option[:data_attributes]),
          ]
        end
      end

      def options_data_attribute(attributes)
        return {} if attributes.nil?

        attrs = {}
        attributes.each do |key, value|
          key_name = "data-#{key.to_s.split('_').join('-')}"
          attrs[key_name] = value.is_a?(Hash) ? value.to_json : value
        end

        attrs
      end
    end
  end
end
