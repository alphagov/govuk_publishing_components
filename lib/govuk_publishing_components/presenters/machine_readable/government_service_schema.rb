module GovukPublishingComponents
  module Presenters
    class GovernmentServiceSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/GovernmentService
        {
          "@context" => "http://schema.org",
          "@type" => "GovernmentService",
          "name" => page.title,
          "description" => page.description,
          "url" => page.canonical_url,
        }
          .merge(provider)
          .merge(related_services)
      end

    private

      def related_services
        related_links = page.content_item.dig("links", "ordered_related_items")

        return {} unless related_links.present?

        {
          "isRelatedTo" => related_links.each_with_object([]) do |link, items|
            next unless link["schema_name"] == "transaction"

            items << {
              "@type" => "GovernmentService",
              "name" => link["title"],
              "url" => link["web_url"],
            }
          end,
        }
      end

      def provider
        organisations = page.content_item.dig("links", "organisations")

        return {} unless organisations.present?

        providers = organisations.map do |organisation|
          {
            "@type" => "GovernmentOrganization",
            "name" => organisation["title"],
            "url" => organisation["web_url"],
          }
        end

        {
          "provider" => providers,
        }
      end
    end
  end
end
