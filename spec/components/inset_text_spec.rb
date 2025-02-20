require "rails_helper"

describe "Inset text", type: :view do
  def component_name
    "inset_text"
  end

  it "renders inset text" do
    render_component(text: "It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.")

    assert_select(".gem-c-inset-text.govuk-\\!-margin-bottom-6", text: "It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.")
  end

  it "renders a block" do
    block = "
      <h2 id='heading'>To publish this step by step you need to</h2>
      <a href='/foo'>Check for broken links</a>
    ".html_safe
    render_component({}) { block }

    assert_select(".govuk-inset-text h2#heading", text: "To publish this step by step you need to")
    assert_select(".govuk-inset-text a[href='/foo']", text: "Check for broken links")
  end

  it "renders only the text if both text and block are provided" do
    block = "<p id='foo'>Foo</p>".html_safe
    render_component(text: "Bar") { block }

    assert_select(".govuk-inset-text", text: "Bar")
    assert_select(".govuk-inset-text p#foo", false, "Block should not have rendered")
  end

  it "applies custom margin bottom" do
    render_component(
      text: "margin!",
      margin_bottom: 9,
    )

    assert_select(".gem-c-inset-text.govuk-\\!-margin-bottom-9", text: "margin!")
  end
end
