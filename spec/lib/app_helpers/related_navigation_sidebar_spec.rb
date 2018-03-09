require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::RelatedNavigationSidebar do
  def payload_for(schema, content_item)
    fully_valid_content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: schema) do |random_item|
      random_item.merge(content_item)
    end

    GovukPublishingComponents::AppHelpers::NavigationHelper.new(fully_valid_content_item).related_navigation_sidebar
  end

  describe "#related-navigation-sidebar" do
    it "can handle randomly generated content" do
      payload = GovukSchemas::RandomExample.for_schema(frontend_schema: "placeholder")

      expect { payload_for("placeholder", payload) }.to_not raise_error
    end

    it "returns empty arrays if there are no related navigation sidebar links" do
      nothing = payload_for("placeholder",
        "details" => {
          "external_related_links" => []
        },
        "links" => {
        })

      expected = {
        related_items: [],
        collections: [],
        statistical_data_sets: [],
        topics: [],
        topical_events: [],
        policies: [],
        publishers: [],
        world_locations: [],
        worldwide_organisations: [],
        other: [[], []]
      }

      expect(nothing).to eql(expected)
    end

    it "extracts and returns the appropriate related links" do
      payload = payload_for("speech",
        "details" => {
          "body" => "body",
          "government" => {
            "title" => "government",
            "slug" => "government",
            "current" => true
            },
          "political" => true,
          "delivered_on" => "2017-09-22T14:30:00+01:00"
        },
        "links" => {
          "parent" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/mainstream-topic",
              "title" => "mainstream topic"
            }
          ],
          "ordered_related_items" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-item",
              "title" => "related item",
              "links" => {
                "mainstream_browse_pages" => [
                  {
                    "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
                    "locale" => "en",
                    "base_path" => "/mainstream-topic",
                    "title" => "mainstream topic"
                  }
                ]
              }
            }
          ],
          "document_collections" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-collection",
              "title" => "related collection",
              "document_type" => "document_collection"
            }
          ],
          "topics" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-topic",
              "title" => "related topic",
              "document_type" => "topic"
            }
          ],
          "topical_events" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-topical-event",
              "title" => "related topical event",
              "document_type" => "topical_event"
            }
          ],
          "organisations" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-organisation",
              "title" => "related organisation",
              "document_type" => "organisation"
            }
          ],
          "related_policies" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "locale" => "en",
              "base_path" => "/related-policy",
              "title" => "related policy",
              "document_type" => "policy"
            }
          ],
          "world_locations" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "title" => "World, ~ (@Location)",
              "locale" => "en"
            }
          ],
        })

      expected = {
        related_items: [{ path: "/related-item", text: "related item" }],
        collections: [{ path: "/related-collection", text: "related collection" }],
        topics: [{ path: "/related-topic", text: "related topic" }, { path: "/mainstream-topic", text: "mainstream topic" }],
        topical_events: [{ path: "/related-topical-event", text: "related topical event" }],
        policies: [{ path: "/related-policy", text: "related policy" }],
        publishers: [{ path: "/related-organisation", text: "related organisation" }],
        world_locations: [{ path: "/world/world-location/news", text: "World, ~ (@Location)" }],
        worldwide_organisations: [],
        statistical_data_sets: [],
        other: [[], []]
      }

      expect(payload).to eql(expected)
    end

    it "returns worldwide organisations" do
      payload = payload_for("world_location_news_article",
        "details" => {
          "body" => "body",
          "government" => {
            "title" => "government",
            "slug" => "government",
            "current" => true
          },
          "political" => true,
          "first_public_at" => "2016-01-01T19:00:00Z",
        },
        "links" => {
          "worldwide_organisations" => [
            {
              "content_id" => "32c1b93d-2553-47c9-bc3c-fc5b513ecc32",
              "title" => "related worldwide organisation",
              "base_path" => "/related-worldwide-organisation",
              "document_type" => "worldwide_organisation",
              "locale" => "en"
            }
          ],
        })
      expected = {
        related_items: [],
        collections: [],
        statistical_data_sets: [],
        topics: [],
        topical_events: [],
        policies: [],
        publishers: [],
        world_locations: [],
        worldwide_organisations: [{ path: "/related-worldwide-organisation", text: "related worldwide organisation" }],
        other: [[], []]
      }
      expect(payload).to eql(expected)
    end

    it "returns statistical data sets" do
      payload = payload_for("publication",
        "details" => {
          "body" => "body",
          "government" => {
            "title" => "government",
            "slug" => "government",
            "current" => true
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
              "locale" => "en"
            }
          ],
        })
      expected = {
        related_items: [],
        collections: [],
        statistical_data_sets: [{ path: "/related-statistical-data-set", text: "related statistical data set" }],
        topics: [],
        topical_events: [],
        policies: [],
        publishers: [],
        world_locations: [],
        worldwide_organisations: [],
        other: [[], []]
      }
      expect(payload).to eql(expected)
    end

    it "returns an Elsewhere on the web section for external related links" do
      payload = payload_for("placeholder",
        "details" => {
          "external_related_links" => [
            {
              "title" => "external-link",
              "url" => "https://external"
            }
          ]
        },)

      expected = [
        [
          {
            title: "Elsewhere on the web",
            links: [{
                text: "external-link",
                path: "https://external",
                rel: "external"
              }]
          }
        ],
        []
      ]

      expect(payload[:other]).to eql(expected)
    end

    it "deduplicates topics for mainstream content" do
      mainstream_browse_link = {
        "content_id" => "fecdc8c8-4006-4f8e-95d5-fe40ca49c7a8",
        "locale" => "en",
        "title" => "Self Assessment",
        "base_path" => "/browse/tax/self-assessment",
        "document_type" => "mainstream_browse_page",
      }
      payload = payload_for("answer",
        "details" => {
          "external_related_links" => []
        },
        "links" => {
          "mainstream_browse_pages" => [mainstream_browse_link],
          "ordered_related_items" => [
            {
              "content_id" => "f29ca4a8-8ed9-4b0f-bb6a-11e373095dee",
              "locale" => "en",
              "title" => "Self Assessment tax returns",
              "base_path" => "/self-assessment-tax-returns",
              "document_type" => "guide",
              "links" => { "mainstream_browse_pages" => [mainstream_browse_link] },
            }
          ],
          "parent" => [mainstream_browse_link],
          "topics" => [
            {
              "content_id" => "7beb97b6-75c9-4aa7-86be-a733ab3a21aa",
              "locale" => "en",
              "base_path" => "/topic/personal-tax/self-assessment",
              "title" => "Self Assessment",
              "document_type" => "topic",
            }
          ],
        })
      expected = {
        related_items: [{ text: "Self Assessment tax returns", path: "/self-assessment-tax-returns" }],
        collections: [],
        statistical_data_sets: [],
        topics: [{ text: "Self Assessment", path: "/browse/tax/self-assessment" }],
        topical_events: [],
        policies: [],
        publishers: [],
        world_locations: [],
        worldwide_organisations: [],
        other: [[], []]
      }

      expect(payload).to eql(expected)
    end
  end
end
