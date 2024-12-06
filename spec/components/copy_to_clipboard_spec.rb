require "rails_helper"

describe "Copy to clipboard", type: :view do
  def component_name
    "copy_to_clipboard"
  end

  it "renders the component" do
    render_component(
      label: "Some label",
      copyable_content: "https://www.example.org",
      button_text: "Copy link",
    )

    assert_select "label", text: "Some label"
    assert_select "input", value: "https://www.example.org"
    assert_select "button[type=\"button\"]", value: "Copy link"
  end
end
