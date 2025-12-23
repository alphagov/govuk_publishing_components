require "rails_helper"

describe "Summary card", type: :view do
  def component_name
    "summary_card"
  end

  it "does not render anything if no data is passed" do
    test_data = {}
    assert_empty render_component(test_data)
  end

  it "renders component title" do
    render_component(title: "Title")
    assert_select ".gem-c-summary-card .govuk-summary-card__title", text: "Title"
  end

  it "renders items" do
    render_component(
      rows: [
        {
          key: "Title",
          value: "The title",
        },
        {
          key: "Summary",
          value: "The summary",
        },
      ],
    )
    assert_select ".govuk-summary-list__row", 2
    assert_select ".govuk-summary-list__key", text: "Title"
    assert_select ".govuk-summary-list__value", text: "The title"
    assert_select ".govuk-summary-list__key", text: "Summary"
    assert_select ".govuk-summary-list__value", text: "The summary"
  end

  it "renders component with a custom id" do
    render_component(
      id: "custom_id",
      title: "Title",
    )
    assert_select "#custom_id", count: 1
  end

  it "renders component title with view and edit actions" do
    render_component(
      title: "Title",
      summary_card_actions: [
        {
          label: "View",
          href: "#1",
        },
        {
          label: "Edit",
          href: "#2",
        },
      ],
    )
    assert_select ".govuk-summary-card__title-wrapper h2.govuk-summary-card__title", text: "Title"
    assert_select '.govuk-summary-card__title-wrapper ul.govuk-summary-card__actions .govuk-link[href="#1"]', text: "View Title"
    assert_select '.govuk-summary-card__title-wrapper ul.govuk-summary-card__actions .govuk-link[href="#2"]', text: "Edit Title"
  end

  it "renders component title with destructive action" do
    render_component(
      title: "Title",
      summary_card_actions: [
        {
          label: "Delete",
          href: "#1",
          destructive: true,
        },
      ],
    )
    assert_select ".govuk-summary-card__title-wrapper h2.govuk-summary-card__title", text: "Title"
    assert_select '.govuk-summary-card__title-wrapper ul.govuk-summary-card__actions .gem-link--destructive[href="#1"]', text: "Delete Title"
  end

  it "renders component with row actions" do
    render_component(
      title: "Title",
      rows: [
        {
          key: "One",
          value: "Value 1",
          actions: [
            {
              label: "View",
              href: "#1",
            },
            {
              label: "Edit",
              href: "#2",
            },
          ],
        },
      ],
    )
    assert_select ".govuk-summary-card__title-wrapper h2.govuk-summary-card__title", text: "Title"
    assert_select '.govuk-summary-list__row .govuk-link[href="#1"]', text: "View One"
    assert_select '.govuk-summary-list__row .govuk-link[href="#2"]', text: "Edit One"
  end

  it "renders component with row destructive action" do
    render_component(
      title: "Title",
      rows: [
        {
          key: "One",
          value: "Value 1",
          actions: [
            {
              label: "View",
              href: "#1",
            },
            {
              label: "Edit",
              href: "#2",
            },
            {
              label: "Delete",
              href: "#3",
              destructive: true,
            },
          ],
        },
      ],
    )
    assert_select ".govuk-summary-card__title-wrapper h2.govuk-summary-card__title", text: "Title"
    assert_select '.govuk-summary-list__row .govuk-link[href="#1"]', text: "View One"
    assert_select '.govuk-summary-list__row .govuk-link[href="#2"]', text: "Edit One"
    assert_select '.govuk-summary-list__row .gem-link--destructive[href="#3"]', text: "Delete One"
  end

  it "renders component with row action that opens in a new tab" do
    render_component(
      title: "Title",
      rows: [
        {
          key: "One",
          value: "Value 1",
          actions: [
            {
              label: "View",
              href: "#1",
              opens_in_new_tab: true,
            },
          ],
        },
      ],
    )
    assert_select ".govuk-summary-card__title-wrapper h2.govuk-summary-card__title", text: "Title"
    assert_select '.govuk-summary-list__row .govuk-link[href="#1"]', text: "View One (opens in new tab)"
    assert_select '.govuk-summary-list__row .govuk-link[target="_blank"]', text: "View One (opens in new tab)"
  end

  it "renders component with row data attributes" do
    render_component(
      title: "Title",
      rows: [
        {
          key: "One",
          value: "Value 1",
          data: { module: "something" },
        },
      ],
    )

    assert_select ".govuk-summary-list__row[data-module='something']", text: /One/
  end

  it "appends a no-actions class to rows without actions" do
    render_component(
      title: "Title",
      rows: [
        {
          key: "One",
          value: "Value 1",
          actions: [
            {
              label: "View",
              href: "#1",
            },
          ],
        },
        {
          key: "Two",
          value: "Value 2",
        },
        {
          key: "Three",
          value: "Value 3",
        },
      ],
    )

    assert_select ".govuk-summary-list__row", 3
    assert_select ".govuk-summary-list__row:not(.govuk-summary-list__row--no-actions)", 1
    assert_select ".govuk-summary-list__row.govuk-summary-list__row--no-actions", 2

    assert_select ".govuk-summary-list__row:not(.govuk-summary-list__row--no-actions) .govuk-summary-list__key", text: "One"
    assert_select ".govuk-summary-list__row:not(.govuk-summary-list__row--no-actions) .govuk-summary-list__value", text: "Value 1"
    assert_select '.govuk-summary-list__row:not(.govuk-summary-list__row--no-actions) .govuk-link[href="#1"]', text: "View One"

    assert_select ".govuk-summary-list__row.govuk-summary-list__row--no-actions .govuk-summary-list__key", text: "Two"
    assert_select ".govuk-summary-list__row.govuk-summary-list__row--no-actions .govuk-summary-list__value", text: "Value 2"

    assert_select ".govuk-summary-list__row.govuk-summary-list__row--no-actions .govuk-summary-list__key", text: "Three"
    assert_select ".govuk-summary-list__row.govuk-summary-list__row--no-actions .govuk-summary-list__value", text: "Value 3"
  end

  it "renders content within a block" do
    render_component(title: "Title") do
      "Some text goes here"
    end

    assert_select ".govuk-summary-card__content .gem-c-summary__block", text: "Some text goes here"
  end
end
