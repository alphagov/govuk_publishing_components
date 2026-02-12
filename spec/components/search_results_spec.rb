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
end
