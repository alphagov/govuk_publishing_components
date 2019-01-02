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
          "description" => page.description || page.body
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
    end
  end
end
