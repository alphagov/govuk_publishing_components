require "rails_helper"

describe "Layout for public", type: :view do
  def component_name
    "layout_for_public"
  end

  it "adds a default <title> tag" do
    render_component({})

    assert_select "title", visible: false, text: "GOV.UK - The best place to find government services and information"
  end

  it "adds a custom <title> tag" do
    render_component(title: "Custom GOV.UK Title")

    assert_select "title", visible: false, text: "Custom GOV.UK Title"
  end

  it "displays as a restricted width layout by default" do
    render_component({})

    assert_select "#content.govuk-width-container"
  end

  it "can support full width layouts" do
    render_component(full_width: true)

    assert_select "#content.govuk-width-container", false, "Should not apply govuk-width-container class when full width"
  end

  it "can display without search bar" do
    render_component(without_search: true)

    assert_select ".gem-c-layout-for-public .gem-c-search", false
  end

  it "can omit the header" do
    render_component(omit_header: true)

    assert_select ".gem-c-layout-for-public .gem-c-layout-header", false
  end
end
