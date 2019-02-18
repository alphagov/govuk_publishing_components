require 'rails_helper'

describe "AccessibleAutocomplete", type: :view do
  def component_name
    "accessible_autocomplete"
  end

  it 'renders select element' do
    render_component(
      id: 'basic-autocomplete',
      label: { text: "Countries" },
      options: [['United Kingdom', 'gb'], ['United States', 'us']]
    )

    assert_select ".govuk-label", text: "Countries", for: "basic-autocomplete"
    assert_select "select#basic-autocomplete"
    assert_select "select[multiple]", false
    assert_select "select#basic-autocomplete option[value=gb]"
    assert_select "select#basic-autocomplete option[value=gb]", text: 'United Kingdom'
    assert_select "select#basic-autocomplete option[value=us]"
    assert_select "select#basic-autocomplete option[value=us]", text: 'United States'
  end

  it 'renders select element with selected value' do
    render_component(
      id: 'basic-autocomplete',
      label: { text: "Countries" },
      options: [['United Kingdom', 'gb'], ['United States', 'us']],
      selected_option: ['United States', 'us']
    )

    assert_select ".govuk-label", text: "Countries", for: "basic-autocomplete"
    assert_select "select#basic-autocomplete"
    assert_select "select#basic-autocomplete option[value=gb]"
    assert_select "select#basic-autocomplete option[value=us][selected]"
  end

  it 'does not render when no data is specified' do
    assert_empty render_component({})
  end

  it 'does not render when no label is specified' do
    assert_empty render_component(
      id: 'basic-autocomplete',
      options: [['United Kingdom', 'gb'], ['United States', 'us']]
    )
  end

  it 'does not render when no options are specified' do
    assert_empty render_component(
      id: 'basic-autocomplete',
      label: { text: "Countries" }
    )
  end

  it 'renders the multiple selection version correctly' do
    render_component(
      multiple: true,
      label: { text: "Countries" },
      options: [['United Kingdom', 'gb'], ['United States', 'us']]
    )

    assert_select "select[multiple]"
    assert_select ".gem-c-accessible-autocomplete.gem-c-accessible-autocomplete--hide-facets", false
    assert_select ".gem-c-accessible-autocomplete .gem-c-autocomplete__multiselect-instructions"
  end

  it 'does not show facet tags for multiple when given the option' do
    render_component(
      multiple: true,
      hide_facets: true,
      label: { text: "Countries" },
      options: [['United Kingdom', 'gb'], ['United States', 'us']]
    )

    assert_select ".gem-c-accessible-autocomplete.gem-c-accessible-autocomplete--hide-facets"
  end
end
