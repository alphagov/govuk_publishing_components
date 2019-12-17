require "rails_helper"

describe "Contextual guidance", type: :view do
  def component_name
    "contextual_guidance"
  end

  it "fails to render when no html_for is given" do
    assert_raises do
      render_component({})
    end
  end

  it "renders the contextual guidance with input, title and content" do
    render_component(
      html_for: "news-title",
      title: "Writing a news title",
      guidance_id: 'news-title-guidance',
      content: sanitize("<p>The title must make clear what the content offers users</p>")
    ) do
      tag.input id: "news-title", name: "news-title", type: "text"
    end

    assert_select ".gem-c-contextual-guidance__input-field input[id='news-title'][name='news-title'][type='text']"
    assert_select ".gem-c-contextual-guidance__wrapper[for='news-title'][id='news-title-guidance']"
    assert_select ".gem-c-contextual-guidance__guidance .govuk-heading-s", text: "Writing a news title"
    assert_select ".gem-c-contextual-guidance__guidance p", text: "The title must make clear what the content offers users"
  end
end
