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

      structured_data = generate_structured_data(
        content_item: content_item,
        schema: :article,
      ).structured_data

      expect(structured_data['@type']).to eql("Article")
      expect(structured_data['mainEntityOfPage']['@id']).to eql("http://www.dev.gov.uk/foo")
      expect(structured_data['articleBody']).to eql("Foo")
    end

    it "generates schema.org NewsArticles" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer")

      structured_data = generate_structured_data(
        content_item: content_item,
        schema: :news_article,
      ).structured_data

      expect(structured_data['@type']).to eql("NewsArticle")
    end

    it "generates schema.org Person" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "person")

      structured_data = generate_structured_data(
        content_item: content_item,
        schema: :person,
      ).structured_data

      expect(structured_data['@type']).to eql("Person")
    end

    it "allows override of the URL" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer") do |random_item|
        random_item.merge(
          "base_path" => "/foo"
        )
      end

      structured_data = generate_structured_data(
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

      structured_data = generate_structured_data(
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

      structured_data = generate_structured_data(
        content_item: content_item,
        schema: :article,
      ).structured_data

      expect(structured_data['author']['name']).to eql("Foo org")
    end

    it "links to step by steps that it belongs to" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "answer") do |random_item|
        random_item.merge(
          "first_published_at" => "2017-09-04T13:50:49.000+00:00",
          "links" => {
            "part_of_step_navs" => [
              {
                "api_path" => "/api/content/employ-someone",
                "base_path" => "/employ-someone",
                "content_id" => "47bcdf4c-9df9-48ff-b1ad-2381ca819464",
                "description" => "Employ someone: agree a contract, right to work checks, DBS checks, workplace pensions, set up PAYE, tell HMRC",
                "details" => {},
                "document_type" => "step_by_step_nav",
                "locale" => "en",
                "public_updated_at" => "2018-06-22T12:12:38Z",
                "schema_name" => "step_by_step_nav",
                "title" => "Employ someone: step by step",
                "api_url" => "https://www.gov.uk/api/content/employ-someone",
                "web_url" => "https://www.gov.uk/employ-someone"
              }
            ],
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

      structured_data = generate_structured_data(
        content_item: content_item,
        schema: :article
      ).structured_data

      expect(structured_data['isPartOf'][0]['@type']).to eq('HowTo')
      expect(structured_data['isPartOf'][0]['sameAs']).to eq('http://www.dev.gov.uk/employ-someone')
    end

    it "adds an image if it's available" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "news_article") do |random_item|
        random_item["details"]["image"] = { "url" => "/foo" }
        random_item
      end

      structured_data = generate_structured_data(
        content_item: content_item,
        schema: :article,
      ).structured_data

      expect(structured_data['image']).to eql(["/foo"])
    end

    it "adds placeholders if there's no image" do
      content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "news_article") do |random_item|
        random_item["details"].delete("image")
        random_item
      end

      structured_data = generate_structured_data(
        content_item: content_item,
        schema: :article,
        image_placeholders: [1, 2]
      ).structured_data

      expect(structured_data['image']).to eql([1, 2])
    end

    def generate_structured_data(args)
      GovukPublishingComponents::Presenters::SchemaOrg.new(GovukPublishingComponents::Presenters::Page.new(args))
    end
  end
end
