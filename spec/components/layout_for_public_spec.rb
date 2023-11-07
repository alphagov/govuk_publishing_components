require "rails_helper"

describe "Layout for public", type: :view do
  def component_name
    "layout_for_public"
  end

  it "renders html document with 'en' as default lang" do
    render_component({})

    assert_select "html.govuk-template[lang=en]"
  end

  it "renders html document with custom lang" do
    render_component(html_lang: "cy")

    assert_select "html.govuk-template[lang=cy]"
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

  it "can omit the footer navigation" do
    render_component(omit_footer_navigation: true)

    assert_select ".gem-c-layout-for-public .govuk-footer__navigation", false
    assert_select ".gem-c-layout-for-public .govuk-footer__section-break", false
  end

  it "does not omit the footer navigation if `omit_footer_navigation` is `false`" do
    render_component(omit_footer_navigation: false)

    assert_select ".gem-c-layout-for-public .govuk-footer__navigation", true
    assert_select ".gem-c-layout-for-public .govuk-footer__section-break", true
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

  it "renders the blue bar if `blue_bar` is `true`" do
    render_component(blue_bar: true)

    assert_select ".gem-c-layout-for-public__blue-bar"
  end

  it "renders homepage variant of layout super navigation header if `homepage` is true" do
    render_component(show_explore_header: true, homepage: true)

    assert_select ".govuk-header__logotype[width='32']"
    assert_select ".govuk-header__logotype[height='30']"
    assert_select ".gem-c-layout-super-navigation-header--blue-background"
    assert_select ".gem-c-layout-super-navigation-header__header-logo--large-navbar"
  end

  it "renders the blue bar if `full_width` is true and `blue_bar` is true" do
    render_component(full_width: true, blue_bar: true)

    assert_select ".gem-c-layout-for-public__blue-bar"
  end

  it "renders the blue bar with a background if valid background specified" do
    render_component(blue_bar: true, full_width: true, blue_bar_background_colour: "browse")

    assert_select ".gem-c-layout-for-public__blue-bar-wrapper--browse .gem-c-layout-for-public__blue-bar"
  end

  it "does not render the blue bar with a background if an invalid background specified" do
    render_component(blue_bar: true, full_width: true, blue_bar_background_colour: "invalid")

    assert page.has_no_selector? ".gem-c-layout-for-public__blue-bar-wrapper--invalid"
  end

  it "has the default logo link when no logo_link is specified" do
    render_component({})

    assert_select ".govuk-header__link--homepage[href='/']"
  end

  it "has a custom logo link when specified" do
    render_component({ logo_link: "https://example.com/jam" })

    assert_select ".govuk-header__link--homepage[href='https://example.com/jam']"
  end

  it "contains real user metrics loader script and LUX measurer script" do
    visit "/public"

    assert page.has_selector?("html > head > script[src*='lux/lux-measurer']", visible: :hidden)
    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :hidden)
  end

  it "does not contain LUX submission script when the page loads", js: true do
    visit "/public"

    assert page.has_no_selector?("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "only contains LUX submission script after usage cookies have been allowed", js: true do
    visit "/public"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :hidden)
    assert page.has_selector?("html > head > script[src*='lux/lux-measurer']", visible: :hidden)

    assert page.has_no_selector?("html > head > script[src*='lux/lux-reporter']", visible: :hidden)

    click_button "Accept additional cookies"

    assert page.has_selector?("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "contains real user metrics scripts on the page after usage cookies have been allowed", js: true do
    visit "/public"

    click_button "Accept additional cookies"

    visit "/public"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :hidden)
    assert page.has_selector?("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
    assert page.has_selector?("html > head > script[src*='lux/lux-measurer']", visible: :hidden)
  end

  it "does not contain real user metrics scripts after usage cookies have not been allowed", js: true do
    visit "/public"

    click_button "Reject additional cookies"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :hidden)
    assert page.has_selector?("html > head > script[src*='lux/lux-measurer']", visible: :hidden)

    assert page.has_no_selector?("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "does not contain real user metrics scripts on page after usage cookies have not been allowed", js: true do
    visit "/public"

    click_button "Reject additional cookies"

    visit "/public"

    assert page.has_selector?("html > head > script[src*='rum-loader']", visible: :hidden)
    assert page.has_selector?("html > head > script[src*='lux/lux-measurer']", visible: :hidden)

    assert page.has_no_selector?("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "account layout renders with a phase banner by default" do
    render_component({ show_account_layout: true })

    assert_select ".gem-c-layout-for-public .gem-c-phase-banner"
  end

  it "account layout renders with an account nav by default" do
    render_component({ show_account_layout: true })

    assert_select ".gem-c-layout-for-public .gem-c-layout-for-public-account-nav"
  end

  it "indicates the active account navigation item if the location parameter is passed" do
    render_component({ show_account_layout: true, account_nav_location: "manage" })

    assert_select ".gem-c-layout-for-public-account-nav li.gem-c-layout-for-public-account-menu__item.gem-c-layout-for-public-account-menu__item--current a[aria-current=page]", text: "Settings"
  end

  it "can accept custom cookie banner content" do
    render_component({
      cookie_banner_data: {
        title: "Can we use cookies to collect information about how you use GOV.UK?",
        text: "Cookies help us see where we can make improvements to GOV.UK.",
        confirmation_message: "You have accepted cookies.",
        cookie_preferences_href: "https://www.gov.uk/government/publications/govuk-accounts-trial-full-privacy-notice-and-accessibility-statement",
        services_cookies: {
          yes: {
            text: "Yes",
            data_attributes: {
              "track-category": "cookieBanner",
            },
          },
          no: {
            text: "No",
            data_attributes: {
              "track-category": "cookieBanner",
            },
          },
          cookie_preferences: {
            text: "How GOV.UK accounts use cookies",
            href: "https://www.gov.uk/government/publications/govuk-accounts-trial-full-privacy-notice-and-accessibility-statement",
          },
        },
      },
    })

    assert_select ".govuk-cookie-banner__heading.govuk-heading-m", text: "Can we use cookies to collect information about how you use GOV.UK?"
  end

  it "displays as draft watermark" do
    render_component({ draft_watermark: true })

    assert_select ".gem-c-layout-for-public.govuk-template__body.draft"
  end

  it "contains a global-bar-present class when the global bar is present" do
    render_component({ global_bar: { present: true } })

    assert_select ".gem-c-layout-for-public.govuk-template__body.global-bar-present"
  end

  it "does not contains a global-bar-present class when the global bar is not present" do
    render_component({ global_bar: {} })

    assert_select ".gem-c-layout-for-public.govuk-template__body.global-bar-present", false
  end

  it "has an Open Graph image with an absolute URL" do
    render_component({})

    assert_select "meta[property='og:image']" do |meta|
      expect(meta.first["content"]).to match(%r{^https?://})
    end
  end

  it "has the skip link immediately after the cookie banner" do
    render_component({})

    assert_select ".gem-c-cookie-banner + .gem-c-skip-link"
  end

  it "can render a custom header instead of the default one" do
    view.content_for(:custom_header) { content_tag(:header, "GOV.UK with a custom header", id: "custom-header") }
    render_component({})

    assert_select "header#custom-header"
    assert page.has_no_selector?(".gem-c-layout-header")
  end

  it "it can render a custom layout instead of the default one" do
    render_component({ custom_layout: true }) do
      content_tag(:main, "GOV.UK with a custom layout", id: "custom-layout")
    end

    assert_select "main#custom-layout"
    assert page.has_no_selector?("div#wrapper")
    assert page.has_no_selector?("main.govuk-main-wrapper")
  end
end
