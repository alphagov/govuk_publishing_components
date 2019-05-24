require 'govuk_publishing_components/presenters/machine_readable/page'
require 'govuk_publishing_components/presenters/machine_readable/article_schema'
require 'govuk_publishing_components/presenters/machine_readable/creative_work_schema'
require 'govuk_publishing_components/presenters/machine_readable/has_part_schema'
require 'govuk_publishing_components/presenters/machine_readable/is_part_of_schema'
require 'govuk_publishing_components/presenters/machine_readable/news_article_schema'
require 'govuk_publishing_components/presenters/machine_readable/organisation_schema'
require 'govuk_publishing_components/presenters/machine_readable/person_schema'
require 'govuk_publishing_components/presenters/machine_readable/potential_search_action_schema'
require 'govuk_publishing_components/presenters/machine_readable/search_results_page_schema'

module GovukPublishingComponents
  module Presenters
    class SchemaOrg
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        if page.schema == :article
          ArticleSchema.new(page).structured_data
        elsif page.schema == :news_article
          NewsArticleSchema.new(page).structured_data
        elsif page.schema == :person
          PersonSchema.new(page).structured_data
        elsif page.schema == :organisation
          OrganisationSchema.new(page).structured_data
        elsif page.schema == :search_results_page
          SearchResultsPageSchema.new(page).structured_data
        else
          raise "#{page.schema} is not supported"
        end
      end
    end
  end
end
