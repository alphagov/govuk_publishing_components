module GovukPublishingComponents
  module Presenters
    class SearchResultsPageSchema
      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/SearchResultsPage
        data = ArticleSchema.new(@page).structured_data
        data["@type"] = "SearchResultsPage"
        data
      end
    end
  end
end
