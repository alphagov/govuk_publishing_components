require "rails_helper"

describe "Search with autocomplete", type: :view do
  def component_name
    "search_with_autocomplete"
  end

  it "requires source_url parameter to be set" do
    expect { render_component({ source_key: "foo" }) }.to raise_error(
      /requires source_url and source_key/,
    )
  end

  it "requires source_key parameter to be set" do
    expect { render_component({ source_url: "foo" }) }.to raise_error(
      /requires source_url and source_key/,
    )
  end

  it "renders the search component within itself" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
    })
    assert_select ".gem-c-search-with-autocomplete .gem-c-search"
  end

  it "passes on options to the search component" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
      on_govuk_blue: true,
      name: "custom_field_name",
      button_text: "Some test text",
    })

    assert_select ".gem-c-search.gem-c-search--on-govuk-blue"
    assert_select ".gem-c-search input[name='custom_field_name']"
    assert_select ".gem-c-search button", text: "Some test text"
  end

  it "can render in large and govuk-blue variants" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
      on_govuk_blue: true,
      size: "large",
    })

    assert_select ".gem-c-search.gem-c-search--on-govuk-blue.gem-c-search--large"
  end

  it "applies a margin bottom of 0" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
      margin_bottom: 0,
    })
    assert_select '.gem-c-search-with-autocomplete.govuk-\!-margin-bottom-0'
  end

  it "applies a valid margin bottom" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
      margin_bottom: 4,
    })
    assert_select '.gem-c-search-with-autocomplete.govuk-\!-margin-bottom-4'
  end

  it "defaults to a margin bottom of 6" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
    })
    assert_select '.gem-c-search-with-autocomplete.govuk-\!-margin-bottom-6'
  end

  it "sets margin bottom to 6 if an invalid number is passed" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
      margin_bottom: -1,
    })
    assert_select '.gem-c-search-with-autocomplete.govuk-\!-margin-bottom-6'
  end

  it "disables margin bottom on the child search component" do
    render_component({
      source_url: "http://example.org/api/autocomplete",
      source_key: "suggestions",
    })
    assert_select '.gem-c-search.govuk-\!-margin-bottom-0'
  end
end
