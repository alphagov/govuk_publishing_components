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

    label_id = "##{assert_select('.gem-c-layout-super-navigation-header__content[aria-labelledby]').first['aria-labelledby']}"

    assert_select label_id, count: 1
  end

  it "renders the menu list with links in it" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__navigation-items", count: 1
    assert_select ".gem-c-layout-super-navigation-header__navigation-items .gem-c-layout-super-navigation-header__navigation-item", count: 3
    assert_select ".gem-c-layout-super-navigation-header__navigation-items .gem-c-layout-super-navigation-header__navigation-item .gem-c-layout-super-navigation-header__navigation-item-link", count: 3
  end

  it "renders the search menu with links in it" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__search-items", count: 1
    assert_select ".gem-c-layout-super-navigation-header__search-items .gem-c-layout-super-navigation-header__search-item", count: 1
    assert_select ".gem-c-layout-super-navigation-header__search-items .gem-c-layout-super-navigation-header__search-item .gem-c-layout-super-navigation-header__search-item-link", count: 1
  end

  it "has only one search link in the menu" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__search-item", count: 1
  end
end
