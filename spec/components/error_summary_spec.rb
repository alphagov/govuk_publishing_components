require "rails_helper"

describe "Error summary", type: :view do
  def component_name
    "error_summary"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders error items when no title is set" do
    render_component(
      id: "error-summary-id",
      items: [
        {
          text: "Descriptive link to the question with an error",
          href: "#example-error-1",
        },
      ],
    )

    assert_select ".gem-c-error-summary[id='error-summary-id']"
    assert_select(
      "ul li a:first-of-type[href='#example-error-1']",
      text: "Descriptive link to the question with an error",
    )
  end

  it "renders an error summary with title set correctly" do
    render_component(
      id: "error-summary-id",
      title: "Message to alert the user to a problem goes here",
    )

    assert_select ".gem-c-error-summary[id='error-summary-id']"
    assert_select ".govuk-error-summary__title", text: "Message to alert the user to a problem goes here"
    assert_select ".govuk-error-summary__body p", count: 0
    assert_select ".govuk-error-summary__list", count: 0
  end

  it "renders the component wrapped in a div with role alert" do
    render_component(
      id: "error-summary-id",
      title: "Message to alert the user to a problem goes here",
    )

    assert_select ".gem-c-error-summary.govuk-error-summary [role='alert']"
  end

  it "renders an error summary with items links" do
    render_component(
      title: "Message to alert the user to a problem goes here",
      description: "Optional description of the errors and how to correct them",
      items: [
        {
          text: "Descriptive link to the question with an error 1",
          href: "#example-error-1",
          data_attributes: { gtm: "tracking-1" },
        },
        {
          text: "Descriptive link to the question with an error 2",
          href: "#example-error-2",
          target: "_blank",
          data_attributes: { gtm: "tracking-2" },
        },
        {
          text: "Description for error 3 with no link",
          data_attributes: { gtm: "tracking-3" },
        },
      ],
    )

    assert_select ".govuk-error-summary__title", text: "Message to alert the user to a problem goes here"
    assert_select ".govuk-error-summary__body p", text: "Optional description of the errors and how to correct them"

    assert_select(
      "ul li a:first-of-type[href='#example-error-1'][data-gtm='tracking-1']",
      text: "Descriptive link to the question with an error 1",
    )
    assert_select(
      "ul li a:nth-of-type(1)[href='#example-error-2'][data-gtm='tracking-2']",
      text: "Descriptive link to the question with an error 2",
    )
    assert_select(
      "ul li:last-of-type span[data-gtm='tracking-3']",
      text: "Description for error 3 with no link",
    )
  end
end
