require 'spec_helper'

RSpec.describe GovukPublishingComponents::Presenters::RelatedTopicsNavigation do
  describe '#related_topics_navigation' do
    it 'can handle randomly generated content' do
      expect { related_topics_navigation_for('placeholder', {}) }.to_not raise_error
    end

    it 'returns is empty if there are no related topic navigation links' do
      nothing = related_topics_navigation_for(
        'placeholder',
        'details' => {
          'external_related_links' => [],
        },
        'links' => {},
      )

      expect(nothing).to be_empty
    end

    it 'extracts and returns the appropriate related topic links' do
      related_topics_navigation = related_topics_navigation_for(
        'speech',
        'details' => {
          'body' => 'body',
          'government' => {
            'title' => 'government',
            'slug' => 'government',
            'current' => true,
          },
          'political' => true,
          'delivered_on' => '2017-09-22T14:30:00+01:00',
        },
        'links' => {
          'topics' => [
            {
              'content_id' => '32c1b93d-2553-47c9-bc3c-fc5b513ecc32',
              'locale' => 'en',
              'base_path' => '/related-topic',
              'title' => 'related topic',
              'document_type' => 'topic',
            },
          ],
          'mainstream_browse_pages' => [
            {
              'content_id' => '06ddefca-c44b-4b7b-b0de-226d15129a29',
              'locale' => 'en',
              'base_path' => '/browse/something',
              'title' => 'A mainstream browse page',
              'document_type' => 'mainstream_browse_page',
            },
          ],
        },
      )

      expect(related_topics_navigation)
        .to contain_exactly(
          { path: '/browse/something', text: 'A mainstream browse page' },
          path: '/related-topic', text: 'related topic'
        )
    end

    it 'deduplicates topics for mainstream content' do
      related_topics_navigation = related_topics_navigation_for(
        'answer',
        'details' => {
          'external_related_links' => [],
        },
        'links' => {
          'mainstream_browse_pages' => [
            {
              'content_id' => 'fecdc8c8-4006-4f8e-95d5-fe40ca49c7a8',
              'locale' => 'en',
              'title' => 'Self Assessment',
              'base_path' => '/browse/tax/self-assessment',
              'document_type' => 'mainstream_browse_page',
            },
          ],
          'topics' => [
            {
              'content_id' => '7beb97b6-75c9-4aa7-86be-a733ab3a21aa',
              'locale' => 'en',
              'base_path' => '/topic/personal-tax/self-assessment',
              'title' => 'Self Assessment',
              'document_type' => 'topic',
            },
          ],
        },
      )

      expect(related_topics_navigation)
        .to contain_exactly(
          text: 'Self Assessment', path: '/browse/tax/self-assessment',
        )
    end

    it 'handles ordered related items that aren\'t tagged to a mainstream browse page' do
      related_topics_navigation = related_topics_navigation_for_example('guide', 'single-page-guide')

      expect(related_topics_navigation)
        .to contain_exactly(
          { text: 'Travel abroad', path: '/browse/abroad/travel-abroad' },
          { text: 'Arriving in the UK', path: '/browse/visas-immigration/arriving-in-the-uk' },
          text: 'Pets', path: '/topic/animal-welfare/pets',
        )
    end

    private

    def related_topics_navigation_for(schema, content_item)
      example = GovukSchemas::RandomExample.for_schema(frontend_schema: schema) do |related_topics_navigation|
        related_topics_navigation.merge(content_item)
      end

      described_class::(example)
    end

    def related_topics_navigation_for_example(schema, example_name)
      example = GovukSchemas::Example.find(schema, example_name: example_name)

      described_class::(example)
    end
  end
end
