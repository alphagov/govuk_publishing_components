require "rails_helper"

describe "Step by step navigation header", type: :view do
  def component_name
    "step_by_step_nav_header"
  end

  it "renders nothing without passed content" do
    assert_empty render_component({})
  end

  it "renders default component" do
    render_component(title: "This is my title")

    assert_select ".gem-c-step-nav-header span.gem-c-step-nav-header__title", text: "This is my title"
  end

  it "renders with a link" do
    render_component(title: "This is my title", path: "/notalink")

    link = ".gem-c-step-nav-header a.gem-c-step-nav-header__title"

    assert_select link + "[href='/notalink']", text: "This is my title"
    assert_select link + "[data-track-category='stepNavHeaderClicked']"
    assert_select link + "[data-track-action='top']"
    assert_select link + "[data-track-label='/notalink']"
    assert_select link + "[data-track-dimension='This is my title']"
    assert_select link + "[data-track-dimension-index='29']"
  end

  it "adds a tracking id" do
    render_component(title: "This is my title", path: "/notalink", tracking_id: "brian")

    assert_select ".gem-c-step-nav-header .gem-c-step-nav-header__title[data-track-options='{\"dimension96\" : \"brian\" }']"
  end

  it "renders machine readable breadcrumbs" do
    render_component(title: "This is my title", path: "/notalink")

    expected_breadcrumb_values = [
      ["Home", "http://www.dev.gov.uk/"],
      ["This is my title", "http://www.dev.gov.uk/notalink"],
    ]

    schema_sections = css_select("script[type='application/ld+json']")

    breadcrumb_schema = schema_sections
      .map { |section| JSON.parse(section.text) }
      .detect { |schema| schema["@type"] == "BreadcrumbList" }

    breadcrumbs = breadcrumb_schema["itemListElement"]

    # breadcrumbs looks something like this:
    # [{"@type":"ListItem","position":1,"item":{"name":"Home","@id":"http://www.dev.gov.uk/"}},{"@type":"ListItem","position":2,"item":{"name":"This is my title","@id":"http://www.dev.gov.uk/notalink"}}]}
    rendered_values = breadcrumbs.map { |b| b["item"].values }

    assert_equal expected_breadcrumb_values, rendered_values
  end
end
