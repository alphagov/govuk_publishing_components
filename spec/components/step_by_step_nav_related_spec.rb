require "rails_helper"

describe "Step by step navigation related", type: :view do
  def component_name
    "step_by_step_nav_related"
  end

  def one_link
    [
      {
        href: "/link1",
        text: "Link 1",
      },
    ]
  end

  def two_links
    [
      {
        href: "/link1",
        text: "Link 1",
      },
      {
        href: "/link2",
        text: "Link 2",
      },
    ]
  end

  def two_links_with_tracking
    [
      {
        href: "/link1",
        text: "Link 1",
        tracking_id: "peter",
      },
      {
        href: "/link2",
        text: "Link 2",
        tracking_id: "paul",
      },
    ]
  end

  it "renders nothing without passed content" do
    assert_empty render_component({})
  end

  it "displays one link inside a heading" do
    render_component(links: one_link)

    this_link = ".gem-c-step-nav-related .gem-c-step-nav-related__heading .govuk-link"

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__heading .gem-c-step-nav-related__pretitle", text: "Part of"
    assert_select "#{this_link}[href='/link1']", text: "Link 1"
  end

  it "displays more than one link in a list" do
    render_component(links: two_links)

    this_link = ".gem-c-step-nav-related .gem-c-step-nav-related__links .govuk-link[href='/link2']"

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__heading .gem-c-step-nav-related__pretitle", text: "Part of"
    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__links .govuk-link[href='/link1']", text: "Link 1"
    assert_select this_link, text: "Link 2"
  end

  it "shows alternative heading text" do
    render_component(links: one_link, pretitle: "Moo")

    assert_select ".gem-c-step-nav-related__pretitle", text: "Moo"
  end

  it "displays as a list when always_display_as_list is passed in" do
    render_component(links: one_link, always_display_as_list: true)

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__heading .gem-c-step-nav-related__pretitle", text: "Part of"
    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__links .govuk-link[href='/link1']", text: "Link 1"
  end

  it "adds GA4 data attributes" do
    render_component(pretitle: "Some text", links: one_link)

    this_link = ".gem-c-step-nav-related .gem-c-step-nav-related__heading .govuk-link"

    expected = {
      "event_name": "navigation",
      "type": "part of",
      "index_link": "1",
      "index_total": "1",
      "section": "Some text",
    }

    assert_select "#{this_link}[data-ga4-link='#{expected.to_json}']"
  end

  it "does not add GA4 data attributes when disable_ga4 is true" do
    render_component(links: one_link, disable_ga4: true)

    this_link = ".gem-c-step-nav-related .gem-c-step-nav-related__heading .govuk-link"

    expected = {
      "event_name": "navigation",
      "type": "related content",
      "index_link": "1",
      "index_total": "1",
      "section": "Part of",
    }

    assert_select "#{this_link}[data-ga4-link='#{expected.to_json}']", false
  end

  it "adds GA4 data attributes on multiple links" do
    render_component(pretitle: "Some more text", links: two_links)

    link_one = ".gem-c-step-nav-related .gem-c-step-nav-related__links .govuk-link[href='/link1']"
    link_two = ".gem-c-step-nav-related .gem-c-step-nav-related__links .govuk-link[href='/link2']"

    expected_one = {
      "event_name": "navigation",
      "type": "part of",
      "index_link": "1",
      "index_total": "2",
      "section": "Some more text",
    }

    expected_two = {
      "event_name": "navigation",
      "type": "part of",
      "index_link": "2",
      "index_total": "2",
      "section": "Some more text",
    }

    assert_select "#{link_one}[data-ga4-link='#{expected_one.to_json}']"
    assert_select "#{link_two}[data-ga4-link='#{expected_two.to_json}']"
  end

  it "does not add GA4 data attributes on multiple links when GA4 is disabled" do
    render_component(links: two_links, disable_ga4: true)

    link_one = ".gem-c-step-nav-related .gem-c-step-nav-related__links .govuk-link[href='/link1']"
    link_two = ".gem-c-step-nav-related .gem-c-step-nav-related__links .govuk-link[href='/link2']"

    expected_one = {
      "event_name": "navigation",
      "type": "part of",
      "index_link": "1",
      "index_total": "2",
      "section": "Part of",
    }

    expected_two = {
      "event_name": "navigation",
      "type": "part of",
      "index_link": "2",
      "index_total": "2",
      "section": "Part of",
    }

    assert_select "#{link_one}[data-ga4-link='#{expected_one.to_json}']", false
    assert_select "#{link_two}[data-ga4-link='#{expected_two.to_json}']", false
  end
end
