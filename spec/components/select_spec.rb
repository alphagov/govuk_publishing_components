require "rails_helper"

describe "Select", type: :view do
  def component_name
    "select"
  end

  it "does not render anything if no data is passed" do
    assert_empty render_component({})
  end

  it "does not render if items are passed but no id is passed" do
    assert_empty render_component(
      label: "My label",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )
  end

  it "does not render if items are passed but no label is passed" do
    assert_empty render_component(
      id: "mydropdown",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )
  end

  it "does not render if no items are passed" do
    assert_empty render_component(id: "mydropdown", label: "My label", options: [])
  end

  it "renders a select box with one item" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select "select[name=mydropdown][id=mydropdown]"
    assert_select ".govuk-label[for=mydropdown]", text: "My dropdown"
    assert_select ".govuk-select option[value=government-gateway]"
  end

  it "renders a select box with multiple items" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      options: [
        {
          value: "big",
          text: "Big",
        },
        {
          value: "medium",
          text: "Medium",
        },
        {
          value: "small",
          text: "Small",
        },
      ],
    )

    assert_select ".govuk-select option[value=big]"
    assert_select ".govuk-select option[value=small]"
    assert_select ".govuk-select option[value=medium]"
  end

  it "can accept an id and a name" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      name: "somethingelse",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select "select[name=somethingelse][id=mydropdown]"
  end

  it "renders a select a preselected item" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      options: [
        {
          value: "big",
          text: "Big",
        },
        {
          value: "medium",
          text: "Medium",
          selected: true,
        },
        {
          value: "small",
          text: "Small",
        },
      ],
    )

    assert_select ".govuk-select option[value=medium][selected]"
  end

  it "renders a select with data attributes" do
    render_component(
      id: "mydropdown",
      label: "attributes",
      options: [
        {
          value: 1,
          text: "One",
          data_attributes: {
            an_attribute: "some_value",
          },
        },
      ],
    )

    assert_select ".govuk-select option[value=1][data-an-attribute='some_value']"
  end

  it "renders a select box with a hint" do
    render_component(
      id: "mydropdown",
      label: "attributes",
      hint: "this is a hint",
      hint_id: "hint_id",
      options: [
        {
          value: 1,
          text: "One",
        },
      ],
    )

    assert_select ".gem-c-select .govuk-hint", "this is a hint"
    assert_select ".gem-c-select .govuk-select[aria-describedby='hint_id']"
  end

  it "renders a select box in an error state" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      error_message: "Please choose an option",
      error_id: "error_id",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select ".govuk-form-group.gem-c-select.govuk-form-group--error"
    assert_select ".gem-c-error-message.govuk-error-message", text: "Error: Please choose an option"
    assert_select ".govuk-select.govuk-select--error[aria-describedby=error_id]"
  end

  it "applies aria-describedby if an error is is given" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      error_id: "error_id",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select ".gem-c-error-message.govuk-error-message", false
    assert_select ".govuk-select.govuk-select--error[aria-describedby=error_id]"
  end

  it "applies aria-describedby if a hint and an error are present" do
    render_component(
      id: "mydropdown",
      label: "attributes",
      hint: "this is a hint",
      hint_id: "hint_id",
      error_id: "error_id",
      options: [
        {
          value: 1,
          text: "One",
        },
      ],
    )

    assert_select ".gem-c-select .govuk-hint", "this is a hint"
    assert_select ".gem-c-select .govuk-select[aria-describedby='error_id hint_id']"
  end

  it "renders a select box full width" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      full_width: true,
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select "select[name=mydropdown]"
    assert_select ".gem-c-select .gem-c-select__select--full-width"
  end

  it "renders a select box with a custom label size" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      heading_size: "s",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway",
        },
      ],
    )

    assert_select ".govuk-label.govuk-label--s"
  end

  it "renders select with a label inside a heading" do
    render_component(
      id: "colour",
      label: "What is you favourite colour?",
      is_page_heading: true,
      options: [
        { text: "Red", value: "red" },
        { text: "Blue", value: "blue" },
      ],
    )

    assert_select "select[name=colour]"
    assert_select ".gem-c-select h1.gem-c-title__text label.govuk-label"
  end
end
