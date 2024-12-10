module GovukPublishingComponents
  module Presenters
    class ArticleSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/Article
        data = CreativeWorkSchema.new(@page).structured_data
          .merge(head_line)
          .merge(body)
          .merge(search_action)
        data["@type"] = "Article"
        data
      end

    private

      def head_line
        {
          "headLine" => page.title,
          "description" => page.description,
        }
      end

      # Not all formats have a `body` - some have their content split over
      # multiple fields. In this case we'll skip the `articleBody` field
      def body
        return {} if page.body.blank?

        {
          "articleBody" => page.body,
        }
      end

      def search_action
        return {} unless page.document_type == "manual"

        manuals_facet_params = { manual: page.base_path }
        PotentialSearchActionSchema.new(manuals_facet_params, search_description).structured_data
      end

      def search_description
        I18n.t(:scoped_search_description, scope: %i[components article_schema], title: page.title)
      end
    end
  end
end
