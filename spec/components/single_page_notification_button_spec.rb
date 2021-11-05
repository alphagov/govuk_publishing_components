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
    render_component({ base_path: "/the-current-page", data_attributes: { action: "kaboom!" } })
    assert_select ".gem-c-single-page-notification-button[data-action='kaboom!']"
  end

  it "sets a default bottom margin" do
    render_component({ base_path: "/the-current-page" })
    assert_select '.gem-c-single-page-notification-button.govuk-\!-margin-bottom-3'
  end

  it "adds bottom margin if margin_bottom is specified" do
    render_component({ base_path: "/the-current-page", margin_bottom: 9 })
    assert_select '.gem-c-single-page-notification-button.govuk-\!-margin-bottom-9'
  end
end
