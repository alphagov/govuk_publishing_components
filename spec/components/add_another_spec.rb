require "rails_helper"

describe "Add another", type: :view do
  def component_name
    "add_another"
  end

  describe "Default" do
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

      assert_select "div.gem-c-add-another[data-module='add-another'][data-empty-fields='false']"
    end

    it "renders the items provided" do
      empty = ""
      render_component({ items: default_items, empty: })

      assert_select "div.js-add-another__fieldset .item1"
      assert_select "div.js-add-another__fieldset .item2"
    end

    it "renders a destroy checkbox for each item" do
      empty = ""
      render_component({ items: default_items, empty: })

      assert_select "div.js-add-another__fieldset .js-add-another__destroy-checkbox", count: 2
    end

    it "renders the empty item" do
      empty = sanitize("<div class=\"empty\">empty</div>")
      render_component({ items: default_items, empty: })

      assert_select ".js-add-another__empty div.empty"
    end
  end

  describe "Start empty" do
    def empty_items
      []
    end

    it "renders a wrapper element" do
      render_component({ items: empty_items, empty_fields: true })

      assert_select "div.gem-c-add-another[data-module='add-another'][data-empty-fields='true']"
    end

    it "renders only the empty item provided" do
      empty = sanitize("<div class=\"empty\">empty</div>")
      render_component({ items: empty_items, empty:, empty_fields: true })

      assert_select ".js-add-another__empty div.empty"
      assert_select "div.js-add-another__fieldset .item1", false
      assert_select "div.js-add-another__fieldset .item2", false
    end

    it "does not render a destroy checkbox" do
      empty = sanitize("<div class=\"empty\">empty</div>")
      render_component({ items: empty_items, empty: })

      assert_select ".js-add-another__destroy-checkbox", count: 0
    end
  end
end
