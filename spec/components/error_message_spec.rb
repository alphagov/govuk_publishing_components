require 'rails_helper'

describe "Error message", type: :view do
  def component_name
    "error_message"
  end

  it "renders error message" do
    render_component(text: "Please enter your National Insurance number")

    assert_select(".govuk-error-message", text: "Please enter your National Insurance number")
  end
end
