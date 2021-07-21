require "rails_helper"

describe "Intervention", type: :view do
  def component_name
    "intervention"
  end

  it "renders the component" do
    render_component({})
    assert_select ".gem-c-intervention__title", text: "Check the next steps for your limited company"
    assert_select ".gem-c-intervention__paragraph", text: "You might be interested in this because you’ve been browsing guidance relevant to starting a limited company."
    assert_select ".gem-c-intervention__paragraph a", text: "Hide this suggestion"
  end

  it "renders the tracking attributes" do
    render_component({})
    assert_select ".gem-c-intervention__title a[data-track-category=\"interventionBanner\"][data-track-action=\"interventionClicked\"][data-track-label=\"/next-steps-for-your-business\"][data-track-options=\"{'dimension29':'Check the next steps for your limited company'}\"]"
    assert_select ".gem-c-intervention__paragraph a[data-track-category=\"interventionBanner\"][data-track-action=\"interventionDismissed\"][data-track-label=\"?hide-intervention=true\"][data-track-options=\"{'dimension29':'Hide this suggestion'}\"]"
  end
end
