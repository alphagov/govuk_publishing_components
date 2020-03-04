require "rails_helper"

describe "Chevron Banner", type: :view do
  def component_name
    "chevron_banner"
  end

  it "fails to render a chevron banner when no href and no text is given" do
    assert_empty render_component({})
  end

  it "fails to render a chevron banner when no href is given" do
    assert_empty render_component(text: "Start doing this thing")
  end

  it "does not render a chevron banner when no text is given" do
    assert_empty render_component(href: "/a-link")
  end

  it "renders a chevron banner correctly" do
    render_component(href: "/a-link", text: "This is a link")
    assert_select ".gem-c-chevron-banner"
    assert_select ".gem-c-chevron-banner__link[href='/a-link']", text: "This is a link"
  end

  it "can render with a border on hover" do
    render_component(href: "/a-link", text: "This is a link", hover_border: true)
    assert_select ".gem-c-chevron-banner--hover-border"
  end

  it "automatically adds data module track click if data attributes are provided" do
    render_component(
      href: "/a-link",
      text: "This is a link",
      data_attributes: {
        "data-track-category": "category",
        "data-track-action": "action",
        "data-track-label": "label",
      },
    )

    assert_select ".gem-c-chevron-banner__link[data-module='track-click']", text: "This is a link"
  end

  it "adds data attributes when supplied" do
    render_component(
      href: "/a-link",
      text: "This is a link",
      data_attributes: {
        "track-category": "category",
        "track-action": "action",
        "track-label": "label",
      },
    )

    assert_select ".gem-c-chevron-banner__link[data-track-category='category']"
    assert_select ".gem-c-chevron-banner__link[data-track-action='action']"
    assert_select ".gem-c-chevron-banner__link[data-track-label='label']"
  end
end
