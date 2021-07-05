require "rails_helper"

describe "Super navigation header", type: :view do
  def component_name
    "layout_super_navigation_header"
  end

  it "renders the super navigation header" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header"
  end
end
