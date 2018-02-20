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
end
