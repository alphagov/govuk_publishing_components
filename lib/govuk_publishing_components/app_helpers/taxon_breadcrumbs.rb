module GovukPublishingComponents
  module AppHelpers
    class TaxonBreadcrumbs
      # @param content_item A taxon
      def initialize(content_item)
        @content_item = TaxonBreadcrumbs::ContentItem.new(content_item)
      end

      # Generate a breadcrumb trail for a taxon, using the taxon_parent link field
      #
      # @return [Hash] Payload for the GOV.UK breadcrumbs component
      # @see https://govuk-component-guide.herokuapp.com/components/breadcrumbs
      def breadcrumbs
        ordered_parents = all_parents.map.with_index do |parent, index|
          {
            title: parent.title,
            url: parent.base_path,
            is_page_parent: index.zero?
          }
        end

        ordered_parents << {
          title: "Home",
          url: "/",
          is_page_parent: ordered_parents.empty?
        }

        ordered_parents.reverse
      end

    private

      attr_reader :content_item

      def all_parents
        parents = []

        direct_parent = content_item.parent_taxon
        while direct_parent
          parents << direct_parent
          direct_parent = direct_parent.parent_taxon
        end

        parents
      end

      class ContentItem
        attr_reader :content_item

        def initialize(content_item)
          @content_item = content_item
        end

        def parent_taxon
          parent_taxons.first
        end

        def parent_taxons
          @_parent_taxons ||= begin
            content_item.dig("links", "parent_taxons")
              .to_a
              .select { |t| phase_is_live?(t) }
              .map { |taxon| ContentItem.new(taxon) }
          end
        end

        def phase_is_live?(taxon)
          taxon["phase"] == "live"
        end

        def title
          content_item.fetch("title")
        end

        def base_path
          content_item.fetch("base_path")
        end
      end
    end
  end
end
