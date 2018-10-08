require 'rails_helper'

describe 'Related topics navigation', type: :view do
  def component_name
    'related_topics_navigation'
  end

  context 'with no content item' do
    before { render_component({}) }

    it 'renders nothing' do
      expect(rendered).to be_blank
    end
  end

  context 'with a content item with linked taxons' do
    before do
      content_item = {
        'links' => {
          'taxons' => [
            {
              'title' => 'Driving instruction and driving lessons',
              'base_path' => '/transport/driving-instruction-and-driving-lessons',
              'document_type' => 'taxon',
              'phase' => 'live',
            },
          ],
        },
      }

      render_component(content_item)
    end

    it 'renders related content section when passed related items' do
      assert_select '.gem-c-related-topics-navigation__heading',
                    text: 'Topics'

      assert_select '.gem-c-related-topics-navigation__link[href="/transport/driving-instruction-and-driving-lessons"]',
                    text: 'Driving instruction and driving lessons'
    end

    it 'adds aria labelledby to navigation sections' do
      assert_select '.gem-c-related-topics-navigation__section[aria-labelledby]'
    end

    it 'link tracking is enabled' do
      assert_select '.gem-c-related-topics-navigation__link-list[data-module=\'track-click\']'
      assert_select '.gem-c-related-topics-navigation__link[data-track-category=\'relatedLinkClicked\']'
      assert_select '.gem-c-related-topics-navigation__link[data-track-action=\'1\']'
      assert_select '.gem-c-related-topics-navigation__link[data-track-label=\'/transport/driving-instruction-and-driving-lessons\']'
    end
  end
end
