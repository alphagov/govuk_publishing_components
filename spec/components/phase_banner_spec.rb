require 'rails_helper'

describe "Phase banner", type: :view do
  def component_name
    "phase_banner"
  end

  it "errors without a phase" do
    expect {
      render_component({})
    }.to raise_error("The phase banner component expects a `phase` (`beta` or `alpha`), nil given")
  end

  it "does not error without a message" do
    render_component(phase: "alpha")

    assert_select ".gem-c-phase-banner"
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

    assert_select ".govuk-phase-banner__content__tag", text: "alpha"
  end

  it "shows the beta phase" do
    render_component(phase: "beta")

    assert_select ".govuk-phase-banner__content__tag", text: "beta"
  end

  it "shows the app name" do
    render_component(app_name: "Skittles Maker", phase: "beta")

    assert_select ".govuk-phase-banner__content__app-name", text: "Skittles Maker"
    assert_select ".govuk-phase-banner__content__tag", text: "beta"
  end
end
