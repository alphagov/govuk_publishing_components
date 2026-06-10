require "rails_helper"

describe "Date input", type: :view do
  def component_name
    "datetime_fields"
  end

  it "renders the basic component" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
    })

    assert_select ".gem-c-datetime-fields"
    assert_select ".govuk-fieldset__legend", text: "Date (required)"
    assert_select ".govuk-input[name='day']"
    assert_select ".govuk-input[name='month']"
    assert_select ".govuk-input[name='year']"
    assert_select ".govuk-fieldset__legend", text: "Time"
    assert_select ".govuk-label", text: "Hour"
    assert_select ".govuk-label", text: "Minute"
  end

  it "allows heading level and size" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      heading_level: 1,
      heading_size: "l",
    })

    assert_select "legend.govuk-fieldset__legend--l", text: "Date (required)"
    assert_select "h1.govuk-fieldset__heading", text: "Date (required)"
    assert_select "legend.govuk-fieldset__legend--l", text: "Time"
    assert_select "h1.govuk-fieldset__heading", text: "Time"
  end

  it "allows custom test for the date and time headings" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      date_heading: "The date",
      time_heading: "The time",
    })

    assert_select "legend.govuk-fieldset__legend", text: "The date"
    assert_select "legend.govuk-fieldset__legend", text: "The time"
  end

  it "shows hint text" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      date_hint: "For example, 01 August 2022",
      time_hint: "For example, 09:30 or 19:30",
    })

    assert_select ".govuk-hint", text: "For example, 01 August 2022"
    assert_select ".govuk-hint", text: "For example, 09:30 or 19:30"
  end

  it "accepts an id" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      id: "kevin",
    })

    assert_select "[id='kevin']"
    assert_select ".govuk-date-input[id='kevin_date']"
  end

  it "renders custom date fields" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      year: {
        id: "year_id",
        name: "year_name",
        width: 4,
        value: "2024",
      },
      month: {
        id: "month_id",
        name: "month_name",
        width: 3,
        value: "1",
      },
      day: {
        id: "day_id",
        name: "day_name",
        width: 2,
        value: "14",
      },
    })

    assert_select ".govuk-input.govuk-input--width-4[id='year_id'][name='year_name'][value='2024']"
    assert_select ".govuk-input.govuk-input--width-3[id='month_id'][name='month_name'][value='1']"
    assert_select ".govuk-input.govuk-input--width-2[id='day_id'][name='day_name'][value='14']"
  end

  it "accepts values and ids for hour and minute elements" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      hour: {
        value: 2,
        id: "my-hour-id",
      },
      minute: {
        value: 3,
        id: "my-minute-id",
      },
    })

    assert_select "select[id='my-hour-id'] option[value='02'][selected='selected']"
    assert_select "select[id='my-minute-id'] option[value='03'][selected='selected']"
  end

  it "renders error fields for the whole component" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      error_items: [
        {
          text: "Descriptive error 1",
        },
        {
          text: "Descriptive error 2",
        },
      ],
    })

    assert_select ".gem-c-datetime-fields.govuk-form-group--error"
    assert_select ".govuk-form-group--error .govuk-error-message", text: "Error: Descriptive error 1Descriptive error 2"
  end

  it "renders separate error fields for the date and time sections" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      error_items_date: [
        {
          text: "Descriptive date error 1",
        },
        {
          text: "Descriptive date error 2",
        },
      ],
      error_items_time: [
        {
          text: "Descriptive time error 1",
        },
        {
          text: "Descriptive time error 2",
        },
      ],
    })

    assert_select ".gem-c-datetime-fields .govuk-form-group--error"
    assert_select ".govuk-form-group--error .govuk-error-message", text: "Error: Descriptive date error 1Descriptive date error 2"
    assert_select ".govuk-form-group--error .govuk-error-message", text: "Error: Descriptive time error 1Descriptive time error 2"
  end

  it "accepts data attributes" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      data_attributes: {
        module: "not-a-real-module",
        something_else: "i-just-thought-of",
      },
    })

    assert_select ".gem-c-datetime-fields[data-module='not-a-real-module'][data-something-else='i-just-thought-of']"
  end

  it "with date only option" do
    render_component({
      prefix: "prefix",
      field_name: "field_name",
      date_only: true,
    })

    assert_select ".govuk-input[name='day']"
    assert_select ".govuk-input[name='month']"
    assert_select ".govuk-input[name='year']"
    assert_select ".gem-c-datetime-fields__date-time-wrapper", false
  end
end
