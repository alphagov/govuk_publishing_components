require 'rails_helper'

describe "Hint", type: :view do
  def component_name
    "hint"
  end

  it "renders hint" do
    render_component(text: "For example, ‘QQ 12 34 56 C’.")

    assert_select(".govuk-hint", text: "For example, ‘QQ 12 34 56 C’.")
  end
end
