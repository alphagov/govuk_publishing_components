require "rails_helper"

describe "Taxonomy navigation", type: :view do
  def component_name
    "taxonomy_navigation"
  end

  it "renders nothing if no parameters are passed in" do
    assert_empty render_component({})
  end
end
