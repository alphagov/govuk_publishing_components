require "rails_helper"

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
    assert_select "[data-ga4-attributes]", false
  end

  it "renders text correctly" do
    render_component(text: "Submit")
    assert_select ".govuk-button", text: "Submit"
  end

  it "renders with the correct types" do
    render_component(text: "Submit")
    assert_select ".govuk-button[type=submit]", text: "Submit"

    render_component(text: "Link", href: "#", type: "button")
    assert_select "a.govuk-button[data-module=\"govuk-button\"]", text: "Link"
    assert_select "a.govuk-button[type=submit]", false

    render_component(text: "Button", type: "button")
    assert_select ".govuk-button[type=button]"
  end

  it "renders with draggable=false if a href is included" do
    render_component(text: "Not draggable")
    assert_select "a.govuk-button[draggable=false]", false

    render_component(text: "Not draggable", href: "#")
    assert_select "a.govuk-button[draggable=false]"
  end

  it "renders start now button" do
    render_component(text: "Start now", href: "#", start: true)
    assert_select ".govuk-button[href='#'] span", text: /Start now/
    assert_select ".govuk-button--start"
    assert_select ".govuk-button--start[data-ga4-attributes='{\"event_name\":\"navigation\",\"type\":\"start button\"}']"
  end

  it "renders start now button with GA4 attributes disabled" do
    render_component(text: "Start now", href: "#", start: true, disable_ga4: true)
    assert_select ".govuk-button[href='#'] span", text: /Start now/
    assert_select ".govuk-button--start"
    assert_select ".govuk-button--start[data-ga4-attributes='{\"event_name\":\"navigation\",\"type\":\"start button\"}']", false
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

  it "renders secondary solid button" do
    render_component(text: "Secondary solid", href: "#", secondary_solid: true)
    assert_select ".govuk-button--secondary[href='#']", text: "Secondary solid"
    assert_select ".govuk-button--secondary"
  end

  it "renders destructive button" do
    render_component(text: "Warning", href: "#", destructive: true)
    assert_select ".govuk-button--warning[href='#']", text: "Warning"
    assert_select ".govuk-button--warning"
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

  it "renders info text and the relevant aria attributes " do
    render_component(text: "Start now", info_text: "Information text")
    assert_select ".govuk-button", text: "Start now"
    assert_select ".govuk-button[aria-labelledby]", count: 1
    assert_select ".gem-c-button__info-text[aria-hidden='true']", count: 1
  end

  it "renders info text with margin bottom" do
    render_component(text: "Start now", info_text: "Information text", margin_bottom: true)

    assert_select ".gem-c-button--bottom-margin", count: 0

    assert_select ".govuk-button", text: "Start now"
    assert_select ".gem-c-button__info-text.gem-c-button__info-text--bottom-margin", text: "Information text"
  end

  it "renders info text with variable margin bottom" do
    render_component(text: "Start now", info_text: "Information text", margin_bottom: 6)

    assert_select ".gem-c-button--bottom-margin", count: 0

    assert_select ".govuk-button", text: "Start now"
    assert_select '.gem-c-button__info-text.govuk-\!-margin-bottom-6', text: "Information text"
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

  it "renders a variable margin bottom correctly" do
    render_component(text: "Submit", margin_bottom: 6)
    assert_select '.govuk-button.govuk-\!-margin-bottom-6', text: "Submit"
  end

  it "renders data attributes correctly for buttons" do
    render_component(
      text: "Submit",
      data_attributes: {
        "module": "cross-domain-tracking",
        "tracking-code": "GA-123ABC",
        "tracking-name": "transactionTracker",
      },
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
        "tracking-name": "transactionTracker",
      },
    )

    assert_select "a.govuk-button[data-module='govuk-button cross-domain-tracking']"
    assert_select "a.govuk-button[data-tracking-code='GA-123ABC']"
    assert_select "a.govuk-button[data-tracking-name='transactionTracker']"
  end

  it "renders a title attribute" do
    render_component(text: "Submit", title: "Do it!")

    assert_select ".govuk-button[title='Do it!']"
  end

  it "renders an inline button" do
    render_component(text: "Button one", inline_layout: true)

    assert_select ".gem-c-button--inline", text: "Button one"
  end

  it "renders with a name and a value attribute when name and value are set" do
    render_component(text: "Button one", value: "this_value", name: "this_name")

    assert_select ".gem-c-button[name='this_name']", 1
    assert_select ".gem-c-button[value='this_value']", 1
  end

  it "renders without a name or a value attribute when only value is set" do
    render_component(text: "Button one", value: "this_value")

    assert_select ".gem-c-button[name]", 0
    assert_select ".gem-c-button[value]", 0
  end

  it "renders without a name or a value attribute when only name is set" do
    render_component(text: "Button one", name: "this_name")

    assert_select ".gem-c-button[name]", 0
    assert_select ".gem-c-button[value]", 0
  end

  it "renders without a name or a value attribute neither name or value is set" do
    render_component(text: "Button one")

    assert_select ".gem-c-button[name]", 0
    assert_select ".gem-c-button[value]", 0
  end

  it "renders with `js-` prefixed classes for interactive hooks" do
    render_component(text: "Button", classes: "js-selector-1 js-selector-2")

    assert_select ".gem-c-button.js-selector-1.js-selector-2"
  end

  it "raises exception is CSS classes are not prefixed with `js-`" do
    expect {
      render_component(text: "Button", classes: "my-class")
    }.to raise_error("Passed classes must be prefixed with `js-`")
  end

  it "renders with aria-label" do
    render_component(text: "Button", aria_label: "Button with custom label")

    assert_select '.gem-c-button[aria-label="Button with custom label"]'
  end

  it "renders with aria-controls" do
    render_component(text: "Button", aria_controls: "Testing aria-controls")

    assert_select '.gem-c-button[aria-controls="Testing aria-controls"]'
  end

  it "renders with aria-describedby" do
    render_component(text: "Button", aria_describedby: "Testing aria-describedby")

    assert_select '.gem-c-button[aria-describedby="Testing aria-describedby"]'
  end
end
