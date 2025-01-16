require "rails_helper"

describe "Global banner", type: :view do
  def component_name
    "global_banner"
  end

  it "renders nothing without a title" do
    assert_empty render_component({})
  end

  it "renders with a title" do
    render_component(title: "Look here you")
    assert_select ".gem-c-global-banner", text: "Look here you"
  end

  it "renders with a title and a link" do
    render_component(title: "Look here you", title_href: "https://www.gov.uk")
    assert_select ".gem-c-global-banner a.gem-c-global-banner__title", text: "Look here you"
  end

  it "renders with a title and text" do
    render_component(title: "Look here you", text: "This is important")
    assert_select ".gem-c-global-banner .gem-c-global-banner__title", text: "Look here you"
    assert_select ".gem-c-global-banner .gem-c-global-banner__text", text: "This is important"
  end
end
