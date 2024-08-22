require "rails_helper"

describe "Autocomplete", type: :view do
  def component_name
    "autocomplete"
  end

  test_data = {
    source: "/url",
  }

  it "renders with default attributes and content" do
    render_component(test_data)

    assert_select "input", count: 1
    assert_select "[data-suggestion-icon='true']", count: 0
    assert_select "[data-display-number-suggestions='5']", count: 1
  end

  it "throws error if no suggestion source_url provided" do
    assert_raises ActionView::Template::Error do
      render_component({})
    end
  end

  it "add suggestion icon data attribute" do
    render_component({ source: "/url", suggestion_icon: true })

    assert_select "[data-suggestion-icon='true']", count: 1
  end

  it "add number suggestions to display data attribute" do
    render_component({ source: "/url", display_number_suggestions: 3 })

    assert_select "[data-display-number-suggestions='3']", count: 1
  end

  it "add throttle delay time data attribute" do
    render_component({ source: "/url", throttle_delay_time: 100 })

    assert_select "[data-throttle-delay-time='100']", count: 1
  end

  it "add position results data attribute" do
    render_component({ source: "/url", position_results: "absolute" })

    assert_select ".gem-c-autocomplete--absolute", count: 1
  end

  it "add submit on select data attribute" do
    render_component({ source: "/url", submit_form_on_select: true })

    assert_select "[data-submit-on-select='true']", count: 1
  end
end
