require "rails_helper"

describe "Hint", type: :view do
  def component_name
    "hint"
  end

  it "renders hint" do
    render_component(text: "For example, ‘QQ 12 34 56 C’.")

    assert_select ".govuk-hint", text: "For example, ‘QQ 12 34 56 C’."
  end

  it "sets a default id" do
    render_component(text: "For example, ‘QQ 12 34 56 C’.")

    assert_select ".govuk-hint[id^=hint-]"
  end

  it "accepts a custom id" do
    render_component(text: "For example, ‘QQ 12 34 56 C’.", id: "special-hint")

    assert_select ".govuk-hint[id=special-hint]"
  end

  it "applies a specified bottom margin" do
    render_component(text: "For example, ‘QQ 12 34 56 C’.", margin_bottom: 7)

    assert_select '.govuk-hint.govuk-\!-margin-bottom-7'
  end

  it "applies zero bottom margin" do
    render_component(text: "For example, ‘QQ 12 34 56 C’.", margin_bottom: 0)

    assert_select '.govuk-hint.govuk-\!-margin-bottom-0'
  end

  it "accepts js classes" do
    render_component(text: "For example, ‘QQ 12 34 56 C’.", classes: "js-class-one js-class-two")

    assert_select ".govuk-hint.js-class-one.js-class-two"
  end

  it "renders the component with the correct `dir` attribute" do
    render_component(
      text: "العربيَّة",
      right_to_left: true,
    )

    assert_select ".govuk-hint[dir='rtl']"
  end
end
