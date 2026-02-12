require "rails_helper"

describe "Search results", type: :view do
  def component_name
    "search_results"
  end

  it "doesn't render a table, it renders results" do
    render_component({})

    assert_select ".govuk-table", count: 0
    assert_select ".govuk-body.gem-c-no-search-results"
  end

  it "renders a table, if there are results" do
    render_component({
      "items": {
        "count": 5,
        "name": "result",
      },
      "link": {
        "text": "text",
        "href": "#",
      },
      "pages": {
        "previous_page": {
          "href": "previous-page",
        },
      },
      "table": {
        "head": [
          {
            "text": "Month you apply",
          },
          {
            "text": "Rate for bicycles",
            "format": "numeric",
          },
          {
            "text": "Rate for vehicles",
            "format": "numeric",
          },
        ],
        "rows": [
          [
            {
              "text": "January",
            },
            {
              "text": "£85",
              "format": "numeric",
            },
            {
              "text": "£95",
              "format": "numeric",
            },
          ],
        ],
      },
    })

    assert_select ".govuk-table"
    assert_select ".govuk-body.gem-c-no-search-results", count: 0
    assert_select ".govuk-pagination"
    assert_select ".gem-c-search-results__link"
  end

  it "doesn't render a link, when no link is present" do
    render_component({
      "items": {
        "count": 5,
        "name": "result",
      },
      "pages": {
        "previous_page": {
          "href": "previous-page",
        },
      },
    })

    assert_select ".gem-c-search-results__link", count: 0
  end

  it "doesn't render pages, if pages are not present" do
    render_component({
      "items": {
        "count": 5,
        "name": "result",
      },
      "link": {
        "text": "text",
        "href": "#",
      },
    })

    assert_select ".govuk-pagination", count: 0
  end

  it "renders filter of type `input`" do
    render_component({
      "items": {
        "count": 5,
        "name": "result",
      },
      "link": {
        "text": "text",
        "href": "#",
      },
      "filter": {
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
      },
    })

    assert_select ".gem-c-search-results__filter-options", count: 1
    assert_select "#title_filter[type=search]", count: 1
    assert_select "label[for='title_filter']", count: 1
  end

  it "renders filter of type `checkbox`" do
    render_component({
      "items": {
        "count": 5,
        "name": "result",
      },
      "link": {
        "text": "text",
        "href": "#",
      },
      "filter": {
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
      },
    })

    assert_select ".gem-c-search-results__filter-options", count: 1
    assert_select "[type=checkbox]", count: 1
  end

  it "renders filter of type `select`" do
    %w[select select_with_search].each_with_index do |filter_type, index|
      render_component({
        "items": {
          "count": 5,
          "name": "result",
        },
        "link": {
          "text": "text",
          "href": "#",
        },
        "filter": {
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
        },
      })

      assert_select ".gem-c-search-results__filter-options .gem-c-#{filter_type.gsub('_', '-')}", count: 1
      assert_select "#author_filter_#{index}", count: 1
      assert_select "label[for='author_filter_#{index}']", count: 1
    end
  end

  it "renders grouped filters" do
    render_component({
      "items": {
        "count": 5,
        "name": "result",
      },
      "link": {
        "text": "text",
        "href": "#",
      },
      "filter": {
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
      },
    })

    assert_select ".gem-c-search-results__filter-options fieldset .govuk-date-input", count: 2
    assert_select "[name^=to_date]", count: 3
    assert_select "[name^=from_date]", count: 3
  end
end
