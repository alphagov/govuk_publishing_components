require "rails_helper"

describe "Print link", type: :view do
  def component_name
    "print_link"
  end

  it "renders with default text when no data is given" do
    render_component({})

    assert_select ".gem-c-button__outline.gem-c-button__outline--print"
    assert_select ".gem-c-button__outline.gem-c-button__outline--print.govuk-\\!-margin-bottom-0"
    assert_select(
      "button.gem-c-button__outline.gem-c-button__outline--print[data-module='print-link']",
      text: "Print this page",
    )
  end

  it "renders with alternative text when given" do
    render_component({
      text: "Print this manual",
    })

    assert_select ".gem-c-button__outline.gem-c-button__outline--print"
    assert_select(
      "button.gem-c-button__outline.gem-c-button__outline--print",
      text: "Print this manual",
    )
  end

  it "renders with alternative href as an anchor link" do
    render_component({
      href: "/print",
    })

    assert_select ".gem-c-button__outline.gem-c-button__outline--print"
    assert_select(
      'a.gem-c-button__outline.gem-c-button__outline--print[href="/print"][data-module="govuk-button button"]',
      text: "Print this page",
    )
  end

  it "displays child data attributes" do
    render_component({
      child_data_attributes: {
        snow: "patrol",
      },
    })

    assert_select "button.gem-c-button__outline.gem-c-button__outline--print[data-snow='patrol']"
  end

  it "accepts an additional passed data module when rendering as a button" do
    render_component({
      child_data_attributes: {
        module: "ga4-link-tracker",
      },
    })

    assert_select "button.gem-c-button__outline.gem-c-button__outline--print[data-module='ga4-link-tracker print-link']"
  end

  it "accepts an additional passed data module when rendering as a link" do
    render_component({
      href: "/print",
      child_data_attributes: {
        module: "ga4-link-tracker",
      },
    })

    assert_select "a.gem-c-button__outline.gem-c-button__outline--print[data-module='govuk-button ga4-link-tracker button']"
  end
end
