module GovukPublishingComponents
  module Presenters
    class BigNumberHelper
      def initialize(local_assigns)
        @label = local_assigns[:label]
        @href = local_assigns[:href]
        @number = local_assigns[:number] || nil
      end

      def value_classes
        class_list = ["gem-c-big-number__value"]

        if @label.nil? && @href
          class_list << "gem-c-big-number__value--decorated"
        end

        class_list
      end

      # This function is to check for small symbols which alter how the number is rendered lightly
      # We do this to account for small symbols awkwardly sitting above the baseline in our typeface and adjust them to sit at the baseline for the purpose of visual harmony
      # Currently the only small symbol used with big numbers are pluses so they are specifically targetted in the below code
      def number_has_plus_suffix?
        if @number.is_a? String
          @number.end_with?("+")
        end
      end
    end
  end
end
