require 'rails_helper'

describe "warning text", type: :view do
  def component_name
    "warning_text"
  end

  it "renders warning text" do
    render_component(text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__assistive", text: "Warning")
    assert_select(".govuk-warning-text__text", text: /You can be fined up to £5,000 if you don’t register?/i)
  end

  it "renders custom assistive text" do
    render_component(text_assistive: "Danger", text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__assistive", text: "Danger")
    assert_select(".govuk-warning-text__text", text: /You can be fined up to £5,000 if you don’t register?/i)
  end

  it "renders custom icon text" do
    render_component(text_icon: ":(", text: "You can be fined up to £5,000 if you don’t register.")
    assert_select(".govuk-warning-text__icon", text: ":(")
  end
end
