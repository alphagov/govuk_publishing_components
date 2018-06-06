require 'rails_helper'

describe "Label", type: :view do
  def component_name
    "label"
  end

  it "does not render label when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders label with text" do
    render_component(
      text: "National Insurance number",
      html_for: "id-that-matches-input",
    )

    assert_select(
      ".gem-c-label__text[for='id-that-matches-input']",
      text: "National Insurance number"
    )
  end

  it "renders label with text and hint text" do
    render_component(
      text: "National Insurance number",
      html_for: "id-that-matches-input",
      hint_id: "should-match-aria-describedby-input",
      hint_text: "It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’."
    )

    assert_select(
      ".gem-c-label__text[for='id-that-matches-input']",
      text: "National Insurance number"
    )
    assert_select ".gem-c-label__hint", text: "It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’."
    assert_select ".gem-c-label__hint[id=should-match-aria-describedby-input]"
  end

  it "renders label with bold text" do
    render_component(
      text: "National Insurance number",
      html_for: "id-that-matches-input",
      bold: true,
    )

    assert_select(
      ".gem-c-label__text[for='id-that-matches-input']",
      text: "National Insurance number"
    )
    assert_select ".gem-c-label--bold"
  end
end
