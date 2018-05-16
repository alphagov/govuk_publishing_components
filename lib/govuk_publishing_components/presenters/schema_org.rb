module GovukPublishingComponents
  module Presenters
    class SchemaOrg
      def initialize(local_assigns)
        @local_assigns = local_assigns
      end

      def structured_data
        if @local_assigns.fetch(:schema) == :article
          ArticleSchema.new(@local_assigns).structured_data
        elsif @local_assigns.fetch(:schema) == :news_article
          NewsArticleSchema.new(@local_assigns).structured_data
        else
          raise "#{@local_assigns.fetch(:schema)} is not supported"
        end
      end

      class NewsArticleSchema
        def initialize(local_assigns)
          @local_assigns = local_assigns
        end

        def structured_data
          # http://schema.org/NewsArticle
          data = ArticleSchema.new(@local_assigns).structured_data
          data["@type"] = "NewsArticle"
          data
        end
      end

      class ArticleSchema
        attr_reader :content_item, :canonical_url, :local_assigns

        def initialize(local_assigns)
          @local_assigns = local_assigns

          @content_item = local_assigns[:content_item]
          @canonical_url = local_assigns[:canonical_url]
          @custom_body = local_assigns[:body]
        end

        def structured_data
          # http://schema.org/Article
          {
            "@context" => "http://schema.org",
            "@type" => "Article",
            "mainEntityOfPage" => {
              "@type" => "WebPage",
              "@id" => canonical_url || page_url_from_content_item,
            },
            "headline" => local_assigns[:title] || content_item["title"],
            "datePublished" => content_item["first_published_at"],
            "dateModified" => content_item["public_updated_at"],
            "description" => content_item["description"],
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
          return {} unless @custom_body || content_item["details"]["body"]

          {
            "articleBody" => @custom_body || content_item["details"]["body"]
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
          content_item.dig("links", "primary_publishing_organisation").to_a.first
        end

        def page_url_from_content_item
          Plek.current.website_root + content_item["base_path"]
        end

        def image
          content_item.dig("details", "image")
        end
      end
    end
  end
end
