require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContentBreadcrumbsBasedOnTaxons do
  describe "Taxon breadcrumbs" do
    it "can handle any valid content item" do
      payload = GovukSchemas::RandomExample.for_schema(
        frontend_schema: "taxon",
      )

      expect {
        described_class.new(
          payload,
        ).breadcrumbs
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

    it "places parent under the root when there is a taxon" do
      content_item = content_item_tagged_to_taxon([])
      breadcrumbs = breadcrumbs_for(content_item)

      expect(breadcrumbs).to eq(
        [
          { title: "Home", url: "/", is_page_parent: false },
          { title: "Taxon", url: "/taxon", is_page_parent: true },
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

        content_item = content_item_tagged_to_taxon([parent])
        breadcrumbs = breadcrumbs_for(content_item)

        expect(breadcrumbs).to eq(
          [
            { title: "Home", url: "/", is_page_parent: false },
            { title: "Another-parent", url: "/another-parent", is_page_parent: false },
            { title: "A-parent", url: "/a-parent", is_page_parent: false },
            { title: "Taxon", url: "/taxon", is_page_parent: true },
          ],
        )
      end
    end

    context "with a taxon content item with parent taxons" do
      it "includes parents and grandparents when available" do
        parent = {
          "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
          "locale" => "en",
          "title" => "A-parent",
          "base_path" => "/a-parent",
          "phase" => "live",
          "links" => {
            "parent_taxons" => [],
          },
        }

        content_item = taxon_with_parent_taxons([parent])
        breadcrumbs = breadcrumbs_for(content_item)

        expect(breadcrumbs).to eq(
          [
            { title: "Home", url: "/", is_page_parent: false },
            { title: "A-parent", url: "/a-parent", is_page_parent: true },
          ],
        )
      end

      context "when parent taxon has a url_override" do
        it "uses the url_override value instead of the base_path" do
          parent = {
            "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
            "locale" => "en",
            "title" => "A-parent",
            "base_path" => "/a-parent",
            "phase" => "live",
            "links" => {
              "parent_taxons" => [],
            },
            "details" => {
              "url_override" => "/foo",
            },
          }

          content_item = taxon_with_parent_taxons([parent])
          breadcrumbs = breadcrumbs_for(content_item)

          expect(breadcrumbs).to eq(
            [
              { title: "Home", url: "/", is_page_parent: false },
              { title: "A-parent", url: "/foo", is_page_parent: true },
            ],
          )
        end
      end
    end

    context "with multiple parents" do
      it "selects the first parent taxon in alphabetical order by title" do
        parent1 = {
          "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
          "locale" => "en",
          "title" => "Parent A",
          "base_path" => "/parent-a",
          "phase" => "live",
          "links" => {
            "parent_taxons" => [],
          },
        }
        parent2 = {
          "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
          "locale" => "en",
          "title" => "Parent B",
          "base_path" => "/parent-b",
          "phase" => "live",
          "links" => {
            "parent_taxons" => [],
          },
        }

        content_item = taxon_with_parent_taxons([parent2, parent1])
        breadcrumbs = breadcrumbs_for(content_item)

        expect(breadcrumbs).to eq(
          [
            { title: "Home", url: "/", is_page_parent: false },
            { title: "Parent A", url: "/parent-a", is_page_parent: true },
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

  def content_item_tagged_to_taxon(parents)
    {
      "title" => "Some Content",
      "document_type" => "answer",
      "links" => {
        "taxons" => [
          {
            "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
            "locale" => "en",
            "title" => "Taxon",
            "base_path" => "/taxon",
            "phase" => "live",
            "links" => {
              "parent_taxons" => parents,
            },
          },
        ],
      },
    }
  end
end
