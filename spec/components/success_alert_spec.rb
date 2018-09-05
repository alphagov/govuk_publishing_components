require "rails_helper"

describe "Success Alert", type: :view do
  def component_name
    "success_alert"
  end

  it "shows the error message" do
    render_component(message: "Foo")
    assert_select ".gem-c-success-alert__message", text: "Foo"
  end

  it "allows a block to be given for description" do
    render_component(message: "Foo", description: "Bar")

    assert_select ".gem-c-success-summary__title", text: "Foo"
    assert_select ".gem-c-success-summary__body", text: "Bar"
  end
end
