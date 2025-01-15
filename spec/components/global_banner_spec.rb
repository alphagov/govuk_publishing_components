require "rails_helper"

describe "Global bar", type: :view do
  def component_name
    "global_bar"
  end

  it "renders nothing without a title" do
    assert_empty render_component({})
  end

  it "renders with a title" do
    render_component(title: "Look here you")
    assert_select ".gem-c-global-bar", text: "Look here you"
  end

  it "renders with a title and a link" do
    render_component(title: "Look here you", title_href: "https://www.gov.uk")
    assert_select ".gem-c-global-bar a.gem-c-global-bar-title", text: "Look here you"
  end

  it "renders with a title and text" do
    render_component(title: "Look here you", text: "This is important")
    assert_select ".gem-c-global-bar .gem-c-global-bar-title", text: "Look here you"
    assert_select ".gem-c-global-bar .gem-c-global-bar-text", text: "This is important"
  end
end
