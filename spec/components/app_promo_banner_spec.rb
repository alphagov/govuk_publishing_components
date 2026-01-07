require "rails_helper"

describe "App promo banner", type: :view do
  def component_name
    "app_promo_banner"
  end

  it "renders the component" do
    render_component({})

    assert_select ".gem-c-app-promo-banner[aria-label='GOV.UK app']"
    assert_select ".gem-c-app-promo-banner__close-button[data-module='ga4-event-tracker']"
    assert_select ".govuk-link[data-module='ga4-link-tracker']"
    assert_select ".govuk-link", text: "View on Google Play"
    assert_select ".govuk-link .govuk-visually-hidden", text: "on Google Play"
  end

  it "allows tracking to be disabled" do
    render_component(disable_ga4: true)

    assert_select ".gem-c-app-promo-banner"
    assert_select ".gem-c-app-promo-banner__close-button[data-module='ga4-event-tracker']", false
    assert_select ".govuk-link[data-module='ga4-link-tracker']", false
  end
end
