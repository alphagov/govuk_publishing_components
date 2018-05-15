require "rails_helper"

describe "Breadcrumbs", type: :view do
  def component_name
    "breadcrumbs"
  end

  def assert_link_with_text_in(selector, link, text)
    assert_select "#{selector} a[href=\"#{link}\"]", text: text
  end

  it "no error if no parameters passed in" do
    render_component({})
    assert_select ".gem-c-breadcrumbs"
  end

  it "renders a single breadcrumb" do
    render_component(breadcrumbs: [{ title: 'Section', url: '/section' }])

    assert_link_with_text_in('ol li:first-child', '/section', 'Section')
  end

  it "renders all data attributes for tracking" do
    render_component(breadcrumbs: [{ title: 'Section', url: '/section' }])

    expected_tracking_options = {
      dimension28: "1",
      dimension29: "Section"
    }

    assert_select '.gem-c-breadcrumbs[data-module="track-click"]', 1
    assert_select 'ol li:first-child a[data-track-action="1"]', 1
    assert_select 'ol li:first-child a[data-track-label="/section"]', 1
    assert_select 'ol li:first-child a[data-track-category="breadcrumbClicked"]', 1
    assert_select "ol li:first-child a[data-track-options='#{expected_tracking_options.to_json}']", 1
  end

  it "tracks the total breadcrumb count on each breadcrumb" do
    breadcrumbs = [
      { title: 'Section 1', url: '/section-1' },
      { title: 'Section 2', url: '/section-2' },
      { title: 'Section 3', url: '/section-3' },
    ]
    render_component(breadcrumbs: breadcrumbs)

    expected_tracking_options = [
      { dimension28: "3", dimension29: "Section 1" },
      { dimension28: "3", dimension29: "Section 2" },
      { dimension28: "3", dimension29: "Section 3" },
    ]

    assert_select "ol li:nth-child(1) a[data-track-options='#{expected_tracking_options[0].to_json}']", 1
    assert_select "ol li:nth-child(2) a[data-track-options='#{expected_tracking_options[1].to_json}']", 1
    assert_select "ol li:nth-child(3) a[data-track-options='#{expected_tracking_options[2].to_json}']", 1
  end

  it "renders a list of breadcrumbs" do
    render_component(breadcrumbs: [
        { title: 'Home', url: '/' },
        { title: 'Section', url: '/section' },
        { title: 'Sub-section', url: '/sub-section' },
      ])

    assert_link_with_text_in('ol li:first-child', '/', 'Home')
    assert_link_with_text_in('ol li:first-child + li', '/section', 'Section')
    assert_link_with_text_in('ol li:last-child', '/sub-section', 'Sub-section')
  end

  it "renders inverted breadcrumbs when passed a flag" do
    render_component(breadcrumbs: [
        { title: 'Home', url: '/' },
        { title: 'Section', url: '/section' },
      ], inverse: true)

    assert_select ".gem-c-breadcrumbs--inverse"
  end

  it "allows the last breadcrumb to be text only" do
    render_component(
      breadcrumbs: [
        { title: 'Topic', url: '/topic' },
        { title: 'Current Page' },
      ]
    )
    assert_select('ol li:last-child', 'Current Page')
  end
end
