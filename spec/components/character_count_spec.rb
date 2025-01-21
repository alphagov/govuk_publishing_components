require "rails_helper"

describe "Character count", type: :view do
  def component_name
    "character_count"
  end

  it "fails to render if maxlength or maxwords are not passed" do
    assert_empty render_component({})
  end

  it "renders character count with minimal data passed" do
    render_component(
      textarea: {
        name: "more-details",
      },
      maxlength: "100",
    )
    assert_select ".govuk-character-count .govuk-textarea[name='more-details']"
  end

  it "renders character count with more options" do
    render_component(
      textarea: {
        label: { text: "Can you provide more detail?" },
        name: "more-details",
      },
      maxlength: "100",
      maxwords: "3",
      threshold: "11",
    )
    assert_select ".gem-c-character-count[data-maxlength='100']"
    assert_select ".gem-c-character-count[data-maxwords='3']"
    assert_select ".gem-c-character-count[data-threshold='11']"
    assert_select ".govuk-character-count .govuk-textarea[name='more-details']"
    assert_select ".govuk-character-count .govuk-label", text: "Can you provide more detail?"
  end

  it "renders character count with the correct id for the textarea" do
    render_component(
      textarea: {
        label: { text: "Can you provide more detail?" },
        name: "more-details",
        textarea_id: "textarea-element-id",
        id: "textarea-component-id",
      },
      maxlength: "100",
      id: "character-count-id",
    )
    assert_select "#textarea-component-id.gem-c-textarea"
    assert_select "textarea#character-count-id"
    assert_select "#textarea-element-id", false
  end
end
