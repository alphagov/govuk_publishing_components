module GovukPublishingComponents
  module Presenters
    class BreadcrumbSelector
      def self.call(*args)
        new(*args).output
      end

      attr_reader :content_item, :request, :prioritise_taxon_breadcrumbs

      def initialize(content_item, request, prioritise_taxon_breadcrumbs)
        @content_item = content_item
        @request = request
        @prioritise_taxon_breadcrumbs = prioritise_taxon_breadcrumbs
      end

      def navigation
        @navigation ||= ContextualNavigation.new(content_item, request)
      end

      def output
        OpenStruct.new(options)
      end

      def breadcrumbs
        navigation.breadcrumbs
      end

      def priority_breadcrumbs
        navigation.priority_breadcrumbs
      end

      def taxon_breadcrumbs
        navigation.taxon_breadcrumbs
      end

      def options
        if priority_breadcrumbs
          {
            step_by_step: true,
            breadcrumbs: priority_breadcrumbs,
          }
        elsif navigation.content_tagged_to_current_step_by_step?
          {
            step_by_step: true,
            breadcrumbs: navigation.step_nav_helper.header,
          }
        elsif navigation.content_tagged_to_a_finder?
          {
            step_by_step: false,
            breadcrumbs: breadcrumbs,
          }
        elsif navigation.content_is_tagged_to_a_live_taxon? && prioritise_taxon_breadcrumbs
          {
            step_by_step: false,
            breadcrumbs: taxon_breadcrumbs,
          }
        elsif navigation.content_tagged_to_mainstream_browse_pages?
          {
            step_by_step: false,
            breadcrumbs: breadcrumbs,
          }
        elsif navigation.content_has_curated_related_items?
          {
            step_by_step: false,
            breadcrumbs: breadcrumbs,
          }
        elsif navigation.content_is_tagged_to_a_live_taxon? && !navigation.content_is_a_specialist_document?
          {
            step_by_step: false,
            breadcrumbs: taxon_breadcrumbs,
          }
        elsif breadcrumbs.any?
          {
            step_by_step: false,
            breadcrumbs: breadcrumbs,
          }
        else
          {
            step_by_step: false,
            breadcrumbs: false,
          }
        end
      end
    end
  end
end
