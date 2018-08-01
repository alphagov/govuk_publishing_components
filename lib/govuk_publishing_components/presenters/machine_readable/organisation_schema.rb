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
          "description" => page.body
        }
      end
    end
  end
end
