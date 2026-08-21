require "rails_helper"

describe "Date input", type: :view do
  def component_name
    "datetime_fields"
  end

  it "renders the basic component" do
    render_component({})

    assert_select ".gem-c-datetime-fields"
    assert_select ".govuk-fieldset__legend", text: "Date"
    assert_select ".govuk-input[name='day']"
    assert_select ".govuk-input[name='month']"
    assert_select ".govuk-input[name='year']"
    assert_select ".govuk-fieldset__legend", text: "Time"
    assert_select ".govuk-label", text: "Hour"
    assert_select ".govuk-label", text: "Minute"
  end

  it "renders the correct names for the inputs" do
    render_component({
      year: { name: "year_field_name" },
      month: { name: "month_field_name" },
      day: { name: "day_field_name" },
      hour: { name: "hour_field_name" },
      minute: { name: "minute_field_name" },
    })

    assert_select ".govuk-input[name='year_field_name']"
    assert_select ".govuk-input[name='month_field_name']"
    assert_select ".govuk-input[name='day_field_name']"
    assert_select ".govuk-select[name='hour_field_name']"
    assert_select ".govuk-select[name='minute_field_name']"
  end

  it "allows heading level and size" do
    render_component({
      heading_level: 1,
      heading_size: "l",
    })

    assert_select "legend.govuk-fieldset__legend--l", text: "Date"
    assert_select "h1.govuk-fieldset__heading", text: "Date"
    assert_select "legend.govuk-fieldset__legend--l", text: "Time"
    assert_select "h1.govuk-fieldset__heading", text: "Time"
  end

  it "allows custom text for the date and time headings" do
    render_component({
      date_heading: "The date",
      time_heading: "The time",
    })

    assert_select "[data-ga4-form-section='The date'] .govuk-fieldset__legend", text: "The date"
    assert_select "[data-ga4-form-section='The time'] .govuk-fieldset__legend", text: "The time"
  end

  it "shows hint text" do
    render_component({
      date_hint: "For example, 01 August 2022",
      time_hint: "For example, 09:30 or 19:30",
    })

    assert_select "[data-ga4-form-section='Date'] .govuk-hint", text: "For example, 01 August 2022"
    assert_select "[data-ga4-form-section='Time'] .govuk-hint", text: "For example, 09:30 or 19:30"
  end

  it "accepts an id" do
    render_component({
      id: "kevin",
    })

    assert_select "[id='kevin']"
    assert_select ".govuk-date-input[id='kevin_date']"
  end

  it "renders custom field ids" do
    render_component({
      year: {
        id: "year_id",
      },
      month: {
        id: "month_id",
      },
      day: {
        id: "day_id",
      },
      hour: {
        id: "hour_id",
      },
      minute: {
        id: "minute_id",
      },
    })

    assert_select ".govuk-input[id='year_id']"
    assert_select ".govuk-input[id='month_id']"
    assert_select ".govuk-input[id='day_id']"
    assert_select ".govuk-select[id='hour_id']"
    assert_select ".govuk-select[id='minute_id']"
  end

  it "renders field values" do
    render_component({
      year: {
        value: 2024,
      },
      month: {
        value: 1,
      },
      day: {
        value: 14,
      },
      hour: {
        value: 2,
        id: "my-hour-id",
      },
      minute: {
        value: 3,
        id: "my-minute-id",
      },
    })

    assert_select ".govuk-input[value='2024']"
    assert_select ".govuk-input[value='1']"
    assert_select ".govuk-input[value='14']"
    assert_select "select[id='my-hour-id'] option[value='02'][selected='selected']"
    assert_select "select[id='my-minute-id'] option[value='03'][selected='selected']"
  end

  it "renders error fields for the whole component" do
    render_component({
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

    assert_select "[data-ga4-form-section='Date'] .govuk-error-message", text: "Error: Descriptive date error 1Descriptive date error 2"
    assert_select "[data-ga4-form-section='Time'] .govuk-error-message", text: "Error: Descriptive time error 1Descriptive time error 2"
  end

  it "accepts data attributes" do
    render_component({
      data_attributes: {
        module: "not-a-real-module",
        something_else: "i-just-thought-of",
      },
    })

    assert_select ".gem-c-datetime-fields[data-module='not-a-real-module'][data-something-else='i-just-thought-of']"
  end

  it "with date only option" do
    render_component({
      date_only: true,
    })

    assert_select ".govuk-input[name='day']"
    assert_select ".govuk-input[name='month']"
    assert_select ".govuk-input[name='year']"
    assert_select ".gem-c-datetime-fields__date-time-wrapper", false
  end
end
