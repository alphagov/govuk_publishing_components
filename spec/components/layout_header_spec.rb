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

  it "renders the header with navigation items" do
    navigation_items = [
      { text: "Foo", href: "/foo", active: true },
      { text: "Bar", href: "/bar" },
    ]

    render_component(environment: "staging", navigation_items: navigation_items)

    assert_select ".govuk-header__navigation-item.govuk-header__navigation-item--active", text: "Foo"
    assert_select ".govuk-header__navigation-item", text: "Bar"
  end
end
