require "rails_helper"

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
      ".govuk-label[for='id-that-matches-input']",
      text: "National Insurance number",
    )
  end

  it "renders label with text and hint text" do
    render_component(
      text: "National Insurance number",
      html_for: "id-that-matches-input",
      hint_id: "should-match-aria-describedby-input",
      hint_text: "It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.",
    )

    assert_select(
      ".govuk-label[for='id-that-matches-input']",
      text: "National Insurance number",
    )
    assert_select ".govuk-hint", text: "It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’."
    assert_select ".govuk-hint[id=should-match-aria-describedby-input]"
  end

  it "renders label with different label sizes" do
    render_component(
      text: "National Insurance number",
      html_for: "id-that-matches-input",
      heading_size: "m",
    )

    assert_select ".gem-c-label.govuk-label.govuk-label--m"
  end

  it "renders label with bold text" do
    render_component(
      text: "National Insurance number",
      html_for: "id-that-matches-input",
      bold: true,
    )

    assert_select(
      ".govuk-label[for='id-that-matches-input']",
      text: "National Insurance number",
    )
    assert_select ".govuk-label--s"
  end

  it "renders label as page heading" do
    render_component(
      text: "National Insurance number",
      html_for: "id-that-matches-input",
      is_page_heading: true,
    )

    assert_select(
      "h1.govuk-label-wrapper .govuk-label[for='id-that-matches-input']",
      text: "National Insurance number",
    )
  end

  it "renders label when required to be inside the radio component" do
    render_component(
      is_radio_label: true,
      text: "A label for the radio component",
      html_for: "id-radio",
      hint_id: "should-match-aria-describedby-input",
      hint_text: "It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.",
    )

    assert_select ".gem-c-label.govuk-label.govuk-radios__label"
    assert_select ".govuk-hint.govuk-radios__hint"
  end

  it "renders label with id" do
    render_component(
      text: "Label with ID",
      id: "test-id",
      html_for: "label-with-id",
    )

    assert_select(
      ".govuk-label[id='test-id'][for='label-with-id']",
      text: "Label with ID",
    )
  end
end
