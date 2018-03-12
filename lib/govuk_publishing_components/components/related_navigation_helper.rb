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
    @related_content ||= [
      { "related_items" => related_items },
      { "related_guides" => related_guides },
      { "collections" => related_collections },
      { "topics" => related_topics },
      { "policies" => related_policies },
      { "topical_events" => related_topical_events },
      { "world_locations" => related_world_locations },
      { "statistical_data_sets" => related_statistical_data_sets },
    ]

    other = [related_external_links, related_contacts] || []
    other.each do |sections|
      sections.each do |section|
        @related_content.push(
          section["title"].tr(' ', '_') => section["links"]
        )
      end
    end

    @related_content
  end

  def other
    @other ||= []
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
    topics = filter_link_type("topics", "topic")
    links = build_links_for_sidebar(topics)
    links << related_mainstream_topic << related_mainstream_parent_topic
    deduplicate_topics_by_title(links.compact)
  end

  def related_topical_events
    topical_events = filter_link_type("topical_events", "topical_event")
    build_links_for_sidebar(topical_events)
  end

  def related_contacts
    contacts = filter_link_type("related", "contact")
    return [] unless contacts.any?
    [
      title: "Other contacts",
      links: build_links_for_sidebar(contacts).map
    ]
  end

  def related_external_links
    external_links = @content_item.dig("details", "external_related_links").to_a
    return [] unless external_links.any?
    [
      "title" => "Elsewhere on the web",
      "links" => build_links_for_sidebar(external_links, "url", rel: 'external')
    ]
  end

  def related_mainstream_topic
    return unless tagged_to_same_mainstream_browse_page.any?
    { text: parent["title"], path: parent["base_path"] }
  end

  def related_mainstream_parent_topic
    return unless parents_tagged_to_same_mainstream_browse_page.any?
    { text: grandparent["title"], path: grandparent["base_path"] }
  end

  def parent
    link_group("parent").first
  end

  def grandparent
    parent.dig("links", "parent", 0)
  end

  # This method post-processes the topics collated by the helper.
  # We add mainstream browse page links if they are present, however
  # if these have the same title as an existing topic we should prefer
  # the mainstream version and remove the existing topic.
  # @see spec/related_navigation_helper_spec.rb for test coverage.
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

  def tagged_to_same_mainstream_browse_page
    return [] unless parent
    @tagged_to_same_mainstream_browse_page ||= related_links.select do |related_item|
      links = related_item.dig("links", "mainstream_browse_pages") || []
      content_ids = links.any? ? links.map { |page| page["content_id"] } : []
      content_ids.include?(parent["content_id"])
    end
  end

  def parents_tagged_to_same_mainstream_browse_page
    return [] unless parent && grandparent
    common_parent_content_ids = tagged_to_same_mainstream_browse_page.map { |item| item["content_id"] }

    @parents_tagged_to_same_mainstream_browse_page ||= related_links.select do |related_item|
      next if common_parent_content_ids.include?(related_item["content_id"])
      mainstream_browse_pages = related_item.dig("links", "mainstream_browse_pages") || []
      parents = mainstream_browse_pages.map { |page| page["links"]["parent"][0] }
      content_ids = parents.map { |parent| parent["content_id"] }
      content_ids.include?(grandparent["content_id"])
    end
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
