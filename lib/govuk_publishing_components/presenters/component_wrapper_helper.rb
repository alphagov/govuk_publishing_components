module GovukPublishingComponents
  module Presenters
    class ComponentWrapperHelper
      def initialize(options, request = nil)
        @options = options
        @request = request
        @not_found = "not found"

        check_id_is_valid(@options[:id]) if @options.include?(:id)
        check_classes_are_valid(@options[:classes]) if @options.include?(:classes)
        check_aria_is_valid(@options[:aria]) if @options.include?(:aria)
      end

      def all_attributes
        {
          id: @options[:id],
          data: @options[:data],
          aria: @options[:aria],
          class: @options[:classes],
        }
      end

      def set_id(id)
        check_id_is_valid(id)
        @options[:id] = id
      end

      def add_class(classes)
        check_classes_are_valid(classes)
        extend_string(:classes, classes)
      end

      def add_data_attribute(attributes)
        extend_object(:data, attributes)
      end

      def add_aria_attribute(attributes)
        check_aria_is_valid(attributes)
        extend_object(:aria, attributes)
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

      def check_id_is_valid(id)
        raise(ArgumentError, "Id cannot start with a number or contain whitespace and can only contain letters, digits, `_` and `-`") unless /^[a-zA-Z][\w:-]*$/.match?(id)
      end

      def check_classes_are_valid(classes)
        classes = classes.split(" ")
        unless classes.all? { |c| c.start_with?("js-", "gem-c-", "govuk-") }
          raise(ArgumentError, "Passed classes must be prefixed with `js-`")
        end
      end

      def check_aria_is_valid(attributes)
        arias = %w[activedescendant atomic autocomplete busy checked colcount colindex colspan controls current describedby description details disabled dropeffect errormessage expanded flowto grabbed haspopup hidden invalid keyshortcuts label labelledby level live modal multiline multiselectable orientation owns placeholder posinset pressed readonly relevant required roledescription rowcount rowindex rowspan selected setsize sort valuemax valuemin valuenow valuetext]

        unless attributes.all? { |key, _value| arias.include? key.to_s }
          raise(ArgumentError, "Aria attribute is not recognised")
        end
      end

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
