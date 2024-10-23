require "rails_helper"

describe "Summary list", type: :view do
  def component_name
    "summary_list"
  end

  it "does not render anything if no data is passed" do
    test_data = {}
    assert_empty render_component(test_data)
  end

  it "renders section title" do
    render_component(title: "Title, summary and body")
    assert_select ".gem-c-summary-list .govuk-heading-m", text: "Title, summary and body"
  end

  it "renders section title with edit and delete actions" do
    render_component(
      title: "Title, summary and body",
      edit: {
        href: "#edit-title-summary-body",
        data_attributes: {
          gtm: "edit-title-summary-body",
        },
      },
      delete: {
        href: "#delete-title-summary-body",
        data_attributes: {
          gtm: "delete-title-summary-body",
        },
      },
    )
    assert_select ".gem-c-summary-list h3.govuk-heading-m.gem-c-summary-list__group-title", text: "Title, summary and body"
    assert_select '.gem-c-summary-list__group-actions-list .govuk-link[href="#edit-title-summary-body"][data-gtm="edit-title-summary-body"]', text: "Change Title, summary and body"
    assert_select '.gem-c-summary-list__group-actions-list .govuk-link.gem-link--destructive[href="#delete-title-summary-body"][data-gtm="delete-title-summary-body"]', text: "Delete Title, summary and body"
  end

  it "renders section title with custom link text and heading level" do
    render_component(
      title: "Items",
      heading_level: 2,
      heading_size: "l",
      edit: {
        href: "#custom-action",
        link_text: "Reorder",
      },
    )
    assert_select ".gem-c-summary-list h2.govuk-heading-l", text: "Items"
    assert_select '.gem-c-summary-list__group-actions-list .govuk-link[href="#custom-action"]', text: "Reorder Items"
  end

  it "renders section title with block" do
    render_component(
      title: "Title, summary and body",
      block: sanitize('<p class="govuk-body">Some HTML</p>'),
    )
    assert_select ".gem-c-summary-list .govuk-heading-m", text: "Title, summary and body"
    assert_select ".gem-c-summary__block", text: "Some HTML"
  end

  it "renders without borders" do
    render_component(
      title: "Title, summary and body",
      borderless: true,
    )
    assert_select ".gem-c-summary-list.govuk-summary-list--no-border"
  end

  it "renders items" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
        },
        {
          field: "Summary",
          value: "Find out more about our reviews on the subject of ethical standards for public service providers, including our 2014 report, 2015 guidance and 2018 follow-up publication.",
        },
      ],
    )
    assert_select ".govuk-summary-list__row", 2
    assert_select ".govuk-summary-list__key", text: "Title"
    assert_select ".govuk-summary-list__value", text: "Find out more about our reviews on the subject of ethical standards for public service providers, including our 2014 report, 2015 guidance and 2018 follow-up publication."
  end

  it "renders items with only the edit action" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
          edit: {
            href: "#edit-title",
            data_attributes: {
              gtm: "edit-title",
            },
          },
        },
      ],
    )
    assert_select ".govuk-summary-list__key", text: "Title"
    assert_select ".govuk-summary-list__value", text: "Ethical standards for public service providers"
    assert_select 'dd.govuk-summary-list__actions .govuk-link[href="#edit-title"][data-gtm="edit-title"]', text: /Change\s*Title\s*/
  end

  it "renders items with only the delete action" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
          delete: {
            href: "#delete-title",
            data_attributes: {
              gtm: "delete-title",
            },
          },
        },
      ],
    )
    assert_select ".govuk-summary-list__key", text: "Title"
    assert_select ".govuk-summary-list__value", text: "Ethical standards for public service providers"
    assert_select 'dd.govuk-summary-list__actions .govuk-link.gem-link--destructive[href="#delete-title"][data-gtm="delete-title"]', text: /\s*Delete\s*Title\s*/
  end

  it "renders items with both the edit and the delete action" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
          edit: {
            href: "#edit-title",
          },
          delete: {
            href: "#delete-title",
          },
        },
      ],
    )
    assert_select ".govuk-summary-list__key", text: "Title"
    assert_select ".govuk-summary-list__value", text: "Ethical standards for public service providers"
    assert_select 'li.govuk-summary-list__actions-list-item .govuk-link[href="#edit-title"]', text: /\s*Change\s*Title\s*/
    assert_select 'li.govuk-summary-list__actions-list-item .govuk-link.gem-link--destructive[href="#delete-title"]', text: /\s*Delete\s*Title\s*/
  end

  it "renders items with custom text for edit and delete action" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
          edit: {
            href: "#edit-title",
            link_text: "Edit",
          },
          delete: {
            href: "#delete-title",
            link_text: "Remove",
          },
        },
      ],
    )
    assert_select '.govuk-summary-list__actions-list-item .govuk-link[href="#edit-title"]', text: /\s*Edit\s*Title\s*/
    assert_select '.govuk-summary-list__actions-list-item .govuk-link.gem-link--destructive[href="#delete-title"]', text: /\s*Remove\s*Title\s*/
  end

  it "renders the edit action on section" do
    render_component(
      title: "Title",
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
        },
      ],
      edit: {
        href: "edit-title",
      },
    )
    assert_select 'div.govuk-summary-list__actions-list .govuk-link[href="edit-title"]', text: /\s*Change\s*Title\s*/
  end

  it "renders the delete action on section" do
    render_component(
      title: "Title",
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
        },
      ],
      delete: {
        href: "delete-title",
      },
    )
    assert_select 'div.govuk-summary-list__actions-list .govuk-link[href="delete-title"]', text: /\s*Delete\s*Title\s*/
  end

  it "renders the edit and delete actions on section" do
    render_component(
      title: "Title",
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
        },
      ],
      edit: {
        href: "edit-title",
        data_attributes: {
          gtm: "edit-title",
        },
      },
      delete: {
        href: "delete-title",
        data_attributes: {
          gtm: "delete-title",
        },
      },
    )
    assert_select 'ul.govuk-summary-list__actions-list .govuk-summary-list__actions-list-item .govuk-link[href="edit-title"][data-gtm="edit-title"]', text: /\s*Change\s*Title\s*/
    assert_select 'ul.govuk-summary-list__actions-list .govuk-summary-list__actions-list-item .govuk-link[href="delete-title"][data-gtm="delete-title"]', text: /\s*Delete\s*Title\s*/
  end

  it "renders the edit and delete actions on section with custom text" do
    render_component(
      title: "Title",
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
        },
      ],
      edit: {
        href: "edit-title",
        link_text: "Edit",
      },
      delete: {
        href: "delete-title",
        link_text: "Destroy",
      },
    )
    assert_select 'ul.govuk-summary-list__actions-list .govuk-summary-list__actions-list-item .govuk-link[href="edit-title"]', text: /\s*Edit\s*Title\s*/
    assert_select 'ul.govuk-summary-list__actions-list .govuk-summary-list__actions-list-item .govuk-link[href="delete-title"]', text: /\s*Destroy\s*Title\s*/
  end

  it "renders all links without visually hidden extra text if specified" do
    render_component(
      title: "Something",
      edit: {
        href: "edit-something",
        link_text_no_enhance: true,
      },
      delete: {
        href: "delete-something",
        link_text_no_enhance: true,
      },
      items: [
        {
          field: "Item 1",
          value: "Ethical standards for public service providers",
          edit: {
            href: "#edit-item-1-title",
            link_text_no_enhance: true,
          },
          delete: {
            href: "#delete-item-1-title",
            link_text_no_enhance: true,
          },
        },
        {
          field: "Item 2",
          value: "Ethical standards for janitorial staff",
          edit: {
            href: "#edit-item-2-title",
          },
          delete: {
            href: "#delete-item-2-title",
          },
        },
      ],
    )
    assert_select '.govuk-summary-list__actions-list .govuk-link[href="edit-something"]', text: /\s*Change\s*/
    assert_select '.govuk-summary-list__actions-list .govuk-link[href="delete-something"]', text: /\s*Delete\s*/

    assert_select '.govuk-summary-list__row .govuk-summary-list__actions .govuk-link[href="#edit-item-1-title"]', text: /\s*Change\s*/
    assert_select '.govuk-summary-list__row .govuk-summary-list__actions .govuk-link.gem-link--destructive[href="#delete-item-1-title"]', text: /\s*Delete\s*/

    assert_select '.govuk-summary-list__row .govuk-summary-list__actions .govuk-link[href="#edit-item-2-title"]', text: /\s*Change\s*Item\s*2\s*/
    assert_select '.govuk-summary-list__row .govuk-summary-list__actions .govuk-link.gem-link--destructive[href="#delete-item-2-title"]', text: /\s*Delete\s*Item\s*2\s*/
  end

  it "renders the wider dt layout" do
    render_component(
      title: "Title",
      wide_title: true,
      items: [
        {
          field: "Allow us to contact you regarding your fruit preferences",
          value: "No",
        },
      ],
    )
    assert_select(".gem-c-summary-list.gem-c-summary-list--wide-title")
  end

  it "renders component with row data attributes" do
    render_component(
      title: "Title",
      items: [
        {
          field: "One",
          value: "Value 1",
          data: { module: "something" },
        },
      ],
    )

    assert_select ".govuk-summary-list__row[data-module='something']", text: /One/
  end
end
