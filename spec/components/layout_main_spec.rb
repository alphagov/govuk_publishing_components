require 'rails_helper'

describe "Layout main", type: :view do
  def component_name
    "layout_main"
  end

  it "renders a flash error" do
    render_component(flash: { error: "Something went wrong" })

    assert_select ".govuk-error-summary__body", text: "Something went wrong"
  end

  it "renders a flash notice" do
    render_component(flash: { notice: "Something went neutral" })

    assert_select ".govuk-panel__body", text: "Something went neutral"
  end
end
