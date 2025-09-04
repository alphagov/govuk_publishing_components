require "rails_helper"

describe "Cookie banner", type: :view do
  def component_name
    "cookie_banner"
  end

  it "renders with default values" do
    render_component({})
    assert_select '.gem-c-cookie-banner[id="global-cookie-message"][data-module="cookie-banner"]'
    assert_select ".govuk-cookie-banner__heading", text: "Cookies on GOV.UK"
    assert_select ".govuk-cookie-banner__content p:nth-child(1)", text: "We use some essential cookies to make this website work."
    assert_select ".govuk-cookie-banner__content p:nth-child(2)", text: "We’d like to set additional cookies to understand how you use GOV.UK, remember your settings and improve government services."
    assert_select ".govuk-cookie-banner__content p:nth-child(3)", text: "We also use cookies set by other sites to help us deliver content from their services."
    assert_select 'button[data-hide-cookie-banner="true"]'
  end

  it "renders a button for accepting cookies" do
    render_component({})
    assert_select ".govuk-button-group .gem-c-button", text: "Accept additional cookies"
  end

  it "renders a button for rejecting cookies" do
    render_component({})
    assert_select ".govuk-button-group .gem-c-button", text: "Reject additional cookies"
  end

  it "renders a link for viewing cookie settings" do
    render_component({})
    assert_select ".govuk-button-group .govuk-link", text: "View cookies"
  end

  it "renders a confirmation message" do
    render_component({})
    assert_select ".gem-c-cookie-banner__confirmation-message", text: /You can change your cookie settings at any time./
  end

  it "renders a link to the settings page within the confirmation message" do
    render_component({})
    assert_select ".gem-c-cookie-banner__confirmation-message a", text: "change your cookie settings"
  end

  it "renders a hide link within the confirmation banner" do
    render_component({})

    assert_select ".govuk-button-group .gem-c-cookie-banner__hide-button", text: "Hide cookie message"
    assert_select '.gem-c-cookie-banner__hide-button[data-module="ga4-event-tracker"]'
  end

  it "renders with custom content" do
    render_component(
      title: "Can we store analytics cookies on your device?",
      text: sanitize("This is some custom text with a link to the <a href='/cookies' class='govuk-link'>cookies page</a>"),
      confirmation_message: "You’ve accepted all cookies.",
    )
    assert_select ".govuk-cookie-banner__heading.govuk-heading-m", text: "Can we store analytics cookies on your device?"
    assert_select ".gem-c-cookie-banner__content", text: "This is some custom text with a link to the cookies page"
    assert_select ".govuk-link[href='/cookies']", text: "cookies page"
    assert_select ".gem-c-cookie-banner__confirmation-message", text: /You’ve accepted all cookies./
  end

  it "renders with multi paragraph content" do
    render_component(
      title: "Can we store analytics cookies on your device?",
      text: ["Paragraph 1", "Paragraph 2"],
      confirmation_message: "You’ve accepted all cookies.",
    )
    assert_select "p.govuk-body", text: "Paragraph 1"
    assert_select "p.govuk-body", text: "Paragraph 2"
  end

  it "renders with a custom preferences page link" do
    render_component(cookie_preferences_href: "/cookies")
    assert_select ".govuk-button-group a[href='/cookies']", text: "View cookies"

    # Check that the confirmation message also includes the custom URL
    assert_select ".gem-c-cookie-banner__confirmation-message a[href='/cookies']", text: "change your cookie settings"
  end

  it "renders with GA4 attributes" do
    render_component({})
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-cookie-banner]"
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-module=ga4-link-tracker]"
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-track-links-only]"
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-set-indexes]"
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"cookie banner\",\"section\":\"You have accepted additional cookies\"}']"

    assert_select ".gem-c-cookie-banner__hide-button[data-module='ga4-event-tracker']"
    assert_select ".gem-c-cookie-banner__hide-button[data-ga4-event='{\"event_name\":\"select_content\",\"type\":\"cookie banner\",\"action\":\"closed\",\"section\":\"You have accepted additional cookies\"}']"
  end

  it "renders without GA4 attributes when disable_ga4 is true" do
    render_component({ disable_ga4: true })
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-cookie-banner]", false
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-module]", false
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-track-links-only]", false
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-set-indexes]", false
    assert_select ".gem-c-cookie-banner__confirmation-message--accepted[data-ga4-link]", false

    assert_select ".gem-c-cookie-banner__hide-button[data-module='ga4-event-tracker']", false
    assert_select ".gem-c-cookie-banner__hide-button[data-ga4-event]", false
  end
end
