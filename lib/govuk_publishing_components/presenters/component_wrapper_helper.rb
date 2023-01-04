module GovukPublishingComponents
  module Presenters
    class ComponentWrapperHelper
      def initialize(options)
        @options = options

        if @options.include?(:component_class)
          classes = @options[:component_class].split(" ")
          unless classes.all? { |c| c.start_with?("js-", "gem-c-", "govuk-") }
            raise(ArgumentError, "Passed classes must be prefixed with `js-`")
          end
        end
      end

      def component_attributes
        {
          id: @options[:component_id],
          data: @options[:component_data],
          aria: @options[:component_aria],
          class: @options[:component_class],
        }
      end

      def set_id(id)
        @options[:component_id] = id
      end

      def add_class(classes)
        extend_string(:component_class, classes)
      end

      def add_data_attribute(attributes)
        extend_object(:component_data, attributes)
      end

      def add_aria_attribute(attributes)
        extend_object(:component_aria, attributes)
      end

    private

      def extend_string(option, string)
        ((@options[option] ||= "") << " #{string}").strip!
      end

      def extend_object(option, object)
        @options[option] ||= {}
        object.each_key do |key|
          @options[option][key] =
            if @options[option].key?(key)
              "#{@options[option][key]} #{object[key]}"
            else
              object[key]
            end
        end
      end
    end
  end
end
