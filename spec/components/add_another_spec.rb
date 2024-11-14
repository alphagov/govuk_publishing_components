require "rails_helper"

describe "Add another", type: :view do
  def component_name
    "add_another"
  end

  def default_items
    [
      {
        fields: sanitize("<div class=\"item1\">item1</div>"),
        destroy_checkbox: sanitize("<input type=\"checkbox\" />"),
      },
      {
        fields: sanitize("<div class=\"item2\">item2</div>"),
        destroy_checkbox: sanitize("<input type=\"checkbox\" />"),
      },
    ]
  end

  it "renders a wrapper element" do
    render_component(items: default_items)

    assert_select "div.gem-c-add-another[data-module='add-another']"
  end

  it "renders the items provided" do
    empty = ""
    render_component({ items: default_items, empty: })

    assert_select "div.gem-c-add-another__repeated-fields .item1"
    assert_select "div.gem-c-add-another__repeated-fields .item2"
  end

  it "renders a destroy checkbox for each item" do
    empty = ""
    render_component({ items: default_items, empty: })

    assert_select "div.gem-c-add-another__repeated-fields .js-add-another_destroy-checkbox", count: 2
  end

  it "renders the empty item" do
    empty = sanitize("<div class=\"empty\">empty</div>")
    render_component({ items: default_items, empty: })

    assert_select "div.empty"
  end
end
