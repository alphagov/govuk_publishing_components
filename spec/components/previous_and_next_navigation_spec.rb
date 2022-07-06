require "rails_helper"

describe "Previous and next navigation", type: :view do
  def component_name
    "previous_and_next_navigation"
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

    assert_select ".govuk-pagination[role='navigation']"
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

  def assert_link(link)
    assert_select "a[href=\"#{link}\"]"
  end
end
