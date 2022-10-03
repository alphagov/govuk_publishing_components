module GovukPublishingComponents
  module Presenters
    class CreativeWorkSchema
      attr_reader :page

      def initialize(page)
        @page = page
        @pages = {}
      end

      def structured_data
        # http://schema.org/CreativeWork
        {
          "@context" => "http://schema.org",
          "@type" => "CreativeWork",
          "mainEntityOfPage" => {
            "@type" => "WebPage",
            "@id" => page.canonical_url,
          },
          "name" => page.title,
          "datePublished" => page.content_item["first_published_at"],
          "dateModified" => page.content_item["public_updated_at"],
          "text" => page.description,
          "publisher" => {
            "@type" => "Organization",
            "name" => "GOV.UK",
            "url" => "https://www.gov.uk",
            "logo" => {
              "@type" => "ImageObject",
              "url" => page.logo_url,
            },
          },
        }.merge(image_schema).merge(author_schema).merge(is_part_of).merge(about).merge(has_part)
      end

    private

      attr_reader :presenter

      def image_schema
        {
          "image" => page.has_image? ? [page.image_url] : page.image_placeholders,
        }
      end

      def author_schema
        return {} unless publishing_organisation

        {
          "author" => {
            "@type" => "Organization",
            "name" => publishing_organisation["title"],
            "url" => Plek.new.website_root + publishing_organisation["base_path"],
          },
        }
      end

      def publishing_organisation
        page.content_item.dig("links", "primary_publishing_organisation").to_a.first
      end

      def is_part_of
        return {} unless document_collections.any?

        {
          "isPartOf" => document_collections,
        }
      end

      def linked_page(step_by_step)
        Page.new(
          content_item: step_by_step,
          schema: :article,
          logo_url: page.logo_url,
          image_placeholders: page.image_placeholders,
        )
      end

      def has_part
        return {} unless collection_pages("documents").any?

        {
          "hasPart" => collection_pages("documents").map { |document| HasPartSchema.new(document).structured_data },
        }
      end

      def document_collections
        @document_collections ||= collection_pages("document_collections")
                                      .map { |document| IsPartOfSchema.new(document).structured_data }
      end

      def collection_pages(linked_type)
        @pages[linked_type] ||= fetch_collection_pages(linked_type)
      end

      def fetch_collection_pages(linked_type)
        page.content_item.dig("links", linked_type).to_a.map { |document| document["web_url"] }
      end

      def about
        return {} unless live_taxons.any?

        {
          "about" => linked_taxons,
        }
      end

      def live_taxons
        taxons = page.content_item.dig("links", "taxons")
        return [] unless taxons

        taxons.select { |taxon| taxon["phase"] == "live" }
      end

      def linked_taxons
        live_taxons.map do |taxon|
          {
            "@context" => "http://schema.org",
            "@type" => "Thing",
            "sameAs" => taxon["web_url"],
          }
        end
      end
    end
  end
end
