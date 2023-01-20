module GovukPublishingComponents
  module Presenters
    class ComponentWrapperHelper
      def initialize(options, request = nil)
        @options = options
        @request = request
        @not_found = "not found"

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

      def audit_component
        File.write("/Users/andysellick/workspace/govuk/collections/tmp/audit.json", "#{component_usage_data.to_json}\n", mode: "a")
      end

      def component_usage_data
        url = @request.original_url if @request
        d = Time.now
        {
          component: get_item_from_caller(/(?<=\/_)[a-zA-Z_]*(?=.html.erb)/).gsub("_", " "),
          application: get_application_name,
          url: url || @not_found,
          date: d.strftime("%d/%m/%Y %H:%M"),
          template: get_item_from_caller(/app\/views\/(?!govuk_publishing_components)[a-zA-Z_\/]+.html.erb/),
          options: @options,
        }
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

      def get_application_name
        return Rails.root.to_s.split("/").last if Rails.method_defined? :root

        @not_found
      end

      def get_item_from_caller(lookfor)
        caller.each do |file|
          found = file.match(lookfor)
          return found.to_s if found
        end

        @not_found
      end
    end
  end
end
