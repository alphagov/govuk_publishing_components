require "rails_helper"

describe "Skip Link", type: :view do
  def component_name
    "skip_link"
  end

  it "renders a skip link correctly by default" do
    render_component({})
    assert_select ".govuk-skip-link[data-module=\"govuk-skip-link\"][href=\"#main-content\"]", text: "Skip to main content"
  end

  it "renders a skip link correctly when href is specified" do
    render_component(href: "#skip-to")
    assert_select ".govuk-skip-link[data-module=\"govuk-skip-link\"][href=\"#skip-to\"]", text: "Skip to main content"
  end

  it "renders a skip link correctly when text is specified" do
    render_component(text: "Go to somewhere on the page")
    assert_select ".govuk-skip-link[data-module=\"govuk-skip-link\"][href=\"#main-content\"]", text: "Go to somewhere on the page"
  end
end
