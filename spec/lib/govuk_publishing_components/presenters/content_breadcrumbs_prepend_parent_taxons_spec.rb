require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContentBreadcrumbsPrependParentTaxons do
  let(:parent) { GovukSchemas::RandomExample.for_schema(frontend_schema: "taxon") }

  it 'foo' do
    # binding.irb
  end

  def given_theres_a_page_with_coronavirus_taxon
    live_taxon = example_item("taxon", "taxon")
    live_taxon["links"]["parent_taxons"] << coronavirus_taxon

    content_store_has_random_item links: { "taxons" => [live_taxon] }
  end

  def content_store_has_random_item(schema: "placeholder", links: {})
    content_item = random_item(
      schema,
      "base_path" => "/page-with-contextual-navigation",
      "links" => links,
    )

    stub_content_store_has_item(content_item["base_path"], content_item)
  end

  def random_step_nav_item(schema_name)
    GovukSchemas::Example.find(schema_name, example_name: "step_by_step_nav")
  end

  def example_item(schema_name, example_name)
    GovukSchemas::Example.find(schema_name, example_name: example_name)
  end

  def random_item(schema_name, merge_with = {})
    GovukSchemas::RandomExample.for_schema(frontend_schema: schema_name) do |random_item|
      random_item.merge(merge_with)
    end
  end
end
