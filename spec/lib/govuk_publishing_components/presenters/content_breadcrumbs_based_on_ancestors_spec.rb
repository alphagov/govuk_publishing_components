require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::ContentBreadcrumbsBasedOnAncestors do
  describe "#breadcrumbs" do
    it "can handle any valid content item" do
      payload = GovukSchemas::RandomExample.for_schema(frontend_schema: "guide")

      expect { described_class.new(payload).breadcrumbs }.not_to raise_error
    end

    it "returns the root when parent is not specified" do
      content_item = { "links" => {} }
      breadcrumbs = breadcrumbs_for(content_item)

      expect(breadcrumbs).to eq(
        [
          { title: "Home", url: "/" },
        ],
      )
    end

    it "returns the root when parent is empty" do
      content_item = content_item_with_parents([])
      breadcrumbs = breadcrumbs_for(content_item)

      expect(breadcrumbs).to eq(
        [
          { title: "Home", url: "/" },
        ],
      )
    end

    it "places parent under the root when there is a parent" do
      parent = {
        "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
        "locale" => "en",
        "title" => "A-parent",
        "base_path" => "/a-parent",
      }

      content_item = content_item_with_parents([parent])
      breadcrumbs = breadcrumbs_for(content_item)

      expect(breadcrumbs).to eq(
        [
          { title: "Home", url: "/" },
          { title: "A-parent", url: "/a-parent" },
        ],
      )
    end

    it "includes grandparent when available" do
      grandparent = {
        "title" => "Another-parent",
        "base_path" => "/another-parent",
        "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
        "locale" => "en",
      }

      parent = {
        "content_id" => "30c1b93d-2553-47c9-bc3c-fc5b513ecc32",
        "locale" => "en",
        "title" => "A-parent",
        "base_path" => "/a-parent",
        "links" => {
          "parent" => [grandparent],
        },
      }

      content_item = content_item_with_parents([parent])
      breadcrumbs = breadcrumbs_for(content_item)

      expect(breadcrumbs).to eq(
        [
          { title: "Home", url: "/" },
          { title: "Another-parent", url: "/another-parent" },
          { title: "A-parent", url: "/a-parent" },
        ],
      )
    end
  end

  def content_item_with_parents(parents)
    {
      "links" => { "parent" => parents },
    }
  end

  def breadcrumbs_for(content_item)
    fully_valid_content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "guide") do |random_item|
      random_item.merge(content_item)
    end

    described_class.new(fully_valid_content_item).breadcrumbs
  end
end
