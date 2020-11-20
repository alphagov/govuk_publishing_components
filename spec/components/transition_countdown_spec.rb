require "rails_helper"

describe "Transition call to action", type: :view do
  def component_name
    "transition_countdown"
  end

  day_before_transition_period_ends = Date.new(2020, 12, 31)

  it "renders the countdown when called without attributes" do
    travel_to day_before_transition_period_ends

    render_component({})

    assert_select ".gem-c-transition-countdown"
    assert_select ".gem-c-transition-countdown__countdown", text: "01 #{t('components.transition_countdown.day_to_go')}"
  end

  it "renders the call to action with title, countdown, and content" do
    travel_to day_before_transition_period_ends

    render_component(
      title: "Brexit transition",
      text: "Check you’re ready for 2021",
      url: "https://www.gov.uk/transition",
      data_attributes: { "track-category": "brexit" },
    )

    assert_select ".gem-c-transition-countdown[href='https://www.gov.uk/transition']"
    assert_select ".gem-c-transition-countdown[data-track-category=brexit]"
    assert_select ".gem-c-transition-countdown__title", text: "Brexit transition"
    assert_select ".gem-c-transition-countdown__countdown", text: "01 #{t('components.transition_countdown.day_to_go')}"
    assert_select ".gem-c-transition-countdown__text", text: "Check you’re ready for 2021"
  end
end
