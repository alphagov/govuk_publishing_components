require "rails_helper"

describe "Big number", type: :view do
  def component_name
    "big_number"
  end

  it "renders nothing when nothing is passed to it" do
    assert_empty render_component({})
    assert_empty render_component(number: false)
  end

  it "renders a number value" do
    render_component(number: 500)

    assert_select ".gem-c-big-number", count: 1
  end

  it "renders a number label if a label attribute is present" do
    render_component({
      number: 500,
      label: "test runs",
    })

    assert_select ".gem-c-big-number__label", text: "test runs"
  end

  it "wraps a number item in a link if a href attribute is present" do
    render_component({
      number: 500,
      label: "test runs",
      href: "/tests",
    })

    assert_select "a.gem-c-big-number__link", count: 1, href: "/tests"
  end

  it "includes the number decorator class link if a href attribute is present but a label is not present" do
    render_component({
      number: 500,
      href: "/tests",
    })

    assert_select ".gem-c-big-number__value.gem-c-big-number__value--decorated"
  end

  it "adds data attributes to the rendered link if a href attribute is present" do
    render_component({
      number: 500,
      href: "/tests",
      nested_data_attributes: {
        my_cool_attribute: "cool",
      },
    })

    assert_select ".gem-c-big-number__link[data-my-cool-attribute='cool']"
  end

  it "adds aria attributes to the big number if that attribute is present" do
    render_component({
      number: 500,
      href: "/tests",
      aria: {
        hidden: true,
        live: "polite",
      },
    })

    assert_select ".gem-c-big-number[aria-hidden='true']"
    assert_select ".gem-c-big-number[aria-live='polite']"
  end

  it "adds data attributes to the span containing the number value if a href attribute is not present" do
    render_component({
      number: 500,
      nested_data_attributes: {
        my_cool_attribute: "cool",
      },
    })

    assert_select ".gem-c-big-number__value[data-my-cool-attribute='cool']"
  end

  it "sets a custom margin bottom if the margin_bottom attribute is present" do
    render_component({
      number: 500,
      margin_bottom: 5,
    })

    assert_select '.gem-c-big-number.govuk-\!-margin-bottom-5'
  end

  # The space mentioned in the below test is to handle screen readers printing dictations without a space between the number and the label
  # We don't want this to get removed accidentally, hence the following test
  it "ensures that a visually hidden space is included for screen readers when a label is present" do
    render_component({
      number: 500,
      label: "test runs",
    })

    assert_select ".govuk-visually-hidden", count: 1
  end

  it "converts a plus into a sub element if a number attribute is passed that ends with a plus symbol" do
    render_component({
      number: "400+",
      label: "test runs",
    })

    assert_select ".gem-c-big-number__suffix", count: 1
  end
end
