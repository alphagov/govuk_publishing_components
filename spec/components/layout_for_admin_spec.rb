require 'rails_helper'

describe "Layout for admin", type: :view do
  def component_name
    "layout_for_admin"
  end

  it "adds the <title> tag" do
    render_component(browser_title: "Hello, admin page", environment: "production")

    assert_select "title", visible: false, text: "Hello, admin page"
  end
end
