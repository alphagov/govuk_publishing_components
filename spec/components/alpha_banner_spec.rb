require 'rails_helper'

describe "Alpha banner", type: :view do
  def component_name
    "alpha_banner"
  end

  it "does not error without a message" do
    render_component({})
    assert_select ".gem-c-phase-banner"
  end

  it "shows a custom message" do
    render_component(message: "custom message")
    assert_select ".gem-c-phase-banner span", text: "custom message"
  end

  it "allows custom message HTML" do
    render_component(message: "custom <strong>message</strong>")
    assert_select ".gem-c-phase-banner strong", text: "message"
  end
end
