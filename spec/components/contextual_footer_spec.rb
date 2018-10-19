require 'rails_helper'

RSpec.describe 'Contextual footer', type: :view do
  def component_name
    'contextual_footer'
  end

  it 'renders the footer' do
    render_component(
      content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: 'speech')
    )

    assert_select '.gem-c-contextual-footer'
  end

  context 'part of a step by step' do
    it 'does not renders the footer' do
      render_component(
        content_item: GovukSchemas::RandomExample.for_schema(frontend_schema: 'step_by_step_nav')
      )

      refute_selector '.gem-c-contextual-footer'
    end
  end
end
