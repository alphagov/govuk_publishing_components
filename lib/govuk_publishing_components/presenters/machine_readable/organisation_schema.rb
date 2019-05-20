module GovukPublishingComponents
  module Presenters
    class OrganisationSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/GovernmentOrganization
        {
          "@context" => "http://schema.org",
          "@type" => "GovernmentOrganization",
          "mainEntityOfPage" => {
            "@type" => "WebPage",
            "@id" => page.canonical_url,
          },
          "name" => page.title,
          "description" => page.description || page.body,
          "potentialAction" => {
            "@type": "SearchAction",
            "target": scoped_search_url,
            "query": "required"
          }
        }.merge(parent_organisations).merge(sub_organisations)
      end

    private

      def parent_organisations
        related_organisations("ordered_parent_organisations", "parentOrganization")
      end

      def sub_organisations
        related_organisations("ordered_child_organisations", "subOrganization")
      end

      def related_organisations(link_type, schema_name)
        organisations = page.content_item.dig("links", link_type)

        return {} unless organisations.present?

        related_orgs = organisations.map do |org|
          page = Page.new(content_item: org)
          linked_org(page.canonical_url)
        end

        {
          schema_name => related_orgs
        }
      end

      def linked_org(url)
        {
          "@context" => "http://schema.org",
          "@type" => "GovernmentOrganization",
          "sameAs" => url
        }
      end

      def slug
        uri = URI.parse(page.canonical_url)
        File.basename(uri.path)
      end

      def scoped_search_url
        "#{Plek.current.website_root}/search/all?keywords={query}&organisations[]=#{slug}"
      end
    end
  end
end
