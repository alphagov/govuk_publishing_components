module GovukPublishingComponents
  module Presenters
    class HasPartSchema
      attr_reader :has_part_url

      def initialize(has_part_url)
        @has_part_url = has_part_url
      end

      def structured_data
        # http://schema.org/hasPart - minimal
        {
          "@context" => "http://schema.org",
          "@type" => "CreativeWork",
          "sameAs" => has_part_url
        }
      end
    end
  end
end
