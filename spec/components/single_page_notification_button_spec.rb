require "rails_helper"

describe "Single page notification button", type: :view do
  def component_name
    "single_page_notification_button"
  end

  it "does not render without a base path" do
    assert_empty render_component({})
  end

  it "renders with the correct markup if base path is present" do
    render_component({ base_path: "/the-current-page" })
    assert_select ".gem-c-single-page-notification-button form"
    assert_select "input[type='hidden']", value: "/the-current-page"
    assert_select ".gem-c-single-page-notification-button button.gem-c-single-page-notification-button__submit[type='submit']"
  end

  it "shows 'Get emails about this page' by default" do
    render_component({ base_path: "/the-current-page" })
    assert_select ".gem-c-single-page-notification-button", text: "Get emails about this page"
  end

  it "shows 'Stop getting emails about this page' if already_subscribed is true" do
    render_component({ base_path: "/the-current-page", already_subscribed: true })
    assert_select ".gem-c-single-page-notification-button", text: "Stop getting emails about this page"
  end

  it "shows custom subscribe text if button_text:subscribe and button_text:unsubscribe are provided" do
    local_assigns = {
      base_path: "/the-current-page",
      button_text: {
        subscribe: "Start getting emails about this stuff",
        unsubscribe: "Stop getting emails about this stuff",
      },
    }
    render_component(local_assigns)
    assert_select ".gem-c-single-page-notification-button", text: "Start getting emails about this stuff"
  end

  it "does not show custom text unless both button_text:subscribe and button_text:unsubscribe are provided" do
    local_assigns = {
      base_path: "/the-current-page",
      already_subscribed: true,
      button_text: {
        unsubscribe: "Stop getting emails about this stuff",
      },
    }
    render_component(local_assigns)
    assert_select ".gem-c-single-page-notification-button", text: "Stop getting emails about this page"
  end

  it "by defaults sets a form action of '/email/subscriptions/single-page/new'" do
    local_assigns = {
      base_path: "/the-current-page",
    }
    render_component(local_assigns)
    assert_select "form[action='/email/subscriptions/single-page/new']"
    assert_select "input[name='base_path']", value: "/the-current-page"
  end

  it "set the default form action of '/email/subscriptions/single-page/new' if skip_account is present but not 'true'" do
    local_assigns = {
      base_path: "/the-current-page",
      skip_account: "anything-goes",
    }
    render_component(local_assigns)
    assert_select "form[action='/email/subscriptions/single-page/new']"
    assert_select "input[name='base_path']", value: "/the-current-page"
    assert_select "input[name='single_page_subscription']", false
    assert_select "input[name='link']", false
  end

  it "sets a form action of '/email-signup' and adds a hidden link param if skip_account is 'true'" do
    local_assigns = {
      base_path: "/the-current-page",
      skip_account: true,
    }
    render_component(local_assigns)
    assert_select "form[action='/email-signup']"
    assert_select "input[name='base_path']", value: "/the-current-page"
    assert_select "input[name='single_page_subscription']", value: "true"
    assert_select "input[name='link']", value: "/the-current-page"
  end

  it "has data attributes if data_attributes is specified" do
    render_component({ base_path: "/the-current-page", data_attributes: { custom_attribute: "kaboom!" } })
    assert_select ".gem-c-single-page-notification-button[data-custom-attribute='kaboom!']"
  end

  it "sets a default bottom margin to its wrapper" do
    render_component({ base_path: "/the-current-page" })
    assert_select '.gem-c-single-page-notification-button.govuk-\!-margin-bottom-3'
  end

  it "adds bottom margin to its wrapper if margin_bottom is specified" do
    render_component({ base_path: "/the-current-page", margin_bottom: 9 })
    assert_select '.gem-c-single-page-notification-button.govuk-\!-margin-bottom-9'
  end

  it "has a js-enhancement class and a data-module attribute if the js-enhancement flag is present" do
    render_component({ base_path: "/the-current-page", js_enhancement: true })
    assert_select ".gem-c-single-page-notification-button.js-personalisation-enhancement[data-module='single-page-notification-button']"
  end

  it "does not have a js-enhancement class and a data-module attribute if the js-enhancement flag is not present" do
    render_component({ base_path: "/the-current-page" })
    assert_select ".gem-c-single-page-notification-button.js-personalisation-enhancement", false
    assert_select ".gem-c-single-page-notification-button[data-module='single-page-notification-button']", false
  end

  it "renders the GA4 data attributes and module that it is passed" do
    local_assigns = {
      base_path: "/the-current-page",
      ga4_data_attributes: {
        module: "ga4-link-tracker",
        ga4_link: {
          event_name: "navigation",
          type: "subscribe",
          index_link: 1,
          index_total: 2,
          section: "Top",
        },
      },
    }
    render_component(local_assigns)

    assert_select "[data-module='ga4-link-tracker']"
    assert_select ".gem-c-single-page-notification-button__submit" do |button|
      expect(button.attr("data-ga4-link").to_s).to eq '{"event_name":"navigation","type":"subscribe","index_link":1,"index_total":2,"section":"Top","url":"/email/subscriptions/single-page/new"}'
    end
  end

  it "does not render any GA4 data attributes or modules that it isn't passed" do
    render_component({ base_path: "/the-current-page" })

    assert_select "[data-module='ga4-link-tracker']", false
    assert_select ".gem-c-single-page-notification-button__submit" do |button|
      expect(button.attr("data-ga4-link")).to be_nil
    end
  end
end
