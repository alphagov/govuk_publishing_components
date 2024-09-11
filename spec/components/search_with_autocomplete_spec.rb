require "rails_helper"

describe "Search with autocomplete", type: :view do
  def component_name
    "search_with_autocomplete"
  end

  it "requires source parameter to be set" do
    expect { render_component({ source_key: "foo" }) }.to raise_error(
      /requires source and source_key/,
    )
  end

  it "requires source_key parameter to be set" do
    expect { render_component({ source_key: "foo" }) }.to raise_error(
      /requires source and source_key/,
    )
  end

  it "renders the search component within itself" do
    render_component({
      source: "http://example.org/api/autocomplete",
      source_key: "suggestions",
    })
    assert_select ".gem-c-search-with-autocomplete .gem-c-search"
  end

  it "passes on options to the search component" do
    render_component({
      source: "http://example.org/api/autocomplete",
      source_key: "suggestions",
      on_govuk_blue: true,
      name: "custom_field_name",
      button_text: "Some test text",
    })

    assert_select ".gem-c-search.gem-c-search--on-govuk-blue"
    assert_select ".gem-c-search input[name='custom_field_name']"
    assert_select ".gem-c-search button", text: "Some test text"
  end
end
