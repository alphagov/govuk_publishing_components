require 'rails_helper'

describe "Character count", type: :view do
  def component_name
    "character_count"
  end

  it "renders character count with textarea" do
    render_component(
      name: "character-count",
      textarea: {
        label: { text: "Can you provide more detail?" },
        name: "more-details"
      },
      data: {
        module: "character-count",
        maxlength: "100",
      }
    )

    assert_select ".govuk-character-count .govuk-textarea"

    assert_select ".govuk-character-count .govuk-label", text: "Can you provide more detail?"
  end

  it "renders character count with data attributes" do
    render_component(
      name: "character-count",
      textarea: {
        label: { text: "Can you provide more detail?" },
        name: "more-details"
      },
      data: {
        module: "character-count"
      },
      maxlength: "100",
    )

    assert_select ".govuk-character-count[data-module='character-count']"
    assert_select ".govuk-character-count[data-maxlength='100']"
  end
end
