require 'rails_helper'

describe "Skip Link", type: :view do
  def component_name
    "skip_link"
  end

  it "renders a skip link correctly" do
    render_component(href: '#main-content')
    assert_select ".govuk-skip-link[href=\"#main-content\"]", text: "Skip to main content"
  end
end
