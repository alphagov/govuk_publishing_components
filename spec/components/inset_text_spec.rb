require 'rails_helper'

describe "Inset text", type: :view do
  def component_name
    "inset_text"
  end

  it "renders inset text" do
    render_component(text: "It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.")

    assert_select(".govuk-inset-text", text: "It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.")
  end
end
