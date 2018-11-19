require 'rails_helper'

describe "Checkbox", type: :view do
  def component_name
    "checkbox"
  end

  it "renders checkbox" do
    render_component(
      id: "favourite_colour_default",
      name: "favourite_colour_default",
      index: 1,
      item: {
        label: "Red",
        value: "red_colour"
      }
    )
    assert_select ".govuk-checkboxes__item"
    assert_select "label[for='favourite_colour_default-1']", text: "Red"
    assert_select "input[name='favourite_colour_default']", value: "red_colour"
  end

  it "renders checkbox with custom hint text" do
    render_component(
      id: "favourite_colour_checkbox_with_hint",
      name: "favourite_colour_checkbox_with_hint",
      index: 2,
      item: {
        label: "Red",
        value: "red_colour",
        hint: "This is the colour red."
      }
    )
    assert_select ".govuk-checkboxes__item"
    assert_select(".govuk-hint.govuk-checkboxes__hint", text: "This is the colour red.")
  end

  it "renders preselected checkbox" do
    render_component(
      id: "favourite_colour_checkbox_with_checked",
      name: "favourite_colour_checkbox_with_checked",
      index: 3,
      item: {
        label: "Red",
        value: "red_colour",
        checked: true
      }
    )
    assert_select ".govuk-checkboxes__item"
    assert_select "input[checked]", value: "red_colour"
  end
end
