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
            "logo" => {
              "@type" => "ImageObject",
              "url" => page.logo_url,
            }
          }
        }.merge(image_schema).merge(author_schema).merge(body).merge(is_part_of)
      end

    private

      attr_reader :presenter

      # Not all formats have a `body` - some have their content split over
      # multiple fields. In this case we'll skip the `articleBody` field
      def body
        return {} unless page.body.present?

        {
          "articleBody" => page.body
        }
      end

      def image_schema
        {
          "image" => page.has_image? ? [page.image_url] : page.image_placeholders
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

      def is_part_of
        return {} unless linked_step_by_steps.any?
        {
          "isPartOf" => step_by_step_schemas
        }
      end

      def linked_step_by_steps
        # We could include `related_to_step_navs` eventually too, but initially
        # link to those that we render in the "step_by_step_nav_related" component
        @step_by_steps ||= page.content_item.dig("links", "part_of_step_navs").to_a
      end

      def step_by_step_schemas
        linked_step_by_steps.map do |step_by_step|
          step_by_step_page = linked_page(step_by_step)
          structured_data = HowToSchema.new(step_by_step_page.canonical_url).structured_data

          structured_data.merge(image_schema)
        end
      end

      def linked_page(step_by_step)
        Page.new(
          content_item: step_by_step,
          schema: :article,
          logo_url: page.logo_url,
          image_placeholders: page.image_placeholders
        )
      end
    end
  end
end
