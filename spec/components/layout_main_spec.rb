require 'rails_helper'

describe "Layout main", type: :view do
  def component_name
    "layout_main"
  end

  it "renders with a column" do
    render_component({}) do
      "Some content"
    end

    assert_select ".govuk-width-container", text: "Some content"
  end
end
