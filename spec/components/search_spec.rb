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

  it "doesn't render a search box for a dark background if the parameter is invalid" do
    render_component(on_govuk_blue: "dummy")
    assert_select ".gem-c-search.gem-c-search--on-govuk-blue", false
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

  it "renders a search box with custom margins" do
    render_component(
      margin_top: 3,
      margin_bottom: 2,
    )
    assert_select '.gem-c-search.govuk-\!-margin-top-3.govuk-\!-margin-bottom-2'
  end

  it "renders a search box with no border" do
    render_component(no_border: true)
    assert_select ".gem-c-search--no-border"
  end

  it "renders a search box with default button text" do
    render_component({})
    assert_select ".gem-c-search__submit", text: "Search"
  end

  it "renders a search box with custom button text" do
    render_component(button_text: "Search please")
    assert_select ".gem-c-search__submit", text: "Search please"
  end
end
