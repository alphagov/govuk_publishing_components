require "rails_helper"

describe "Phase banner", type: :view do
  def component_name
    "phase_banner"
  end

  it "shows a custom message" do
    render_component(phase: "alpha", message: "custom message")

    assert_select ".gem-c-phase-banner .govuk-phase-banner__text", text: "custom message"
  end

  it "allows custom message HTML" do
    render_component(phase: "beta", message: "custom <strong>message</strong>".html_safe)

    assert_select ".gem-c-phase-banner .govuk-phase-banner__text strong", text: "message"
  end

  it "shows the alpha phase" do
    render_component(phase: "alpha")

    assert_select ".govuk-phase-banner__content__tag", text: "Alpha"
  end

  it "shows the beta phase" do
    render_component(phase: "beta")

    assert_select ".govuk-phase-banner__content__tag", text: "Beta"
  end

  it "shows the app name" do
    render_component(app_name: "Skittles Maker", phase: "beta")

    assert_select ".govuk-phase-banner__content__app-name", text: "Skittles Maker"
    assert_select ".govuk-phase-banner__content__tag", text: "Beta"
  end

  it "correctly uses inverse mode " do
    render_component(phase: "beta", inverse: true)
    assert_select ".gem-c-phase-banner--inverse"
  end

  it "renders banner with ga4 attributes" do
    render_component(phase: "beta")
    assert_select ".gem-c-phase-banner[data-ga4-phase-banner=beta]"
    assert_select ".gem-c-phase-banner[data-module=ga4-link-tracker]"
    assert_select ".gem-c-phase-banner[data-ga4-track-links-only]"
    assert_select ".gem-c-phase-banner[data-ga4-set-indexes]"
    assert_select ".gem-c-phase-banner[data-ga4-link='{\"event_name\":\"navigation\",\"type\":\"phase banner\",\"section\":\"This part of GOV.UK is being rebuilt – find out what beta means\"}']"
  end

  it "renders banner without ga4 attributes" do
    render_component(phase: "beta", disable_ga4: true)
    assert_select ".gem-c-phase-banner[data-ga4-phase-banner]", false
    assert_select ".gem-c-phase-banner[data-module=ga4-link-tracker]", false
    assert_select ".gem-c-phase-banner[data-ga4-track-links-only]", false
    assert_select ".gem-c-phase-banner[data-ga4-set-indexes]", false
    assert_select ".gem-c-phase-banner[data-ga4-link]", false
  end
end
