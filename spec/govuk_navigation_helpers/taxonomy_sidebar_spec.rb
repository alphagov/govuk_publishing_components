require 'spec_helper'
require 'webmock/rspec'
require 'gds_api/test_helpers/rummager'

include GdsApi::TestHelpers::Rummager

RSpec.describe GovukNavigationHelpers::TaxonomySidebar do
  describe '#sidebar' do
    it 'can handle any valid content item' do
      stub_any_rummager_search_to_return_no_results

      payload = GovukSchemas::RandomExample.for_schema(
        frontend_schema: 'placeholder',
      )

      expect { sidebar_for(payload) }.to_not raise_error
    end

    context 'given a content item not tagged to any taxon with no document collections' do
      it 'returns an empty sidebar hash' do
        content_item = { "links" => {} }

        expect(sidebar_for(content_item)).to eq(
          items: [],
          collections: []
        )
      end
    end

    context 'given a content item tagged to taxons and with related items' do
      before do
        stub_any_rummager_search
          .to_return(
            body: {
              'results': [
                { 'title': 'Related item C', 'link': '/related-item-c', },
                { 'title': 'Related item B', 'link': '/related-item-b', },
                { 'title': 'Related item A', 'link': '/related-item-a', },
              ],
            }.to_json
          )
      end

      it 'returns a sidebar hash containing a sorted list of parent taxons and related content' do
        expect(GovukStatsd).to receive(
          :increment
        ).with(
          :taxonomy_sidebar_searches
        ).twice

        content_item = content_item_tagged_to_taxon

        expect(sidebar_for(content_item)).to eq(
          items: [
            {
              title: "Taxon A",
              url: "/taxon-a",
              description: "The A taxon.",
              related_content: [
                { 'title': 'Related item A', 'link': '/related-item-a', },
                { 'title': 'Related item B', 'link': '/related-item-b', },
                { 'title': 'Related item C', 'link': '/related-item-c', },
              ],
            },
            {
              title: "Taxon B",
              url: "/taxon-b",
              description: "The B taxon.",
              related_content: [
                { 'title': 'Related item A', 'link': '/related-item-a', },
                { 'title': 'Related item B', 'link': '/related-item-b', },
                { 'title': 'Related item C', 'link': '/related-item-c', },
              ],
            },
          ],
          collections: [],
        )
      end

      it 'only shows related links for the first 2 taxons with related content' do
        expect(GovukStatsd).to receive(
          :increment
        ).with(
          :taxonomy_sidebar_searches
        ).twice

        content_item = content_item_tagged_to_taxon

        content_item['links']['taxons'] << {
          "title" => "Taxon C",
          "base_path" => "/taxon-c",
          "content_id" => "taxon-c",
          "description" => "The C taxon.",
          "phase" => "live",
        }

        expect(sidebar_for(content_item)).to eq(
          items: [
            {
              title: "Taxon A",
              url: "/taxon-a",
              description: "The A taxon.",
              related_content: [
                { 'title': 'Related item A', 'link': '/related-item-a', },
                { 'title': 'Related item B', 'link': '/related-item-b', },
                { 'title': 'Related item C', 'link': '/related-item-c', },
              ],
            },
            {
              title: "Taxon B",
              url: "/taxon-b",
              description: "The B taxon.",
              related_content: [
                { 'title': 'Related item A', 'link': '/related-item-a', },
                { 'title': 'Related item B', 'link': '/related-item-b', },
                { 'title': 'Related item C', 'link': '/related-item-c', },
              ],
            },
            {
              title: "Taxon C",
              url: "/taxon-c",
              description: "The C taxon.",
              related_content: [],
            },
          ],
          collections: [],
        )
      end
    end

    context 'given there are repeated related links across different parent taxons' do
      before do
        # First taxon should have links A and B
        stub_request(
          :get,
          %r{.*search.json?.*\&filter_taxons%5B%5D=taxon-a.*}
        ).to_return(
          body: {
            'results': [
              { 'title': 'Related item A', 'link': '/related-item-a', },
              { 'title': 'Related item B', 'link': '/related-item-b', },
            ],
          }.to_json
        )

        # Second taxon should only return link C, and reject the other 2
        stub_request(
          :get,
          %r{.*search.json?.*\&filter_taxons%5B%5D=taxon-b.*&reject_link%5B%5D=/related-item-a&reject_link%5B%5D=/related-item-b.*}
        ).to_return(
          body: {
            'results': [
              { 'title': 'Related item C', 'link': '/related-item-c', },
            ],
          }.to_json
        )
      end

      it 'does not duplicate the related links across each taxon' do
        expect(GovukStatsd).to receive(
          :increment
        ).with(
          :taxonomy_sidebar_searches
        ).twice

        content_item = content_item_tagged_to_taxon

        expect(sidebar_for(content_item)).to eq(
          items: [
            {
              title: "Taxon A",
              url: "/taxon-a",
              description: "The A taxon.",
              related_content: [
                { 'title': 'Related item A', 'link': '/related-item-a', },
                { 'title': 'Related item B', 'link': '/related-item-b', },
              ],
            },
            {
              title: "Taxon B",
              url: "/taxon-b",
              description: "The B taxon.",
              related_content: [
                { 'title': 'Related item C', 'link': '/related-item-c', },
              ],
            }
          ],
          collections: [],
        )
      end
    end

    context 'when there are related link overrides' do
      context 'belonging to the same taxon' do
        it 'displays the related link overrides under a single taxon' do
          content_item = content_item_tagged_to_taxon

          content_item['links']['ordered_related_items_overrides'] = [
            {
              'title' => 'Related link override B',
              'base_path' => '/override-b',
              'content_id' => 'override-b',
              'links' => {
                'taxons' => [
                  content_item['links']['taxons'][0],
                ],
              },
            },
          ]

          expect(sidebar_for(content_item)).to eq(
            items: [
              {
                title: "Taxon A",
                url: "/taxon-a",
                description: "The A taxon.",
                related_content: [],
              },
              {
                title: "Taxon B",
                url: "/taxon-b",
                description: "The B taxon.",
                related_content: [
                  { title: 'Related link override B', link: '/override-b' },
                ],
              }
            ],
            collections: [],
          )
        end

        it 'displays the related link overrides under a multiple taxons' do
          content_item = content_item_tagged_to_taxon

          content_item['links']['ordered_related_items_overrides'] = [
            {
              'title' => 'Related link override B',
              'base_path' => '/override-b',
              'content_id' => 'override-b',
              'links' => {
                'taxons' => [
                  content_item['links']['taxons'][0],
                ],
              },
            },
            {
              'title' => 'Related link override A-2',
              'base_path' => '/override-a-2',
              'content_id' => 'override-a-2',
              'links' => {
                'taxons' => [
                  content_item['links']['taxons'][1],
                ],
              },
            },
            {
              'title' => 'Related link override A-1',
              'base_path' => '/override-a-1',
              'content_id' => 'override-a-1',
              'links' => {
                'taxons' => [
                  content_item['links']['taxons'][1],
                ],
              },
            },
          ]

          expect(sidebar_for(content_item)).to eq(
            items: [
              {
                title: "Taxon A",
                url: "/taxon-a",
                description: "The A taxon.",
                related_content: [
                  { 'title': 'Related link override A-1', 'link': '/override-a-1' },
                  { 'title': 'Related link override A-2', 'link': '/override-a-2' },
                ],
              },
              {
                title: "Taxon B",
                url: "/taxon-b",
                description: "The B taxon.",
                related_content: [
                  { 'title': 'Related link override B', 'link': '/override-b' },
                ],
              }
            ],
            collections: [],
          )
        end

        it 'displays a related link tagged to multiple taxons under a single taxon' do
          content_item = content_item_tagged_to_taxon

          content_item['links']['ordered_related_items_overrides'] = [
            {
              'title' => 'Related link override',
              'base_path' => '/override',
              'content_id' => 'override',
              'links' => {
                'taxons' => [
                  content_item['links']['taxons'][0],
                  content_item['links']['taxons'][1],
                ],
              },
            },
          ]

          expect(sidebar_for(content_item)).to eq(
            items: [
              {
                title: "Taxon A",
                url: "/taxon-a",
                description: "The A taxon.",
                related_content: [
                  { 'title': 'Related link override', 'link': '/override' },
                ],
              },
              {
                title: "Taxon B",
                url: "/taxon-b",
                description: "The B taxon.",
                related_content: [],
              }
            ],
            collections: [],
          )
        end

        it 'displays a related link tagged to another taxon under "Elsewhere"' do
          content_item = content_item_tagged_to_taxon

          content_item['links']['ordered_related_items_overrides'] = [
            {
              'title' => 'Related link override',
              'base_path' => '/override',
              'content_id' => 'override',
              'links' => {
                'taxons' => [
                  {
                    'title' => 'Some other taxon',
                    'content_id' => 'some-other-taxon',
                    'base_path' => '/some-other-taxon',
                  }
                ],
              },
            },
          ]

          expect(sidebar_for(content_item)).to eq(
            items: [
              {
                title: "Taxon A",
                url: "/taxon-a",
                description: "The A taxon.",
                related_content: [],
              },
              {
                title: "Taxon B",
                url: "/taxon-b",
                description: "The B taxon.",
                related_content: [],
              },
              {
                title: "Elsewhere on GOV.UK",
                related_content: [
                  { title: 'Related link override', link: '/override' }
                ],
              },
            ],
            collections: [],
          )
        end

        it 'displays a related link not tagged to any taxons under "Elsewhere"' do
          content_item = content_item_tagged_to_taxon

          content_item['links']['ordered_related_items_overrides'] = [
            {
              'title' => 'Related link override',
              'base_path' => '/override',
              'content_id' => 'override',
              'links' => {},
            },
          ]

          expect(sidebar_for(content_item)).to eq(
            items: [
              {
                title: "Taxon A",
                url: "/taxon-a",
                description: "The A taxon.",
                related_content: [],
              },
              {
                title: "Taxon B",
                url: "/taxon-b",
                description: "The B taxon.",
                related_content: [],
              },
              {
                title: "Elsewhere on GOV.UK",
                related_content: [
                  { title: 'Related link override', link: '/override' }
                ],
              },
            ],
            collections: [],
          )
        end

        it 'displays an external related link under "Elsewhere"' do
          content_item = content_item_tagged_to_taxon

          content_item['links']['ordered_related_items_overrides'] = [
            {
              'title' => 'Related link override',
              'base_path' => '/override',
              'content_id' => 'override',
              'links' => {},
            },
          ]

          content_item['details'] = {
            'external_related_links' => [
              {
                'title' => 'External related link',
                'url' => 'http://example.com',
              },
            ]
          }

          expect(sidebar_for(content_item)).to eq(
            items: [
              {
                title: "Taxon A",
                url: "/taxon-a",
                description: "The A taxon.",
                related_content: [],
              },
              {
                title: "Taxon B",
                url: "/taxon-b",
                description: "The B taxon.",
                related_content: [],
              },
              {
                title: "Elsewhere on GOV.UK",
                related_content: [
                  { title: 'Related link override', link: '/override' }
                ],
              },
              {
                title: "Elsewhere on the web",
                related_content: [
                  { title: 'External related link', link: 'http://example.com' }
                ],
              },
            ],
            collections: [],
          )
        end
      end
    end

    context 'given a content item with document collections' do
      it 'returns a sidebar hash containing document collections' do
        content_item = content_item_with_document_collections

        expect(sidebar_for(content_item)).to eq(
          items: [],
          collections: [
            {
              path: "/collection-b",
              text: "Collection B",
            },
            {
              path: "/collection-a",
              text: "Collection A",
            },
            ]
        )
      end
    end
    context 'when Rummager raises an exception' do
      before(:each) do
        stub_any_rummager_search
            .to_return(status: 500)

        expect(GovukStatsd).to_not receive(
          :increment
        )
      end

      it 'does not re-raise' do
        content_item = content_item_tagged_to_taxon

        expect { sidebar_for(content_item) }.to_not raise_error
      end

      it 'logs an error' do
        allow(GovukError).to receive(:notify)

        content_item = content_item_tagged_to_taxon
        sidebar_for(content_item)

        expect(GovukError).to have_received(:notify).at_least(1).times
      end
    end
  end

  def sidebar_for(content_item)
    GovukNavigationHelpers::TaxonomySidebar.new(content_item).sidebar
  end

  def content_item_tagged_to_taxon
    {
      "title" => "A piece of content",
      "base_path" => "/a-piece-of-content",
      "links" => {
        "taxons" => [
          {
            "title" => "Taxon B",
            "base_path" => "/taxon-b",
            "content_id" => "taxon-b",
            "description" => "The B taxon.",
            "phase" => "live",
          },
          {
            "title" => "Taxon A",
            "base_path" => "/taxon-a",
            "content_id" => "taxon-a",
            "description" => "The A taxon.",
            "phase" => "live",
          },
        ],
      },
    }
  end

  def content_item_with_document_collections
    {
      "title" => "A piece of content",
      "base_path" => "/a-piece-of-content",
      "links" => {
        "document_collections" => [
          {
            "title" => "Collection B",
            "base_path" => "/collection-b",
            "content_id" => "collection-b",
            "document_type" => "document_collection",
          },
          {
            "title" => "Collection A",
            "base_path" => "/collection-a",
            "content_id" => "collection-a",
            "document_type" => "document_collection",
          },
        ],
      },
    }
  end
end
