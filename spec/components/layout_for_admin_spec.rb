require 'rails_helper'

describe "Layout for admin", type: :view do
  def component_name
    "layout_for_admin"
  end

  it "adds the <title> tag" do
    render_component(browser_title: "Hello, admin page", environment: "production")

    assert_select "title", visible: false, text: "Hello, admin page - GOV.UK Publishing"
  end

  it "adds the robots metatag" do
    render_component(browser_title: "Hello, admin page", environment: "production")

    assert_select 'meta[name="robots"][content="noindex,nofollow,noimageindex"]', visible: false
  end
end
