require "rails_helper"

describe "Filter Options", type: :view do
  def component_name
    "filter_options"
  end

  it "does not render anything if no data is passed" do
    test_data = {}
    assert_empty render_component(test_data)
  end
end