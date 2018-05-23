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

      class Page
        attr_reader :local_assigns

        def initialize(local_assigns)
          @local_assigns = local_assigns
        end

        def schema
          local_assigns.fetch(:schema)
        end

        def canonical_url
          local_assigns[:canonical_url] || (Plek.current.website_root + content_item["base_path"])
        end

        def body
          local_assigns[:body] || content_item["details"]["body"]
        end

        def title
          local_assigns[:title] || content_item["title"]
        end

        def content_item
          local_assigns[:content_item]
        end
      end

      class NewsArticleSchema
        def initialize(page)
          @page = page
        end

        def structured_data
          # http://schema.org/NewsArticle
          data = ArticleSchema.new(@page).structured_data
          data["@type"] = "NewsArticle"
          data
        end
      end

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
            "description" => page.content_item["description"],
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
          return {} unless image

          {
            "image" => [
              image["url"],
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

        def image
          page.content_item.dig("details", "image")
        end
      end
    end
  end
end
