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
    assert_select "form.gem-c-single-page-notification-button"
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

  it "sets a form action of '/email-signup' and adds a hidden link param if skip_account is provided" do
    local_assigns = {
      base_path: "/the-current-page",
      skip_account: "true",
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
    assert_select 'div.govuk-\!-margin-bottom-3 .gem-c-single-page-notification-button'
  end

  it "adds bottom margin to its wrapper if margin_bottom is specified" do
    render_component({ base_path: "/the-current-page", margin_bottom: 9 })
    assert_select 'div.govuk-\!-margin-bottom-9 .gem-c-single-page-notification-button'
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

  it "has correct attributes for tracking by default" do
    render_component({ base_path: "/the-current-page" })
    assert_select ".gem-c-single-page-notification-button[data-track-category='Single-page-notification-button'][data-track-action='Subscribe-button'][data-track-label='/the-current-page']"
  end

  it "has correct attributes for tracking when already_subscribed is true" do
    render_component({ base_path: "/the-current-page", already_subscribed: true })

    assert_select ".gem-c-single-page-notification-button[data-track-category='Single-page-notification-button'][data-track-action='Unsubscribe-button'][data-track-label='/the-current-page']"
  end

  it "has the correct default data-track-action for tracking when button_location is top" do
    render_component({ base_path: "/the-current-page", button_location: "top" })

    assert_select ".gem-c-single-page-notification-button[data-track-action='Subscribe-button-top']"
  end

  it "has the correct data-track-action for tracking when button_location is top and already_subscribed is true" do
    render_component({ base_path: "/the-current-page", button_location: "top", already_subscribed: true })

    assert_select ".gem-c-single-page-notification-button[data-track-action='Unsubscribe-button-top']"
  end

  it "has the correct default data-track-action for tracking when button_location is bottom" do
    render_component({ base_path: "/the-current-page", button_location: "bottom" })

    assert_select ".gem-c-single-page-notification-button[data-track-action='Subscribe-button-bottom']"
  end

  it "has the correct data-track-action for tracking when button_location is bottom and already_subscribed is true" do
    render_component({ base_path: "/the-current-page", button_location: "bottom", already_subscribed: true })

    assert_select ".gem-c-single-page-notification-button[data-track-action='Unsubscribe-button-bottom']"
  end

  it "has the correct data-track-action for tracking when button_location has an invalid value" do
    render_component({ base_path: "/the-current-page", button_location: "this is unacceptable" })

    assert_select ".gem-c-single-page-notification-button[data-track-action='Subscribe-button']"
  end
end
