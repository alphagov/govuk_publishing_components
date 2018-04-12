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
        policies
        topical_events
        world_locations
        statistical_data_sets
      ).freeze

      def initialize(content_item)
        @content_item = content_item
      end

      def related_navigation
        {
          "related_items" => related_items,
          "related_guides" => related_guides,
          "collections" => related_collections,
          "topics" => related_topics,
          "policies" => related_policies,
          "topical_events" => related_topical_events,
          "world_locations" => related_world_locations,
          "statistical_data_sets" => related_statistical_data_sets,
          "related_external_links" => related_external_links,
          "related_contacts" => related_contacts,
        }
      end

      def construct_section_heading(section_title)
        unless section_title === "related_items"
          I18n.t('components.related_navigation.' + section_title, default: section_title.tr('_', ' '))
        end
      end

      def section_css_class(css_class, section_title, link = {})
        unless DEFINED_SECTIONS.include?(section_title) || link.fetch(:finder, false)
          css_class += "--other"
        end
        css_class
      end

      def calculate_section_link_limit(links)
        links.length == MAX_SECTION_LENGTH + 1 ? MAX_SECTION_LENGTH + 1 : MAX_SECTION_LENGTH
      end

      def remaining_link_count(links)
        links.length - MAX_SECTION_LENGTH
      end

      def anything_to_show?
        related_navigation.flat_map(&:last).any?
      end

    private

      def build_links_for_sidebar(collection, path_key = "base_path", additional_attr = {})
        collection.map do |link|
          {
            path: link[path_key],
            text: link["title"]
          }.merge(additional_attr)
        end
      end

      def world_location_base_path(title)
        "/world/#{parameterise(title)}/news"
      end

      def related_items
        links = build_links_for_sidebar(quick_links, "url")
        mainstream_links = related_mainstream_content
        related_ordered_items = link_group("ordered_related_items")
        if links.any?
          links + mainstream_links
        else
          build_links_for_sidebar(related_ordered_items) + mainstream_links
        end
      end

      def quick_links
        @content_item.dig("details", "quick_links").to_a
      end

      def related_world_locations
        locations = link_group("world_locations")
        locations.map! { |link| link.merge("base_path" => world_location_base_path(link["title"])) }
        build_links_for_sidebar(locations)
      end

      def related_collections
        collections = filter_link_type("document_collections", "document_collection")
        build_links_for_sidebar(collections)
      end

      def filter_link_type(group, type)
        links = link_group(group)
        links.select do |link|
          link["document_type"] == type
        end
      end

      def related_policies
        policies = filter_link_type("related_policies", "policy")
        build_links_for_sidebar(policies)
      end

      def related_statistical_data_sets
        statistical_data_sets = filter_link_type("related_statistical_data_sets", "statistical_data_set")
        build_links_for_sidebar(statistical_data_sets)
      end

      def related_topics
        mainstream_browse_pages = filter_link_type("mainstream_browse_pages", "mainstream_browse_page")

        topics_that_dont_duplicate_browse = filter_link_type("topics", "topic").select do |topic|
          mainstream_browse_pages.none? { |browse_page| browse_page["title"] == topic["title"] }
        end

        links = build_links_for_sidebar(mainstream_browse_pages + topics_that_dont_duplicate_browse)
        links.compact
      end

      def related_topical_events
        topical_events = filter_link_type("topical_events", "topical_event")
        build_links_for_sidebar(topical_events)
      end

      def related_contacts
        contacts = filter_link_type("related", "contact")
        build_links_for_sidebar(contacts)
      end

      def related_external_links
        external_links = @content_item.dig("details", "external_related_links").to_a
        build_links_for_sidebar(external_links, "url", rel: "external")
      end

      def parameterise(str, sep = "-")
        parameterised_str = str.gsub(/[^\w\-]+/, sep)
        unless sep.nil? || sep.empty?
          re_sep = Regexp.escape(sep)
          # No more than one of the separator in a row.
          parameterised_str.gsub!(/#{re_sep}{2,}/, sep)
          # Remove leading/trailing separator.
          parameterised_str.gsub!(/^#{re_sep}|#{re_sep}$/, '')
        end
        parameterised_str.downcase
      end

      def related_links
        link_group("ordered_related_items")
      end

      def related_mainstream_content
        return [] unless @content_item["document_type"] == "detailed_guide"
        content = link_group("related_mainstream_content")
        build_links_for_sidebar(content)
      end

      def related_guides
        return [] unless @content_item["document_type"] == "detailed_guide"
        guides = link_group("related_guides")
        build_links_for_sidebar(guides)
      end

      def link_group(type)
        @content_item.dig("links", type).to_a
      end
    end
  end
end
