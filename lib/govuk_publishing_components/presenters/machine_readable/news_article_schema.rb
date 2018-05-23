module GovukPublishingComponents
  module Presenters
    class NewsArticleSchema
      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/NewsArticle
        data = ArticleSchema.new(@page).structured_data
        data["@type"] = "NewsArticle"
        data
      end
    end
  end
end
