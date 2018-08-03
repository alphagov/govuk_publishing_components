module GovukPublishingComponents
  module Presenters
    class HowToSchema
      attr_reader :how_to_url

      def initialize(how_to_url)
        @how_to_url = how_to_url
      end

      def structured_data
        # http://schema.org/HowTo - minimal
        {
          "@context" => "http://schema.org",
          "@type" => "HowTo",
          "sameAs" => how_to_url
        }
      end
    end
  end
end
