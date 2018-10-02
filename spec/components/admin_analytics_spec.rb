require 'rails_helper'

describe "Admin analytics", type: :view do
  def component_name
    "admin_analytics"
  end

  it "renders a script tag" do
    render_component({})

    assert_select "script"
  end
end
