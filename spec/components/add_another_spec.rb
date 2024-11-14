require "rails_helper"

describe "Add another", type: :view do
  def component_name
    "add_another"
  end

  it "renders a wrapper element" do
    render_component({}) do
      "<div class=\"item1\">item1</div>\n<div class=\"item2\">item2</div>".html_safe
    end

    assert_select "div.gem-c-add-another[data-module='add-another']"
  end

  it "renders the items provided" do
    items = ["<div class=\"item1\">item1</div>", "<div class=\"item2\">item2</div>"]
    render_component({ items:, empty: "" })

    assert_select "div.gem-c-add-another__repeated-fields .item1"
    assert_select "div.gem-c-add-another__repeated-fields .item2"
  end

  it "renders the add button with the default text when the add button text option is not set" do
    render_component({}) do
      "<div class=\"item1\">item1</div>\n<div class=\"item2\">item2</div>".html_safe
    end

    assert_select "button", text: "Add another"
  end

  it "renders the add button with the provided text when the add button text option is set" do
    add_button_text = "Add one more"
    render_component(add_button_text:) do
      "<div class=\"item1\">item1</div>\n<div class=\"item2\">item2</div>".html_safe
    end

    assert_select "button", text: add_button_text
  end
end
