require "rails_helper"

describe "Super navigation header", type: :view do
  def component_name
    "layout_super_navigation_header"
  end

  it "renders the super navigation header" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header", count: 1
  end

  it "has a nav element that is labelled by a heading that exists" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__content[aria-labelledby]", count: 1

    label = "##{assert_select('.gem-c-layout-super-navigation-header__content[aria-labelledby]').first['aria-labelledby']}"

    assert_select label, count: 1
  end

  it "renders the menu list with links in it" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__items", count: 1
    assert_select ".gem-c-layout-super-navigation-header__items .gem-c-layout-super-navigation-header__item", count: 4
    assert_select ".gem-c-layout-super-navigation-header__items .gem-c-layout-super-navigation-header__item .gem-c-layout-super-navigation-header__item-link", count: 4
  end

  it "has only one search link in the menu" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__item--search", count: 1
  end
end
