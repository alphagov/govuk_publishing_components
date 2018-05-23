require 'govuk_publishing_components/presenters/machine_readable/page'
require 'govuk_publishing_components/presenters/machine_readable/article_schema'
require 'govuk_publishing_components/presenters/machine_readable/news_article_schema'

module GovukPublishingComponents
  module Presenters
    class SchemaOrg
      attr_reader :page

      def initialize(local_assigns)
        @page = Page.new(local_assigns)
      end

      def structured_data
        if page.schema == :article
          ArticleSchema.new(page).structured_data
        elsif page.schema == :news_article
          NewsArticleSchema.new(page).structured_data
        else
          raise "#{page.schema} is not supported"
        end
      end
    end
  end
end
