require "rails_helper"

describe "Search", type: :view do
  def component_name
    "search"
  end

  it "renders a search box with default options" do
    render_component({})
    assert_select ".gem-c-search.gem-c-search--on-white"
  end

  it "renders a search box for a dark background" do
    render_component(on_govuk_blue: true)
    assert_select ".gem-c-search.gem-c-search--on-govuk-blue"
  end

  it "renders a search box with a custom label text" do
    render_component(label_text: "This is my new label")
    assert_select ".gem-c-search .gem-c-search__label", text: "This is my new label"
  end

  it "renders a search box with a custom label content" do
    render_component(inline_label: false, label_text: "This is a heading 1")
    assert_select ".gem-c-search .gem-c-search__label", text: "This is a heading 1"
    assert_select ".gem-c-search.gem-c-search--separate-label"
  end

  it "renders a search box with a value" do
    render_component(value: "I searched for this")
    assert_select ".gem-c-search .gem-c-search__input" do
      assert_select "[value=?]", "I searched for this"
    end
  end

  it "renders a search box with a custom id" do
    render_component(id: "my-unique-id")
    assert_select ".gem-c-search #my-unique-id.gem-c-search__input"
  end

  it "renders a large search box" do
    render_component(size: "large")
    assert_select ".gem-c-search.gem-c-search--large"
  end

  it "renders a search box with a default name" do
    render_component({})
    assert_select 'input[name="q"]'
  end

  it "renders a search box with a custom name" do
    render_component(name: "my_custom_field")
    assert_select 'input[name="my_custom_field"]'
  end

  it "renders a search box with the aria-controls attribute" do
    render_component(aria_controls: "something-else")
    assert_select "input[aria-controls='something-else']"
  end

  it "renders a search box with no margin" do
    render_component(no_margin: true)
    assert_select '.gem-c-search--no-margin'
  end

  it "renders a search box with no border" do
    render_component(no_border: true)
    assert_select '.gem-c-search--no-border'
  end
end
