module GovukPublishingComponents
  module Presenters
    class PersonSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/Person
        {
          "@context" => "http://schema.org",
          "@type" => "Person",
          "mainEntityOfPage" => {
            "@type" => "WebPage",
            "@id" => page.canonical_url,
          },
          "name" => page.title,
          "description" => page.body
        }.merge(image_schema)
      end

    private

      attr_reader :presenter

      def image_schema
        return {} unless page.has_image?

        {
          "image" => [
            page.image_url
          ]
        }
      end
    end
  end
end
