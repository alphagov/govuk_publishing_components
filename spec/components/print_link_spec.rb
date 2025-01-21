require "rails_helper"

describe "Print link", type: :view do
  def component_name
    "print_link"
  end

  it "renders with default text no data is given" do
    render_component({})

    assert_select ".gem-c-print-link"
    assert_select ".gem-c-print-link.govuk-\\!-margin-top-3"
    assert_select ".gem-c-print-link.govuk-\\!-margin-bottom-3"
    assert_select(
      "button.gem-c-print-link__button[data-module='print-link']",
      text: "Print this page",
    )
  end

  it "renders with alternative text when given" do
    render_component({
      text: "Print this manual",
    })

    assert_select ".gem-c-print-link"
    assert_select(
      "button.gem-c-print-link__button",
      text: "Print this manual",
    )
  end

  it "renders with alternative href as an anchor link" do
    render_component({
      href: "/print",
    })

    assert_select ".gem-c-print-link"
    assert_select(
      'a.gem-c-print-link__link[href="/print"][data-module="button"]',
      text: "Print this page",
    )
  end

  it "renders with custom margin" do
    render_component({
      margin_top: 0,
      margin_bottom: 4,
    })

    assert_select ".gem-c-print-link"
    assert_select ".gem-c-print-link.govuk-\\!-margin-top-0"
    assert_select ".gem-c-print-link.govuk-\\!-margin-bottom-4"
    assert_select(
      "button.gem-c-print-link__button",
      text: "Print this page",
    )
  end

  it "displays child data attributes" do
    render_component({
      child_data_attributes: {
        snow: "patrol",
      },
    })

    assert_select ".gem-c-print-link button[data-snow='patrol']"
  end

  it "accepts an additional passed data module when rendering as a button" do
    render_component({
      child_data_attributes: {
        module: "ga4-link-tracker",
      },
    })

    assert_select ".gem-c-print-link button[data-module='ga4-link-tracker print-link']"
  end

  it "accepts an additional passed data module when rendering as a link" do
    render_component({
      href: "/print",
      child_data_attributes: {
        module: "ga4-link-tracker",
      },
    })

    assert_select ".gem-c-print-link a[data-module='ga4-link-tracker button']"
  end
end
