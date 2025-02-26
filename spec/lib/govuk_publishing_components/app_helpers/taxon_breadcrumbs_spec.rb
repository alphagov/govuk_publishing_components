require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::TaxonBreadcrumbs do
  describe "Taxon breadcrumbs" do
    it "can handle any valid content item" do
      payload = GovukSchemas::RandomExample.for_schema(
        frontend_schema: "taxon",
      )

      expect {
        described_class.new(payload).breadcrumbs
      }.not_to raise_error
    end

    it "returns the root when taxon is not specified" do
      content_item = {
        "title" => "Some Content",
        "document_type" => "answer",
        "links" => {},
      }
      breadcrumbs = breadcrumbs_for(content_item)

      expect(breadcrumbs).to eq(
        [
          { title: "Home", url: "/", is_page_parent: true },
        ],
      )
    end

    it "places parent under the root when it's a root-level taxon" do
      content_item = taxon_with_parent_taxons([])

      breadcrumbs = breadcrumbs_for(content_item)

      expect(breadcrumbs).to eq(
        [
          { title: "Home", url: "/", is_page_parent: true },
        ],
      )
    end

    context "with a taxon with taxon parents" do
      it "includes parents and grandparents when available" do
        grandparent = {
          "title" => "Another-parent",
          "base_path" => "/another-parent",
          "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
          "locale" => "en",
          "phase" => "live",
        }

        parent = {
          "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
          "locale" => "en",
          "title" => "A-parent",
          "base_path" => "/a-parent",
          "phase" => "live",
          "links" => {
            "parent_taxons" => [grandparent],
          },
        }

        content_item = taxon_with_parent_taxons([parent])
        breadcrumbs = breadcrumbs_for(content_item)

        expect(breadcrumbs).to eq(
          [
            { title: "Home", url: "/", is_page_parent: false },
            { title: "Another-parent", url: "/another-parent", is_page_parent: false },
            { title: "A-parent", url: "/a-parent", is_page_parent: true },
          ],
        )
      end
    end
  end

  def breadcrumbs_for(content_item)
    fully_valid_content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: content_item["document_type"]) do |random_item|
      random_item.merge(content_item)
    end

    described_class.new(fully_valid_content_item).breadcrumbs
  end

  def taxon_with_parent_taxons(parents)
    {
      "title" => "Taxon",
      "document_type" => "taxon",
      "links" => {
        "parent_taxons" => parents,
      },
    }
  end
end
