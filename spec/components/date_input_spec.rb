require "rails_helper"

describe "Date input", type: :view do
  def component_name
    "date_input"
  end

  it "renders with default fields when no data is given" do
    render_component({})

    assert_select ".govuk-date-input", 1
    assert_select ".govuk-date-input__item", 3
    assert_select ".govuk-input.govuk-input--width-2", 2
    assert_select ".govuk-input.govuk-input--width-4", 1

    assert_select ".govuk-date-input__item:first-child", text: "Day"
  end

  it "renders with custom name on input fields" do
    render_component(
      name: "dob",
    )

    assert_select ".govuk-input[name='dob[day]'].govuk-input--width-2", 1
    assert_select ".govuk-input[name='dob[month]'].govuk-input--width-2", 1
    assert_select ".govuk-input[name='dob[year]'].govuk-input--width-4", 1
  end

  it "renders with autocomplete enabled" do
    render_component(
      autocomplete_date_of_birth: true,
    )

    assert_select ".govuk-input[name='day'][autocomplete='bday-day'].govuk-input--width-2"
    assert_select ".govuk-input[name='month'][autocomplete='bday-month'].govuk-input--width-2"
    assert_select ".govuk-input[name='year'][autocomplete='bday-year'].govuk-input--width-4"
  end

  it "renders with legend and fieldset" do
    render_component(
      legend_text: "What is your date of birth?",
    )

    assert_select ".govuk-fieldset[role=group] .govuk-fieldset__legend", text: "What is your date of birth?"
    assert_select ".govuk-fieldset[role=group] .govuk-date-input", 1
    assert_select ".govuk-fieldset[role=group] .govuk-date-input__item", 3
  end

  it "renders with hint" do
    render_component(
      legend_text: "What is your date of birth?",
      hint: "For example, 31 3 1980",
    )

    assert_select ".govuk-fieldset[role=group] .govuk-hint", text: "For example, 31 3 1980"
  end

  it "renders with error message" do
    render_component(
      legend_text: "What is your date of birth?",
      error_message: "Error message goes here",
    )

    assert_select ".govuk-form-group--error .govuk-fieldset[role=group] .govuk-error-message", text: "Error: Error message goes here"
    assert_select ".govuk-form-group--error .govuk-fieldset[role=group] .govuk-date-input__item .govuk-input--error", 3
  end

  it "renders with error items" do
    render_component(
      legend_text: "What is your date of birth?",
      error_items: [{ text: "Error 1" }, { text: "Error 2" }],
    )

    assert_select(
      ".govuk-form-group--error .govuk-fieldset[role=group] .govuk-error-message",
      html: "<span class=\"govuk-visually-hidden\">Error:</span> Error 1<br>Error 2",
    )
    assert_select ".govuk-form-group--error .govuk-fieldset[role=group] .govuk-date-input__item .govuk-input--error", 3
  end

  it "renders with named error items" do
    render_component(
      legend_text: "What is your date of birth?",
      error_items: [
        { name: "day", text: "day-error" },
        { name: "year", text: "year-error" },
      ],
    )

    assert_select(
      ".govuk-form-group--error .govuk-fieldset[role=group] .govuk-error-message",
      html: "<span class=\"govuk-visually-hidden\">Error:</span> day-error<br>year-error",
    )
    assert_select ".govuk-form-group--error .govuk-fieldset[role=group] .govuk-date-input__item .govuk-input--error", 2
  end

  it "renders with custom items" do
    render_component(
      legend_text: "What is your date of birth?",
      items: [
        { label: "Dydd", name: "dob-dydd", width: 2, value: 31 },
        { label: "Mis", name: "dob-mis", width: 2, value: 3 },
        { label: "Blwyddyn", name: "dob-blwyddyn", width: 4, value: 1980 },
      ],
    )

    assert_select ".govuk-date-input__item:nth-child(1)", text: "Dydd"
    assert_select ".govuk-date-input__item:nth-child(2)", text: "Mis"
    assert_select ".govuk-date-input__item:nth-child(3)", text: "Blwyddyn"

    assert_select ".govuk-input[name='dob-dydd'][value='31'].govuk-input--width-2"
    assert_select ".govuk-input[name='dob-mis'][value='3'].govuk-input--width-2"
    assert_select ".govuk-input[name='dob-blwyddyn'][value='1980'].govuk-input--width-4"
  end
end
