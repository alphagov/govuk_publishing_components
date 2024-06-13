require "rails_helper"

describe "Checkboxes", type: :view do
  def component_name
    "checkboxes"
  end

  it "renders a single checkbox" do
    render_component(
      name: "favourite_colour",
      items: [
        { label: "Red", value: "red" },
      ],
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
      ],
    )
    assert_select "fieldset.govuk-fieldset"
    assert_select "legend", text: "What is your favourite colour?"
    assert_select "legend h1", false
    assert_select ".govuk-hint", text: "Select all that apply."
    assert_select ".govuk-checkboxes"
    assert_select ".govuk-label", text: "Red"
    assert_select ".govuk-label", text: "Green"
  end

  it "renders small checkboxes" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite colour?",
      small: true,
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select ".gem-c-checkboxes.govuk-checkboxes--small"
  end

  it "renders nothing if no heading is supplied" do
    render_component(
      name: "favourite_colour",
      heading_caption: "Question 3 of 9",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select "fieldset.govuk-fieldset", false
    assert_select "legend", false
    assert_select "legend h1", false
    assert_select "legend span.govuk-caption-xl", false
    assert_select ".govuk-hint", false
    assert_select ".govuk-checkboxes", false
  end

  it "shows a heading/legend if supplied with only one checkbox" do
    render_component(
      name: "favourite_colour",
      heading: "Favourite colour?",
      items: [
        { label: "Red", value: "red" },
      ],
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
      ],
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
        { label: "Blue", value: "blue" },
      ],
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
        { label: "Blue", value: "blue", id: "also-custom" },
      ],
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
      ],
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
      ],
    )
    assert_select ".govuk-hint", false
    assert_select ".govuk-fieldset[aria-describedby]", false
  end

  it "does not render a hint or heading if there is only one checkbox" do
    render_component(
      name: "favourite_colour",
      items: [
        { label: "Red", value: "red" },
      ],
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
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-checkboxes"
    assert_select "legend h1", "What is your favourite skittle?"
  end

  it "renders checkboxes with custom heading size" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_size: "s",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-fieldset__legend.govuk-fieldset__legend--s", "What is your favourite skittle?"
  end

  it "renders checkboxes with default heading size when passing an undefined size" do
    render_component(
      name: "favourite-skittle",
      heading: "What is your favourite skittle?",
      heading_size: "x",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" },
      ],
    )
    assert_select ".govuk-fieldset__legend.govuk-fieldset__legend--m", "What is your favourite skittle?"
  end

  it "renders checkboxes with aria-controls attributes" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite skittle?",
      hint_text: "Choose carefully",
      items: [
        { label: "Red", value: "red", controls: "js-live-results" },
        { label: "Green", value: "green", controls: "js-live-results2" },
      ],
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
              dimension29: "Tracked",
            },
          },
        },
      ],
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
              dimension29: "Tracked",
            },
          },
          controls: "js-live-results",
        },
      ],
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
        { label: "Other", value: "other", hint: "Anything other than the above" },
      ],
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
        { label: "Other", value: "other" },
      ],
    )
    assert_select ".govuk-checkboxes"
    assert_select("#nationality-error", text: "Select if you are British, Irish or a citizen of a different country")
  end

  it "renders checkboxes with exclusive option" do
    render_component(
      id: "nationality",
      name: "nationality",
      heading: "What is your nationality?",
      error: "Select if you are British, Irish or a citizen of a different country",
      hint_text: "If you have dual nationality, select all options that are relevant to you.",
      items: [
        { label: "British", value: "british", hint: "including English, Scottish, Welsh and Northern Irish" },
        { label: "Irish", value: "irish" },
        :or,
        { label: "Other", value: "other", exclusive: true },
      ],
    )
    assert_select ".govuk-checkboxes__input[value=other][data-behaviour=exclusive]"
    assert_select ".govuk-checkboxes__divider", text: "or"
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
        { label: "Other", value: "other", conditional: "Sorry this is so vague" },
      ],
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
        { label: "Other", value: "other" },
      ],
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
            { label: "Dark Red", value: "dark_red" },
          ],
        },
        { label: "Blue", value: "blue" },
        { label: "Other", value: "other" },
      ],
    )
    assert_select ".govuk-checkboxes"
    assert_select ".govuk-checkboxes--nested"
    assert_select ".govuk-checkboxes--nested input[value=light_red]"
  end

  it "renders checkboxes with a description text" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite skittle?",
      description: "This is a description about skittles.",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select ".govuk-body", text: "This is a description about skittles."
  end

  it "renders checkboxes with a page heading and caption" do
    render_component(
      name: "favourite_colour",
      heading_caption: "Question 3 of 9",
      heading: "What is your favourite skittle?",
      is_page_heading: true,
      description: "This is a description about skittles.",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select "legend span.govuk-caption-xl", text: "Question 3 of 9"
    assert_select "legend h1", text: "What is your favourite skittle?"
  end

  it "renders checkboxes with custom sized page heading and caption" do
    render_component(
      name: "favourite_colour",
      heading_caption: "Question 3 of 9",
      heading: "What is your favourite skittle?",
      heading_size: "l",
      is_page_heading: true,
      description: "This is a description about skittles.",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select "legend span.govuk-caption-l", text: "Question 3 of 9"
    assert_select "legend.govuk-fieldset__legend--l h1", text: "What is your favourite skittle?"
  end

  it "renders checkboxes with default size for page heading and caption if no custom heading size is passed in" do
    render_component(
      name: "favourite_colour",
      heading_caption: "Question 3 of 9",
      heading: "What is your favourite skittle?",
      is_page_heading: true,
      description: "This is a description about skittles.",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select "legend span.govuk-caption-xl", text: "Question 3 of 9"
    assert_select "legend.govuk-fieldset__legend--xl h1", text: "What is your favourite skittle?"
  end

  it "renders checkboxes with default size for heading if no custom heading size or page heading option is passed in" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite skittle?",
      description: "This is a description about skittles.",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select "legend.govuk-fieldset__legend--m", text: "What is your favourite skittle?"
  end

  it "renders no caption if the header is not a page heading" do
    render_component(
      name: "favourite_colour",
      heading_caption: "Question 3 of 9",
      heading: "What is your favourite skittle?",
      description: "This is a description about skittles.",
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select "legend span.govuk-caption-xl", false
    assert_select "legend h1", false
  end

  it "renders checkboxes with a govspeak description text" do
    render_component(
      name: "favourite_colour",
      heading: "What is your favourite skittle?",
      description: render(
        "govuk_publishing_components/components/govspeak",
        content: "<p>This is a description about skittles.</p>".html_safe,
      ),
      items: [
        { label: "Red", value: "red" },
        { label: "Green", value: "green" },
      ],
    )
    assert_select ".govuk-body", text: "This is a description about skittles."
  end
end
