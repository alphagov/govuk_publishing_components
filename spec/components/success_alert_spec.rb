require "rails_helper"

describe "Success Alert", type: :view do
  def component_name
    "success_alert"
  end

  it "shows the message" do
    render_component(message: "Foo")
    assert_select ".govuk-notification-banner__heading", text: "Foo"
  end

  it "allows a block to be given for description" do
    render_component(message: "Foo", description: raw("<p class=\"govuk-body\">Bar</p>"))

    assert_select ".govuk-notification-banner__heading", text: "Foo"
    assert_select ".govuk-notification-banner__content .govuk-body", text: "Bar"
  end

  it "allows the block to be given a custom component label id" do
    render_component(message: "Foo", title_id: "Bar")

    assert_select ".gem-c-success-alert", aria: { labelledby: "Bar" }
    assert_select ".govuk-notification-banner__title", id: "Bar"
  end

  it "applies a custom margin-bottom class when margin_bottom is specified" do
    render_component(message: "Foo", margin_bottom: 5)

    assert_select '.gem-c-success-alert.govuk-\!-margin-bottom-5'
  end
end
