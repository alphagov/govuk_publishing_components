require 'rails_helper'

describe "Select", type: :view do
  def component_name
    "select"
  end

  it "does not render anything if no data is passed" do
    assert_empty render_component({})
  end

  it "does not render if items are passed but no id is passed" do
    assert_empty render_component(label: 'My label',
        options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        }
      ])
  end

  it "does not render if items are passed but no label is passed" do
    assert_empty render_component(id: 'mydropdown',
        options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        }
      ])
  end


  it "does not render if no items are passed" do
    assert_empty render_component(id: 'mydropdown', label: "My label", options: [])
  end

  it "renders a select box with one item" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      options: [
        {
          value: "government-gateway",
          text: "Use Government Gateway"
        }
      ]
    )

    assert_select "select[name=mydropdown]"
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
          text: "Big"
        },
        {
          value: "medium",
          text: "Medium"
        },
        {
          value: "small",
          text: "Small"
        }
      ]
    )

    assert_select ".govuk-select option[value=big]"
    assert_select ".govuk-select option[value=small]"
    assert_select ".govuk-select option[value=medium]"
  end

  it "renders a select a preselected item" do
    render_component(
      id: "mydropdown",
      label: "My dropdown",
      options: [
        {
          value: "big",
          text: "Big"
        },
        {
          value: "medium",
          text: "Medium",
          selected: true
        },
        {
          value: "small",
          text: "Small"
        }
      ]
    )

    assert_select ".govuk-select option[value=medium][selected]"
  end
end
