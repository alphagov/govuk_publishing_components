require "rails_helper"

describe "Error Alert", type: :view do
  def component_name
    "error_alert"
  end

  it "shows the error message" do
    render_component(message: "Foo")
    assert_select ".gem-c-error-alert__message", text: "Foo"
  end

  it "allows an id to be specified" do
    render_component(message: "Foo", id: "test-id")
    assert_select "#test-id .gem-c-error-alert__message", text: "Foo"
  end

  it "allows a block to be given for description" do
    render_component(message: "Foo", description: "Bar")

    assert_select ".gem-c-error-summary__title", text: "Foo"
    assert_select ".gem-c-error-summary__body", text: "Bar"
  end
end
