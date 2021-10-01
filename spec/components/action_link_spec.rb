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

  it "adds js- prefixed classes to the component" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      classes: "js-hook",
    )
    assert_select ".gem-c-action-link .gem-c-action-link__link.js-hook"
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

  it "renders blue icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      blue_arrow: true,
    )
    assert_select ".gem-c-action-link--blue-arrow"
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

  it "renders small icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      small_icon: true,
    )
    assert_select ".gem-c-action-link--small-icon"
  end

  it "renders transparent icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      transparent_icon: true,
    )
    assert_select ".gem-c-action-link--transparent-icon"
  end

  it "renders with a custom font size" do
    render_component(
      text: "Guidance for businesses",
      href: "/guidance-for-businesses",
      font_size: "l",
    )
    assert_select ".gem-c-action-link__link.govuk-heading-l"
  end

  it "renders NHS icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      nhs_icon: true,
    )
    assert_select ".gem-c-action-link--nhs"
  end

  it "renders light text version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      light_text: true,
    )
    assert_select ".gem-c-action-link--light-text"
  end

  it "has data attributes if data attributes are passed in" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      data: {
        testing: "hasDataAttribute",
      },
    )
    assert_select ".gem-c-action-link__link[data-testing='hasDataAttribute']"
  end
end
