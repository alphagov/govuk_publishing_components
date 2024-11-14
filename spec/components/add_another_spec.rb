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
    items = [sanitize("<div class=\"item1\">item1</div>"), sanitize("<div class=\"item2\">item2</div>")]
    empty = ""
    render_component({ items:, empty: })

    assert_select "div.gem-c-add-another__repeated-fields .item1"
    assert_select "div.gem-c-add-another__repeated-fields .item2"
  end

  it "renders the empty item" do
    items = [sanitize("<div class=\"item1\">item1</div>"), sanitize("<div class=\"item2\">item2</div>")]
    empty = sanitize("<div class=\"empty\">empty</div>")
    render_component({ items:, empty: })

    assert_select "div.empty"
  end
end
