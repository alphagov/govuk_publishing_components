require "rails_helper"

describe "Action link", type: :view do
  def component_name
    "action_link"
  end

  it "renders nothing without text" do
    assert_empty render_component(href: "/coronavirus")
  end

  it "applies default margin to the component" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
    )
    assert_select '.gem-c-action-link.govuk-\!-margin-bottom-0'
  end

  it "applies margin to the component" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      margin_bottom: 6,
    )
    assert_select '.gem-c-action-link.govuk-\!-margin-bottom-6'
  end

  it "renders simple icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      simple: true,
    )
    assert_select ".gem-c-action-link--simple"
  end

  it "renders inverse version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      inverse: true,
    )
    assert_select ".gem-c-action-link--inverse"
  end

  it "renders large version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      large: true,
    )
    assert_select ".gem-c-action-link.gem-c-action-link--large"
  end
end
