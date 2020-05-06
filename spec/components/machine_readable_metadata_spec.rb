require "rails_helper"

describe "Machine readable metadata", type: :view do
  def component_name
    "machine_readable_metadata"
  end

  it "generates machine readable JSON-LD for articles" do
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: "generic")
    render_component(content_item: example, schema: :article)

    json_linked_data = Nokogiri::HTML(rendered).css("script").text

    assert JSON.parse(json_linked_data)
  end

  it "generates machine readable JSON-LD for people" do
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: "person")
    render_component(content_item: example, schema: :person)

    json_linked_data = Nokogiri::HTML(rendered).css("script").text

    assert JSON.parse(json_linked_data)
  end

  it "uses images if available" do
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: "news_article") do |item|
      item["details"]["image"] = {
        "url" => "https://example.org/low-res.jpg",
      }
      item
    end

    render_component(content_item: example, schema: :article)

    assert_meta_tag "twitter:image", "https://example.org/low-res.jpg"
  end

  it "uses high resolution images if available" do
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: "news_article") do |item|
      item["details"]["image"] = {
        "url" => "https://example.org/low-res.jpg",
        "high_resolution_url" => "https://example.org/high-res.jpg",
      }
      item
    end

    render_component(content_item: example, schema: :article)

    assert_meta_tag "twitter:image", "https://example.org/high-res.jpg"
  end

  it "generates machine readable JSON-LD for finders" do
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: "finder")
    render_component(content_item: example, schema: :search_results_page)

    json_linked_data = Nokogiri::HTML(rendered).css("script").text

    assert JSON.parse(json_linked_data)
  end

  def assert_meta_tag(name, content)
    assert_select "meta[name='#{name}'][content='#{content}']"
  end
end
