require 'rails_helper'

describe "Layout header", type: :view do
  def component_name
    "layout_header"
  end

  it "renders the header" do
    render_component(environment: "staging")

    assert_select ".govuk-header"
  end

  it "renders the header with environment modifier class" do
    render_component(environment: "staging")

    assert_select ".govuk-header.gem-c-layout-header--staging"
  end

  it "renders the product name" do
    render_component(environment: "staging", product_name: "Product name")

    assert_select ".govuk-header__product-name", text: "Product name"
  end

  it "renders at a constrained width by default" do
    render_component(environment: "staging", product_name: "Product name")

    assert_select ".govuk-width-container"
  end

  it "renders at full width when requested to" do
    render_component(environment: "staging", product_name: "Product name", full_width: true)

    assert_select ".govuk-header__container--full-width"
  end

  it "renders the header with navigation items" do
    navigation_items = [
      { text: "Foo", href: "/foo", active: true },
      { text: "Bar", href: "/bar" },
      { text: "Hello", href: "/hello", show_only_in_collapsed_menu: true },
    ]

    render_component(environment: "staging", navigation_items: navigation_items)

    assert_select ".govuk-header__navigation-item.govuk-header__navigation-item--active", text: "Foo"
    assert_select ".govuk-header__navigation-item", text: "Bar"
    assert_select ".govuk-header__navigation-item.govuk-header__navigation-item--collapsed-menu-only", text: "Hello"
  end

  it "renders the header without the bottom border" do
    render_component(remove_bottom_border: true, environment: 'public')

    assert_select ".gem-c-layout-header--no-bottom-border"
  end
end
