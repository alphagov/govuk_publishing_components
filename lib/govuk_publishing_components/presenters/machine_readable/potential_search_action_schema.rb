require "plek"

module GovukPublishingComponents
  module Presenters
    class PotentialSearchActionSchema
      attr_reader :facet_params, :description

      BASE_SEARCH_URL = "#{Plek.new.website_root}/search/all?keywords={query}&order=relevance".freeze

      def initialize(facet_params, description)
        @facet_params = facet_params
        @description = description
      end

      def structured_data
        # http://schema.org/SearchAction - minimal
        {
          "potentialAction" => {
            "@type": "SearchAction",
            "description": description,
            "target": search_template,
            "query": "required",
          },
        }
      end

    private

      def search_template
        "#{BASE_SEARCH_URL}&#{facet_params.to_query}"
      end
    end
  end
end
