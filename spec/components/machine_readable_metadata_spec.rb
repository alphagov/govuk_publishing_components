require 'rails_helper'

describe "Machine readable metadata", type: :view do
  def component_name
    "machine_readable_metadata"
  end

  it "generates machine readable JSON-LD for articles" do
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: "generic")
    render_component(content_item: example, schema: :article)

    json_linked_data = Nokogiri::HTML(rendered).css('script').text

    assert JSON.parse(json_linked_data)
  end

  it "generates machine readable JSON-LD for people" do
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: "person")
    render_component(content_item: example, schema: :person)

    json_linked_data = Nokogiri::HTML(rendered).css('script').text

    assert JSON.parse(json_linked_data)
  end
end
