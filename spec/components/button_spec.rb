require 'rails_helper'

describe "Button", type: :view do
  def component_name
    "button"
  end

  it "no error if no parameters passed in" do
    render_component({})
    assert_select ".govuk-button"
  end

  it "renders the correct defaults" do
    render_component(text: "Submit")
    assert_select ".govuk-button[type=submit]", text: "Submit"
    assert_select ".govuk-button--start", false
    assert_select ".gem-c-button__info-text", false
  end

  it "renders text correctly" do
    render_component(text: "Submit")
    assert_select ".govuk-button", text: "Submit"
  end

  it "renders start now button" do
    render_component(text: "Start now", href: "#", start: true)
    assert_select ".govuk-button[href='#']", text: "Start now"
    assert_select ".govuk-button--start"
  end

  it "renders secondary button" do
    render_component(text: "Secondary", href: "#", secondary: true)
    assert_select ".gem-c-button--secondary[href='#']", text: "Secondary"
    assert_select ".gem-c-button--secondary"
  end

  it "renders secondary quiet button" do
    render_component(text: "Secondary quiet", href: "#", secondary_quiet: true)
    assert_select ".gem-c-button--secondary-quiet[href='#']", text: "Secondary quiet"
    assert_select ".gem-c-button--secondary-quiet"
  end

  it "renders destructive button" do
    render_component(text: "Warning", href: "#", destructive: true)
    assert_select ".gem-c-button--destructive[href='#']", text: "Warning"
    assert_select ".gem-c-button--destructive"
  end

  it "renders an anchor if href set" do
    render_component(text: "Start now", href: "#")
    assert_select "a.govuk-button"
    assert_select "button.govuk-button", false
  end

  it "renders a button if href not set" do
    render_component(text: "Start now")
    assert_select "button.govuk-button"
    assert_select "a.govuk-button", false
  end

  it "renders info text" do
    render_component(text: "Start now", info_text: "Information text")
    assert_select ".govuk-button", text: "Start now"
    assert_select ".gem-c-button__info-text", text: "Information text"
  end

  it "renders rel attribute correctly" do
    render_component(text: "Start now", rel: "nofollow")
    assert_select ".govuk-button[rel='nofollow']", text: "Start now"

    render_component(text: "Start now", rel: "nofollow preload")
    assert_select ".govuk-button[rel='nofollow preload']", text: "Start now"
  end

  it "renders target attribute correctly" do
    render_component(text: "Start now", href: "#", target: "_blank")
    assert_select "a.govuk-button[target='_blank']"
    assert_select "button.govuk-button", false
  end

  it "renders margin bottom class correctly" do
    render_component(text: "Submit")
    assert_select ".govuk-button", text: "Submit"
    assert_select ".gem-c-button--bottom-margin", count: 0

    render_component(text: "Submit", margin_bottom: true)
    assert_select ".govuk-button.gem-c-button--bottom-margin", text: "Submit"
  end

  it "renders data attributes correctly for buttons" do
    render_component(
      text: "Submit",
      data_attributes: {
        "module": "cross-domain-tracking",
        "tracking-code": "GA-123ABC",
        "tracking-name": "transactionTracker"
      }
    )

    assert_select "button.govuk-button[data-module='cross-domain-tracking']"
    assert_select "button.govuk-button[data-tracking-code='GA-123ABC']"
    assert_select "button.govuk-button[data-tracking-name='transactionTracker']"
  end

  it "renders data attributes correctly for links" do
    render_component(
      text: "Submit",
      href: "/foo",
      data_attributes: {
        "module": "cross-domain-tracking",
        "tracking-code": "GA-123ABC",
        "tracking-name": "transactionTracker"
      }
    )

    assert_select "a.govuk-button[data-module='cross-domain-tracking']"
    assert_select "a.govuk-button[data-tracking-code='GA-123ABC']"
    assert_select "a.govuk-button[data-tracking-name='transactionTracker']"
  end

  it "renders a title attribute" do
    render_component(text: "Submit", title: "Do it!")

    assert_select ".govuk-button[title='Do it!']"
  end
end
