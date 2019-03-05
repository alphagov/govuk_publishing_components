require 'rails_helper'

describe 'Modal dialogue', type: :view do
  def component_name
    'modal_dialogue'
  end

  it 'places the content correctly' do
    render_component(id: 'my-modal') do
      "Content"
    end

    assert_select '.gem-c-modal-dialogue__content', text: 'Content'
  end

  it 'applies modifier class to the wide modal' do
    render_component(id: 'my-modal', wide: true) do
      "Content"
    end

    assert_select '.gem-c-modal-dialogue__box.gem-c-modal-dialogue__box--wide', count: 1
  end
end
