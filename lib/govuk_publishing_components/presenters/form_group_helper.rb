module GovukPublishingComponents
  module Presenters
    class FormGroupHelper
      def initialize(local_assigns)
        @options = local_assigns
      end

      def form_group_options
        {
          label: options[:label],
          margin_bottom: options[:margin_bottom],
          hint: options[:hint],
          error: options[:error]
        }
      end

      def generate_field_id(field_name)
        parameterised_name = field_name.parameterize.presence if field_name

        "#{parameterised_name || 'field'}-#{SecureRandom.hex(4)}"
      end

      def merge_described_by(field_attributes, described_by)
        described_by = Array(described_by)
        return if described_by.empty?

        field_attributes[:aria] ||= {}
        all_described_by = [field_attributes.dig(:aria, :describedby)].compact + described_by

        field_attributes[:aria][:describedby] = all_described_by.join(" ")
      end

      def additional_field_classes(field_attributes)
        classes = field_attributes[:classes]
        return [] unless classes.present?

        classes = classes.split(" ") if classes.is_a?(String)
        unless classes.all? { |c| c.start_with?("js-") }
          raise ArgumentError, "Passed classes must be prefixed with `js-`"
        end

        classes
      end

    private
      attr_reader :options
    end
  end
end
