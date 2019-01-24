module GovukPublishingComponents
  module Presenters
    class AccordionHelper
      attr_reader :heading_tag

      def initialize(options)
        @heading_tag = "h2"
        @heading_tag = "h#{options[:heading_level]}" if [1, 2, 3, 4, 5, 6].include? options[:heading_level]
      end
    end
  end
end
