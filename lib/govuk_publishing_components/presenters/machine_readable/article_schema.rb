module GovukPublishingComponents
  module Presenters
    class ArticleSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/Article
        data = CreativeWorkSchema.new(@page).structured_data.merge(body)
        data["@type"] = "Article"
        data
      end

    private

      # Not all formats have a `body` - some have their content split over
      # multiple fields. In this case we'll skip the `articleBody` field
      def body
        return {} unless page.body.present?

        {
          "articleBody" => page.body
        }
      end
    end
  end
end
