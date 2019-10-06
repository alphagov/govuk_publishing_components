require "rails_helper"

describe "Contextual guidance", type: :view do
  def component_name
    "contextual_guidance"
  end

  it "renders the contextual guidance" do
    render_component({})

    assert_select ".gem-c-contextual-guidance"
  end

  it "renders the contextual guidance with input, title and content" do
    render_component(
      id: "news-title-guidance",
      title: "Writing a news title",
      content: sanitize("<p>The title must make clear what the content offers users</p>")
    ) do
      tag.input name: "news-title", type: "text", data: { "contextual-guidance": "news-title-guidance" }
    end

    assert_select "input[name='news-title'][type='text'][data-contextual-guidance='news-title-guidance']"
    assert_select ".gem-c-contextual-guidance .govuk-heading-s", text: "Writing a news title"
    assert_select ".gem-c-contextual-guidance p", text: "The title must make clear what the content offers users"
  end
end
