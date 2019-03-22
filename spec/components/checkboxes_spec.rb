require 'rails_helper'

describe "Checkboxes", type: :view do
  def component_name
    "checkboxes"
  end

  it "renders a single checkbox" do
    render_component(
      name: "favourite_colour",
      items: [
        { label: "Red", value: "red" },
      ]
    )
    assert_select ".gem-c-checkboxes.govuk-form-group"
    assert_select "fieldset", false
    assert_select ".govuk-label.govuk-checkboxes__label", text: "Red"
    assert_select ".govuk-hint", false
  end

  it "renders multiples checkboxes" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite colour?",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ]
    )
    assert_select "fieldset.govuk-fieldset"
    assert_select "legend", text: "What is your favourite colour?"
    assert_select "legend h1", false
    assert_select ".govuk-hint", text: "Select all that apply."
    assert_select ".govuk-checkboxes"
    assert_select ".govuk-label", text: "Red"
    assert_select ".govuk-label", text: "Green"
  end

  it "renders nothing if no heading is supplied" do
    render_component(
      name: "favourite_colour",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ]
    )
    assert_select "fieldset.govuk-fieldset", false
    assert_select "legend", false
    assert_select "legend h1", false
    assert_select ".govuk-hint", false
    assert_select ".govuk-checkboxes", false
  end

  it "shows a heading/legend if supplied with only one checkbox" do
    render_component(
      name: "favourite_colour",
      heading: "Favourite colour?",
      items: [
        { label: "Red", value: "red" },
      ]
    )
    assert_select ".govuk-fieldset__legend", text: "Favourite colour?"
  end

  it "renders a hidden heading/legend" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite colour?",
      visually_hide_heading: true,
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ]
    )
    assert_select ".govuk-fieldset__legend.gem-c-checkboxes__legend--hidden", text: "What is your favourite colour?"
  end

  it "renders checkboxes with a given id" do
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
    assert_select ".gem-c-checkboxes#favourite-colour"
    assert_select ".govuk-checkboxes__input#favourite-colour-0"
    assert_select ".govuk-checkboxes__label[for='favourite-colour-0']", text: "Red"
    assert_select ".govuk-checkboxes__input#favourite-colour-1"
    assert_select ".govuk-checkboxes__label[for='favourite-colour-1']", text: "Green"
    assert_select ".govuk-checkboxes__input#favourite-colour-2"
    assert_select ".govuk-checkboxes__label[for='favourite-colour-2']", text: "Blue"
    assert_select ".govuk-fieldset[aria-describedby='favourite-colour-hint']"
  end

  it "renders checkboxes with individual ids" do
    render_component(
      id: "favourite-colour",
      name: "favourite_colour",
      heading: "What is your favourite colour?",
      items: [
        { label: "Red", value: "red", id: "custom" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue", id: "also-custom" }
      ]
    )
    assert_select ".gem-c-checkboxes#favourite-colour"
    assert_select ".govuk-checkboxes__input#custom"
    assert_select ".govuk-checkboxes__label[for='custom']", text: "Red"
    assert_select ".govuk-checkboxes__input#favourite-colour-1"
    assert_select ".govuk-checkboxes__label[for='favourite-colour-1']", text: "Green"
    assert_select ".govuk-checkboxes__input#also-custom"
    assert_select ".govuk-checkboxes__label[for='also-custom']", text: "Blue"
  end

  it "renders checkboxes with a custom hint" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite skittle?",
      hint_text: "Choose carefully",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ]
    )
    assert_select ".govuk-hint", text: "Choose carefully"
  end

  it "renders checkboxes with no hint" do
    render_component(
      name: "favourite_colour",
      no_hint_text: true,
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ]
    )
    assert_select ".govuk-hint", false
    assert_select ".govuk-fieldset[aria-describedby]", false
  end

  it "does not render a hint or heading if there is only one checkbox" do
    render_component(
      name: "favourite_colour",
      items: [
        { label: "Red", value: "red" },
      ]
    )
    assert_select ".govuk-fieldset__legend", false
    assert_select ".govuk-hint", false
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

  it "renders checkboxes with aria-controls attributes" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite skittle?",
      hint_text: "Choose carefully",
      items: [
        { label: "Red", value: "red", controls: "js-live-results" },
        { label: "Green", value: "green", controls: "js-live-results2" },
      ]
    )
    assert_select ".govuk-checkboxes__input[data-controls='js-live-results']"
    assert_select ".govuk-checkboxes__input[data-controls='js-live-results2']"
  end

  it "renders a checkbox with data attributes" do
    render_component(
      name: "with_tracking",
      heading: "What is your favourite skittle?",
      items: [
        {
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
      ]
    )
    assert_select ".govuk-checkboxes__input[data-track-category='checkboxClicked']"
    assert_select ".govuk-checkboxes__input[data-track-label='/news-and-communications']"
    assert_select ".govuk-checkboxes__input[data-track-options='{\"dimension28\":2,\"dimension29\":\"Tracked\"}']"
  end

  it "renders checkboxes with both aria-controls and other data attributes" do
    render_component(
      name: "with_tracking",
      heading: "What is your favourite skittle?",
      items: [
        {
          label: "Tracked",
          value: "tracked",
          data_attributes: {
            track_category: "checkboxClicked",
            track_label: "/news-and-communications",
            track_options: {
              dimension28: 2,
              dimension29: "Tracked"
            }
          },
          controls: "js-live-results"
        }
      ]
    )
    assert_select ".govuk-checkboxes__input[data-track-category='checkboxClicked']"
    assert_select ".govuk-checkboxes__input[data-track-label='/news-and-communications']"
    assert_select ".govuk-checkboxes__input[data-track-options='{\"dimension28\":2,\"dimension29\":\"Tracked\"}']"
    assert_select ".govuk-checkboxes__input[data-controls='js-live-results']"
  end

  it "renders checkboxes with hint text for individual checkboxes" do
    render_component(
      id: "nationality",
      name: "nationality",
      heading: "What is your nationality?",
      hint_text: "If you have dual nationality, select all options that are relevant to you.",
      items: [
        { label: "British", value: "british", hint: "including English, Scottish, Welsh and Northern Irish" },
        { label: "Irish", value: "irish" },
        { label: "Other", value: "other", hint: "Anything other than the above" }
      ]
    )
    assert_select ".govuk-checkboxes"
    assert_select "label[for='nationality-0']", text: "British"
    assert_select "label[for='nationality-1']", text: "Irish"
    assert_select "label[for='nationality-2']", text: "Other"
    assert_select("#nationality-0-item-hint", text: "including English, Scottish, Welsh and Northern Irish")
    assert_select("#nationality-2-item-hint", text: "Anything other than the above")
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

  it "renders checkboxes with disabled attribute applied" do
    render_component(
      name: "planet",
      heading: "What is your favourite planet?",
      hint_text: "Choose carefully",
      items: [
        { label: "Earth", value: "Earth" },
        { label: "Pluto", value: "pluto", disabled: true },
      ]
    )
    assert_select ".govuk-checkboxes__input[disabled]", value: 'pluto'
  end

end
