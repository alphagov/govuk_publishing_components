require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::RelatedNavigationHelper do
  def payload_for(schema, content_item, context = nil)
    example = GovukSchemas::RandomExample.for_schema(frontend_schema: schema) do |payload|
      payload.merge(content_item)
    end

    described_class.new(content_item: example, context: context)#.related_navigation
  end

  describe "#related_navigation" do
    it "can handle randomly generated content" do
      expect { payload_for("placeholder", {}) }.to_not raise_error
    end

    it "returns empty arrays if there are no related navigation sidebar links" do
      nothing = payload_for(
        "placeholder",
        "details" => {
          "external_related_links" => [],
        },
        "links" => {},
      )

      expected = {
        "related_items" => [],
        "related_guides" => [],
        "collections" => [],
        "topics" => [],
        "topical_events" => [],
        "world_locations" => [],
        "statistical_data_sets" => [],
        "related_contacts" => [],
        "related_external_links" => [],
      }

      expect(nothing.total_links).to eq(0)
      expect(nothing.related_navigation).to eq(expected)
    end

    it "extracts and returns the appropriate related links" do
      payload = payload_for(
        "speech",
        "details" => {
          "body" => "body",
          "government" => {
            "title" => "government",
            "slug" => "government",
            "current" => true,
          },
          "political" => true,
          "delivered_on" => "2017-09-22T14:30:00+01:00",
        },
        "links" => {
          "ordered_related_items" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-item",
              "title" => "related item",
            },
          ],
          "document_collections" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-collection",
              "title" => "related collection",
              "document_type" => "document_collection",
            },
          ],
          "topics" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-topic",
              "title" => "related topic",
              "document_type" => "topic",
            },
          ],
          "topical_events" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-topical-event",
              "title" => "related topical event",
              "document_type" => "topical_event",
            },
          ],
          "organisations" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-organisation",
              "title" => "related organisation",
              "document_type" => "organisation",
            },
          ],
          "mainstream_browse_pages" => [
            {
              "content_id" => "06ddefca-c44b-4b7b-b0de-226d15129a29",
              "locale" => "en",
              "base_path" => "/browse/something",
              "title" => "A mainstream browse page",
              "document_type" => "mainstream_browse_page",
            },
          ],
          "world_locations" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "title" => "World, ~ (@Location)",
              "locale" => "en",
            },
          ],
        },
      )

      expected = {
        "related_items" => [{ locale: "en", path: "/related-item", text: "related item" }],
        "related_guides" => [],
        "collections" => [{ locale: "en", path: "/related-collection", text: "related collection" }],
        "topics" => [
          { locale: "en", path: "/browse/something", text: "A mainstream browse page" },
          { locale: "en", path: "/related-topic", text: "related topic" },
        ],
        "related_contacts" => [],
        "related_external_links" => [],
        "topical_events" => [{ locale: "en", path: "/related-topical-event", text: "related topical event" }],
        "world_locations" => [{ locale: "en", path: "/world/world-location/news", text: "World, ~ (@Location)" }],
        "statistical_data_sets" => [],
      }

      expect(payload.total_links).to eql(6)
      expect(payload.related_navigation).to eql(expected)
    end

    it "returns statistical data sets" do
      payload = payload_for(
        "publication",
        "details" => {
          "body" => "body",
          "government" => {
            "title" => "government",
            "slug" => "government",
            "current" => true,
          },
          "political" => false,
          "documents" => [],
          "first_public_at" => "2016-01-01T19:00:00Z",
        },
        "links" => {
          "related_statistical_data_sets" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "title" => "related statistical data set",
              "base_path" => "/related-statistical-data-set",
              "document_type" => "statistical_data_set",
              "locale" => "en",
            },
          ],
        },
      )

      expect(payload.total_links).to eql(1)
      expect(payload.related_navigation["statistical_data_sets"]).to eql(
        [{ locale: "en", path: "/related-statistical-data-set", text: "related statistical data set" }],
      )
    end

    it "deduplicates topics for mainstream content" do
      payload = payload_for(
        "answer",
        "details" => {
          "external_related_links" => [],
        },
        "links" => {
          "mainstream_browse_pages" => [
            {
              "content_id" => "fecdc8c8-4006-4f8e-95d5-fe40ca49c7a8",
              "locale" => "en",
              "title" => "Self Assessment",
              "base_path" => "/browse/tax/self-assessment",
              "document_type" => "mainstream_browse_page",
            },
          ],
          "ordered_related_items" => [
            {
              "content_id" => "f29ca4a8-8ed9-4b0f-bb6a-11e373095dee",
              "locale" => "en",
              "title" => "Self Assessment tax returns",
              "base_path" => "/self-assessment-tax-returns",
              "document_type" => "guide",
            },
          ],
          "topics" => [
            {
              "content_id" => "7beb97b6-75c9-4aa7-86be-a733ab3a21aa",
              "locale" => "en",
              "base_path" => "/topic/personal-tax/self-assessment",
              "title" => "Self Assessment",
              "document_type" => "topic",
            },
          ],
        },
      )

      expect(payload.total_links).to eql(2)
      expect(payload.related_navigation["topics"]).to eql(
        [{ locale: "en", text: "Self Assessment", path: "/browse/tax/self-assessment" }],
      )
    end

    it "handles ordered related items that aren't tagged to a mainstream browse page" do
      example = GovukSchemas::Example.find("guide", example_name: "single-page-guide")
      payload = described_class.new(content_item: example)
      expected = [
        { locale: "en", text: "Travel abroad", path: "/browse/abroad/travel-abroad" },
        { locale: "en", text: "Arriving in the UK", path: "/browse/visas-immigration/arriving-in-the-uk" },
        { locale: "en", text: "Pets", path: "/topic/animal-welfare/pets" },
      ]
      expect(payload.total_links).to eql(3)
      expect(payload.related_navigation["topics"]).to eql(expected)
    end

    it "returns an Elsewhere on the web section for external related links" do
      payload = payload_for(
        "placeholder",
        "details" => {
          "external_related_links" => [
            {
              "title" => "external-link",
              "url" => "https://external",
            },
          ],
        },
      )

      expect(payload["related_external_links"]).to eql([
        {
          path: "https://external",
          text: "external-link",
          rel: "external",
        },
      ])
    end

    it "returns an 'Other contacts' section" do
      payload = payload_for(
        "contact",
        "links" => {
          "related" => [
            {
              "content_id" => "d636b991-a239-497b-be51-1617b0299cf5",
              "locale" => "en",
              "base_path" => "/foo",
              "document_type" => "contact",
              "title" => "Foo",
            },
          ],
        },
      )

      expect(payload["related_contacts"]).to eql(
        [{ locale: "en", path: "/foo", text: "Foo" }],
      )
    end

    it "returns live taxons" do
      payload = payload_for(
        "placeholder",
        "details" => {
          "external_related_links" => [],
        },
        "links" => {
          "taxons" => [
            {
              "title" => "Taxon B",
              "base_path" => "/taxon-b",
              "content_id" => "82a84770-ec89-4f75-8335-4ff78d84d97d",
              "document_type" => "taxon",
              "description" => "The B taxon.",
              "phase" => "live",
              "locale" => "en",
            },
            {
              "title" => "Taxon A",
              "base_path" => "/taxon-a",
              "content_id" => "c8743ebd-ceb3-493b-b66a-e3bb4d30b7be",
              "document_type" => "taxon",
              "description" => "The A taxon.",
              "phase" => "live",
              "locale" => "en",
            },
            {
              "title" => "Taxon C",
              "base_path" => "/taxon-c",
              "content_id" => "6271264a-72fa-4c12-aaa2-ab3071d3d133",
              "document_type" => "taxon",
              "description" => "The C taxon.",
              "phase" => "draft",
              "locale" => "en",
            },
          ],
        },
      )

      expect(payload["topics"]).to eql(
        [
          { locale: "en", path: "/taxon-b", text: "Taxon B" },
          { locale: "en", path: "/taxon-a", text: "Taxon A" },
        ],
      )
    end

    context "for a sidebar" do
      subject(:payload) { payload_for("placeholder", {}, :sidebar) }

      it "only includes collections, guides and related items" do
        expect(payload).to include(
          "collections",
          "related_guides",
          "related_items",
        )

        expect(payload).to_not include(
          "related_contacts",
          "related_external_links",
          "statistical_data_sets",
          "topical_events",
          "topics",
          "world_locations",
        )
      end
    end

    context "for a footer" do
      subject(:payload) { payload_for("placeholder", {}, :footer) }

      it "only includes contacts external links, statistical datasets, topical events, topics and world locations" do
        expect(payload).to include(
          "related_contacts",
          "related_external_links",
          "statistical_data_sets",
          "topical_events",
          "topics",
          "world_locations",
        )

        expect(payload).to_not include(
          "collections",
          "related_guides",
          "related_items",
        )
      end
    end
  end
end
