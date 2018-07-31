require 'rails_helper'

describe "Details", type: :view do
  def component_name
    "details"
  end

  it "renders a details element" do
    render_component(title: "Some title") do
      "This is more info"
    end

    assert_select "details.gem-c-details"
    assert_select ".govuk-details__summary-text", text: "Some title"
    assert_select ".govuk-details__text", text: "This is more info"
  end
end
