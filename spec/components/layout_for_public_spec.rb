require "rails_helper"

describe "Layout for public", :capybara, type: :view do
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

    assert_select "title", visible: :hidden, text: "GOV.UK - The best place to find government services and information"
  end

  it "adds a custom <title> tag" do
    render_component(title: "Custom GOV.UK Title")

    assert_select "title", visible: :hidden, text: "Custom GOV.UK Title"
  end

  it "adds a <title> tag with a custom lang" do
    render_component(title: "Custom GOV.UK Title", title_lang: "cy")

    assert_select "title[lang=cy]", visible: :hidden, text: "Custom GOV.UK Title"
  end

  it "displays as a restricted width layout when called with the for_static parameter" do
    render_component(for_static: true)

    assert_select "#wrapper.govuk-width-container"
  end

  it "can support full width layouts when called with the for_static parameter" do
    render_component(for_static: true, full_width: true)

    assert_select "#wrapper.govuk-width-container", false, "Should not apply govuk-width-container class when full width"
  end

  it "displays with search bar by default" do
    render_component({})

    assert_select ".gem-c-layout-for-public .gem-c-search"
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

  it "can add a emergency banner" do
    render_component({
      emergency_banner: "<div id='test-emergency-banner'>This is an emergency banner test</div>",
    })

    assert_select "#test-emergency-banner", text: "This is an emergency banner test"
  end

  it "can add a global banner" do
    render_component({
      global_banner: "<div id='test-global-banner'>This is a global banner test</div>",
    })

    assert_select "#test-global-banner", text: "This is a global banner test"
  end

  it "can add both an emergency banner and a global banner" do
    render_component({
      emergency_banner: "<div id='test-emergency-banner'>This is an emergency banner test</div>",
      global_banner: "<div id='test-global-banner'>This is a global banner test</div>",
    })

    assert_select "#test-emergency-banner", text: "This is an emergency banner test"
    assert_select "#test-global-banner", text: "This is a global banner test"
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

    expect(page).to have_selector("html > head > script[src*='lux/lux-measurer']", visible: :hidden)
    expect(page).to have_selector("html > head > script[src*='rum-loader']", visible: :hidden)
  end

  it "does not contain LUX submission script when the page loads", :js do
    visit "/public"

    expect(page).not_to have_selector("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "only contains LUX submission script after usage cookies have been allowed", :js do
    visit "/public"

    expect(page).to have_selector("html > head > script[src*='rum-loader']", visible: :hidden)
    expect(page).to have_selector("html > head > script[src*='lux/lux-measurer']", visible: :hidden)

    expect(page).not_to have_selector("html > head > script[src*='lux/lux-reporter']", visible: :hidden)

    click_button "Accept additional cookies"

    expect(page).to have_selector("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "contains real user metrics scripts on the page after usage cookies have been allowed", :js do
    visit "/public"

    click_button "Accept additional cookies"

    visit "/public"

    expect(page).to have_selector("html > head > script[src*='rum-loader']", visible: :hidden)
    expect(page).to have_selector("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
    expect(page).to have_selector("html > head > script[src*='lux/lux-measurer']", visible: :hidden)
  end

  it "does not contain real user metrics scripts after usage cookies have not been allowed", :js do
    visit "/public"

    click_button "Reject additional cookies"

    expect(page).to have_selector("html > head > script[src*='rum-loader']", visible: :hidden)
    expect(page).to have_selector("html > head > script[src*='lux/lux-measurer']", visible: :hidden)

    expect(page).not_to have_selector("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "does not contain real user metrics scripts on page after usage cookies have not been allowed", :js do
    visit "/public"

    click_button "Reject additional cookies"

    visit "/public"

    expect(page).to have_selector("html > head > script[src*='rum-loader']", visible: :hidden)
    expect(page).to have_selector("html > head > script[src*='lux/lux-measurer']", visible: :hidden)

    expect(page).not_to have_selector("html > head > script[src*='lux/lux-reporter']", visible: :hidden)
  end

  it "account layout renders with a main element if for_static is explicitly set to true" do
    render_component({ show_account_layout: true, for_static: true })

    assert_select ".gem-c-layout-for-public main#content"
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
              "an_attribute": "some_value1",
            },
          },
          no: {
            text: "No",
            data_attributes: {
              "an_attribute": "some_value2",
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
    assert_select ".govuk-cookie-banner .gem-c-button[data-an-attribute='some_value1']", text: "Yes"
    assert_select ".govuk-cookie-banner .gem-c-button[data-an-attribute='some_value2']", text: "No"
  end

  it "displays as draft watermark" do
    render_component({ draft_watermark: true })

    assert_select ".gem-c-layout-for-public.gem-c-layout-for-public--draft"
  end

  it "contains a global-banner-present class when the global banner is present" do
    render_component({ global_banner: { present: true } })

    assert_select ".gem-c-layout-for-public.govuk-template__body.global-banner-present"
  end

  it "does not contains a global-banner-present class when the global banner is not present" do
    render_component({ global_banner: {} })

    assert_select ".gem-c-layout-for-public.govuk-template__body.global-banner-present", false
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

  it "renders without the wrapper if for_static is not explictly set to true" do
    render_component({})

    assert_select "div#wrapper", false
    assert_select "main.govuk-main-wrapper", false
  end

  it "account layout renders without the main element if for_static is not explicitly set to true" do
    render_component({ show_account_layout: true })

    assert_select ".gem-c-layout-for-public main#content", false
  end
end
