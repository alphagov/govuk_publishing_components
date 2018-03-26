require "spec_helper"

RSpec.describe GovukNavigationHelpers::RelatedItems do
  def payload_for(content_item)
    fully_valid_content_item = GovukSchemas::RandomExample.for_schema(frontend_schema: "placeholder") do |random_item|
      random_item.merge(content_item)
    end
    GovukNavigationHelpers::NavigationHelper.new(fully_valid_content_item).related_items
  end

  describe "#related_items" do
    it "can handle randomly generated content" do
      payload = GovukSchemas::RandomExample.for_schema(frontend_schema: "placeholder")

      expect { payload_for(payload) }.to_not raise_error
    end

    it "returns nothing if there are no related links" do
      nothing = payload_for(
        "details" => {
          "external_related_links" => []
        },
        "links" => {
        }
      )

      expect(nothing).to eql(sections: [])
    end

    it "returns an elswhere on GOV.UK section for related items with no browse pages in common" do
      payload = payload_for(
        "details" => {
          "external_related_links" => []
        },
        "links" => {
          "ordered_related_items" => [
            {
              "title" => "Foo",
              "content_id" => "fdbf634c-06f5-43ea-915a-53b34b660353",
              "base_path" => "/foo",
              "locale" => "en"
            }
          ]
        }
      )

      expect(payload).to eql(
        sections: [
          {
            title: "Elsewhere on GOV.UK",
            items: [
              { title: "Foo", url: "/foo" },
            ]
          },
        ]
      )
    end

    it "returns the external related links" do
      payload = payload_for(
        "details" => {
          "external_related_links" => [
            { "title" => "Foo", "url" => "https://example.org/foo" },
            { "title" => "Bar", "url" => "https://example.org/bar" }
          ]
        },
        "links" => {
        }
      )

      expect(payload).to eql(
        sections: [
          {
            title: "Elsewhere on the web",
            items: [
              { title: "Foo", url: "https://example.org/foo", rel: "external" },
              { title: "Bar", url: "https://example.org/bar", rel: "external" },
            ]
          },
        ]
      )
    end

    it "returns a primary section for related items tagged to the same mainstream browse page as the item" do
      payload = payload_for(
        "details" => {
          "external_related_links" => []
        },
        "links" => {
          "parent" => [
            {
              "title" => "Foo's parent",
              "content_id" => "a9c6f24a-92a1-4ead-a776-532d1d99123c",
              "base_path" => "/foo-parent",
              "locale" => "en"
            }
          ],
          "ordered_related_items" => [
            {
              "content_id" => "9effaabe-346d-4ad0-9c1b-baa49bc084d6",
              "title" => "Foo",
              "base_path" => "/bar",
              "locale" => "en",
              "links" => {
                "mainstream_browse_pages" => [
                  {
                    "title" => "Foo's parent",
                    "content_id" => "a9c6f24a-92a1-4ead-a776-532d1d99123c",
                    "base_path" => "/foo-parent",
                    "locale" => "en"
                  }
                ]
              }
            }
          ]
        }
      )

      expect(payload).to eql(
        sections: [
          {
            title: "Foo's parent",
            url: "/foo-parent",
            items: [
              { title: "Foo", url: "/bar" },
            ]
          },
        ]
      )
    end

    it "returns a secondary section for related items tagged to the same mainstream browse page as the item's parent" do
      payload = payload_for(
        "details" => {
          "external_related_links" => []
        },
        "links" => {
          "parent" => [
            {
              "title" => "Foo's parent",
              "content_id" => "67c28e19-9934-462c-b174-db5b8e566384",
              "base_path" => "/foo-parent",
              "locale" => "en",
              "links" => {
                "parent" => [
                  {
                    "title" => "Foo's grandparent",
                    "content_id" => "a9c6f24a-92a1-4ead-a776-532d1d99123c",
                    "base_path" => "/foo-grand-parent",
                    "locale" => "en",
                  }
                ]
              }
            }
          ],
          "ordered_related_items" => [
            {
              "content_id" => "9effaabe-346d-4ad0-9c1b-baa49bc084d6",
              "title" => "Foo",
              "base_path" => "/bar",
              "locale" => "en",
              "links" => {
                "mainstream_browse_pages" => [
                  {
                    "title" => "Some sibling of foo-parent",
                    "content_id" => "c34672dc-2ff3-4d28-92fd-bcba382e8a0b",
                    "base_path" => "/foo-sibling",
                    "locale" => "en",
                    "links" => {
                      "parent" => [
                        {
                          "title" => "Foo's grandparent",
                          "content_id" => "a9c6f24a-92a1-4ead-a776-532d1d99123c",
                          "base_path" => "/foo-grand-parent",
                          "locale" => "en",
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      )

      expect(payload).to eql(
        sections: [
          {
            title: "Foo's grandparent",
            url: "/foo-grand-parent",
            items: [
              { title: "Foo", url: "/bar" },
            ]
          },
        ]
      )
    end

    it "returns only related items in the primary section where they are tagged to the same mainstream browse pages as both the item and the item's parent" do
      payload = payload_for(
        "details" => {
          "external_related_links" => []
        },
        "links" => {
          "parent" => [
            {
              "title" => "Foo's parent",
              "content_id" => "67c28e19-9934-462c-b174-db5b8e566384",
              "base_path" => "/foo-parent",
              "locale" => "en",
              "links" => {
                "parent" => [
                  {
                    "title" => "Foo's grandparent",
                    "content_id" => "a9c6f24a-92a1-4ead-a776-532d1d99123c",
                    "base_path" => "/foo-grand-parent",
                    "locale" => "en",
                  }
                ]
              }
            }
          ],
          "ordered_related_items" => [
            {
              "content_id" => "9effaabe-346d-4ad0-9c1b-baa49bc084d6",
              "title" => "Foo",
              "base_path" => "/bar",
              "locale" => "en",
              "links" => {
                "mainstream_browse_pages" => [
                  {
                    "title" => "Foo's parent",
                    "content_id" => "67c28e19-9934-462c-b174-db5b8e566384",
                    "base_path" => "/foo-parent",
                    "locale" => "en",
                    "links" => {
                      "parent" => [
                        {
                          "title" => "Foo's grandparent",
                          "content_id" => "a9c6f24a-92a1-4ead-a776-532d1d99123c",
                          "base_path" => "/foo-grand-parent",
                          "locale" => "en",
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      )

      expect(payload).to eql(
        sections: [
          {
            title: "Foo's parent",
            url: "/foo-parent",
            items: [
              { title: "Foo", url: "/bar" },
            ]
          },
        ]
      )
    end
  end
end
