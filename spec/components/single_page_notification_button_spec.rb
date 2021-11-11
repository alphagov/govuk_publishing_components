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

  it "has data attributes if data_attributes is specified" do
    render_component({ base_path: "/the-current-page", data_attributes: { custom_attribute: "kaboom!" } })
    assert_select ".gem-c-single-page-notification-button[data-custom-attribute='kaboom!']"
  end

  it "sets a default bottom margin" do
    render_component({ base_path: "/the-current-page" })
    assert_select '.gem-c-single-page-notification-button.govuk-\!-margin-bottom-3'
  end

  it "adds bottom margin if margin_bottom is specified" do
    render_component({ base_path: "/the-current-page", margin_bottom: 9 })
    assert_select '.gem-c-single-page-notification-button.govuk-\!-margin-bottom-9'
  end

  it "has a data-module attribute for JavaScript, if the js-enhancement flag is present" do
    render_component({ base_path: "/the-current-page", js_enhancement: true })
    dom = Nokogiri::HTML(rendered)
    form_data_module = dom.xpath("//form")[0].attr("data-module")

    expect(form_data_module).to include("single-page-notification-button")
  end

  it "has correct attributes for tracking by default" do
    render_component({ base_path: "/the-current-page" })
    assert_select ".gem-c-single-page-notification-button[data-category='Single-page-notification-button'][data-action='Subscribe-button'][data-label='/the-current-page']"
  end

  it "has correct attributes for tracking when already_subscribed is true" do
    render_component({ base_path: "/the-current-page", already_subscribed: true })

    assert_select ".gem-c-single-page-notification-button[data-category='Single-page-notification-button'][data-action='Unsubscribe-button'][data-label='/the-current-page']"
  end

  it "has the correct default data-action for tracking when button_location is top" do
    render_component({ base_path: "/the-current-page", button_location: "top" })

    assert_select ".gem-c-single-page-notification-button[data-action='Subscribe-button-top']"
  end

  it "has the correct data-action for tracking when button_location is top and already_subscribed is true" do
    render_component({ base_path: "/the-current-page", button_location: "top", already_subscribed: true })

    assert_select ".gem-c-single-page-notification-button[data-action='Unsubscribe-button-top']"
  end

  it "has the correct default data-action for tracking when button_location is bottom" do
    render_component({ base_path: "/the-current-page", button_location: "bottom" })

    assert_select ".gem-c-single-page-notification-button[data-action='Subscribe-button-bottom']"
  end

  it "has the correct data-action for tracking when button_location is bottom and already_subscribed is true" do
    render_component({ base_path: "/the-current-page", button_location: "bottom", already_subscribed: true })

    assert_select ".gem-c-single-page-notification-button[data-action='Unsubscribe-button-bottom']"
  end

  it "has the correct data-action for tracking when button_location has an invalid value" do
    render_component({ base_path: "/the-current-page", button_location: "this is unacceptable" })

    assert_select ".gem-c-single-page-notification-button[data-action='Subscribe-button']"
  end
end
