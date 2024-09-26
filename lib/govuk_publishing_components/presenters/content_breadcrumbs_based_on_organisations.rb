module GovukPublishingComponents
  module Presenters
    # @private
    class ContentBreadcrumbsBasedOnOrganisations
      def self.call(content_item)
        new(content_item).breadcrumbs
      end

      def initialize(content_item)
        @content_item = ContentItem.new(content_item)
      end

      def breadcrumbs
        [
          { title: "Home", url: "/" },
          *organisation_breadcrumbs_items,
        ]
      end

    private

      attr_reader :content_item

      def organisation_breadcrumbs_items
        first_related_organisation = ContentItem.new(content_item.related_organisations.first)
        return [] unless first_related_organisation.present?

        [{
          title: first_related_organisation.title,
          url: first_related_organisation.base_path,
        }]
      end
    end
  end
end
