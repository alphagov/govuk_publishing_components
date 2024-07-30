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

    assert_select ".gem-c-layout-super-navigation-header__navigation-dropdown-menu .gem-c-layout-super-navigation-header__navigation-items", count: 1
  end

  it "renders the search menu with links in it" do
    render_component({})

    assert_select "#super-search-menu", count: 1
    assert_select "#super-search-menu .gem-c-layout-super-navigation-header__search-items", count: 1
  end

  it "has only one search link in the menu" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__search-item .gem-c-layout-super-navigation-header__search-item-link", count: 1
  end

  it "has only one menu link in the menu" do
    render_component({})

    assert_select ".gem-c-layout-super-navigation-header__navigation-item .gem-c-layout-super-navigation-header__navigation-item-link", count: 1
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

  it "hides logo text and renders visually hidden span" do
    render_component({
      hide_logo_text: true,
    })

    assert_select "a.govuk-header__link--homepage[href='https://www.gov.uk/']", "GOV.UK"
    assert_select "a.govuk-header__link--homepage .govuk-visually-hidden"
  end

  it "hides left border of button" do
    render_component({
      hide_button_left_border: true,
    })

    assert_select ".gem-c-layout-super-navigation-header__navigation-top-toggle-button-inner--no-left-border"
  end

  it "allows a custom crown logo link and custom title" do
    render_component({
      logo_link: "https://www.example.com/",
      logo_link_title: "Go to example",
    })

    assert_select "a.govuk-header__link--homepage[href='https://www.example.com/']", count: 1
    assert_select "a.govuk-header__link--homepage[aria-label='Go to example']", count: 1
  end

  it "renders blue background navbar variant" do
    render_component({
      blue_background: true,
    })

    assert_select ".gem-c-layout-super-navigation-header__navigation-top-toggle-button--blue-background"
    assert_select ".gem-c-layout-super-navigation-header__search-toggle-button--blue-background"
    assert_select ".gem-c-layout-super-navigation-header__search-item-link--blue-background"
    assert_select ".gem-c-layout-super-navigation-header__navigation-item-link--blue-background"
  end

  it "renders large navbar variant" do
    render_component({
      large_navbar: true,
      hide_logo_text: true,
    })

    assert_select ".gem-c-layout-super-navigation-header__button-container--large-navbar"
    assert_select ".gem-c-layout-super-navigation-header__header-logo--large-navbar"
    assert_select ".gem-c-layout-super-navigation-header__navigation-top-toggle-button--large-navbar"
    assert_select ".gem-c-layout-super-navigation-header__search-toggle-button--large-navbar"
    assert_select ".gem-c-layout-super-navigation-header__search-item-link--large-navbar"
    assert_select ".gem-c-layout-super-navigation-header__navigation-item-link--large-navbar"
    assert_select ".gem-c-layout-super-navigation-header__logotype-crown--large-navbar"
    assert_select ".gem-c-header__link--large-navbar"
  end

  it "doesn't have the initialised class before the JavaScript is run" do
    render_component({})

    assert_select ".js-module-initialised[data-module=\"super-navigation-mega-menu\"]", false
  end

  it "adds GA4 tracking" do
    render_component({ ga4_tracking: true })

    assert_select "header[data-module='ga4-event-tracker ga4-link-tracker']"
    assert_select "a[data-ga4-link]", count: 23
    assert_select 'a[data-ga4-link=\'{"event_name":"navigation","type":"header menu bar","external":"false","text":"GOV.UK","section":"Logo","index_link":1,"index_section":0,"index_section_count":2,"index_total":1}\']'
    assert_select 'a[data-ga4-link=\'{"event_name":"navigation","type":"header menu bar","index_section":1,"index_link":1,"index_section_count":3,"index_total":16,"section":"Services and information"}\']'
    assert_select 'a[data-ga4-link=\'{"event_name":"navigation","type":"header menu bar","index_section":1,"index_link":16,"index_section_count":3,"index_total":16,"section":"Services and information"}\']'
    assert_select 'a[data-ga4-link=\'{"event_name":"navigation","type":"header menu bar","index_section":2,"index_link":1,"index_section_count":3,"index_total":6,"section":"Government activity"}\']'
    assert_select 'a[data-ga4-link=\'{"event_name":"navigation","type":"header menu bar","index_section":2,"index_link":6,"index_section_count":3,"index_total":6,"section":"Government activity"}\']'
    form_attributes = {
      event_name: "search",
      type: "header menu bar",
      section: "Search GOV.UK",
      action: "search",
      url: "/search/all",
      index_section: 3,
      index_section_count: 3,
    }.to_json
    assert_select "form[data-ga4-form=\'#{form_attributes}\']"
  end
end
