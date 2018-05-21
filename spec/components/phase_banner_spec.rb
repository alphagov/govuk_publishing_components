require 'rails_helper'

describe "Phase banner", type: :view do
  def component_name
    "phase_banner"
  end

  it "does not error without a message" do
    render_component(phase: "alpha")

    assert_select ".gem-c-phase-banner"
  end

  it "shows a custom message" do
    render_component(phase: "alpha", message: "custom message")

    assert_select ".gem-c-phase-banner span", text: "custom message"
  end

  it "allows custom message HTML" do
    render_component(phase: "beta", message: "custom <strong>message</strong>".html_safe)

    assert_select ".gem-c-phase-banner strong", text: "message"
  end

  it "shows the alpha phase" do
    render_component(phase: "alpha")

    assert_select ".phase-tag", text: "alpha"
  end

  it "shows the beta phase" do
    render_component(phase: "beta")

    assert_select ".phase-tag", text: "beta"
  end
end
