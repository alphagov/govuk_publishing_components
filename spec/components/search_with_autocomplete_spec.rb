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

  it "renders a search box with default options" do
    render_component({
      source: "http://example.org/api/autocomplete",
      source_key: "suggestions",
    })
    assert_select ".gem-c-search-with-autocomplete"
  end
end
