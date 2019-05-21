require 'plek'

module GovukPublishingComponents
  module Presenters
    class PotentialSearchActionSchema
      attr_reader :facet_params

      BASE_SEARCH_URL = "#{Plek.current.website_root}/search/all?keywords={query}".freeze

      def initialize(facet_params)
        @facet_params = facet_params
      end

      def structured_data
        # http://schema.org/SearchAction - minimal
        {
          "potentialAction" => {
            "@type": "SearchAction",
            "target": search_template,
            "query": "required"
          }
        }
      end

    private

      def search_template
        "#{BASE_SEARCH_URL}&#{facet_params.to_query}"
      end
    end
  end
end
