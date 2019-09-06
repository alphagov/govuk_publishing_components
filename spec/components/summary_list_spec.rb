require 'rails_helper'

describe "Summary list", type: :view do
  def component_name
    'summary_list'
  end

  it "does not render anything if no data is passed" do
    test_data = {}
    assert_empty render_component(test_data)
  end

  it "renders section title" do
    render_component(title: 'Title, summary and body')
    assert_select '.gem-c-summary-list .govuk-heading-m', text: 'Title, summary and body'
  end

  it "renders section title with edit action" do
    render_component(
      title: 'Title, summary and body',
      edit: {
        href: "#edit-title-summary-body",
        data_attributes: {
          gtm: "edit-title-summary-body"
        }
      }
    )
    assert_select '.gem-c-summary-list .govuk-heading-m', text: 'Title, summary and body'
    assert_select '.gem-c-summary-list__edit-section-link[title="Edit Title, summary and body"][href="#edit-title-summary-body"][data-gtm="edit-title-summary-body"]', text: 'Edit Title, summary and body'
  end

  it "renders section title with custom link text" do
    render_component(
      title: 'Items',
      edit: {
        href: "#custom-action",
        link_text: "Reorder"
      }
    )
    assert_select '.gem-c-summary-list .govuk-heading-m', text: 'Items'
    assert_select '.gem-c-summary-list__edit-section-link[title="Reorder Items"][href="#custom-action"]', text: 'Reorder Items'
  end

  it "renders section title with block" do
    render_component(
      title: 'Title, summary and body',
      block: sanitize('<p class="govuk-body">Some HTML</p>')
    )
    assert_select '.gem-c-summary-list .govuk-heading-m', text: 'Title, summary and body'
    assert_select '.gem-c-summary__block', text: 'Some HTML'
  end

  it "renders without borders" do
    render_component(
      title: 'Title, summary and body',
      borderless: true
    )
    assert_select '.gem-c-summary-list.govuk-summary-list--no-border'
  end

  it "renders items" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers"
        },
        {
          field: "Summary",
          value: "Find out more about our reviews on the subject of ethical standards for public service providers, including our 2014 report, 2015 guidance and 2018 follow-up publication."
        }
      ]
    )
    assert_select '.govuk-summary-list__row', 2
    assert_select '.govuk-summary-list__key', text: 'Title'
    assert_select '.govuk-summary-list__value', text: 'Find out more about our reviews on the subject of ethical standards for public service providers, including our 2014 report, 2015 guidance and 2018 follow-up publication.'
  end

  it "renders items with edit action" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
          edit: {
            href: "#edit-title",
            data_attributes: {
              gtm: "edit-title"
            }
          }
        }
      ]
    )
    assert_select '.govuk-summary-list__key', text: 'Title'
    assert_select '.govuk-summary-list__value', text: 'Ethical standards for public service providers'
    assert_select '.govuk-summary-list__actions-list-item .govuk-link[title="Edit Title"][href="#edit-title"][data-gtm="edit-title"]', text: "Edit Title"
  end

  it "renders items with delete action" do
    render_component(
      items: [
        {
          field: "Title",
          value: "Ethical standards for public service providers",
          delete: {
            href: "#delete-title",
            data_attributes: {
              gtm: "delete-title"
            }
          }
        }
      ]
    )
    assert_select '.govuk-summary-list__key', text: 'Title'
    assert_select '.govuk-summary-list__value', text: 'Ethical standards for public service providers'
    assert_select '.govuk-summary-list__actions-list-item .govuk-link[title="Delete Title"][href="#delete-title"][data-gtm="delete-title"]', text: "Delete Title"
  end
end
