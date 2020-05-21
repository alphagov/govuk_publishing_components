module GovukPublishingComponents
  module Presenters
    class ContentBreadcrumbsBasedOnPriority
      # keys are labels, values are the content_ids for the matching taxons
      # Where multiple matching taxons are present, the top most one is the highest priority
      #   and the bottom one the lowest priority
      PRIORITY_TAXONS = {
        education_coronavirus: "272308f4-05c8-4d0d-abc7-b7c2e3ccd249",
        business_coronavirus: "65666cdf-b177-4d79-9687-b9c32805e450",
      }.freeze

      # Returns the highest priority taxon that has a content_id matching those in PRIORITY_TAXONS
      def self.call(content_item)
        new(content_item).taxon
      end

      attr_reader :content_item

      def initialize(content_item)
        @content_item = content_item
      end

      def taxon
        @taxon ||= priority_taxons.min_by { |t| PRIORITY_TAXONS.values.index(t["content_id"]) }
      end

    private

      def priority_taxons
        taxons = []
        content_item.dig("links", "taxons")&.map do |taxon|
          taxons << taxon if priority_taxon?(taxon)

          taxons << taxon.dig("links", "parent_taxons")&.select do |parent_taxon|
            priority_taxon?(parent_taxon)
          end
        end

        taxons.flatten!
        taxons.compact!
        taxons
      end

      def priority_taxon?(taxon)
        PRIORITY_TAXONS.values.include?(taxon["content_id"])
      end
    end
  end
end
