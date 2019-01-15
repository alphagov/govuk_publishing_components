module GovukPublishingComponents
  module Presenters
    # @private
    # Only used by the related_navigation component
    class RelatedNavigationHelper
      MAX_SECTION_LENGTH = 5
      DEFINED_SECTIONS = %w(
        related_guides
        topics
        collections
        topical_events
        world_locations
        statistical_data_sets
      ).freeze

      def initialize(options = {})
        @content_item = options.fetch(:content_item) { raise ArgumentError, 'missing argument: content_item' }
        @context = options.fetch(:context, nil)
      end

      def related_navigation
        case @context.try(:to_sym)
        when :sidebar
          {
            "related_items" => related_items,
            "related_guides" => related_guides,
            "collections" => related_document_collections,
          }
        when :footer
          {
            "topics" => related_topics,
            "topical_events" => related_topical_events,
            "world_locations" => related_world_locations,
            "statistical_data_sets" => related_statistical_data_sets,
            "related_external_links" => related_external_links,
            "related_contacts" => related_contacts,
          }
        else
          {
            "related_items" => related_items,
            "related_guides" => related_guides,
            "collections" => related_document_collections,
            "topics" => related_topics,
            "topical_events" => related_topical_events,
            "world_locations" => related_world_locations,
            "statistical_data_sets" => related_statistical_data_sets,
            "related_external_links" => related_external_links,
            "related_contacts" => related_contacts,
          }
        end
      end

      def construct_section_heading(section_title)
        unless section_title === "related_items"
          I18n.t("components.related_#{@context}_navigation." + section_title,
                 default: [
                   I18n.t('components.related_navigation.' + section_title),
                   section_title.tr('_', ' '),
                 ])
        end
      end

      def section_css_class(css_class, section_title, link = {})
        css_classes = [css_class, "#{css_class}--#{@context}"]

        unless DEFINED_SECTIONS.include?(section_title) || link.fetch(:finder, false)
          css_classes << " #{css_class}--other"
        end

        css_classes.join(' ')
      end

      def section_data_track_count(section_title)
        String(@context || 'sidebar') + String(section_title).camelcase
      end

      def section_heading_level
        @context == :footer ? 'h2' : 'h3'
      end

      def calculate_section_link_limit(links)
        links.length == MAX_SECTION_LENGTH + 1 ? MAX_SECTION_LENGTH + 1 : MAX_SECTION_LENGTH
      end

      def remaining_link_count(links)
        links.length - MAX_SECTION_LENGTH
      end

      def related_navigation?
        related_navigation.flat_map(&:last).any?
      end

    private

      def related_items
        related_quick_links = content_item_details_for('quick_links')

        if related_quick_links.any?
          related_quick_links + related_mainstream_content
        else
          content_item_links_for('ordered_related_items') + related_mainstream_content
        end
      end

      def related_world_locations
        content_item_links_for('world_locations')
          .map { |link| link.merge(path: "/world/#{link[:text].parameterize}/news") }
      end

      def related_statistical_data_sets
        content_item_links_for('related_statistical_data_sets', only: 'statistical_data_set')
      end

      def related_taxons
        content_item_links_for('taxons', only: 'taxon')
      end

      def related_topics
        if related_legacy_topics.any?
          related_legacy_topics
        elsif related_taxons.any?
          related_taxons
        else
          []
        end
      end

      def related_legacy_topics
        mainstream_browse_page_links = content_item_links_for('mainstream_browse_pages', only: 'mainstream_browse_page')
        topic_links = content_item_links_for('topics', only: 'topic')

        mainstream_browse_page_links + topic_links.find_all do |topic_link|
          mainstream_browse_page_links.none? do |mainstream_browse_page_link|
            mainstream_browse_page_link[:text] == topic_link[:text]
          end
        end
      end

      def related_topical_events
        content_item_links_for('topical_events', only: 'topical_event')
      end

      def related_contacts
        content_item_links_for('related', only: 'contact')
      end

      def related_external_links
        content_item_details_for('external_related_links')
      end

      def related_mainstream_content
        return [] unless detailed_guide?

        content_item_links_for('related_mainstream_content')
      end

      def related_guides
        return [] unless detailed_guide?

        content_item_links_for('related_guides')
      end

      def related_document_collections
        content_item_links_for('document_collections', only: 'document_collection')
      end

      def detailed_guide?
        @content_item['document_type'] == 'detailed_guide'
      end

      def content_item_details_for(key)
        Array(@content_item.dig('details', key))
          .map { |link| { path: link['url'], text: link['title'], rel: 'external' } }
      end

      def content_item_links_for(key, only: nil)
        links = Array(@content_item.dig('links', key))

        if key == 'taxons'
          links = links.find_all { |link| link['phase'] == 'live' }
        end

        if only.present?
          links = links.find_all { |link| link['document_type'] == only }
        end

        links.map { |link| { path: link['base_path'], text: link['title'] } }
      end
    end
  end
end
