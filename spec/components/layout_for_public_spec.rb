require "rails_helper"

describe "Layout for public", type: :view do
  def component_name
    "layout_for_public"
  end

  it "adds a default <title> tag" do
    render_component({})

    assert_select "title", visible: false, text: "GOV.UK - The best place to find government services and information"
  end

  it "adds a custom <title> tag" do
    render_component(title: "Custom GOV.UK Title")

    assert_select "title", visible: false, text: "Custom GOV.UK Title"
  end

  it "displays as a restricted width layout by default" do
    render_component({})

    assert_select "#wrapper.govuk-width-container"
  end

  it "can support full width layouts" do
    render_component(full_width: true)

    assert_select "#wrapper.govuk-width-container", false, "Should not apply govuk-width-container class when full width"
  end

  it "displays with search bar by default" do
    render_component({})

    assert_select ".gem-c-layout-for-public .gem-c-search"
  end

  it "can display without search bar" do
    render_component(show_search: false)

    assert_select ".gem-c-layout-for-public .gem-c-search", false
  end

  it "can omit the header" do
    render_component(omit_header: true)

    assert_select ".gem-c-layout-for-public .gem-c-layout-header", false
  end

  it "displays with a feedback component by default" do
    render_component({})

    assert_select ".gem-c-layout-for-public .gem-c-feedback", true
  end

  it "can omit the feedback component" do
    render_component(omit_feedback_form: true)

    assert_select ".gem-c-layout-for-public .gem-c-feedback", false
  end

  it "can add a product name in the header" do
    render_component(product_name: "Account")

    assert_select ".gem-c-layout-for-public .gem-c-header__product-name", text: "Account"
  end

  it "can add a emergency banner" do
    render_component({
      emergency_banner: "<div id='test-emergency-banner'>This is an emergency banner test</div>",
    })

    assert_select "#test-emergency-banner", text: "This is an emergency banner test"
  end

  it "can add a global bar" do
    render_component({
      global_bar: "<div id='test-global-banner'>This is a global bar test</div>",
    })

    assert_select "#test-global-banner", text: "This is a global bar test"
  end

  it "can add both an emergency banner and a global bar" do
    render_component({
      emergency_banner: "<div id='test-emergency-banner'>This is an emergency banner test</div>",
      global_bar: "<div id='test-global-banner'>This is a global bar test</div>",
    })

    assert_select "#test-emergency-banner", text: "This is an emergency banner test"
    assert_select "#test-global-banner", text: "This is a global bar test"
  end

  it "has a blue bar by default" do
    render_component({})

    assert_select ".gem-c-layout-for-public__blue-bar"
  end

  it "has no blue bar when using the full width layout" do
    render_component(full_width: true)

    assert_select ".gem-c-layout-for-public__blue-bar", false
  end

  it "has the default logo link when no logo_link is specified" do
    render_component({})

    assert_select ".govuk-header__link--homepage[href='/']"
  end

  it "has a custom logo link when specified" do
    render_component({ logo_link: "https://example.com/jam" })

    assert_select ".govuk-header__link--homepage[href='https://example.com/jam']"
  end

  it "contains real user metrics loader script" do
    visit "/public"
    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :all)
  end

  it "does not contain real user metrics scripts before cookie banner interacted with" do
    Capybara.current_driver = Capybara.javascript_driver

    visit "/public"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :all)
    assert page.has_no_selector?("html > head > script[src*='lux/lux']", visible: :all)
    assert page.has_no_selector?("html > head > script[src*='lux/lux-polyfill']", visible: :all)
  end

  it "does not contain real user metrics scripts on the page where cookies are accepted" do
    Capybara.current_driver = Capybara.javascript_driver

    visit "/public"

    click_button "Accept additional cookies"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :all)
    assert page.has_no_selector?("html > head > script[src*='lux/lux']", visible: :all)
    assert page.has_no_selector?("html > head > script[src*='lux/lux-polyfill']", visible: :all)
  end

  it "contains real user metrics scripts on page after cookies opted in" do
    Capybara.current_driver = Capybara.javascript_driver

    visit "/public"

    click_button "Accept additional cookies"

    visit "/public"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :all)
    assert page.has_selector?("html > head > script[src*='lux/lux']", visible: :all)
    assert page.has_selector?("html > head > script[src*='lux/lux-polyfill']", visible: :all)
  end

  it "does not contain real user metrics scripts on page after cookies opted out" do
    Capybara.current_driver = Capybara.javascript_driver

    visit "/public"

    click_button "Reject additional cookies"

    visit "/public"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :all)
    assert page.has_no_selector?("html > head > script[src*='lux/lux']", visible: :all)
    assert page.has_no_selector?("html > head > script[src*='lux/lux-polyfill']", visible: :all)
  end
end
