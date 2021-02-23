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

  def one_link_with_tracking
    [
      {
        href: "/link1",
        text: "Link 1",
        tracking_id: "peter",
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

    this_link = ".gem-c-step-nav-related .gem-c-step-nav-related__heading .gem-c-step-nav-related__link"

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__heading .gem-c-step-nav-related__pretitle", text: "Part of"
    assert_select "#{this_link}[href='/link1']", text: "Link 1"
    assert_select "#{this_link}[data-track-category='stepNavPartOfClicked']"
    assert_select "#{this_link}[data-track-action='Part of']"
    assert_select "#{this_link}[data-track-label='/link1']"
    assert_select "#{this_link}[data-track-dimension='Link 1']"
    assert_select "#{this_link}[data-track-dimension-index='29']"
  end

  it "displays more than one link in a list" do
    render_component(links: two_links)

    this_link = ".gem-c-step-nav-related .gem-c-step-nav-related__links .gem-c-step-nav-related__link[href='/link2']"

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__heading .gem-c-step-nav-related__pretitle", text: "Part of"
    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__links .gem-c-step-nav-related__link[href='/link1']", text: "Link 1"
    assert_select this_link, text: "Link 2"
    assert_select "#{this_link}[data-track-category='stepNavPartOfClicked']"
    assert_select "#{this_link}[data-track-action='Part of']"
    assert_select "#{this_link}[data-track-label='/link2']"
    assert_select "#{this_link}[data-track-dimension='Link 2']"
    assert_select "#{this_link}[data-track-dimension-index='29']"
  end

  it "shows alternative heading text" do
    render_component(links: one_link, pretitle: "Moo")

    assert_select ".gem-c-step-nav-related__pretitle", text: "Moo"
    assert_select ".gem-c-step-nav-related__link[data-track-action='Moo']"
  end

  it "adds a tracking id to one link" do
    render_component(links: one_link_with_tracking)

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__link[data-track-options='{\"dimension96\" : \"peter\" }']"
  end

  it "adds a tracking id to every link when there are more than one" do
    render_component(links: two_links_with_tracking)

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__link-item:nth-child(1) .gem-c-step-nav-related__link[data-track-options='{\"dimension96\" : \"peter\" }']"
    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__link-item:nth-child(2) .gem-c-step-nav-related__link[data-track-options='{\"dimension96\" : \"paul\" }']"
  end

  it "displays as a list when always_display_as_list is passed in" do
    render_component(links: one_link, always_display_as_list: true)

    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__heading .gem-c-step-nav-related__pretitle", text: "Part of"
    assert_select ".gem-c-step-nav-related .gem-c-step-nav-related__links .gem-c-step-nav-related__link[href='/link1']", text: "Link 1"
  end
end
