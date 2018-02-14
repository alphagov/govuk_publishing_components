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

  def build_related_content(related_data)
    @related_content ||= [
      { "related_items"         => related_data[:related_items] ||= [] },
      { "related_guides"        => related_data[:related_guides] ||= [] },
      { "topics"                => related_data[:topics] ||= [] },
      { "collections"           => related_data[:collections] ||= [] },
      { "policies"              => related_data[:policies] ||= [] },
      { "topical_events"        => related_data[:topical_events] ||= [] },
      { "world_locations"       => related_data[:world_locations] ||= [] },
      { "statistical_data_sets" => related_data[:statistical_data_sets] ||= [] },
    ]

    other = related_data[:other] || []
    other.each do |sections|
      sections.each do |section|
        @related_content.push(
          section[:title].tr(' ', '_') => section[:links]
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
end
