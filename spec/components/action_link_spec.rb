require "rails_helper"

describe "Action link", type: :view do
  def component_name
    "action_link"
  end

  it "renders nothing without a href" do
    assert_empty render_component(text: "Get more info")
  end

  it "renders nothing without text" do
    assert_empty render_component(href: "/coronavirus")
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

  it "renders simple icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      simple: true,
    )
    assert_select ".gem-c-action-link--simple"
  end

  it "renders dark icon version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      dark_icon: true,
    )
    assert_select ".gem-c-action-link--dark-icon"
  end

  it "renders light text version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      light_text: true,
    )
    assert_select ".gem-c-action-link--light-text"
  end

  it "renders compact version" do
    render_component(
      text: "Get more info",
      href: "/coronavirus",
      compact: true,
    )
    assert_select ".gem-c-action-link--compact"
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
