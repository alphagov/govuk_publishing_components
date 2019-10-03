require "rails_helper"

describe "Contextual guidance", type: :view do
  def component_name
    "contextual_guidance"
  end

  it "renders the contextual guidance" do
    render_component({})

    assert_select ".gem-c-contextual-guidance"
  end

  it "renders the contextual guidance with title and content" do
    render_component(id: 'news-title-guidance', title: 'Writing a news title') do
      tag.p "The title must make clear what the content offers users"
    end

    assert_select '.gem-c-contextual-guidance .govuk-heading-s', text: 'Writing a news title'
    assert_select '.gem-c-contextual-guidance p', text: 'The title must make clear what the content offers users'
  end
end
