require 'rails_helper'

describe "Layout header", type: :view do
  def component_name
    "layout_header"
  end

  it "renders the header" do
    render_component(environment: "staging")

    assert_select ".govuk-header"
  end

  it "renders the header with navigation links" do
    navigation_links = [
      { name: "Foo", href: "/foo", active: true },
      { name: "Bar", href: "/bar" },
    ]

    render_component(environment: "staging", navigation_links: navigation_links)

    assert_select ".govuk-header__navigation-item.govuk-header__navigation-item--active", text: "Foo"
    assert_select ".govuk-header__navigation-item", text: "Bar"
  end
end
