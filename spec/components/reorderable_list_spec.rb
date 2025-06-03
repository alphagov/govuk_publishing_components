require "rails_helper"

describe "Reorderable list", type: :view do
  def component_name
    "reorderable_list"
  end

  def items
    [
      {
        id: "item-1",
        title: "Budget 2018",
        description: "PDF, 2.56MB, 48 pages",
      },
      {
        id: "item-2",
        title: "Budget 2018 (web)",
        description: "HTML attachment",
      },
      {
        id: "item-3",
        title: "Impact on households: distributional analysis to accompany Budget 2018",
        description: "PDF, 592KB, 48 pages",
      },
      {
        id: "item-3",
        title: "Table 2.1: Budget 2018 policy decisions",
        description: "MS Excel Spreadsheet, 248KB",
      },
      {
        id: "item-3",
        title: "Table 2.2: Measures announced at Autumn Budget 2017 or earlier that will take effect from November 2018 or later (£ million)",
        description: "MS Excel Spreadsheet, 248KB",
      },
    ]
  end

  it "renders a list of items" do
    render_component(items:)

    assert_select ".gem-c-reorderable-list"
    assert_select ".gem-c-reorderable-list__item", 5
    assert_select ".gem-c-reorderable-list__item" do |elements|
      elements.each_with_index do |element, index|
        assert_select element, ".gem-c-reorderable-list__title", { text: items[index][:title] }
        assert_select element, ".gem-c-reorderable-list__description", { text: items[index][:description] }
        assert_select element, ".gem-c-reorderable-list__actions"
        assert_select element, ".gem-c-reorderable-list__actions .js-reorderable-list-up", { text: "Up" }
        assert_select element, ".gem-c-reorderable-list__actions .js-reorderable-list-down", { text: "Down" }
        assert_select element, ".gem-c-reorderable-list__actions input[name='ordering[#{items[index][:id]}]']"
        assert_select element, ".gem-c-reorderable-list__actions input[value='#{index + 1}']"
      end
    end
  end

  it "adds correct data attributes if tracking enabled" do
    render_component(items:)

    assert_select ".gem-c-reorderable-list[data-module~='ga4-event-tracker']"
    assert_select ".gem-c-reorderable-list__item", 5
    assert_select ".gem-c-reorderable-list__item" do |elements|
      elements.each_with_index do |element, index|
        expected_dataset = {
          event_name: "select_content",
          type: "reorderable list",
          section: items[index][:title],
          index_section: index,
          index_section_count: elements.length,
        }

        assert_select element, ".gem-c-reorderable-list__actions .js-reorderable-list-up", data_ga4_event: expected_dataset.merge({ action: "Up" }).as_json
        assert_select element, ".gem-c-reorderable-list__actions .js-reorderable-list-down", data_ga4_event: expected_dataset.merge({ action: "Down" }).as_json
      end
    end
  end

  it "does not add correct data attributes if tracking disabled" do
    render_component(items:, disable_ga4: true)

    assert_select ".gem-c-reorderable-list[data-module~='ga4-event-tracker']", 0
    assert_select ".gem-c-reorderable-list__item", 5
    assert_select ".gem-c-reorderable-list__item [data-ga4-event]", 0
  end

  it "renders allows custom input names" do
    render_component(items:, input_name: "attachments[ordering]")

    assert_select ".gem-c-reorderable-list"
    assert_select ".gem-c-reorderable-list__item" do |elements|
      elements.each_with_index do |element, index|
        assert_select element, ".gem-c-reorderable-list__actions input[name='attachments[ordering][#{items[index][:id]}]']"
      end
    end
  end
end
