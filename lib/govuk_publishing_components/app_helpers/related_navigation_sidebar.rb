require 'govuk_publishing_components/app_helpers/services'
require 'govuk_publishing_components/app_helpers/configuration'

module GovukPublishingComponents
  module AppHelpers
    # @private
    class RelatedNavigationSidebar
      def initialize(content_item)
        @content_item = ContentItem.new content_item
      end

      def related_navigation_sidebar
        {
          related_items: related_items,
          collections: related_collections,
          statistical_data_sets: related_statistical_data_sets,
          topics: related_topics,
          topical_events: related_topical_events,
          policies: related_policies,
          publishers: related_organisations,
          world_locations: related_world_locations,
          worldwide_organisations: related_worldwide_organisations,
          other: [related_external_links, related_contacts]
        }
      end

    private

      def build_links_for_sidebar(collection, path_key = "base_path", additional_attr = {})
        collection.map do |link|
          {
            text: link["title"],
            path: link[path_key]
          }.merge(additional_attr)
        end
      end

      def world_location_base_path(title)
        "/world/#{parameterise(title)}/news"
      end

      def related_items
        quick_links = build_links_for_sidebar(@content_item.quick_links, "url")

        quick_links.any? ? quick_links : build_links_for_sidebar(@content_item.related_ordered_items)
      end

      def related_organisations
        build_links_for_sidebar(@content_item.related_organisations)
      end

      def related_world_locations
        locations = @content_item.related_world_locations
        locations.map! { |link| link.merge("base_path" => world_location_base_path(link["title"])) }
        build_links_for_sidebar(locations)
      end

      def related_worldwide_organisations
        build_links_for_sidebar(@content_item.related_worldwide_organisations)
      end

      def related_collections
        build_links_for_sidebar(@content_item.related_collections)
      end

      def related_policies
        build_links_for_sidebar(@content_item.related_policies)
      end

      def related_statistical_data_sets
        build_links_for_sidebar(@content_item.related_statistical_data_sets)
      end

      def related_topics
        topics = build_links_for_sidebar(@content_item.related_topics)
        topics << related_mainstream_topic << related_mainstream_parent_topic
        deduplicate_topics_by_title(topics.compact)
      end

      def related_topical_events
        build_links_for_sidebar(@content_item.related_topical_events)
      end

      def related_contacts
        return [] unless @content_item.related_other_contacts.any?
        [
          title: "Other contacts",
          links: build_links_for_sidebar(@content_item.related_other_contacts).map
        ]
      end

      def related_external_links
        return [] unless @content_item.external_links.any?
        [
          title: "Elsewhere on the web",
          links: build_links_for_sidebar(@content_item.external_links, "url", rel: 'external')
        ]
      end

      def related_mainstream_topic
        return unless grouped.tagged_to_same_mainstream_browse_page.any?
        { text: @content_item.parent.title, path: @content_item.parent.base_path }
      end

      def related_mainstream_parent_topic
        return unless grouped.parents_tagged_to_same_mainstream_browse_page.any?
        { text: @content_item.parent.parent.title, path: @content_item.parent.parent.base_path }
      end

      # This method post-processes the topics collated by the helper.
      # We add mainstream browse page links if they are present, however
      # if these have the same title as an existing topic we should prefer
      # the mainstream version and remove the existing topic.
      # @see spec/related_navigation_sidebar_spec.rb:260 for test coverage.
      def deduplicate_topics_by_title(topics)
        is_dupe = lambda { |a, b| a && a != b && a[:text] == b[:text] }

        topics.delete_if do |t|
          is_dupe.call(related_mainstream_topic, t) ||
            is_dupe.call(related_mainstream_parent_topic, t)
        end

        topics
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

      def grouped
        @grouped ||= GroupedRelatedLinks.new(@content_item)
      end
    end
  end
end
