require 'rails_helper'

describe "Checkboxes", type: :view do
  def component_name
    "checkboxes"
  end

  it "renders checkboxes" do
    render_component(
      id: "favourite-colour",
      name: "favourite_colour",
      heading: "What is your favourite colour?",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select "label[for='favourite-colour-0']", text: "Red"
    assert_select "label[for='favourite-colour-1']", text: "Green"
    assert_select "label[for='favourite-colour-2']", text: "Blue"
    assert_select "legend", text: "What is your favourite colour?"
    assert_select "legend h1", false
  end

  it "renders checkboxes with the legend as the page heading" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      is_page_heading: true,
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select "legend h1", "What is your favourite skittle?"
  end

  it "renders checkboxes with custom hint text" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      hint_text: "Taste the rainbow",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select(".govuk-hint", text: "Taste the rainbow")
  end

  it "renders checkboxes with hint text for checkbox item" do
    render_component(
      id: "nationality",
      name: "nationality",
      heading: "What is your nationality?",
      hint_text: "If you have dual nationality, select all options that are relevant to you.",
      items: [
        { label: "British", value: "british", hint: "including English, Scottish, Welsh and Northern Irish" },
        { label: "Irish", value: "irish" },
        { label: "Other", value: "other" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select "label[for='nationality-0']", text: "British"
    assert_select "label[for='nationality-1']", text: "Irish"
    assert_select "label[for='nationality-2']", text: "Other"
    assert_select("#nationality-0-item-hint", text: "including English, Scottish, Welsh and Northern Irish")
  end

  it "renders checkboxes with error message" do
    render_component(
      id: "nationality",
      name: "nationality",
      heading: "What is your nationality?",
      error: "Select if you are British, Irish or a citizen of a different country",
      hint_text: "If you have dual nationality, select all options that are relevant to you.",
      items: [
        { label: "British", value: "british", hint: "including English, Scottish, Welsh and Northern Irish" },
        { label: "Irish", value: "irish" },
        { label: "Other", value: "other" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select("#nationality-error", text: "Select if you are British, Irish or a citizen of a different country")
  end

  it "renders checkboxes with conditional reveal" do
    render_component(
      id: "nationality",
      name: "nationality",
      heading: "What is your nationality?",
      hint_text: "If you have dual nationality, select all options that are relevant to you.",
      items: [
        { label: "British", value: "british", conditional: "including English, Scottish, Welsh and Northern Irish" },
        { label: "Irish", value: "irish" },
        { label: "Other", value: "other", conditional: "Sorry this is so vague" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select("#nationality-0-conditional-0", text: "including English, Scottish, Welsh and Northern Irish")
    assert_select("#nationality-2-conditional-2", text: "Sorry this is so vague")
  end

  it "renders checkboxes with preselected items" do
    render_component(
      id: "nationality",
      name: "nationality",
      heading: "What is your nationality?",
      hint_text: "If you have dual nationality, select all options that are relevant to you.",
      items: [
        { label: "British", value: "british", checked: true },
        { label: "Irish", value: "irish" },
        { label: "Other", value: "other" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select ".govuk-checkboxes__input[checked]", value: "british"
  end

  it "renders checkboxes with nested items" do
    render_component(
      id: "favourite_colour_nested",
      name: "favourite_colour_nested",
      heading: "What is your favourite colour?",
      items: [
        {
          label: "Red",
          value: "red",
          items: [
            { label: "Light Red", value: "light_red" },
            { label: "Dark Red", value: "dark_red" }
          ]
        },
        { label: "Blue", value: "blue" },
        { label: "Other", value: "other" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select ".govuk-checkboxes.govuk-checkboxes--nested"
    assert_select ".govuk-checkboxes.govuk-checkboxes--nested input[value=light_red]"
  end
end
