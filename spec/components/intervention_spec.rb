require "rails_helper"

describe "Intervention", type: :view do
  def component_name
    "intervention"
  end

  it "renders the component" do
    render_component({})
    assert_select ".gem-c-intervention__title", text: "Check the next steps for your limited company"
    assert_select ".gem-c-intervention__paragraph", text: "You might be interested in this because you’ve been browsing guidance relevant to starting a limited company."
    assert_select ".gem-c-intervention__paragraph", text: "Hide this suggestion if it’s not relevant to you"
  end
end
