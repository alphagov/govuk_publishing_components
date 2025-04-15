require "rails_helper"

describe "Table", type: :view do
  def component_name
    "table"
  end

  it "renders data in a table" do
    render_component({})
    assert_select ".govuk-table"

    assert_select "thead", false
  end

  it "renders with caption" do
    render_component(
      caption: "My caption",
      caption_classes: "govuk-heading-m",
    )

    assert_select "caption.govuk-heading-m", "My caption"
  end

  it "renders data in cells" do
    render_component(
      rows: [
        [
          {
            text: "January",
          },
          {
            text: "£85",
            format: "numeric",
          },
          {
            text: "£95",
            format: "numeric",
          },
        ],
      ],
    )

    assert_select ".govuk-table td:first-child", "January"
    assert_select ".govuk-table td:nth-child(2).govuk-table__cell--numeric", "£85"
  end

  it "renders 'Not set' for empty cells" do
    render_component(
      rows: [
        [
          {
            text: "January",
          },
          {
            text: nil,
            format: "numeric",
          },
          {
            text: "£95",
            format: "numeric",
          },
        ],
      ],
    )

    assert_select ".govuk-table td:first-child", "January"
    assert_select ".govuk-table td:nth-child(2).govuk-table__cell--empty", "Not set"
  end

  it "renders header" do
    render_component(
      head: [
        {
          text: "Month you apply",
        },
        {
          text: "Rate for bicycles",
          format: "numeric",
        },
        {
          text: "Rate for vehicles",
          format: "numeric",
        },
      ],
    )

    assert_select ".govuk-table th:first-child", "Month you apply"
    assert_select ".govuk-table th:nth-child(2).govuk-table__header--numeric", "Rate for bicycles"
  end

  it "renders first cell in row as header" do
    render_component(
      first_cell_is_header: true,
      rows: [
        [
          {
            text: "January",
          },
          {
            text: "£85",
            format: "numeric",
          },
          {
            text: "£95",
            format: "numeric",
          },
        ],
      ],
    )

    assert_select ".govuk-table th:first-child", "January"
    assert_select ".govuk-table td:nth-child(2)", "£85"
  end

  it "renders sortable header" do
    render_component(
      sortable: true,
      head: [
        {
          text: "Month you apply",
        },
        {
          text: "Rate for bicycles",
          format: "numeric",
          sort_direction: "descending",
          href: "/?sort_direction=desc",
        },
        {
          text: "Rate for vehicles",
          format: "numeric",
          href: "/?sort_direction=desc",
          data_attributes: {
            tracking: "UTM-123",
          },
        },
      ],
    )

    assert_select ".govuk-table.govuk-table--sortable"

    assert_select ".govuk-table th:nth-child(2).govuk-table__header--active", "Rate for bicycles"
    assert_select ".govuk-table th:nth-child(2).govuk-table__header--active a.app-table__sort-link--descending[href='/?sort_direction=desc']"

    assert_select ".govuk-table th:nth-child(3) a.app-table__sort-link[href='/?sort_direction=desc'][data-tracking='UTM-123']"
  end

  it "renders a filterable table with a filter section and a 'no results' message" do
    render_component(
      filterable: true,
    )

    assert_select "[data-module='table']"
    assert_select ".js-gem-c-table__filter"
    assert_select ".js-gem-c-table__message"
  end

  it "accepts a width value for head cells" do
    render_component(
      head: [
        {
          text: "Month you apply",
          width: "one-third",
        },
      ],
      rows: [
        [
          {
            text: "January",
          },
        ],
      ],
    )

    # This needs [class=...] attribute syntax as Nokogiri doesn't like the `!` in the class name
    assert_select ".govuk-table th[class='govuk-table__header govuk-!-width-one-third']", "Month you apply"
  end
end
