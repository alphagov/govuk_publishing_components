require "rails_helper"

describe "Breadcrumbs", type: :view do
  def component_name
    "breadcrumbs"
  end

  def assert_link_with_text_in(selector, link, text)
    assert_select "#{selector} a[href=\"#{link}\"]", text:
  end

  it "no error if no parameters passed in" do
    render_component({})
    assert_select ".gem-c-breadcrumbs"
  end

  it "renders a single breadcrumb" do
    render_component(breadcrumbs: [{ title: "Section", url: "/section" }])

    assert_link_with_text_in(".govuk-breadcrumbs__list-item:first-child", "/section", "Section")
  end

  describe "aria" do
    it "has a default aria label" do
      render_component(breadcrumbs: [{ title: "Section", url: "/section" }])
      assert_select ".gem-c-breadcrumbs[aria-label='Breadcrumb']"
    end

    it "still has a default aria label when other aria attributes are passed" do
      render_component(breadcrumbs: [{ title: "Section", url: "/section" }], aria: { labelledby: "a-thing" })
      assert_select ".gem-c-breadcrumbs[aria-label='Breadcrumb'][aria-labelledby='a-thing']"
    end

    it "can override the default aria label" do
      render_component(breadcrumbs: [{ title: "Section", url: "/section" }], aria: { labelledby: "a-thing", label: "new-label" })
      assert_select ".gem-c-breadcrumbs[aria-label='new-label'][aria-labelledby='a-thing']"
    end
  end

  it "renders schema data" do
    breadcrumbs = [
      { title: "Section 1", url: "/section-1" },
      { title: "Section 2", url: "/section-2" },
      { title: "Section 3", url: "/section-3" },
    ]
    structured_data = GovukPublishingComponents::Presenters::Breadcrumbs.new(breadcrumbs).structured_data
    expect(structured_data["@type"]).to eq("BreadcrumbList")
    expect(structured_data["itemListElement"].first["@type"]).to eq("ListItem")
    expect(structured_data["itemListElement"].first["position"]).to eq(1)
    expect(structured_data["itemListElement"].first["item"]["@id"]).to eq("http://www.dev.gov.uk/section-1")
    expect(structured_data["itemListElement"].first["item"]["name"]).to eq("Section 1")
    expect(structured_data["itemListElement"][1]["item"]["@id"]).to eq("http://www.dev.gov.uk/section-2")
    expect(structured_data["itemListElement"][1]["item"]["name"]).to eq("Section 2")
    expect(structured_data["itemListElement"][2]["item"]["@id"]).to eq("http://www.dev.gov.uk/section-3")
    expect(structured_data["itemListElement"][2]["item"]["name"]).to eq("Section 3")
  end

  it "omits breadcrumb structured data when no url is present" do
    breadcrumbs = [
      { title: "Section 1", url: "/section-1" },
      { title: "Section 2" },
    ]
    structured_data = GovukPublishingComponents::Presenters::Breadcrumbs.new(breadcrumbs).structured_data
    expect(structured_data["@type"]).to eq("BreadcrumbList")
    expect(structured_data["itemListElement"].count).to eq(1)
    expect(structured_data["itemListElement"].first["@type"]).to eq("ListItem")
    expect(structured_data["itemListElement"].first["position"]).to eq(1)
    expect(structured_data["itemListElement"].first["item"]["@id"]).to eq("http://www.dev.gov.uk/section-1")
    expect(structured_data["itemListElement"].first["item"]["name"]).to eq("Section 1")
  end

  it "renders all data attributes for google analytics 4 tracking" do
    render_component(breadcrumbs: [{ title: "Section", url: "/section" }])

    expected_tracking_options = {
      event_name: "navigation",
      type: "breadcrumb",
      index_link: "1",
      index_total: "1",
    }

    assert_select '.gem-c-breadcrumbs[data-module="ga4-link-tracker"]', 1
    assert_select ".govuk-breadcrumbs__list-item:first-child a[data-ga4-link='#{expected_tracking_options.to_json}']", 1
  end

  it "renders a list of breadcrumbs" do
    render_component(breadcrumbs: [
      { title: "Home", url: "/" },
      { title: "Section", url: "/section" },
      { title: "Sub-section", url: "/sub-section" },
    ])

    assert_link_with_text_in(".govuk-breadcrumbs__list-item:first-child", "/", "Home")
    assert_link_with_text_in(".govuk-breadcrumbs__list-item:first-child + li", "/section", "Section")
    assert_link_with_text_in(".govuk-breadcrumbs__list-item:last-child", "/sub-section", "Sub-section")
  end

  it "renders inverted breadcrumbs when passed a flag" do
    render_component(
      breadcrumbs: [
        { title: "Home", url: "/" },
        { title: "Section", url: "/section" },
      ],
      inverse: true,
    )

    assert_select ".govuk-breadcrumbs--inverse"
  end

  it "renders breadcrumb items without link as text" do
    render_component(
      breadcrumbs: [
        { title: "Education", url: "/education" },
        { title: "Current Page" },
      ],
    )

    assert_link_with_text_in(".govuk-breadcrumbs__list-item:first-child", "/education", "Education")
    assert_select(".govuk-breadcrumbs__list-item:last-child", "Current Page")
    assert_select(".govuk-breadcrumbs__list-item:last-child a", false)
  end

  it "collapses on mobile if passed a flag" do
    render_component(
      collapse_on_mobile: true,
      breadcrumbs: [
        { title: "Home", url: "/" },
        { title: "Section", url: "/section" },
        { title: "Sub-section", url: "/sub-section" },
      ],
    )

    assert_select(".gem-c-breadcrumbs.govuk-breadcrumbs.govuk-breadcrumbs--collapse-on-mobile")
  end

  it "has a border when passed a border parameter" do
    render_component(
      border: "bottom",
      breadcrumbs: [
        { title: "Home", url: "/" },
        { title: "Section", url: "/section" },
        { title: "Sub-section", url: "/sub-section" },
        { title: "Sub-sub-section", url: "/sub-sub-section" },
        { title: "Sub-sub-sub-section", url: "/sub-sub-sub-section" },
      ],
    )

    assert_select(".gem-c-breadcrumbs.govuk-breadcrumbs.gem-c-breadcrumbs--border-bottom")
  end
end
