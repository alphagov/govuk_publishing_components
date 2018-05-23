module GovukPublishingComponents
  module Presenters
    class ArticleSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/Article
        {
          "@context" => "http://schema.org",
          "@type" => "Article",
          "mainEntityOfPage" => {
            "@type" => "WebPage",
            "@id" => page.canonical_url,
          },
          "headline" => page.title,
          "datePublished" => page.content_item["first_published_at"],
          "dateModified" => page.content_item["public_updated_at"],
          "description" => page.description,
          "publisher" => {
            "@type" => "Organization",
            "name" => "GOV.UK",
            "url" => "https://www.gov.uk",
          }
        }.merge(image_schema).merge(author_schema).merge(body)
      end

    private

      attr_reader :presenter

      # Not all formats have a `body` - some have their content split over
      # multiple fields. In this case we'll skip the `articleBody` field
      def body
        return {} unless page.body

        {
          "articleBody" => page.body
        }
      end

      def image_schema
        return {} unless page.has_image?

        {
          "image" => [
            page.image_url
          ]
        }
      end

      def author_schema
        return {} unless publishing_organisation

        {
          "author" => {
            "@type" => "Organization",
            "name" => publishing_organisation["title"],
            "url" => Plek.current.website_root + publishing_organisation["base_path"],
          }
        }
      end

      def publishing_organisation
        page.content_item.dig("links", "primary_publishing_organisation").to_a.first
      end
    end
  end
end
