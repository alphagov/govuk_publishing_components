require "rails_helper"

describe "List", type: :view do
  def component_name
    "list"
  end

  it "does not render anything if no data is passed" do
    test_data = {}

    assert_empty render_component(test_data)
  end

  it "does not render anything if nothing is in the items array" do
    test_data = { items: [] }

    assert_empty render_component(test_data)
  end

  it "renders an unordered list by default" do
    render_component(
      items: ["Test item", "Another test item"],
    )

    assert_select "ul.govuk-list li", text: "Test item"
    assert_select "ul.govuk-list li:nth-child(2)", text: "Another test item"
  end

  it "adds an aria-label" do
    render_component(
      aria_label: "An aria-label to give this context.",
      items: ["Test item", "Another test item"],
    )

    assert_select "ul[aria-label]"
    assert_select "ul[aria-label='An aria-label to give this context.']"
  end

  it "renders an ordered list" do
    render_component(
      list_type: "number",
      items: ["Test item", "Another test item"],
    )

    assert_select "ol.govuk-list li", text: "Test item"
    assert_select "ol.govuk-list li:nth-child(2)", text: "Another test item"
  end

  it "renders an unordered list with visible bullets" do
    render_component(
      visible_counters: true,
      items: ["Test item", "Another test item"],
    )

    assert_select "ul.govuk-list--bullet li", text: "Test item"
    assert_select "ul.govuk-list--bullet li:nth-child(2)", text: "Another test item"
  end

  it "renders an ordered list with visible counters" do
    render_component(
      list_type: "number",
      visible_counters: true,
      items: ["Test item", "Another test item"],
    )

    assert_select "ol.govuk-list--number li", text: "Test item"
    assert_select "ol.govuk-list--number li:nth-child(2)", text: "Another test item"
  end

  it "adds extra spacing to each list item" do
    render_component(
      extra_spacing: true,
      items: ["Test item", "Another test item"],
    )

    assert_select "ul.govuk-list--spaced li", text: "Test item"
    assert_select "ul.govuk-list--spaced li:nth-child(2)", text: "Another test item"
  end

  it "adds an `id` correctly" do
    render_component(
      id: "this-is-a-test-id",
      items: ["Test item", "Another test item"],
    )

    assert_select "ul#this-is-a-test-id li", text: "Test item"
    assert_select "ul#this-is-a-test-id li:nth-child(2)", text: "Another test item"
  end

  it "adds markup within the list items" do
    render_component(
      items: [
        "<a href='https://example.com/'>Test item</a>",
        "<a href='https://example.com/'>Another test item</a>",
      ],
    )

    assert_select "ul.govuk-list li a", text: "Test item"
    assert_select "ul.govuk-list li:nth-child(2) a", text: "Another test item"
  end

  it "keeps attributes intact when given markup" do
    render_component(
      items: [
        "<a
          href='https://example.com/'
          data-module='ga4-link-tracker'
        >Test item</a>",
        "<a href='https://example.com/'>Another test item</a>",
      ],
    )

    assert_select "ul.govuk-list li a[data-module='ga4-link-tracker']"
  end

  it "adds margin" do
    render_component(
      margin_bottom: 7,
      items: [
        "<a href='https://example.com/'>Test item</a>",
        "<a href='https://example.com/'>Another test item</a>",
      ],
    )
    assert_select '.gem-c-list.govuk-\!-margin-bottom-7'
  end

  it "defaults to no bottom margin if an incorrect value is passed" do
    render_component(
      margin_bottom: 20,
      items: [
        "<a href='https://example.com/'>Test item</a>",
        "<a href='https://example.com/'>Another test item</a>",
      ],
    )
    assert_select "[class^='govuk-\!-margin-bottom-']", false
  end

  it "has no margin class added by default" do
    render_component(
      items: [
        "<a href='https://example.com/'>Test item</a>",
        "<a href='https://example.com/'>Another test item</a>",
      ],
    )
    assert_select "[class^='govuk-\!-margin-bottom-']", false
  end

  it "has no margin class added if `margin_bottom` set to 4" do
    render_component(
      margin_bottom: 4,
      items: [
        "<a href='https://example.com/'>Test item</a>",
        "<a href='https://example.com/'>Another test item</a>",
      ],
    )
    assert_select "[class^='govuk-\!-margin-bottom-']", false
  end
end
