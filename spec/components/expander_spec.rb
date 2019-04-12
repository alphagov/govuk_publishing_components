require 'rails_helper'

describe "expander", type: :view do
  def component_name
    "expander"
  end

  it "renders nothing without passed content" do
    assert_empty render_component({})
  end

  it "shows the given title and content" do
    render_component(title: "Some title") do
      "This is more info"
    end

    assert_select ".gem-c-expander"
    assert_select ".gem-c-expander__title", text: "Some title"
    assert_select ".gem-c-expander__content", text: "This is more info"
  end

  it "sets open on load correctly" do
    render_component(title: "Some title", open_on_load: true) do
      "This is more info"
    end

    assert_select ".gem-c-expander[data-open-on-load='true']"
  end

  it "sets a margin bottom" do
    render_component(title: "Some title", margin_bottom: 9) do
      "This is more info"
    end

    assert_select '.gem-c-expander.govuk-\!-margin-bottom-9'
  end
end
