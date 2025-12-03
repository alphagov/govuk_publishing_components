require "rails_helper"

describe "Related navigation", type: :view do
  def component_name
    "related_navigation"
  end

  def construct_links(type, base_path, title, document_type = nil, locale = nil)
    {
      type => [
        {
          "base_path" => base_path,
          "title" => title,
          "document_type" => document_type,
          "locale" => locale,
        },
      ],
    }
  end

  it "renders nothing when no parameters given" do
    assert_empty render_component(content_item: {}).strip
  end

  it "renders related content section when passed related items" do
    content_item = {}
    content_item["links"] = construct_links(
      "ordered_related_items", "/apprenticeships", "Apprenticeships"
    )
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__main-heading", text: "Related content"
    assert_select ".gem-c-related-navigation__section-link--other[href=\"/apprenticeships\"]", text: "Apprenticeships"
  end

  it "renders related guides section when passed related guides" do
    content_item = { "document_type" => "detailed_guide" }
    content_item["links"] = construct_links(
      "related_guides", "/something-a-bit-like-this", "Some other guidance"
    )
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading", text: "Detailed guidance"
    assert_select ".gem-c-related-navigation__section-link[href=\"/something-a-bit-like-this\"]", text: "Some other guidance"
  end

  it "renders statistical data set section when passed statistical data set items" do
    content_item = {}
    content_item["links"] = construct_links(
      "related_statistical_data_sets",
      "/air-quality-statistics",
      "Air quality statistics",
      "statistical_data_set",
    )
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading", text: "Statistical data set"
    assert_select ".gem-c-related-navigation__section-link[href=\"/air-quality-statistics\"]", text: "Air quality statistics"
  end

  it "renders world locations section when passed world location items with base path" do
    content_item = {}
    content_item["links"] = construct_links("world_locations", "/uk-mission-to-the-eu", "UK Mission to the European Union")
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading", text: "World locations"
    assert_select ".gem-c-related-navigation__section-link[href=\"/uk-mission-to-the-eu\"]", text: "UK Mission to the European Union"
  end

  it "renders world locations section when passed world location items without base path" do
    content_item = {}
    content_item["links"] = construct_links("world_locations", nil, "USA")
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading", text: "World locations"
    assert_select ".gem-c-related-navigation__section-link[href=\"/world/usa/news\"]", text: "USA"
  end

  it "renders collection section when passed collection items" do
    content_item = {}
    content_item["links"] = construct_links(
      "document_collections",
      "/government/collections/the-future-of-jobs-and-skills",
      "The future of jobs and skills",
      "document_collection",
    )
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading", text: "Collection"
    assert_select ".gem-c-related-navigation__section-link[href=\"/government/collections/the-future-of-jobs-and-skills\"]", text: "The future of jobs and skills"
  end

  it "renders topical events section when passed topical event items" do
    content_item = {}
    content_item["links"] = construct_links(
      "topical_events",
      "/government/topical-events/uk-china-high-level-people-to-people-dialogue-2017",
      "UK-China High-Level People to People Dialogue 2017",
      "topical_event",
    )
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading", text: "Topical event"
    assert_select ".gem-c-related-navigation__section-link[href=\"/government/topical-events/uk-china-high-level-people-to-people-dialogue-2017\"]", text: "UK-China High-Level People to People Dialogue 2017"
  end

  it "renders other links section when passed external related links" do
    content_item = {}
    content_item["details"] = {
      "external_related_links" => [
        {
          "url" => "https://www.thestudentroom.co.uk/content.php?r=5967-Repaying-your-student-loan",
          "title" => "The Student Room repaying your student loan",
        },
      ],
    }
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading--other", text: "Elsewhere on the web"
    assert_select ".gem-c-related-navigation__section-link--other[href=\"https://www.thestudentroom.co.uk/content.php?r=5967-Repaying-your-student-loan\"][rel=\"external\"]", text: "The Student Room repaying your student loan"
  end

  it "renders 'Other contacts' section when passed contacts" do
    content_item = {}
    content_item["links"] = construct_links(
      "related",
      "/ye-olde-contact",
      "A related contact",
      "contact",
    )
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__sub-heading--other", text: "Other contacts"
    assert_select ".gem-c-related-navigation__section-link--other[href=\"/ye-olde-contact\"]", text: "A related contact"
  end

  it "adds aria labelledby to navigation sections" do
    content_item = {}
    content_item["links"] = construct_links(
      "topical_events",
      "/government/topical-events/uk-china-high-level-people-to-people-dialogue-2017",
      "UK-China High-Level People to People Dialogue 2017",
      "topical_event",
    )
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__nav-section[aria-labelledby]"
  end

  it "adds a show more toggle link to long sections" do
    content_item = { "links" => { "world_locations" => [] } }
    %w[USA Wales Fiji Iceland Sweden Mauritius Brazil].each do |country|
      content_item["links"]["world_locations"] << { "title" => country }
    end
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__section-link[href=\"/world/wales/news\"]", text: "Wales"
    assert_select ".gem-c-related-navigation__link.toggle-wrap", text: "Show 2 more world locations"
    assert_select ".gem-c-related-navigation__link.toggle-wrap[data-module='ga4-event-tracker']"
    assert_select "#toggle_world_locations .gem-c-related-navigation__section-link[href=\"/world/mauritius/news\"]", text: "Mauritius"
    assert_select "#toggle_world_locations .gem-c-related-navigation__section-link[href=\"/world/brazil/news\"]", text: "Brazil"
  end

  it "adds a show more toggle link to long external link sections" do
    content_item = {}
    links = []

    7.times do
      links << { "url" => "https://wikipedia.org", "title" => "Wikipedia" }
    end

    content_item["details"] = {
      "external_related_links" => links,
    }

    render_component(content_item:)

    assert_select ".gem-c-related-navigation__link.toggle-wrap", text: "Show 2 more external links"
  end

  it "does not use a Show More for only one link above the max per section" do
    content_item = { "links" => { "world_locations" => [] } }
    %w[USA Wales Fiji Iceland Sweden Mauritius].each do |country|
      content_item["links"]["world_locations"] << { "title" => country }
    end
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__section-link[href=\"/world/wales/news\"]", text: "Wales"
    assert_select ".gem-c-related-navigation__link.toggle-wrap", false, "Progressive disclosure should not display for only 1 link"
  end

  it "renders multiple items when passed data for multiple sections" do
    content_item = {}
    ordered_related_items = construct_links(
      "ordered_related_items", "/apprenticeships", "Apprenticeships"
    )
    content_item["links"] = ordered_related_items
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__main-heading", text: "Related content"
    assert_select ".gem-c-related-navigation__section-link--other[href=\"/apprenticeships\"]", text: "Apprenticeships"
  end

  it "link tracking is enabled" do
    content_item = {}
    content_item["links"] = {
      "taxons" => [
        {
          "base_path" => "/skating",
          "title" => "Skating",
          "document_type" => "taxon",
          "phase" => "live",
        },
      ],
    }
    render_component(content_item:)

    assert_select ".gem-c-related-navigation[data-module='ga4-link-tracker']"
  end

  it "tracks links with GA4" do
    content_item = {}
    content_item["links"] = {
      "ordered_related_items" => [
        {
          "base_path" => "/fishing",
          "title" => "Fishing",
        },
        {
          "base_path" => "/surfing",
          "title" => "Surfing",
        },
      ],
      "taxons" => [
        {
          "base_path" => "/skating",
          "title" => "Skating",
          "document_type" => "taxon",
          "phase" => "live",
        },
        {
          "base_path" => "/paragliding",
          "title" => "Paragliding",
          "document_type" => "taxon",
          "phase" => "live",
        },
        {
          "base_path" => "/knitting",
          "title" => "Knitting",
          "document_type" => "taxon",
          "phase" => "live",
        },
      ],
      "world_locations" => [],
    }
    %w[USA Wales Fiji Iceland Sweden Mauritius Brazil].each do |country|
      content_item["links"]["world_locations"] << { "title" => country }
    end
    render_component(content_item:)

    assert_select ".gem-c-related-navigation[data-module='ga4-link-tracker']"
    assert_select ".gem-c-related-navigation__section-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"related content\",\"index_section\":\"1\",\"index_link\":\"1\",\"index_section_count\":\"3\",\"index_total\":\"2\",\"section\":\"Related content\"}']", text: "Fishing"
    assert_select ".gem-c-related-navigation__section-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"related content\",\"index_section\":\"1\",\"index_link\":\"2\",\"index_section_count\":\"3\",\"index_total\":\"2\",\"section\":\"Related content\"}']", text: "Surfing"

    assert_select ".gem-c-related-navigation__section-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"related content\",\"index_section\":\"2\",\"index_link\":\"1\",\"index_section_count\":\"3\",\"index_total\":\"3\",\"section\":\"Explore the topic\"}']", text: "Skating"
    assert_select ".gem-c-related-navigation__section-link[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"related content\",\"index_section\":\"2\",\"index_link\":\"2\",\"index_section_count\":\"3\",\"index_total\":\"3\",\"section\":\"Explore the topic\"}']", text: "Paragliding"

    assert_select ".gem-c-related-navigation__section-link[href=\"/world/wales/news\"]", text: "Wales"
    assert_select ".gem-c-related-navigation__link.toggle-wrap[data-module='ga4-event-tracker']"
    assert_select ".gem-c-related-navigation__toggle[data-ga4-event='{\"event_name\":\"select_content\",\"type\":\"related content\"}']", text: "Show 2 more world locations"
  end

  it "allows GA4 to be disabled" do
    content_item = {}
    content_item["links"] = {
      "ordered_related_items" => [
        {
          "base_path" => "/fishing",
          "title" => "Fishing",
        },
        {
          "base_path" => "/surfing",
          "title" => "Surfing",
        },
      ],
      "taxons" => [
        {
          "base_path" => "/skating",
          "title" => "Skating",
          "document_type" => "taxon",
          "phase" => "live",
        },
        {
          "base_path" => "/paragliding",
          "title" => "Paragliding",
          "document_type" => "taxon",
          "phase" => "live",
        },
      ],
      "world_locations" => [],
    }
    %w[USA Wales Fiji Iceland Sweden Mauritius Brazil].each do |country|
      content_item["links"]["world_locations"] << { "title" => country }
    end

    render_component(content_item:, disable_ga4: true)

    assert_select ".gem-c-related-navigation__section-link[data-ga4-link]", false
    assert_select ".gem-c-related-navigation__link.toggle-wrap[data-module='ga4-event-tracker']", false
    assert_select ".gem-c-related-navigation__toggle[data-ga4-event]", false
  end

  it "uses lang when locale is set" do
    content_item = {}
    content_item["links"] = {
      "taxons" => [
        {
          "base_path" => "/apprenticeships",
          "title" => "Apprenticeships",
          "document_type" => "taxon",
          "phase" => "live",
          "locale" => "ko",
        },
      ],
    }
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__section-link[lang='ko']"
  end

  it "lang is not used when the same as the app's locale" do
    content_item = {}
    content_item["links"] = {
      "taxons" => [
        {
          "base_path" => "/apprenticeships",
          "title" => "Apprenticeships",
          "document_type" => "taxon",
          "phase" => "live",
          "locale" => I18n.locale,
        },
      ],

    }
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__section-link[lang='#{I18n.locale}']", false
  end

  it "lang is not used when no locale is set" do
    content_item = {}
    content_item["links"] = {
      "taxons" => [
        {
          "base_path" => "/apprenticeships",
          "title" => "Apprenticeships",
          "document_type" => "taxon",
          "phase" => "live",
        },
      ],
    }
    render_component(content_item:)

    assert_select ".gem-c-related-navigation__section-link[lang]", false
  end
end
