require "rails_helper"

describe "Save this page", type: :view do
  def component_name
    "save_this_page"
  end

  it "does not render without page path" do
    assert_empty render_component({})
  end

  it "renders with custom heading level if specified" do
    render_component(
      page_path: "/test",
      heading_level: 3,
    )

    assert_select(".gem-c-save-this-page h3")
  end

  it "renders signed out state by default" do
    render_component(page_path: "/test")

    expect(rendered).to have_content("Sign in to see your saved pages")
  end

  it "renders signed in state with 'save this page' option" do
    render_component(
      page_path: "/test",
      signed_in: true,
    )
    assert_select ".gem-c-save-this-page button", text: "Add to your saved pages"
    expect(rendered).to have_content("See your saved pages")
  end

  it "renders with 'remove this page' option if page has already been saved" do
    render_component(
      page_path: "/test",
      signed_in: true,
      page_is_saved: true,
    )
    assert_select ".gem-c-save-this-page button", text: "Remove from your saved pages"
    expect(rendered).to have_content("See your saved pages")
  end
end
