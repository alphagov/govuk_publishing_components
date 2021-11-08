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

  it "has `aria-labelledby` attributes correctly linked to elements that exist" do
    render_component({})

    label_ids = assert_select("[aria-labelledby]").map do |node|
      node["aria-labelledby"]
    end

    label_ids.each do |label_id|
      assert_select "##{label_id}", count: 1
    end
  end

  it "has `aria-controls` attributes correctly linked to elements that exist" do
    render_component({})

    control_ids = assert_select("[aria-controls]").map do |button|
      button["aria-controls"]
    end

    control_ids.each do |control_id|
      assert_select "##{control_id}", count: 1
    end
  end

  it "has buttons that have the three required attributes for the menu toggles to work" do
    render_component({})

    menu_buttons = assert_select("button[aria-controls][data-toggle-desktop-group][data-toggle-mobile-group]")
    all_buttons = assert_select("button")

    # There is a search submit button - so the correct number of menu buttons
    # should be the total number of buttons in the navigation minus one.
    expect(menu_buttons.count).to eq(all_buttons.count - 1)
  end

  it "has all of the toggle buttons hidden" do
    render_component({})

    all_toggle_buttons = assert_select("button[type='button']")

    assert_select "button[type='button'][hidden]", count: all_toggle_buttons.count
  end

  it "renders the menu list with links in it" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__navigation-items", count: 1
    assert_select ".gem-c-layout-super-navigation-header__navigation-items .gem-c-layout-super-navigation-header__navigation-item", count: 2
    assert_select ".gem-c-layout-super-navigation-header__navigation-items .gem-c-layout-super-navigation-header__navigation-item .gem-c-layout-super-navigation-header__navigation-item-link", count: 2
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

  it "has the correct default crown logo link" do
    render_component({})

    assert_select "a.govuk-header__link--homepage[href='https://www.gov.uk/']", count: 1
  end

  it "allows a custom crown logo link" do
    render_component({
      logo_link: "https://www.example.com/",
    })

    assert_select "a.govuk-header__link--homepage[href='https://www.example.com/']", count: 1
  end

  it "allows a custom crown logo link and custom title" do
    render_component({
      logo_link: "https://www.example.com/",
      logo_link_title: "Go to example",
    })

    assert_select "a.govuk-header__link--homepage[href='https://www.example.com/']", count: 1
    assert_select "a.govuk-header__link--homepage[title='Go to example']", count: 1
  end

  it "doesn't have the initialised class before the JavaScript is run" do
    render_component({})

    assert_select ".js-module-initialised[data-module=\"super-navigation-mega-menu\"]", false
  end
end
