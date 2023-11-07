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

  it "renders with a link" do
    render_component(title: "This is my title", path: "/notalink")

    link = ".gem-c-step-nav-header a.gem-c-step-nav-header__title"

    assert_select "#{link}[href='/notalink']", text: "This is my title"
    assert_select "#{link}[data-track-category='stepNavHeaderClicked']"
    assert_select "#{link}[data-track-action='top']"
    assert_select "#{link}[data-track-label='/notalink']"
    assert_select "#{link}[data-track-dimension='This is my title']"
    assert_select "#{link}[data-track-dimension-index='29']"
  end

  it "adds a margin bottom" do
    render_component(title: "This is my title", margin_bottom: 9)

    assert_select '.gem-c-step-nav-header.govuk-\!-margin-bottom-9'
  end

  it "adds a tracking id" do
    render_component(title: "This is my title", path: "/notalink", tracking_id: "brian")

    assert_select ".gem-c-step-nav-header .gem-c-step-nav-header__title[data-track-options='{\"dimension96\":\"brian\"}']"
  end

  it "adds a custom tracking" do
    render_component(
      title: "This is my title",
      path: "/notalink",
      tracking_id: "tracking-id",
      tracking_category: "customTrackingCategoryClicked",
      tracking_action: "customTrackingAction",
      tracking_label: "customTrackingLabel",
      tracking_dimension: "customTrackingDimension",
      tracking_dimension_index: "23",
    )

    link = ".gem-c-step-nav-header a.gem-c-step-nav-header__title"

    assert_select "#{link}[href='/notalink']", text: "This is my title"
    assert_select "#{link}[data-track-category='customTrackingCategoryClicked']"
    assert_select "#{link}[data-track-action='customTrackingAction']"
    assert_select "#{link}[data-track-label='customTrackingLabel']"
    assert_select "#{link}[data-track-dimension='customTrackingDimension']"
    assert_select "#{link}[data-track-dimension-index='23']"
    assert_select "#{link}[data-track-options='{\"dimension96\":\"tracking-id\"}']"
  end

  it "includes GA4 tracking" do
    render_component(
      title: "This is my title",
      path: "/notalink",
    )
    expected = {
      event_name: "navigation",
      type: "super breadcrumb",
      index_link: "1",
      index_total: "1",
    }.to_json
    assert_select(".gem-c-step-nav-header[data-module='gem-track-click ga4-link-tracker']")
    assert_select(".gem-c-step-nav-header__title[data-ga4-link='#{expected}']")
  end

  it "allows GA4 tracking to be disabled" do
    render_component(
      title: "This is my title",
      path: "/notalink",
      disable_ga4: true,
    )
    assert_select(".gem-c-step-nav-header[data-module='gem-track-click']")
    assert_select(".gem-c-step-nav-header[data-module='gem-track-click ga4-link-tracker']", false)
    assert_select(".gem-c-step-nav-header__title[data-ga4-link]", false)
  end

  it "adds a custom tracking without tracking id or custom dimensions" do
    render_component(
      title: "This is my title",
      path: "/notalink",
      tracking_category: "customTrackingCategoryClicked",
      tracking_action: "customTrackingAction",
      tracking_label: "customTrackingLabel",
      tracking_dimension_enabled: false,
    )

    link = ".gem-c-step-nav-header a.gem-c-step-nav-header__title"

    assert_select "#{link}[href='/notalink']", text: "This is my title"
    assert_select "#{link}[data-track-category='customTrackingCategoryClicked']"
    assert_select "#{link}[data-track-action='customTrackingAction']"
    assert_select "#{link}[data-track-label='customTrackingLabel']"
    assert_select "#{link}[data-track-dimension]", false
    assert_select "#{link}[data-track-dimension-index]", false
    assert_select "#{link}[data-track-options]", false
  end
end
