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
    assert_select ".govuk-checkboxes__input[aria-controls]", false
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

  it "renders a checkbox with data attributes" do
    render_component(
      id: "with_tracking",
      name: "with_tracking",
      index: 4,
      item: {
        label: "Tracked",
        value: "tracked",
        data_attributes: {
          track_category: "checkboxClicked",
          track_label: "/news-and-communications",
          track_options: {
            dimension28: 2,
            dimension29: "Tracked"
          }
        }
      }
    )
    assert_select ".govuk-checkboxes__input[data-track-category='checkboxClicked']"
    assert_select ".govuk-checkboxes__input[data-track-label='/news-and-communications']"
    assert_select ".govuk-checkboxes__input[data-track-options='{\"dimension28\":2,\"dimension29\":\"Tracked\"}']"
  end

  it "renders a checkbox with an id" do
    item = {
      label: "With id",
      value: "id",
    }

    render_component(item: item)
    assert_select ".govuk-checkboxes__input"

    render_component(item: item, id: "myid")
    assert_select ".govuk-checkboxes__input#myid"

    render_component(item: item, id: "myid", index: 10)
    assert_select ".govuk-checkboxes__input#myid-10"
  end
end
