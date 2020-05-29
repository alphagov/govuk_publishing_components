require "govuk_publishing_components/presenters/machine_readable/page"
require "govuk_publishing_components/presenters/machine_readable/article_schema"
require "govuk_publishing_components/presenters/machine_readable/creative_work_schema"
require "govuk_publishing_components/presenters/machine_readable/faq_page_schema"
require "govuk_publishing_components/presenters/machine_readable/government_service_schema"
require "govuk_publishing_components/presenters/machine_readable/has_part_schema"
require "govuk_publishing_components/presenters/machine_readable/html_publication_schema"
require "govuk_publishing_components/presenters/machine_readable/is_part_of_schema"
require "govuk_publishing_components/presenters/machine_readable/news_article_schema"
require "govuk_publishing_components/presenters/machine_readable/organisation_schema"
require "govuk_publishing_components/presenters/machine_readable/person_schema"
require "govuk_publishing_components/presenters/machine_readable/potential_search_action_schema"
require "govuk_publishing_components/presenters/machine_readable/search_results_page_schema"
require "govuk_publishing_components/presenters/machine_readable/dataset_schema"

module GovukPublishingComponents
  module Presenters
    class SchemaOrg
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        schema_for_page.new(page).structured_data
      end

      def schema_for_page
        case page.schema
        when :faq
          FaqPageSchema
        when :article
          ArticleSchema
        when :government_service
          GovernmentServiceSchema
        when :news_article
          NewsArticleSchema
        when :person
          PersonSchema
        when :organisation
          OrganisationSchema
        when :search_results_page
          SearchResultsPageSchema
        when :dataset
          DatasetSchema
        when :html_publication
          HtmlPublicationSchema
        else
          raise "#{page.schema} is not supported"
        end
      end
    end
  end
end
