module GovukPublishingComponents
  module Presenters
    class IsPartOfSchema
      def initialize(is_part_of_url)
        @is_part_of_url = is_part_of_url
      end

      def structured_data
        # http://schema.org/isPartOf - minimal
        {
            "@context" => "http://schema.org",
            "@type" => "CreativeWork",
            "sameAs" => @is_part_of_url
        }
      end
    end
  end
end
