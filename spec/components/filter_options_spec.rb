require "rails_helper"

describe "Filter Options", type: :view do
  def component_name
    "filter_options"
  end

  it "renders filter of type `input`" do
    render_component({
      "action": "/search",
      "options": [
        {
          "fields": [
            {
              "label": {
                "text": "Title",
                "bold": true,
              },
              "name": "title",
              "id": "title_filter",
              "type": "search",
              "filter_type": "input",
            },
          ],
        },
      ],
    })

    assert_select ".gem-c-filter-options", count: 1
    assert_select "#title_filter[type=search]", count: 1
    assert_select "label[for='title_filter']", count: 1
  end

  it "renders filter of type `checkbox`" do
    render_component({
      "action": "/search",
      "options": [
        {
          "fields": [
            {
              "small": true,
              "items": [
                {
                  "value": "1",
                  "label": "Only invalid editions",
                  "bold": true,
                },
              ],
              "filter_type": "checkboxes",
              "name": "only_invalid_editions",
            },
          ],
        },
      ],
    })

    assert_select ".gem-c-filter-options", count: 1
    assert_select "[type=checkbox]", count: 1
  end

  it "renders filter of type `select`" do
    %w[select select_with_search].each_with_index do |filter_type, index|
      render_component({
        "action": "/search",
        "options": [
          {
            "fields": [
              {
                "label": "Author",
                "name": "author",
                "heading_size": "s",
                "id": "author_filter_#{index}",
                "filter_type": filter_type,
                "options": [
                  {
                    "value": "something",
                    "text": "Text",
                    "selected": true,
                  },
                ],
              },
            ],
          },
        ],
      })

      assert_select ".gem-c-filter-options .gem-c-#{filter_type.gsub('_', '-')}", count: 1
      assert_select "#author_filter_#{index}", count: 1
      assert_select "label[for='author_filter_#{index}']", count: 1
    end
  end

  it "renders grouped filters" do
    render_component({
      "action": "/search",
      "options": [
        {
          "section": "Last updated date",
          "fields": [
            {
              "id": "from_date",
              "filter_type": "date_input",
              "hint": "For example, 23/07/2013",
              "legend_text": "From",
              "name": "from_date",
            },
            {
              "id": "to_date",
              "filter_type": "date_input",
              "hint": "For example, 23/07/2013",
              "legend_text": "To",
              "name": "to_date",
            },
          ],
        },
      ],
    })

    assert_select ".gem-c-filter-options fieldset .govuk-date-input", count: 2
    assert_select "[name^=to_date]", count: 3
    assert_select "[name^=from_date]", count: 3
  end
end
