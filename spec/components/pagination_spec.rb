require "rails_helper"

describe "Pagination", type: :view do
  def component_name
    "pagination"
  end

  it "renders if no parameters" do
    assert_empty render_component({})
  end

  it "renders previous pagination" do
    render_component(previous_page: {
      url: "previous-page",
      title: "Previous page",
      label: "1 of 3",
    })

    assert_select ".govuk-pagination"
    assert_select ".govuk-pagination__link-title", text: "Previous page"
    assert_select ".govuk-pagination__link-label", text: "1 of 3"
    assert_link("previous-page")
  end

  it "render pagination" do
    render_component(next_page: {
      url: "next-page",
      title: "Next page",
      label: "2 of 3",
    })

    assert_select ".govuk-pagination__link-title", text: "Next page"
    assert_select ".govuk-pagination__link-label", text: "2 of 3"
    assert_link("next-page")
  end

  it "renders pagination container and page links if items specified" do
    render_component(
      items: [
        {
          number: "1",
          href: "page-1",
        },
      ],
    )

    assert_select ".govuk-pagination--block", false
    assert_select ".govuk-pagination__item", text: "1"
    assert_select ".govuk-pagination__link[aria-label='Page 1']", text: "1"
    assert_link("page-1")
  end

  it "renders page link as current page" do
    render_component(
      items: [
        {
          number: "1",
          href: "page-1",
          current: true,
        },
      ],
    )

    assert_select ".govuk-pagination--block", false
    assert_select ".govuk-pagination__item", text: "1"
    assert_select ".govuk-pagination__item--current", text: "1"
    assert_select ".govuk-pagination__link[aria-current='page']", text: "1"
  end

  it "renders ellipsis" do
    render_component(
      items: [
        {
          ellipsis: true,
        },
      ],
    )

    assert_select ".govuk-pagination--block", false
    assert_select ".govuk-pagination__item--ellipsis", text: "⋯"
  end

  it "raises error if number not defined for item that is not ellipsis" do
    expect {
      render_component(
        items: [
          {
            href: "page-1",
          },
        ],
      )
    }.to raise_error(ActionView::Template::Error, "Number required for item 0")
  end

  it "makes distinction between the navigation text and label text of the links when a label is present" do
    render_component(
      previous_page: {
        url: "previous-page",
        title: "Previous page",
        label: "1 of 3",
      },
      next_page: {
        url: "next-page",
        title: "Next page",
        label: "2 of 3",
      },
    )

    assert_select ".govuk-pagination__prev .govuk-pagination__link .govuk-visually-hidden", text: ":"
    assert_select ".govuk-pagination__next .govuk-pagination__link .govuk-visually-hidden", text: ":"
  end

  it "does not make a distinction between the navigation text and label text of the links when labels are not present" do
    render_component(
      previous_page: {
        url: "previous-page",
        title: "Previous page",
      },
      next_page: {
        url: "next-page",
        title: "Next page",
      },
    )

    assert_select ".govuk-pagination__prev .govuk-pagination__link .govuk-visually-hidden", false
    assert_select ".govuk-pagination__next .govuk-pagination__link .govuk-visually-hidden", false
  end

  it "includes GA4 tracking" do
    render_component(
      previous_page: {
        url: "previous-page",
        title: "Previous page",
      },
      next_page: {
        url: "next-page",
        title: "Next page",
      },
    )

    assert_select ".govuk-pagination" do |pagination|
      expect(pagination.attr("data-module").to_s).to eq "ga4-link-tracker"
    end

    expected_ga4_json = {
      "event_name": "navigation",
      "type": "previous and next",
      "text": "Previous page",
      "section": "Previous",
    }.to_json

    assert_select ".govuk-pagination__prev a" do |pagination_link|
      expect(pagination_link.attr("data-ga4-link").to_s).to eq expected_ga4_json
    end

    expected_ga4_json = {
      "event_name": "navigation",
      "type": "previous and next",
      "text": "Next page",
      "section": "Next",
    }.to_json

    assert_select ".govuk-pagination__next a" do |pagination_link|
      expect(pagination_link.attr("data-ga4-link").to_s).to eq expected_ga4_json
    end
  end

  it "includes GA4 tracking for pagination" do
    render_component(
      previous_page: {
        url: "previous-page",
        title: "Previous page",
      },
      next_page: {
        url: "next-page",
        title: "Next page",
      },
      items: [
        {
          number: "1",
          href: "page-1",
        },
      ],
    )

    assert_select ".govuk-pagination" do |pagination|
      expect(pagination.attr("data-module").to_s).to eq "ga4-link-tracker"
    end

    expected_ga4_json = {
      "event_name": "navigation",
      "type": "pagination",
      "text": "Previous page",
      "section": "Previous",
    }.to_json

    assert_select ".govuk-pagination__prev a" do |pagination_link|
      expect(pagination_link.attr("data-ga4-link").to_s).to eq expected_ga4_json
    end

    expected_ga4_json = {
      "event_name": "navigation",
      "type": "pagination",
      "text": "Next page",
      "section": "Next",
    }.to_json

    assert_select ".govuk-pagination__next a" do |pagination_link|
      expect(pagination_link.attr("data-ga4-link").to_s).to eq expected_ga4_json
    end

    expected_ga4_json = {
      "event_name": "navigation",
      "type": "pagination",
      "text": "1",
      "section": "Pagination list",
    }.to_json

    assert_select ".govuk-pagination__item a" do |pagination_link|
      expect(pagination_link.attr("data-ga4-link").to_s).to eq expected_ga4_json
    end
  end

  it "allows GA4 tracking to be disabled" do
    render_component(
      disable_ga4: true,
      previous_page: {
        url: "previous-page",
        title: "Previous page",
      },
      next_page: {
        url: "next-page",
        title: "Next page",
      },
      items: [
        {
          number: "1",
          href: "page-1",
        },
      ],
    )

    assert_select ".govuk-pagination[data-module='ga4-link-tracker']", false
    assert_select ".govuk-pagination__prev a[data-ga4-link]", false
    assert_select ".govuk-pagination__next a[data-ga4-link]", false
    assert_select ".govuk-pagination__item a[data-ga4-link]", false
  end

  def assert_link(link)
    assert_select "a[href=\"#{link}\"]"
  end
end
