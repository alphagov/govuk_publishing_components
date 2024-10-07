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

  it "renders non wrapping text if nowrap text is passed through" do
    render_component(
      text: "Get more info",
      nowrap_text: "about COVID",
      href: "/coronavirus",
    )
    assert_select ".gem-c-action-link .gem-c-action-link__nowrap-text", text: "about COVID"
  end

  it "renders subtext" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      subtext: "because info is important",
    )
    assert_select ".gem-c-action-link.gem-c-action-link--with-subtext .gem-c-action-link__subtext", text: "because info is important"
  end

  it "shows subtext like on mobile" do
    render_component(
      text: "Get more info",
      subtext: "because info is important",
      mobile_subtext: true,
    )
    assert_select ".gem-c-action-link.gem-c-action-link--mobile-subtext"
  end

  it "can add a link to subtext" do
    render_component(
      text: "Get more info",
      href: "/main-href",
      subtext: "because info is important",
      subtext_href: "/subtext-href",
    )
    assert_select ".gem-c-action-link .gem-c-action-link__link[href='/main-href']"
    assert_select ".gem-c-action-link .gem-c-action-link__subtext .govuk-link[href='/subtext-href']"
  end

  it "renders simple icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      simple: true,
    )
    assert_select ".gem-c-action-link--simple"
  end

  it "renders simple light icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      simple_light: true,
    )
    assert_select ".gem-c-action-link--simple-light"
  end

  it "renders dark icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      dark_icon: true,
    )
    assert_select ".gem-c-action-link--dark-icon"
  end

  it "renders dark large icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      dark_large_icon: true,
    )
    assert_select ".gem-c-action-link--dark-large-icon"
  end

  it "renders inverse version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      inverse: true,
    )
    assert_select ".gem-c-action-link--inverse"
  end
end
