require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::SchemaOrg do
  describe "#structured_data" do
    it "generates schema.org Articles" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer") do |random_item|
        random_item.merge(
          "base_path" => "/foo",
          "details" => {
            "body" => "Foo"
          }
        )
      end

      structured_data = GovukPublishingComponents::Presenters::SchemaOrg.new(
        content_item: content_item,
        schema: :article,
      ).structured_data

      expect(structured_data['@type']).to eql("Article")
      expect(structured_data['mainEntityOfPage']['@id']).to eql("http://www.dev.gov.uk/foo")
      expect(structured_data['articleBody']).to eql("Foo")
    end

    it "generates schema.org NewsArticles" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer")

      structured_data = GovukPublishingComponents::Presenters::SchemaOrg.new(
        content_item: content_item,
        schema: :news_article,
      ).structured_data

      expect(structured_data['@type']).to eql("NewsArticle")
    end

    it "allows override of the URL" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer") do |random_item|
        random_item.merge(
          "base_path" => "/foo"
        )
      end

      structured_data = GovukPublishingComponents::Presenters::SchemaOrg.new(
        content_item: content_item,
        schema: :article,
        canonical_url: "https://www.gov.uk/foo/bar"
      ).structured_data

      expect(structured_data['mainEntityOfPage']['@id']).to eql("https://www.gov.uk/foo/bar")
    end

    it "allows override of the body" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer") do |random_item|
        random_item.merge(
          "base_path" => "/foo",
          "details" => {
            "body" => "Foo"
          }
        )
      end

      structured_data = GovukPublishingComponents::Presenters::SchemaOrg.new(
        content_item: content_item,
        schema: :article,
        body: "Bar"
      ).structured_data

      expect(structured_data['articleBody']).to eql("Bar")
    end

    it "adds the primary publishing org as the author" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer") do |random_item|
        random_item.merge(
          "links" => {
            "primary_publishing_organisation" => [
              {
                "content_id" => "d944229b-a5ad-453d-8e16-cb5dcfcdb866",
                "title" => "Foo org",
                "locale" => "en",
                "base_path" => "/orgs/foo",
              }
            ]
          }
        )
      end

      structured_data = GovukPublishingComponents::Presenters::SchemaOrg.new(
        content_item: content_item,
        schema: :article,
      ).structured_data

      expect(structured_data['author']['name']).to eql("Foo org")
    end

    it "adds an image if it's available" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "news_article") do |random_item|
        random_item["details"]["image"] = { "url" => "/foo" }
        random_item
      end

      structured_data = GovukPublishingComponents::Presenters::SchemaOrg.new(
        content_item: content_item,
        schema: :article,
      ).structured_data

      expect(structured_data['image']).to eql(["/foo"])
    end
  end
end
