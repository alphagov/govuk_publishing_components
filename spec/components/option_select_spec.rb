require "rails_helper"

describe "option select", type: :view do
  def component_name
    "option_select"
  end

  def option_key
    "key"
  end

  def option_select_arguments
    {
      key: option_key,
      title: "Market sector",
      options_container_id: "list-of-sectors",
      options: [
        {
          value: "aerospace",
          label: "Aerospace",
          id: "aerospace",
        },
        {
          value: "value",
          label: "Label",
          id: "ID",
        },
      ],
    }
  end

  def option_select_with_tracking_arguments
    {
      key: option_key,
      title: "Market sector",
      options_container_id: "list-of-sectors",
      options: [
        {
          value: "aerospace",
          label: "Aerospace",
          id: "aerospace",
        },
        {
          value: "value",
          label: "Label",
          id: "ID",
        },
      ],
    }
  end

  it "renders a heading for the option select box containing the title" do
    render_component(option_select_arguments)
    expect(rendered).to have_selector(".gem-c-option-select__title", text: "Market sector")
  end

  it "renders a container with the id passed in" do
    render_component(option_select_arguments)
    expect(rendered).to have_selector("\#list-of-sectors.gem-c-option-select__container")
  end

  it "renders the large version of the component" do
    arguments = option_select_arguments
    arguments[:large] = true
    render_component(arguments)

    expect(rendered).to have_selector(".gem-c-option-select__container--large")
  end

  it "can begin with the options box closed on load" do
    arguments = option_select_arguments
    arguments[:closed_on_load] = true
    render_component(arguments)

    expect(rendered).to have_selector('.gem-c-option-select[data-closed-on-load="true"]')
  end

  it "can begin with the options box closed on load for mobile devices" do
    arguments = option_select_arguments
    arguments[:closed_on_load_mobile] = true
    render_component(arguments)

    expect(rendered).to have_selector('.gem-c-option-select[data-closed-on-load-mobile="true"]')
  end

  it "can show a filter control" do
    arguments = option_select_arguments
    arguments[:show_filter] = true
    render_component(arguments)

    expect(rendered).to have_selector(".gem-c-option-select[data-filter-element]")
    expect(rendered).to have_selector(".gem-c-option-select__count")
  end

  it "does not show a filter control" do
    arguments = option_select_arguments
    arguments[:show_filter] = false
    render_component(arguments)

    expect(rendered).to have_no_selector('.gem-c-option-select .gem-c-input[name="option-select-filter"]')
    expect(rendered).to have_no_selector(".gem-c-option-select__count")
  end

  it "accepts button data attributes" do
    options = option_select_arguments
    button_attrs = {
      ga4_expandable: "true",
      ga4_event: {
        event_name: "select_content",
        type: "finder",
      },
    }
    options[:button_data_attributes] = button_attrs
    render_component(options)
    expect(rendered).to have_selector(".gem-c-option-select[data-button-data-attributes='#{button_attrs.to_json}']")
  end

  def expect_label_and_checked_checkbox(label, id, value)
    expect_label_and_checkbox(label, id, value, checked: true)
  end

  def expect_label_and_checkbox(label, id, value, checked: false)
    expected_name = "[name='#{option_key}[]']"
    expected_id = "[id='#{option_key}-#{id}']"
    expected_value = "[value='#{value}']"
    expected_checked = checked ? "[checked='checked']" : ""

    expect(rendered).to have_selector expected_name
    expect(rendered).to have_selector expected_id
    expect(rendered).to have_selector expected_value

    expect(rendered).to have_selector "label[for='#{option_key}-#{id}']", text: label
    expect(rendered).to have_selector "input[type='checkbox']#{expected_name}#{expected_id}#{expected_value}#{expected_checked}"
  end
end
