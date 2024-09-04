require "rails_helper"

describe "Attachment", type: :view do
  def component_name
    "autocomplete"
  end

  it "fails to render when no data is given" do
    assert_raises do
      render_component({})
    end
  end

  it "does not render when no label is specified" do
    assert_raises do
      render_component({ options: ["United Kingdom", "United States"] })
    end
  end

  it "does not render when no options are specified" do
    assert_raises do
      render_component({ label: "Countries" })
    end
  end

  it "renders an input with a datalist" do
    render_component(
      id: "basic-autocomplete",
      label: "Countries",
      options: ["United Kingdom", "United States"],
    )

    assert_select ".govuk-label", text: "Countries", for: "basic-autocomplete"
    assert_select "input#basic-autocomplete"
    assert_select "datalist option[value='United Kingdom']"
    assert_select "datalist option[value='United States']"
  end

  it "renders an input with a value" do
    render_component(
      label: "Countries",
      options: ["United Kingdom", "United States"],
      value: "Belgium",
    )

    assert_select ".gem-c-autocomplete input[value='Belgium']"
  end

  it "renders an input with a name" do
    render_component(
      label: "Countries",
      options: ["United Kingdom", "United States"],
      name: "custom-name",
    )

    assert_select "input[name='custom-name']"
  end

  it "renders an input with an error" do
    render_component(
      label: "Countries",
      options: ["United Kingdom", "United States"],
      name: "custom-name",
      error_items: [
        {
          text: "There is a problem with this input",
        },
      ],
    )

    assert_select ".gem-c-autocomplete.govuk-form-group--error"
    assert_select ".govuk-error-message", text: "Error: There is a problem with this input"
  end

  it "has the default bottom margin" do
    render_component(
      id: "basic-autocomplete",
      label: "Countries",
      options: ["United Kingdom", "United States"],
    )

    assert_select '.gem-c-autocomplete.govuk-\!-margin-bottom-6'
  end

  it "accepts a different bottom margin" do
    render_component(
      id: "basic-autocomplete",
      label: "Countries",
      options: ["United Kingdom", "United States"],
      margin_bottom: 9,
    )

    assert_select '.gem-c-autocomplete.govuk-\!-margin-bottom-9'
  end
end
